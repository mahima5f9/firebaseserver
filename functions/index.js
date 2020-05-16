const functions = require('firebase-functions');
var admin=require('firebase-admin');
var express=require('express');

const cors = require('cors')

admin.initializeApp({
    credential: admin.credential.cert(require('./keys/ServiceAccKey.json')),
    databaseURL: "https://organic-duality-224412.firebaseio.com"
  });
  
  -
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://fbauthdemo-2a451.firebaseio.com"
  // });
  console.log("wor")
  
  var app = express();
  //app.use(cors())

  exports.api = functions.https.onRequest(app)
  
  app.post("/register", (request,response) => {
    const inputData = request.body
    if(!inputData.uid)
      return response.send({
        code : "incorrect-uid",
        message : "please provide valid uid"
      })
    //inputData.uid = inputData.uid.toUpperCase()
    if(!inputData.phoneNumber || !inputData.phoneNumber.match(/^\+[0-9]{1,3}[0-9]{10}$/))
      return response.send({
        code : "incorrect-phoneNumber",
        message : "please provide valid phoneNumber"
      })

      admin.firestore().collection("USERS").where("uid","==",inputData.uid).get()
      .then(snapshot => {
        if(snapshot.size > 0)
          throw new Error('exists')

        return admin.firestore().collection("USERS").where("phoneNumber","==",inputData.phoneNumber).get()
      }).then(snapshot => {
        if(snapshot.size > 0)
          throw new Error('exists')
        
        return admin.firestore().collection("USERS").doc(inputData.uid).set(inputData)
      }).then(() => {
        const data = {
          uid : inputData.uid,
          phoneNumber : inputData.phoneNumber,
          Name:inputData.Name,
          registernum:inputData.registernum,
          Photo:inputData.Photo,
          Year:inputData.Year,
          Dept:inputData.Dept,
          Email:inputData.Email,
          Backlogs:inputData.Backlogs,
          Cgpa:inputData.Cgpa,
          Skills:inputData.Skills,
          Resume:inputData.Resume,
          Address:inputData.Address,
          password : inputData.phoneNumber+"@sasi.ac.in"
        }
        return admin.auth().createUser(data)
      }).then(() => {
        return response.send({status : true})
      }).catch(err => {
        console.log(err)

        if(err.toString().match("exists"))
          return response.send({
            code : "already-exists",
            message : "user with similar information already exists"
          })
        else if(err.code)
          return response.send({code : err.code, message : err.message})
        
        return response.send({
          code : "internal-error",
          message : "server isn't working now"
        })
1
      })
  })
  
 


  app.post("/profile",(request,response)=>{
    const inputdata=request.body
    console.log(inputdata.uid)
    if(!inputdata.uid)
      return response.send({
        code : "incorrect-uID",
        message : "please provide valid uId"
      })

      admin.firestore().collection("USERS").where("uid","==",inputdata.uid).get()
      .then(snapshot => {
        if(snapshot.size < 0)
          throw new Error('doesnt exists')
      })
        //return admin.firestore().collection("USERS").doc(inputdata.uid).get()
        return admin.firestore().collection("USERS").doc(inputdata.uid).get().then(doc => {
    if (doc.exists) {
         response.send(doc.data())
         console.log("sent")
         console.log(doc.data())
    } else {
         console.log("No  document!");
    }
}).catch(function(error) {
   console.log("Error in document:", error);
        });



  })