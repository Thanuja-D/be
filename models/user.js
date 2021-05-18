const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create user Schema and model
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true,'Name field is required']
  },
  salary:{
    type: Number
  },
  department:{
    type: String,
    default: 'N/A'
  }
});

const User = mongoose.model('user',UserSchema);
module.exports = User;
