/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

let express = require("express");
let bodyParser = require("body-parser");
let core = require("mms-core");
const spawn = require("child_process").spawn;
let fs = require("fs");
let app = express();

let quality = ["500k", "1000k", "2000k"];
let count = 0;

app.post("/api/video/:contentId", function(req, res) {
  var contentId = req.params.contentId;
  count = count + 1;
  console.log(contentId);
  if (!fs.existsSync(contentId)) {


    //Création des répertoires
    if (!fs.existsSync(contentId)) {
      fs.mkdirSync(contentId);
    }
    if (!fs.existsSync(contentId + "/" + quality[0])) {
      fs.mkdirSync(contentId + "/" + quality[0]);
    }
    if (!fs.existsSync(contentId + "/" + quality[1])) {
      fs.mkdirSync(contentId + "/" + quality[1]);
    }
    if (!fs.existsSync(contentId + "/" + quality[2])) {
      fs.mkdirSync(contentId + "/" + quality[2]);
    }


    //execution du transcodeur
    let ls;
    ls = spawn("node", ["index.js", contentId, count]);
    console.log(
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<" + " " + contentId
    );
    ls.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
    });

    ls.on("close", code => {
      console.log(`child process exited with code ${code}`);
    });
  }

});
let server = app.listen(8088);
server.timeout = 100000000;
console.log("listenning in port 8088");
