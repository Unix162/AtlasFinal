const express = require("express");
const router = express.Router();

router.get("/",async(req,res) => {
  res.json({msg:"index work 222"})
})

module.exports = router;