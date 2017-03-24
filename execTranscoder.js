let contentId = ['123','456']; //Id uploader
let users = ['http://192.168.2.118:8080/video', 'http://192.168.2.119:8080/video']; //@ uploader
let fs = require('fs');
const spawn = require('child_process').spawn;
let uploaderId = ['1', '2'], 
    quality = ['500k', '1000k', '2000k'];

for(let i = 0; i < uploaderId.length; i++){
if (!fs.existsSync(uploaderId[i])){ fs.mkdirSync(uploaderId[i]); }
if (!fs.existsSync(uploaderId[i] + "/" + quality[0])){ fs.mkdirSync(uploaderId[i] +"/"+ quality[0]); }
if (!fs.existsSync(uploaderId[i] + "/" + quality[1])){ fs.mkdirSync(uploaderId[i] +"/"+ quality[1]); }
if (!fs.existsSync(uploaderId[i] + "/" + quality[2])){ fs.mkdirSync(uploaderId[i] +"/"+ quality[2]); }
}

let ls;
//for(let k = 0; k < contentId.length; k++){
	ls = spawn('node', ['transcode.js', contentId, users]);
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
//}


// exec: spawns a shell.
/*child_process.exec('ls -l', function(error, stdout, stderr){
	console.log(stdout);
});*/
