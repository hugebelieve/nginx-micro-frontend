var serverCall =  function({ url , type , obj   }){
  return new Promise(function(resolve, reject) {
    $.ajax({
      url,
      data: obj,
      type,
      header:{
        'Content-Type': "application/json",
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Credentials': true
      },
      success: function(data){

        if(data.error){
          reject(data.error);
        }else {
          resolve(data);
        }
      },
      fail: function(error){
        reject(error);
      },
      error: function (errormessage) {
        reject(errormessage);
      }
    });

  });
}

function setMainData(data){
  return serverCall({
          url: "/save",
          type:"POST",obj:data});
}

function removeMainData(id){
  return serverCall({
          url: "/remove",
          type:"POST",obj:{data: {id}}});
  }

function getMainData(){
  return serverCall({
    url: "/getAll",
    type:"POST",obj:{ passcode: "BSCtest" }});
}

function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}

$.fn.scrollView = function () {
  $($(this).parent()).animate({
    scrollTop: $(this).parent().scrollTop() + $(this).offset().top - $(this).parent().offset().top
  }, 500);
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}