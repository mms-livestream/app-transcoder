"use strict";

let util = require("util");
let exec = require("child_process").exec;
let fs = require("fs");
let request = require("request");
let Infiniteloop = require("infinite-loop");

let addr = "http://192.168.2.118:8080/video";
let quality = ["500k", "1000k", "2000k"];
var counter = 1; //global variable

for (let i = 0; i < quality.length; i++) {
  setTimeout(
    function() {
      var child;
      child = exec(
        `ffmpeg -use_wallclock_as_timestamps 1 -i ` +
          addr +
          ` -c copy -flags +global_header -map 0 -codec:v libx264 -profile:v main -b:v ` +
          quality[i] +
          ` -vf scale=1920:1080 -x264opts keyint=12:min-keyint=12:scenecut=-1 -bf 0 -r 24 -f segment -segment_time 6 -segment_format_options movflags=+faststart -reset_timestamps 1 ${quality[i]}/${quality[i]}_%d.mp4`,
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

function mp4box(counter) {
  if (
    fs.existsSync(quality[0] + "/" + quality[0] + "_" + counter + ".mp4") &&
    fs.existsSync(quality[1] + "/" + quality[1] + "_" + counter + ".mp4") &&
    fs.existsSync(quality[2] + "/" + quality[2] + "_" + counter + ".mp4")
  ) {
    var counterTmp = counter - 1;
    var child;
    child = exec(
      `MP4Box -dash 6000-profile live -bs-switching no -segment-name '$RepresentationID$_${counterTmp}' -out 'mpd.mpd' ${quality[0]}/${quality[0]}_${counterTmp}.mp4 ${quality[1]}/${quality[1]}_${counterTmp}.mp4 ${quality[1]}/${quality[1]}_${counterTmp}.mp4`,
      function(error, stdout, stderr) {
        util.print("stdout: " + stdout);
        util.print("stderr: " + stderr);
        if (error !== null) {
          console.log("exec error: " + error);
        }
      }
    );
  }
  counter++;
}

var loop = new Infiniteloop();
//use loop.add to add a function
//fisrt argument should be the fn, the rest is the fn's arguments
loop.add(mp4box, counter).run();

//-use_wallclock_as_timestamps 1 pour forcer la lecture a la bonne vitesse
//video.pipe(tmp);
