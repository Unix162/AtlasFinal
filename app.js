const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const {configRoutes} = require("./routes/configRoutes")
require("./db/mongoConnect")

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))
configRoutes(app);
const server = http.createServer(app);
server.listen(3001);
console.log("http://localhost:3001")