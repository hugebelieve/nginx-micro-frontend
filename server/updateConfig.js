var firebase = require('./firebase');
var fs = require('fs');
var path = require('path');
var ip = require('ip');

function updateConfig(){
  firebase.getAllDocs().then((array)=>{
    return createConfig(array);
  }).then((config)=>{
    fs.writeFile(path.join(__dirname, "../", "nginx-config", "sites-default.conf"), config, 'utf8', function (err) {
      if (err) return console.log(err);
   });
  }).catch(err=>{
    console.error(err);
  });
}

function removeLast(text,check){
  let lastChar = text.slice(-1);
  if (lastChar == check) {
    return text.slice(0, -1)
  }
  return text;
}

function createConfig(array){
  let combinedSubPaths = array.reduce((prev, val)=>{
    if(val.subpath!="main-home"){
      prev += val.subpath+"|";
    }
    return prev;
  },"");

  // combinedSubPaths = removeLast(combinedSubPaths,"|"); // remove last "|"
  combinedSubPaths += "config"; //special path for configuration

  let upstream = "";
  let locationHome = 
  `
    if ($http_referer ~* /(\\w+)/(\\w+)(.*)$ ) {
        # save sub path if any                              
        set $subpath $2;
    }

    # if referer subpath is one of the config subRoutes
    if ($subpath ~ (${combinedSubPaths}) ){
        return 307 $scheme://$host/$subpath$request_uri;
    }
  `;

  let finalConfig = "";
  let homeAdded = false;

  array.forEach(element => {
    if(element.subpath=="config"){
      // config subpath is already in use
      return;
    }
    let pointConfig = createOneEndPoint(element);
    if(element.proxyType=="ip"){
      //create upstream
      upstream += createUpStream(element.host, element.subpath);
    }

    if(element.subpath=="main-home"){
      homeAdded = true;
      locationHome = `
        location / {
          ${locationHome}
          ${pointConfig}
        }
      `;
    }else{
      finalConfig += `
      location /${element.subpath} {
        ${pointConfig}
      }
      `;
    }
  });

  // special config path
  let pointConfig = createOneEndPoint({subpath:"config",
                        proxyType:"ip",
                        host:[`${ip.address()}:8000`]});

  upstream += createUpStream([`${ip.address()}:8000`], "config");
  finalConfig += `
  location /config {
    ${pointConfig}
  }
  `;

  // home location
  if(!homeAdded){
    finalConfig += `
    location / {
      ${locationHome}
    }
    `;
  }else{
    finalConfig += `
      ${locationHome}
    `;
  }

  finalConfig = `
    ${upstream}

    server {
      listen 80;
      listen 443;

      ${finalConfig}
    }
  `;

  return finalConfig;
}

function createUpStream(hosts, name){
  let returnString = `
  upstream ${name} {

  `;
  hosts.forEach((host)=>{
    returnString += `
      server ${host};

    `
  });
  returnString += `
  
  }
  `;
  return returnString;
}

function createOneEndPoint(data){
  let returnString = "";

  switch(data.proxyType){
    case "domain": {
      returnString += `
        rewrite /${data.subpath}$ / break;
        rewrite /${data.subpath}(.*) $1 break;
        proxy_set_header Host ${data.domain};
        proxy_set_header Referer $http_referer;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
        proxy_pass ${data.schema}://${data.domain};
      `
      break;
    }
    case "subpath": {
      returnString += `
      return 307 $scheme://$host/${data.proxySubpath}$request_uri;
      `
      break;
    }
    case "ip": {
      returnString += `
      rewrite /${data.subpath}$ / break;
      rewrite /${data.subpath}(.*) $1 break;
      proxy_set_header Host ${data.host[0]};
      proxy_set_header Referer $http_referer;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_ssl_server_name on;
      proxy_pass http://${data.subpath};
      `
      break;
    }
  }

  return returnString;
}

module.exports = {
  updateConfig
}