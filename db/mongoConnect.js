const mongoose = require('mongoose');
const dns = require("dns");
require("dotenv").config({quiet:true})
dns.setServers(["1.1.1.1"]);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("mongo connect toys_db");

}