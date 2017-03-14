"use strict"

var child_process = require('child_process');

let contentId = ["123"]; //Id uploader
let users = ["http://192.168.2.145:9000"]; //@ uploader

for(let i = 0; i < contentId.length; i++){
//execFile: executes transcoder.js with the specified arguments. Changes in transcode.js : 
//contendId => process.argv[2] 
//destAddr => process.argv[3]
child_process.execFile('node', ['transcoder.js', contentId[i], users[i]], function(error, stdout, stderr){
	console.log(stdout);
});
}

// exec: spawns a shell.
/*child_process.exec('ls -l', function(error, stdout, stderr){
	console.log(stdout);
});*/
