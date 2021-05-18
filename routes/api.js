const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const authController = require('../controllers/authController');

//check login auth
router.get('/checkAuth',function(req,res){
    const token = req.cookies.jwt
    if(token){
      jwt.verify(token, "test-secret",(err,decodedToken) => {
        if(err){
          res.send({status:'failed'});
        }
        else{
          res.send({status:'passed'});
        }
      });
    }
    else{
      res.send({status:'failed'});
    }
});

//Sign up/sign in/log out
router.post('/signup',authController.signup_post);
router.post('/signin',authController.login_post);
router.get('/logout',authController.logout_get);

// Get one user with nameInput
router.get('/oneUser/:name',function(req,res,next){
  User.findOne({name:req.params.name}).then(function(user){
    res.send(user);
  }).catch(next);
});

// Get all users from the database
router.get('/allUsers',function(req,res,next){
  User.find().then(function(users){
    res.send(users);
  }).catch(next);
});

// Add a new user to the DB
router.post('/createUser',function(req,res,next){
  User.create(req.body).then(function(user){
    res.send(user);
  }).catch(next);
});

// Update a user in the DB
router.put('/users/:id',function(req,res,next){
  User.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){
    User.findOne({_id:req.params.id}).then(function(user){
        res.send(user);
    });
  }).catch(next);
});

//Delete a user from the DB
router.delete('/users/:id',function(req,res,next){
  User.findByIdAndRemove({_id:req.params.id}).then(function(user){
    res.send(user);
  }).catch(next);
});

module.exports = router;
