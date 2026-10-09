const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config({quiet:true});

const schema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER"
  }
}, {timestamps:true});

exports.UserModel = mongoose.model("users",schema);
exports.createToken = (user_id) => {

  const token = jwt.sign({_id:user_id},process.env.TOKEN_SECRET,{expiresIn:"600mins"});
  return token;
}

exports.validUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    email:Joi.string().min(2).max(99).email().required(),
    password:Joi.string().min(3).max(99).required()
  });

  return joiSchema.validate(_reqBody);
}


exports.validLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    email:Joi.string().min(2).max(99).email().required(),
    password:Joi.string().min(3).max(99).required()
  });

  return joiSchema.validate(_reqBody);
}