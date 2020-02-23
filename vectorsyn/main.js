import {Visual} from "/visual.js";
import {Audio} from "/engine/audio.js";
import {Screen, Texture} from "/webglVisual.js";
// import {TestShader} from "/shaders.js";

var STATE = {
	time : 0
}




class ScopeVisual extends Visual {

	constructor (templateContainer, parentId, templateId, id, len) {

		super (templateContainer, templateId, parentId);

		this.cnt = 0;
		this.len = len;
		this.data = new Array(len).fill([0,0]);

		this.canvas = this.div.querySelector("canvas");
		this.w = this.canvas.width;
		this.h = this.canvas.height;
		this.context = this.canvas.getContext("2d");

		this.context.strokeStyle = "rgb(255,255,255)";
		this.context.fillStyle = "rgb(0,0,0)";
		this.context.fillRect(0, 0, this.w, this.h);

		this.matrix = [];
		for (var i=0; i<this.w/2; i++) {
			this.matrix[i] = [];
			for (var j=0; j<this.h/2; j++) {
				this.matrix[i][j] = 0;
			}
		}
	}

	addData (x,y) {
		this.data[this.cnt] = [x,y];
		this.cnt = (this.cnt+1) % this.len;
	}

	draw () {
		this.context.fillStyle = "rgba(0,0,0,0.1)";
		this.context.fillRect(0, 0, this.w, this.h);

		this.context.beginPath();
		for (var dat of this.data) {
			this.context.lineTo(dat[0]*this.w*0.9+0.1, dat[1]*this.h*0.9+0.1);
		}

		this.context.lineWidth = 10;
		this.context.strokeStyle = "rgba(200,0,255,0.1)";
		this.context.stroke();
		this.context.lineWidth = 1;
		this.context.strokeStyle = "rgba(255,190,255,0.4)";
		this.context.stroke();
	}

	draw1() {

		// screen.data[0] = Math.random();
		for (var i=0; i<this.w/2; i++) {
			for (var j=0; j<this.h/2; j++) {
				this.matrix[i][j] = 0;
			}
		}

		for (var dat of this.data) {
			var x = Math.floor(dat[0]*this.w/8);
			var y = Math.floor(dat[1]*this.h/8);

			this.matrix[x][y] += 20;
		}

		this.context.fillStyle = "rgba(0,0,0,0.1)";
		this.context.fillRect(0, 0, this.w, this.h);


		for (var i=0; i<this.w; i+=2) {
			for (var j=0; j<this.h; j+=2) {
				var b = this.matrix[i/2][j/2];
				this.context.fillStyle = "rgb("+b+",0,0)";
				this.context.fillRect(i,j,2,2);
			}
		}
	}
}

var TWO_PI = Math.PI*2;

function sin(t, phi=0) {
	return Math.sin(t+phi)*0.5+0.5;
}

function saw (t, phi=0) {
	return ((t+phi)%TWO_PI) / TWO_PI;
}

function draw(dt) {
	STATE.time += dt;
	lastTime = (new Date()).getTime();

	// screen.draw();
	scope.draw();
}

function animate() {
	var dt = ((new Date()).getTime()-lastTime)/1000;

	// texture.use();
	draw(dt);
	requestAnimationFrame(animate);
}


function start() {
	audio.audiocontext.resume();
}


var scope, audio, lastTime, ramp=0, screen, texture;

window.onload = ()=>{

	// screen = new Screen(0,400,400,400);
	// screen.addShader(TestShader);
	// screen.addUniform("data", [0,0,0,0]);
	//
	// texture = new Texture(screen.gl);
	// texture.useInProgram(screen.shader.shaderProgram, "data")
	//screen.shader.addUniform("data", [0,0,0,0]);


	document.getElementById("btn_start").addEventListener("click", start);
	scope = new ScopeVisual ("templates", "scope_container", "template_scope", "scope01", 1024);

	audio = new Audio();
	audio.addProcessor((ctx)=>{
		var R   = sin(ctx.time*ctx.frq)*sin(ctx.time);
		var DS0 = 100//sin(ctx.time*1)*10+1;
		var DS1 = 100//sin(ctx.time*1)*10+1;


		R = Math.round(R*DS0)/DS0;


		// var L = Math.sin(ctx.time*ctx.frq+ctx.time*Math.sin(ctx.time)*100+100)*0.5+0.5
		var L = sin(ctx.time*ctx.frq+Math.PI/2);
		L = Math.round(L*DS1)/DS1;


		scope.addData(L,R);

		return [L,R];
	})

	lastTime = (new Date()).getTime();
	animate();
}
