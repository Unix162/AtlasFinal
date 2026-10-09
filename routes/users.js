const express = require("express");
const bcrypt = require("bcrypt");
const {UserModel,validUser,validLogin,createToken} = require("../models/userModel");
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.get("/",async(req,res) => {
  res.json({msg:"users endpoint"});
});

router.get("/userInfo",auth,async(req,res) => {
  try{
    const data = await UserModel.findOne(
      {_id:req.tokenData._id},
      {password:0}
    );

    res.json({msg:"you logged in",data});
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});

router.post("/",async(req,res) => {
  const validBody = validUser(req.body);

  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }

  try{
    const user = new UserModel(req.body);

    // הצפנת הסיסמא
    user.password = await bcrypt.hash(user.password,10);

    await user.save();

    // הסתרת הסיסמא מהמידע שחוזר לצד לקוח
    user.password = "******";

    res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(400).json({
        err:"User already in system",
        code:11000
      });
    }

    console.log(err);
    res.status(502).json({err});
  }
});

router.post("/login",async(req,res) => {
  const validBody = validLogin(req.body);

  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }

  try{
    const user = await UserModel.findOne({email:req.body.email});

    if(!user){
      return res.status(401).json({err:"Email not found"});
    }

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if(!passwordValid){
      return res.status(401).json({err:"Password not match"});
    }

    const newToken = createToken(user._id);

    res.json({msg:"you logged in",token:newToken});
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});


module.exports = router;