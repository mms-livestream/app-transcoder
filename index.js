/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

//Dependencies

let util = require("util");
let exec = require("child_process").exec;
let fs = require("fs");
let request = require("request");
let core = require("mms-core");
let Promise = require("bluebird"); //jshint ignore:line

let serverAPI = require("./api/server/module.js");
let serviceAPI = require("./api/server/module.js");

//let addr = "http://192.168.2.118:8080/video";
let addr = "http://localhost:"+core.dConfig["NODE_TRANSCODER"].server.port+"/api/localvideo";
let destAddr = "http://192.168.2.122:"+core.dConfig["NODE_REPLICATOR"].server.port;
let quality = ["500k", "1000k", "2000k"];
let qualityDash = ["500000", "1000000", "2000000"];
let counter = 1; //global variable
let counterFind = 0;
let contentId = process.argv[2].split(",");
let count = process.argv[3].split(",");

function mp4box() {
    console.log("=============================>>>>>>>>>>>>>>"+ counter);
  if (
    fs.existsSync(contentId + "/" + quality[0] + "/" + quality[0] + "_" + counter + ".mp4") &&
    fs.existsSync(contentId + "/" + quality[1] + "/" + quality[1] + "_" + counter + ".mp4") &&
    fs.existsSync(contentId + "/" + quality[2] + "/" + quality[2] + "_" + counter + ".mp4")
  ) {
    var counterTmp = counter - 1;
    var child;
    child = exec(
      `MP4Box -dash 6000-profile live -bs-switching no -segment-name '${contentId}/$RepresentationID$_${counterTmp}' -out 'mpd.mpd' ${contentId}/${quality[0]}/${quality[0]}_${counterTmp}.mp4 ${contentId}/${quality[1]}/${quality[1]}_${counterTmp}.mp4 ${contentId}/${quality[2]}/${quality[2]}_${counterTmp}.mp4`,
      function(error, stdout, stderr) {
        util.print("stdout: " + stdout);
        util.print("stderr: " + stderr);
        if (error !== null) {
          console.log("exec error: " + error);
        }
      }
    );
     counter++;
  }
}

function renameSendDelete () {
    console.log("2_"+counterFind+"1.m4s");
  if (
    fs.existsSync(contentId + "/" + "2_"+counterFind+"1.m4s") &&
    fs.existsSync(contentId + "/" + "3_"+counterFind+"1.m4s") &&
    fs.existsSync(contentId + "/" + "4_"+counterFind+"1.m4s")
  ) {
    var counterRename = counterFind + 1;

    /*----------------------------------- Quality 500k ---------------------------------*/
    // rename
    fs.rename(contentId + "/" + "2_"+counterFind+"1.m4s", contentId + "/" + "out"+qualityDash[0]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream(contentId + "/" + "out"+qualityDash[0]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId+"/"+qualityDash[0]+"/"+ "out"+qualityDash[0]+"_dash"+counterRename+".m4s"));
    });
    //Delete
    fs.unlinkSync(contentId + "/" + quality[0] + "/" +quality[0] + "_" + counterFind + ".mp4");

    /*------------------------------------- Quality 1000k -------------------------------*/
    fs.rename(contentId + "/" + "3_"+counterFind+"1.m4s", contentId + "/" + "out"+qualityDash[1]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream(contentId + "/" + "out"+qualityDash[1]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId+"/"+qualityDash[1]+"/"+ "out"+qualityDash[1]+"_dash"+counterRename+".m4s"));
    });

    //Delete
    fs.unlinkSync(contentId + "/" + quality[1] + "/" +quality[1] + "_" + counterFind + ".mp4");

    /*--------------------------------------- Quality 2000k --------------------------------*/
    fs.rename(contentId + "/" + "4_"+counterFind+"1.m4s", contentId + "/" + "out"+qualityDash[2]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream(contentId + "/" + "out"+qualityDash[2]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId+"/"+qualityDash[2]+"/"+ "out"+qualityDash[2]+"_dash"+counterRename+".m4s"));
    });
    //Delete
    fs.unlinkSync(contentId + "/" + quality[2] + "/" +quality[2] + "_" + counterFind + ".mp4");

    /*--------------------------------------Send mp4 ----------------------------------------*/
    fs.rename(contentId + "/" + "2_0.mp4", contentId + "/" + "out"+qualityDash[0]+"_dash"+".mp4", function(err) {
      fs.createReadStream(contentId + "/" + "out"+qualityDash[0]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId + "/"+qualityDash[0]+"/"+ "out"+qualityDash[0]+"_dash"+".mp4"));
    });

    fs.rename(contentId + "/" + "3_0.mp4", contentId + "/" + "out"+qualityDash[1]+"_dash"+".mp4", function(err) {
      fs.createReadStream(contentId + "/" + "out"+qualityDash[1]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId + "/"+qualityDash[1]+"/"+ "out"+qualityDash[1]+"_dash"+".mp4"));
    });

    fs.rename(contentId + "/" + "4_0.mp4", contentId + "/" + "out"+qualityDash[2]+"_dash"+".mp4", function(err) {
      fs.createReadStream(contentId + "/" + "out"+qualityDash[2]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId + "/"+qualityDash[2]+"/"+ "out"+qualityDash[2]+"_dash"+".mp4"));
    });

    counterFind ++;
  }
}


//Class

class Transcoder {
  constructor() {
    this.node = `NODE_TRANSCODER${count}`;
    this.service = new core.Service(this.node, serviceAPI);
    this.server = new core.Server(this.node, serverAPI, {
      service: this.service,
      ffmpeg: this.ffmpeg,
      toolbox: {mp4box: mp4box, renameSendDelete: renameSendDelete}
    });
  }

  ffmpeg() {
    for (let i = 0; i < quality.length; i++) {
      setTimeout(
        function() {
          var child;
          child = exec(
            `ffmpeg -use_wallclock_as_timestamps 1 -i ` +
              addr +
              ` -c copy -flags +global_header -map 0 -codec:v libx264 -profile:v main -b:v ` +
              quality[i] +
              ` -vf scale=640:480 -x264opts keyint=12:min-keyint=12:scenecut=-1 -bf 0 -r 24 -f segment -segment_time 6 -segment_format_options movflags=+faststart -reset_timestamps 1 ${contentId}/${quality[i]}/${quality[i]}_%d.mp4`,
            // //-use_wallclock_as_timestamps 1 pour forcer la lecture a la bonne vitesse

            function(error, stdout, stderr) {
              util.print("stdout: " + stdout);
              util.print("stderr: " + stderr);
              if (error !== null) {
                console.log("exec error: " + error);
              }
            }
          );
        },
        0
      );
    }
  } //ffmpeg


}

//Main

let transcoder = new Transcoder();

transcoder.server.listen();
