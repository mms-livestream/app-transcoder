/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

let express = require("express");
let bodyParser = require("body-parser");

module.exports = options => {
  let service = options.service;
  let router = express.Router();

  let transition = {};

  router.get("/localvideo", function(req, res) {    //route POST /video done before
    transition.pass.pipe(res);
  });

  router.post("/video", function(req, res) {
    transition.pass = req;
  });

    router.get("/test", function(req, res) {
    res.send("test ok");
  });

  return router;
};
