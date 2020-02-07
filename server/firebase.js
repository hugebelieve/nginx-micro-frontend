var admin = require("firebase-admin");

let serviceAccount = require("../config/enigma-nginx-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});
var db = admin.firestore();

function saveDoc(id, obj){
  obj["active"] = true;
  return db.collection("proxy").doc(id).set(obj, {merge: true});
}

function removeDoc(id){
  return db.collection("proxy").doc(id).set({active: false}, {merge: true});
}

function getAllDocs(){
  return new Promise((resolve, reject)=>{
    db.collection("proxy").where("active", "==", true).get().then((querySnapshot)=>{
      let dataList = [];
      querySnapshot.forEach(function(doc) {
        dataList.push(doc.data());
      });
      resolve(dataList.reverse()); // send in desc
    }).catch((error)=>{
      reject(error);
    })
  });
}

module.exports = {
  saveDoc, getAllDocs, removeDoc
}