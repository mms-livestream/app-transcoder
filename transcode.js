"use strict"

let util = require('util')
let exec = require('child_process').exec;
let fs = require('fs');
let request = require('request');


let addr = "http://192.168.1.137:8080/video";
let quality = ["500k","1000k","2000k"];

for (let i = 0; i < quality.length; i++) {
    setTimeout(function() {
                    var child;
            // executes `pwd`
            child = exec(`ffmpeg -use_wallclock_as_timestamps 1 -i ` + addr + ` -c copy -flags +global_header -map 0 -codec:v libx264 -profile:v main -b:v ` + quality[i] + ` -vf scale=1920:1080 -x264opts keyint=12:min-keyint=12:scenecut=-1 -bf 0 -r 24 -f segment -segment_time 6 -segment_format_options movflags=+faststart -reset_timestamps 1 ${quality[i]}/test%d.mp4`, function (error, stdout, stderr) {
                util.print('stdout: ' + stdout);
                util.print('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }, 0);
}

//-use_wallclock_as_timestamps 1 pour forcer la lecture a la bonne vitesse
//video.pipe(tmp);

//`ffmpeg -i $video -c copy -flags +global_header -f segment -segment_time 1 -segment_format_options movflags=+faststart -reset_timestamps 1 test%d.mpg`
//ffmpeg -i sample_upload.mpg -c copy -f segment -segment_time 1 testfile_piece_%02d.mpg
//ffmpeg -i" + video +"-c copy -flags +global_header -f segment -segment_time 1 -segment_format_options movflags=+faststart -reset_timestamps 1 testfile_piece_%02d.mpg

//var video = fs.createReadStream('sample_upload.mpg');
//var tmp = fs.createWriteStream('tmp');
//request(`http://192.168.1.121:8080/video`).pipe(fs.createWriteStream('tmp')); 
