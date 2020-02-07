let sampleSubPath = {
    subpath: "New Subpath",
    proxyType: "ip",
    schema: "https",
    host: [],
    domain: "",
    proxySubpath: ""
};

$(document).ready(function() {

  getMainData().then((data)=>{
    mainData = data;
    $("#accordion").html("");
    mainData.forEach((eachItem, index)=>{
      let cardClone = getCardClone(eachItem.subpath, eachItem);
      $("#accordion").append(cardClone);
      setTimeout(()=>{
        $($("#accordion").children()[index]).find('.proxyType').change();
      },50);
    });
  }).catch((err)=>{
    alert(err);
  })



  $("body").on("click",".add-more",function(event){
    let template = document.getElementById("server-fields");
    let clone = $(template.content.cloneNode(true));
    $(clone.find("button")).removeClass("hide");
    $(event.target).before(clone[0]);
  });

  $("body").on("click",".remove",function(event){ 
    $(event.target).parents(".server-fields").remove();
  });

  $("body").on("change",".proxyType",function(event){
    let option = event.target.value;
    let mainParent = $(event.target).parents(".container");

    let serverType = mainParent.find(".serverTypeClass");
    let domainType = mainParent.find(".domainTypeClass");
    let subpathType = mainParent.find(".subpathTypeClass");

    serverType.addClass("hide");
    domainType.addClass("hide");
    subpathType.addClass("hide");

    switch(option){
      case "ip": serverType.removeClass("hide"); break;
      case "domain": domainType.removeClass("hide"); break;
      case "subpath": subpathType.removeClass("hide"); break;
    }
  });
});

function getCardClone(subPathName, obj){
  let template = document.getElementById("cardTemplate");
  let clone = template.content.cloneNode(true);
  $(clone).find('#cardHeaderId').find('.btn-link').attr('data-target','#'+subPathName);
  $(clone).find('#cardHeaderId').find('.btn-link').attr('aria-controls',subPathName);
  $(clone).find('#cardHeaderId').find('.btn-link').html("/"+subPathName);
  $(clone).find('#cardHeaderId').attr('id', 'header'+subPathName);

  $(clone).find('#cardId').attr('aria-labelledby', 'header'+subPathName);
  $(clone).find('#cardId').attr('id', subPathName);
  $(clone).find('.card').attr('id', subPathName+"Card");

  if(obj){
    if(obj.proxyType) $(clone).find('select[name=proxyType]').val(obj.proxyType);
    if(obj.schema) $(clone).find('input[name=schema]').val(obj.proxyType);
    if(obj.domain) $(clone).find('input[name=domain]').val(obj.domain);
    if(obj.proxySubpath) $(clone).find('input[name=proxySubpath]').val(obj.proxySubpath);

    let serverType = $(clone).find('.serverTypeClass');

    if(obj.host)
    obj.host.forEach((host,index) => {
      if(index==0){
        $(serverType).find("input").val(host);
      }else{
        // attach new
        let template = document.getElementById("server-fields");
        let inputClone = $(template.content.cloneNode(true));
        $(inputClone.find("button")).removeClass("hide");
        $(inputClone).find('input').val(host);
        $($(clone).find('.add-more')).before(inputClone[0]);
      }
    });
  }
  $(clone).find('input[name=subpath]').val(subPathName);

  return clone
}