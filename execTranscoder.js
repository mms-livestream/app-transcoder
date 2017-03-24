"use strict"

//var child_process = require('child_process');
let contentId = ["123"]; //Id uploader
let users = ["http://192.168.2.145:9000"]; //@ uploader
const spawn = require('child_process').spawn;

for(let k = 0; k < contentId.length; k++){
	const ls = spawn('node', ['transcode.js', contentId[k], users[k]]);

	ls.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	});

	ls.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	});

	ls.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	});
}


// exec: spawns a shell.
/*child_process.exec('ls -l', function(error, stdout, stderr){
	console.log(stdout);
});*/
