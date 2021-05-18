const Register = require('../models/register');
const jwt = require('jsonwebtoken');

// Handle errors
const handleErrors = (err) => {
  let errors = {email:"", password:""};

if(err.code===11000){
  errors.email = "Already exists";
}

  if(err.message.includes('register validation failed')){
    Object.values(err.errors).forEach(({properties})=>{
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

const maxAge = 60*60*24;
const createToken = (id)=>{
  return jwt.sign({id},'test-secret',{
    expiresIn:maxAge
  });
}

module.exports.login_post = async(req,res)=>{
  const{email,password} = req.body;
  try{
    const register = await Register.login(email,password);
    const token = createToken(register._id);
    res.cookie('jwt',token,{httpOnly:true, maxAge:1000*60*60*24});
    res.status(200).json({registerId:register._id});
  }
  catch(err){
    res.status(400).json({reason:'failed'});
  }
}

module.exports.signup_post = async(req,res)=> {
  const{name,email,password} = req.body;
  try{
    const register = await Register.create({name,email,password});
    const token = createToken(register._id);
    res.cookie('jwt',token,{httpOnly:true, maxAge:1000*60*60*24});
    res.status(201).json(register._id);
  }
  catch(err){
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

module.exports.logout_get = (req,res)=>{
  res.cookie('jwt',"",{maxAge: 1});
  res.status(200).json({message:'success'});
}
