"use strict"

//var child_process = require('child_process');
let contentId = ["123"]; //Id uploader
let users = ["http://192.168.2.118:8080/video"]; //@ uploader
const spawn = require('child_process').spawn;

let uploaderId = ['1', '2'], 
    quality = ['500k', '1000k', '2000k'];

for(let i = 0; i < uploaderId.length; i++){
if (!fs.existsSync(uploaderId[i])){ fs.mkdirSync(uploaderId[i]); }
if (!fs.existsSync(uploaderId[i] + "/" + quality[0])){ fs.mkdirSync(uploaderId[0] +"/"+ quality[0]); }
if (!fs.existsSync(uploaderId[i] + "/" + quality[1])){ fs.mkdirSync(uploaderId[0] +"/"+ quality[1]); }
if (!fs.existsSync(uploaderId[i] + "/" + quality[2])){ fs.mkdirSync(uploaderId[0] +"/"+ quality[2]); }
}

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
