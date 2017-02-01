var oxford = require("project-oxford");
var client = new oxford.Client('7fe6ec1e951f4f838c0f5d8e0dc495e1');
var mongooseDB = require("./mongooseDB");
var userDB = mongooseDB.userSchema;


var trainingGroup = function(personGroup){
  client.face.personGroup.trainingStart(personGroup)
  .then(function(response){
    console.log(response);
  })
  .catch(function(err){
    console.log(err);
  })
}

var saveUserToDB = function(personId,name){
  var newUser = new userDB();
  newUser.name = name;
  newUser.personID = personId;
  newUser.save(function(err){
    if(err){
      callback(err)
    }
  })
}



module.exports = {

    createUser : function(personGroup,name,callback){
      client.face.person.create(personGroup, name)
      .then(function(response){

        client.face.person.addFace(personGroup,response.personId,{
          path: "./img/faces/blob.png"
        })
        .then(function(response2){
          client.face.personGroup.trainingStart(personGroup)
          .then(function(){
            console.log("training start");
            saveUserToDB(response.personId, name,function(err){
              if(err)
                throw err;
              else{
                console.log('user saved')
              }
                
            })
          })
          .catch(function(err){
            console.log(err);
          })
          
        })
        .catch(function(err){
          console.log(err)
        })
      })
    },


    findUser : function(personGroup){
      client.face.detect({
        path: "./img/faces/blob.png",
        returnFaceId: true
      })
      .then(function(response){
        if(response.length > 0){
          var faces = [response[0].faceId];
          client.face.identify(faces,personGroup,1,0.4)
          .then(function(response2){
            console.log(response2[0].candidates[0])
            userDB.findOne({'personID': response2[0].candidates[0].personId},function(err,userData){
              if(err)
                throw err;
              else
                console.log('Hello, ' + userData.name)
             })
            })
          .catch(function(err){
            console.log(err);
          })
        }
        else{
          console.log("error")
        }
      })
      .catch(function(err){
        console.log(err);
      })
    },

   trainingGroupStatus : function(personGroup){
     client.face.personGroup.trainingStatus(personGroup)
     .then(function(response){
       console.log(response);
     })
     .catch(function(err){
       console.log(err);
     })
   },

   trainingGroupStart: function(personGroup){
      
   },

   resetPersonGroup: function(personGroup){
    client.face.personGroup.delete(personGroup)
    .then(function(){
      client.face.personGroup.create(personGroup,personGroup)
      .then(function(){
        console.log("reset done")
      })
      .catch(function(err){
        throw err;
      })
    })
    .catch(function(err){
      throw err;
    })
   },

   list: function(personGroup){
    client.face.person.list(personGroup)
    .then(function(response){
      console.log(response)
    })
    .catch(function(err){
      throw err;
    })
   } 
}