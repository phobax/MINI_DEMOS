import {Visual} from "/visual.js";
import {Audio} from "/engine/audio.js";



var DATA_MODEL = {
	NSTEPS : 16,
	CNT : 0,
	SPEED : 0.2,
	time : 0,
	CURRENT_TRACK : 0
}


function input(v) {
	inputModule.input(v);
}

function decToHex(v) {
	if (v==10) return "A";
	if (v==11) return "B";
	if (v==12) return "C";
	if (v==13) return "D";
	if (v==14) return "E";
	if (v==15) return "F";
	return v;
}

function arr2short(arr) {
	return (arr[0]) + (arr[1]<<4) + (arr[2]<<8) + (arr[3]<<12)
}




class InputModule extends Visual {

	constructor (templateContainer, parentId, templateId, id) {

		super (templateContainer, templateId);
		this.dat = [4,3,2,1];
		this.cnt = 0;

		this.div.id = id;

		for (var k of this.div.querySelectorAll(".numkey")) {
			k.o = this;
		}

		var parent = document.getElementById(parentId);
		parent.appendChild(this.div)

	}

	input (v) {

		this.dat[this.cnt] = v;
		this.cnt = (this.cnt+1)%4;

		// show
		var str = "";

		for (var i=0; i<this.dat.length; i++) {
			if (i==this.cnt) {
				str += "<b>";
			}

			str += decToHex(this.dat[i])+" ";

			if (i==this.cnt) {
				str += "</b>";
			}
		}
		this.div.querySelector("#display").innerHTML = str;
	}

	val_set() {
		tracks[DATA_MODEL.CURRENT_TRACK].data = arr2short(this.dat);
	}

	val_or() {
		tracks[DATA_MODEL.CURRENT_TRACK].data |= arr2short(this.dat);
	}

	val_and() {
		tracks[DATA_MODEL.CURRENT_TRACK].data &= arr2short(this.dat);
	}

	val_xor() {
		tracks[DATA_MODEL.CURRENT_TRACK].data ^= arr2short(this.dat);
	}
}


var lastTime;
var inputModule;
var audio;
var tracks = [];

var socket = io.connect('/');
socket.on('reload', function(data){
	location.reload();
});

function sendWS (cmd) {
	console.log("send "+cmd);
	socket.send({cmd:cmd, payload:0});
}




class TrackVisual extends Visual {


	constructor (templateContainer, parentId, templateId, id, len) {

		super (templateContainer, templateId);

		this.len = len;
		this.data = 0;
		this.parent = document.getElementById(parentId);
		this.createSteps();
	}

	clickStep(event) {
		var id = event.target.id.split("step")[1];
		DATA_MODEL.DATA ^= (1<<id);
	}

	createStep (i) {

		var clon = this.div.cloneNode(true);
		clon.querySelector("#step").id = "step"+i;

		return clon;
	}

	createSteps() {
		for (var i=0; i<this.len; i++) {
			this.parent.appendChild(this.createStep(i));
		}
	}

	draw() {

		for (var i=0; i<this.len; i++) {
			var div = this.parent.querySelector("#step"+i);
			var dat = (this.data>>i)&0x01;

			if (dat) {
				div.classList.add("on");
			}
			else {
				div.classList.remove("on");
			}
			if (i == DATA_MODEL.CNT) {
				if (dat) {
					div.classList.remove("on");
				}
				else {
					div.classList.add("on");
				}
			}
		}
	}
}



function draw(dt) {

	DATA_MODEL.time += dt;
	if (DATA_MODEL.time > DATA_MODEL.SPEED) {
		DATA_MODEL.time -= DATA_MODEL.SPEED;
		DATA_MODEL.CNT = (DATA_MODEL.CNT+1) % DATA_MODEL.NSTEPS;

		for (var i=0; i<tracks.length; i++) {
			var dat	= (tracks[i].data>>DATA_MODEL.CNT)&0x01;
			if (dat) {
				audio.playSample(i);
			}
		}
	}


	for (var track of tracks) {
		track.draw();
	}

	lastTime = (new Date()).getTime();
}


function animate() {
	var dt = ((new Date()).getTime()-lastTime)/1000;

	draw(dt);
	requestAnimationFrame(animate);
}


function start() {
	audio.audiocontext.resume();
}

window.onload = ()=>{
	inputModule = new InputModule ("templates", "numkeys_container", "template_numkeys", "numkeys01");

	audio = new Audio();

	audio.addSample("https://192.168.9.140:8000/wav/DT_Kick.wav", "0");
	audio.addSample("https://192.168.9.140:8000/wav/DT_Snare.wav", "1");

	tracks[0] = new TrackVisual ("templates", "track_container0", "template_step", "track0", 16);
	tracks[1] = new TrackVisual ("templates", "track_container1", "template_step", "track1", 16);


	lastTime = (new Date()).getTime();
	animate();
}
