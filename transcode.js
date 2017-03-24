"use strict"

let util = require("util");
let exec = require("child_process").exec;
let fs = require("fs");
let request = require("request");
let Infiniteloop = require("infinite-loop");

let addr = process.argv[3];//"http://192.168.2.134:8080/video";
let destAddr = "http://192.168.2.122:9000";
let quality = ["500k", "1000k", "2000k"];
let qualityDash = ["500000", "1000000", "2000000"];
let counter = 1; //global variable
let counterFind = 0;
let contentId = process.argv[2];

for (let i = 0; i < quality.length; i++) {
  setTimeout(
    function() {
      var child;
      child = exec(
        `ffmpeg -use_wallclock_as_timestamps 1 -i ` +
          addr +
          ` -c copy -flags +global_header -map 0 -codec:v libx264 -profile:v main -b:v ` +
          quality[i] +
          ` -vf scale=640:480 -x264opts keyint=12:min-keyint=12:scenecut=-1 -bf 0 -r 24 -f segment -segment_time 6 -segment_format_options movflags=+faststart -reset_timestamps 1 ${quality[i]}/${quality[i]}_%d.mp4`,
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

function mp4box() {
    console.log("=============================>>>>>>>>>>>>>>"+ counter);
  if (
    fs.existsSync(quality[0] + "/" + quality[0] + "_" + counter + ".mp4") &&
    fs.existsSync(quality[1] + "/" + quality[1] + "_" + counter + ".mp4") &&
    fs.existsSync(quality[2] + "/" + quality[2] + "_" + counter + ".mp4")
  ) {
    var counterTmp = counter - 1;
    var child;
    child = exec(
      `MP4Box -dash 6000-profile live -bs-switching no -segment-name '$RepresentationID$_${counterTmp}' -out 'mpd.mpd' ${quality[0]}/${quality[0]}_${counterTmp}.mp4 ${quality[1]}/${quality[1]}_${counterTmp}.mp4 ${quality[2]}/${quality[2]}_${counterTmp}.mp4`,
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
    fs.existsSync("2_"+counterFind+"1.m4s") &&
    fs.existsSync("3_"+counterFind+"1.m4s") &&
    fs.existsSync("4_"+counterFind+"1.m4s")
  ) {
    var counterRename = counterFind + 1;

    /*----------------------------------- Quality 500k ---------------------------------*/

    // rename
    fs.rename("2_"+counterFind+"1.m4s", "out"+qualityDash[0]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream("out"+qualityDash[0]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId+"/"+qualityDash[0]+"/"+ "out"+qualityDash[0]+"_dash"+counterRename+".m4s"));
    });
    //Delete
    fs.unlinkSync(quality[0] + "/" +quality[0] + "_" + counterFind + ".mp4");


    /*------------------------------------- Quality 1000k -------------------------------*/

  fs.rename("3_"+counterFind+"1.m4s", "out"+qualityDash[1]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream("out"+qualityDash[1]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId+"/"+qualityDash[1]+"/"+ "out"+qualityDash[1]+"_dash"+counterRename+".m4s"));
    });

    //Delete
    fs.unlinkSync(quality[1] + "/" +quality[1] + "_" + counterFind + ".mp4");
  
    /*--------------------------------------- Quality 2000k --------------------------------*/

  fs.rename("4_"+counterFind+"1.m4s", "out"+qualityDash[2]+"_dash"+counterRename+".m4s", function(err) {
      if ( err ) console.log('ERROR: ' + err);
      // Send
      fs.createReadStream("out"+qualityDash[2]+"_dash"+counterRename+".m4s").pipe(request.put(destAddr +"/api/content/"+contentId+"/"+qualityDash[2]+"/"+ "out"+qualityDash[2]+"_dash"+counterRename+".m4s"));
    });
    //Delete
    fs.unlinkSync(quality[2] + "/" +quality[2] + "_" + counterFind + ".mp4");

    /*--------------------------------------Send mp4 ----------------------------------------*/

 fs.rename("2_0.mp4", "out"+qualityDash[0]+"_dash"+".mp4", function(err) {
      fs.createReadStream("out"+qualityDash[0]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId + "/"+qualityDash[0]+"/"+ "out"+qualityDash[0]+"_dash"+".mp4"));
    });

    fs.rename("3_0.mp4", "out"+qualityDash[1]+"_dash"+".mp4", function(err) {
      fs.createReadStream("out"+qualityDash[1]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId + "/"+qualityDash[1]+"/"+ "out"+qualityDash[1]+"_dash"+".mp4"));
    });

    fs.rename("4_0.mp4", "out"+qualityDash[2]+"_dash"+".mp4", function(err) {
      fs.createReadStream("out"+qualityDash[2]+"_dash"+".mp4").pipe(request.put(destAddr +"/api/mp4/" + contentId + "/"+qualityDash[2]+"/"+ "out"+qualityDash[2]+"_dash"+".mp4"));
    });


    
    counterFind ++;
  }
}

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

//-use_wallclock_as_timestamps 1 pour forcer la lecture a la bonne vitesse
