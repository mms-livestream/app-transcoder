"use strict";

let contentId = ['1']; 
let users = ['http://192.168.0.25:8080/video']; //@ content
let fs = require('fs');
const spawn = require('child_process').spawn;
let quality = ['500k', '1000k', '2000k'];

for(let i = 0; i < contentId.length; i++){
if (!fs.existsSync(contentId[i])){ fs.mkdirSync(contentId[i]); }
if (!fs.existsSync(contentId[i] + "/" + quality[0])){ fs.mkdirSync(contentId[i] +"/"+ quality[0]); }
if (!fs.existsSync(contentId[i] + "/" + quality[1])){ fs.mkdirSync(contentId[i] +"/"+ quality[1]); }
if (!fs.existsSync(contentId[i] + "/" + quality[2])){ fs.mkdirSync(contentId[i] +"/"+ quality[2]); }
}

let ls;
for(let k = 0; k < contentId.length; k++){
	ls = spawn('node', ['transcodeMulti.js', contentId[k], users[k]]);
console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"+ " " + users.slice(1));
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

