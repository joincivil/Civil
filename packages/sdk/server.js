var path = require("path");
var fs = require("fs");
var express = require("express");
var https = require("https");

var certOptions = {
  key: fs.readFileSync(path.resolve("cert/server.key")),
  cert: fs.readFileSync(path.resolve("cert/server.crt"))
};

var app = express();
app.use(express.static("build"));

var server = https.createServer(certOptions, app).listen(3000);
