var express = require('express');
var app = express();
var multer = require('multer');
var bodyParser = require('body-parser');



app.use(express.static('./public'));
app.use(bodyParser.urlencoded({limit: '1mb',extended: true}))
app.use(bodyParser.json({limit: '1mb'}));


var faceContainer = multer.diskStorage({
  destination:'./img/faces',
  filename: function(req,file,cb){
    cb( null, file.originalname+'.png' );

  }
});

var faceUpload = multer({ storage: faceContainer})


var face = require("./app/faceAPI"); 

//=============================================================

app.post('/find',faceUpload.single('file'),function(req,res){
  face.findUser('test_one');
  res.end();
})

app.post('/create',faceUpload.single('file'),function(req,res){
  console.log(req.body)
  face.createUser('test_one',req.body.username);

  res.end();
})

app.get('/reset',function(req,res){
  face.resetPersonGroup('test_one');
  res.end();
})

app.get('/train',function(req,res){
  face.trainingGroupStart('test_one');
  res.end();
})

app.get('/',function(req,res,next){
  res.end();
})

app.listen(3000);



