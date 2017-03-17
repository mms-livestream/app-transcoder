/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

let express = require("express");
let bodyParser = require("body-parser");
let Infiniteloop = require("infinite-loop");

module.exports = options => {
  let service = options.service;
  let router = express.Router();

  let transition = {};

  router.get("/localvideo", function(req, res) { //small hack : route POST /video done before
    transition.pass.pipe(res);
  });

  router.post("/video", function(req, res) {
    transition.pass = req;
    options.ffmpeg();

    //loop for mp4tom4s
    let loop1 = new Infiniteloop();
    //use loop.add to add a function
    //fisrt argument should be the fn, the rest is the fn's arguments
    loop1.add(options.toolbox.mp4box, []);
    loop1.setInterval(2000);
    loop1.run();

    //loop for renameSendDelete
    let loop2 = new Infiniteloop();
    loop2.add(options.toolbox.renameSendDelete, []);
    loop2.setInterval(2000);
    loop2.run();
  });

  return router;
};
