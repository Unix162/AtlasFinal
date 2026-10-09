const jwt = require("jsonwebtoken");
require("dotenv").config({quiet:true})
exports.auth = (req,res,next) => {
  const token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You need to send token to this endpoint 11111"})
  }
  try{ 
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET)
    req.tokenData = decodeToken;
    next()
  }
  catch(err){
    res.status(401).json({err:"Token invalid or expired"})
  }
}
