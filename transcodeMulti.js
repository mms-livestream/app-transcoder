"use strict"

let util = require("util");
let exec = require("child_process").exec;
let fs = require("fs");
let request = require("request");
let Infiniteloop = require("infinite-loop");

let addr = process.argv[3].split(",");//"http://192.168.2.134:8080/video";
let destAddr = "http://192.168.2.122:9000";
let quality = ["500k", "1000k", "2000k"];
let qualityDash = ["500000", "1000000", "2000000"];
let counter = 1; //global variable
let counterFind = 0;
let contentId = process.argv[2].split(",");
let uploaderId = ['1', '2'];

for (let j = 0; j < uploaderId.length; j++) {
for (let i = 0; i < quality.length; i++) {
  setTimeout(
    function() {
      var child;
      child = exec(
        `ffmpeg -use_wallclock_as_timestamps 1 -i ` +
          addr[j] +
          ` -c copy -flags +global_header -map 0 -codec:v libx264 -profile:v main -b:v ` +
          quality[i] +
          ` -vf scale=640:480 -x264opts keyint=12:min-keyint=12:scenecut=-1 -bf 0 -r 24 -f segment -segment_time 6 -segment_format_options movflags=+faststart -reset_timestamps 1 ${uploaderId[j]}/${quality[i]}/${quality[i]}_%d.mp4`,
        function(error, stdout, stderr) {
          util.print("stdout: " + stdout);
          util.print("stderr: " + stderr);
          if (error !== null) {
            console.log("exec error: " + error);
          }
        }
      );
    },0);
};
};

function mp4box() {
    console.log("=============================>>>>>>>>>>>>>>"+ counter);
  for (let k = 0; k < uploaderId.length; k++){
  if (
    fs.existsSync(uploaderId[k] + "/" + quality[0] + "/" + quality[0] + "_" + counter + ".mp4") &&
    fs.existsSync(uploaderId[k] + "/" + quality[1] + "/" + quality[1] + "_" + counter + ".mp4") &&
    fs.existsSync(uploaderId[k] + "/" + quality[2] + "/" + quality[2] + "_" + counter + ".mp4")
  ) {
    var counterTmp = counter - 1;
    var child;
    child = exec(
      `MP4Box -dash 6000-profile live -bs-switching no -segment-name '$RepresentationID$_${counterTmp}' -out 'mpd.mpd' ${uploaderId[k]}/${quality[0]}/${quality[0]}_${counterTmp}.mp4 ${uploaderId[k]}/${quality[1]}/${quality[1]}_${counterTmp}.mp4 ${uploaderId[k]}/${quality[2]}/${quality[2]}_${counterTmp}.mp4`,
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
}}


function renameSendDelete () {
    console.log("2_"+counterFind+"1.m4s");
  for (let k = 0; k < uploaderId.length; k++){
  if (
    fs.existsSync(uploaderId[k] + "/" + "2_"+counterFind+"1.m4s") &&
    fs.existsSync(uploaderId[k] + "/" + "3_"+counterFind+"1.m4s") &&
    fs.existsSync(uploaderId[k] + "/" + "4_"+counterFind+"1.m4s")
  ) {
    var counterRename = counterFind + 1;

    /*----------------------------------- Quality 500k ---------------------------------*/

    // rename
    fs.rename(uploaderId[k] + "/" + "2_"+counterFind+"1.m4s", uploaderId[k] + "/" + "out"+qualityDash[0]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream(uploaderId[k] + "/" + "out"+qualityDash[0]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId.slice(k)+"/"+qualityDash[0]+"/"+ "out"+qualityDash[0]+"_dash"+counterRename+".m4s"));
    });
    //Delete
    fs.unlinkSync(uploaderId[k] + "/" +quality[0] + "/" +quality[0] + "_" + counterFind + ".mp4");


    /*------------------------------------- Quality 1000k -------------------------------*/

  fs.rename(uploaderId[k] + "/" + "3_"+counterFind+"1.m4s", uploaderId[k] + "/" + "out"+qualityDash[1]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream(uploaderId[k] + "/" + "out"+qualityDash[1]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId.slice(k)+"/"+qualityDash[1]+"/"+ "out"+qualityDash[1]+"_dash"+counterRename+".m4s"));
    });

    //Delete
    fs.unlinkSync(uploaderId[k] + "/" + quality[1] + "/" +quality[1] + "_" + counterFind + ".mp4");
  
    /*--------------------------------------- Quality 2000k --------------------------------*/

  fs.rename(uploaderId[k] + "/" + "4_"+counterFind+"1.m4s", uploaderId[k] + "/" + "out"+qualityDash[2]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream(uploaderId[k] + "/" + "out"+qualityDash[2]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId.slice(k)+"/"+qualityDash[2]+"/"+ "out"+qualityDash[2]+"_dash"+counterRename+".m4s"));
    });
    //Delete
    fs.unlinkSync(uploaderId[k] + "/" + quality[2] + "/" +quality[2] + "_" + counterFind + ".mp4");

    /*--------------------------------------Send mp4 ----------------------------------------*/

 fs.rename(uploaderId[k] + "/" + "2_0.mp4", uploaderId[k] + "/" + "out"+qualityDash[0]+"_dash"+".mp4", function(err) {
      fs.createReadStream(uploaderId[k] + "/" + "out"+qualityDash[0]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId.slice(k) + "/"+qualityDash[0]+"/"+ "out"+qualityDash[0]+"_dash"+".mp4"));
    });

    fs.rename(uploaderId[k] + "/" + "3_0.mp4", uploaderId[k] + "/" + "out"+qualityDash[1]+"_dash"+".mp4", function(err) {
      fs.createReadStream(uploaderId[k] + "/" + "out"+qualityDash[1]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId.slice(k) + "/"+qualityDash[1]+"/"+ "out"+qualityDash[1]+"_dash"+".mp4"));
    });

    fs.rename(uploaderId[k] + "/" + "4_0.mp4", uploaderId[k] + "/" + "out"+qualityDash[2]+"_dash"+".mp4", function(err) {
      fs.createReadStream(uploaderId[k] + "/" + "out"+qualityDash[2]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId.slice(k) + "/"+qualityDash[2]+"/"+ "out"+qualityDash[2]+"_dash"+".mp4"));
    });

    counterFind ++;
  }
}}

//loop for mp4tom4s
var loop1 = new Infiniteloop();
//use loop.add to add a function
//fisrt argument should be the fn, the rest is the fn's arguments
loop1.add(mp4box, []);
loop1.setInterval(2000);
loop1.run();


//loop for renameSendDelete
var loop2 = new Infiniteloop();
loop2.add(renameSendDelete, []);
loop2.setInterval(2000);
loop2.run();
