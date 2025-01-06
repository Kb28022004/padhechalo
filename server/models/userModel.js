const validator = require("validator");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide users name"],
  },
  email: {
    type: String,
    required: [true, "Please provide users email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide users password"],
    minLength:[8,'password should be atleast of 8 characters'],
    select: false,
  },
  profilePicture:{
    type:String,

  },
  role:{
    type:String,
    default:"user"
  },
  otp:{
    otp:{type:String},
    token:{type:String},
    sendTime:{type:Number}
  },
  phone:{
    type:Number,
    required:[true,'Please provide your mobile number']
  },
  enroll:{
    type:Number,
    required:[true,'Please provide your enroll number']
  },
  admission:{
    type:String,
    required:[true,'Plase provide date of admission']
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('User',userSchema)
