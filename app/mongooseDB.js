var mongoose = require("mongoose");

mongoose.connect('mongodb://cc:cc@ds139619.mlab.com:39619/crystalcube-dev',function(err){
  if(err){
    throw err;
  }
  else{
    console.log("DB connection successful")
  }
})

module.exports = {
  userSchema : mongoose.model("accounts",{
    name: String,
    personID: String
  })
}