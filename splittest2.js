
"use strict"

var util = require('util')
var exec = require('child_process').exec;
var fs = require('fs');
let request = require('request');

//var video = fs.createReadStream('sample_upload.mpg');
//var tmp = fs.createWriteStream('tmp');
request(`http://192.168.1.121:8080/video`).pipe(fs.createWriteStream('tmp')); 

setTimeout(function() {
                var child;
        // executes `pwd`     
        child = exec(`ffmpeg -i tmp -c copy -flags +global_header -f segment -segment_time 1 -segment_format_options movflags=+faststart -reset_timestamps 1 test%d.mpg`, function (error, stdout, stderr) {
            util.print('stdout: ' + stdout);
            util.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
}, 10000);


//video.pipe(tmp);


//`ffmpeg -i $video -c copy -flags +global_header -f segment -segment_time 1 -segment_format_options movflags=+faststart -reset_timestamps 1 test%d.mpg`
//ffmpeg -i sample_upload.mpg -c copy -f segment -segment_time 1 testfile_piece_%02d.mpg

//ffmpeg -i" + video +"-c copy -flags +global_header -f segment -segment_time 1 -segment_format_options movflags=+faststart -reset_timestamps 1 testfile_piece_%02d.mpg
