const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


//set up express app
const app = express();

// connect to MongoDB
mongoose.connect('mongodb://localhost/userdata');
mongoose.Promise = global.Promise;

app.use(express.static('./public/frontend/dist/frontend'));
app.use(cookieParser());

app.use(bodyParser.json());

//intialize routes
app.use('/api',require('./routes/api'));

//Error handleing middleware
app.use(function(err,req,res,next){
  res.status(422).send({error: err._message});
});

// listen for requests
app.listen(4000,function(){
  console.log("Listning to port 4000");
});
