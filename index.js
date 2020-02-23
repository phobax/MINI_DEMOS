var express = require('express'),
	fs = require("fs"),
	path = require("path"),
	app = express(),
	server = require('https').createServer({key:fs.readFileSync(path.join(__dirname, "key.pem")), cert:fs.readFileSync(path.join(__dirname, "cert.pem")), passphrase : "test"}, app),
	io = require('socket.io').listen(server),
	zlib = require('zlib'),
  path = require('path');


var t0 = Date.now();
var time = 0;


function serverStart() {
	server.listen(8000);
	console.log('Server listening on port 8000');
	console.log('Point your browser to http://localhost:8000');

  app.use(express.static(path.join(__dirname, '/')));
	app.get('/hexseq', (req, res) => res.sendFile(__dirname + '/hexseq/main.html'));
	app.get('/vectorsyn', (req, res) => res.sendFile(__dirname + '/vectorsyn/main.html'));
	app.get('/reload', (req, res) => {
		io.sockets.emit("reload", {});
		res.send("ok")
	});


	io.on('connection', (client) => {
		client.on ("message", (event) => {
			console.log(event);
			io.sockets.emit("ping", {x:2});
		});
	});
}
serverStart();
