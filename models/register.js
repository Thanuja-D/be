const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

// Create user Schema and model
const RegisterSchema = new Schema({
  name: {
    type: String,
    required: [true,'Name field is required']
  },
  email:{
    type: String,
    required: [true,'Name field is required'],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Email address not valid"]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
});

// Hash the password before saving
RegisterSchema.pre('save',async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
});

//Static method to logIn
RegisterSchema.statics.login = async function(email,password){
  const register = await this.findOne({email:email});
  if(register){
    const auth = await bcrypt.compare(password,register.password);
    if(auth){
      return register;
    }
    throw Error('inccorect password');
  }
  throw Error('incorrect email');
}

const Register = mongoose.model('register',RegisterSchema);
module.exports = Register;
