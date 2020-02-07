var express = require('express');
var router = express.Router();
var firebase = require('../server/firebase');
var update = require('../server/updateConfig');
update.updateConfig();

router.post('/save', function(req, res, next) {
  if(req.body.data && req.body.data.id){
    firebase.saveDoc(req.body.data.id, req.body.data).then(()=>{
      res.send("Successfully saved!");
      // now new config pass to nginx
      update.updateConfig();
    }).catch((error)=>{
      console.log(error);
      res.send({error:"Unable to save right now!"});
    });
  }else{
    res.send({error:"Please provide proper input!"});
  }
});

router.post('/getAll', function(req, res, next) {
  if(req.body.passcode && req.body.passcode=="BSCtest"){
    firebase.getAllDocs().then((data)=>{
      res.send(data);
    }).catch((error)=>{
      console.log(error);
      res.send({error:"Unable to fetch data!"});
    });
  }else{
    res.send({error:"Unauthorized!"});
  }
});

router.post('/remove', function(req, res, next){
  if(req.body.data && req.body.data.id){
    firebase.removeDoc(req.body.data.id).then(()=>{
      res.send("Successfully removed!");
      // now new config pass to nginx
      update.updateConfig();
    }).catch((error)=>{
      console.log(error);
      res.send({error:"Unable to remove right now!"});
    });
  }else{
    res.send({error:"Please provide proper input!"});
  }
})

module.exports = router;