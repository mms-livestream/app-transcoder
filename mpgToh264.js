"use strict"

var util = require('util')
var exec = require('child_process').exec;

var child;
// executes `pwd`
child = exec("ffmpeg -y -i sample_upload.mpg -c:v libx264 -profile:v main -b:v 5000k -vf scale=1920:1080 -x264opts keyint=12:min-keyint=12:scenecut=-1 -bf 0 -r 24 out.h264", function (error, stdout, stderr) {
  util.print('stdout: ' + stdout);
  util.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});














/*
var readmyFile = fs.readFile('sample_upload.mp4')
// make sure you set the correct path to your video file
var proc = ffmpeg(readmyFile)
  // set video bitrate
  .videoBitrate(1024)
  // set target codec
  .videoCodec('libx264')
  // set aspect ratio
  .aspect('16:9')
  // set size in percent
  .size('50%')
  // set fps
  .fps(24)
  // set output format to force
  .format('mp4')
  // setup event handlers
  
  .on('end', function() {
    console.log('file has been converted succesfully');
  })
  .on('error', function(err) {
    console.log('an error happened: ' + err.message);
  })
  // save to file
  .saveToFile('testvideo.mp4')

*/







/* Others

new Transcoder(request(`${protocol}://${targetAddr}:${targetPort}/video`).pipe(res))
    .maxSize(320, 240)
    .videoCodec('h264')
    .videoBitrate(800 * 1000)
    .fps(25)
    .audioCodec('libfaac')
    .sampleRate(44100)
    .channels(2)
    .audioBitrate(128 * 1000)
    .format('mp4')
    .stream().pipe(fs.createWriteStream('test'));*/





/*
app.get('/sample', (req, res) => {
  fs.createReadStream('sample_upload.mpg').pipe(res);
});

new Transcoder(request(`${protocol}://${targetAddr}:${targetPort}/video`).pipe(res))
    .maxSize(320, 240)
    .videoCodec('h264')
    .videoBitrate(800 * 1000)
    .fps(25)
    .audioCodec('libfaac')
    .sampleRate(44100)
    .channels(2)
    .audioBitrate(128 * 1000)
    .format('mp4')
    .stream().pipe(fs.createWriteStream('test'));*/


















/*



var server = http.createServer(function(req, res) {
  /*
    res.writeHead(200,{'Content-type':'video/mp4'});
    var stream = fs.createReadStream('sample_upload.mp4');
    stream.pipe(res);*/

  
/*
    res.writeHead(200, { 'Content-type': 'video/mp4' });
    var stream = ffmpeg('sample_upload.mpg')
        .videoCodec('libx264')
         .format('mp4')
        .videoBitrate(1000)
        .size('640x480');

    stream.pipe(res);
    */
    /*

  var proc = ffmpeg(fs.createReadStream("sample_upload.mpg"))
    .videoCodec("libx264")
    .format("mp4")
    .size("320x?")
    .addOptions(["-movflags frag_keyframe+faststart"])
    // setup event handlers
    .on("end", function() {
      console.log("file has been converted succesfully");
    })
    .on("error", function(err) {
      console.log("an error happened: " + err.message);
    })
    // save to stream
    .pipe(res, { end: true });  */


/*

    var input_file = fs.createReadStream('sample_upload.mpg');
    input_file.on('error', function(err) {
        console.log(err);
    });

    var output_path = 'tmp/output.mp4';
    var output_stream = fs.createWriteStream('tmp/output.mp4');

    var ffmpeg = child_process.spawn('ffmpeg', ['-i', 'pipe:0', '-f', 'mp4', '-movflags', 'frag_keyframe', 'pipe:1']);
    input_file.pipe(ffmpeg.stdin);
    ffmpeg.stdout.pipe(output_stream);

    ffmpeg.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    ffmpeg.stderr.on('end', function () {
        console.log('file has been converted succesfully');
    });

    ffmpeg.stderr.on('exit', function () {
        console.log('child process exited');
    });

    ffmpeg.stderr.on('close', function() {
        console.log('...closing time! bye');
    });
*/

/*

});
server.listen(8000);


*/