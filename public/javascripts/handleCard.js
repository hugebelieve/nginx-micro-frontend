let mainData = [];

$(document).ready(function(){
  
  $("#addProxy").on('click', ()=>{
    let subPathName = prompt("Please enter new subpath for proxy");
    if (subPathName == null || subPathName == "") {
      return;
    }
    mainData.unshift(Object.assign( {}, sampleSubPath, {subpath:subPathName, host: []}));
    $("#accordion").prepend(getCardClone(subPathName, mainData));
  });

  $('#accordion').on('keyup',(event)=>{
    let name = event.target.getAttribute('name');
    if(name!="" && name!=null){
      valueUpdateEvent(event, name);
    }
  });
  $('#accordion').on('change',(event)=>{
    let name = event.target.getAttribute('name');
    if(name!="" && name!=null){
      valueUpdateEvent(event, name);
    }
  });
  $('#accordion').on('click',(event)=>{
    let name = event.target.getAttribute('name');

    switch(name){
      case "remove": valueUpdateEvent(event, "host", true); break;
      case "cardSave": checkValueAndSave(event); break;
      case "cardRemove": removeData(event); break;
    }
  });
});

function removeData(event){
  let index = findPositionIndex($(event.target).parents('.card'), document.getElementById('accordion'));
  if(index<0){
    return;
  }
  if(mainData[index].id){
    if (!confirm("Are you sure you want to remove this entry!")) {
      // cancel click
      return;
    }
    removeMainData(mainData[index].id).then(()=>{
      alert("Successfully removed!");
      $(event.target).parents('.card').remove();
    }).catch(error=>{
      alert(error);
    });
  }else{
    $(event.target).parents('.card').remove();
  }
}

function checkValueAndSave(event){
  let index = findPositionIndex($(event.target).parents('.card'), document.getElementById('accordion'));
  if(index<0){
    return;
  }
  let targetValue = mainData[index];
  if(!targetValue.id){
    targetValue.id = (new Date()).valueOf();
    targetValue.created_at = (new Date()).valueOf();
  }else{
    targetValue.updated_at = (new Date()).valueOf();
  }

  if(!checkAllValue(targetValue)){
    $(event.target).parents('.card').find(".btn-link").click();
    return;
  }
  console.log(targetValue);
  setMainData({data:targetValue}).then((message)=>{
    alert(message);
  }).catch((error)=>{
    alert(error);
  });
}

function checkAllValue(targetValue){
  if(!/^[a-zA-Z-]+$/.test(targetValue.subpath)){
    alert("Please provide proper subpath");
    return false;
  }

  switch(targetValue.proxyType){
    case "ip": {
      if(targetValue.host.length==0){
        alert("Please provide at least one server ip");
        return false;
      }
      targetValue.host.forEach(element => {
        if(!element || element==""){
          alert("Please provide all server ips");
          return false;
        }
      });
      break;
    }
    case "domain": {
      if(!targetValue.domain || targetValue.domain==""){
        alert("Please provide proper domain name");
        return false;
      }
      break;
    }
    case "subpath": {
      if(!/^[a-zA-Z-]+$/.test(targetValue.proxySubpath)){
        alert("Please provide proper proxy subpath");
        return false;
      }
      break;
    }
  }

  return true;
}

function showSpecificCard(event){
  $($(event.target).parents('.card')).find(".btn-link")[0].click()
}

function findPositionIndex(element,parent){
  let allChildren = $(parent).children();
  for(let i=0; i<allChildren.length; i++){
    if($(allChildren[i])[0]==$(element)[0]){
      return i;
    }
  }
  return -1;
}

function valueUpdateEvent(event, name, removeHost=false){
  let index = findPositionIndex($(event.target).parents('.card'), document.getElementById('accordion'));
  if(index<0){
    return;
  }

  if(name!="host"){
    mainData[index][name] = event.target.value;
  }else{
    let hostIndex = findPositionIndex($(event.target).parents('.server-fields'), $(event.target).parents('.serverTypeClass'));
    if(hostIndex<0){
      return;
    }
    if(removeHost){
      mainData[index][name].splice(hostIndex, 1);
    }else{
      mainData[index][name][hostIndex] = event.target.value;
    }
  }
}