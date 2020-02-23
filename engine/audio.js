class Audio {

  constructor() {

    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    this.audiocontext = new AudioContext();
    this.node = this.audiocontext.createBufferSource();
    this.buffer = this.audiocontext.createBuffer(1, 4096, this.audiocontext.sampleRate)
    this.frameCnt = 0;
    this.N = 1024;
    this.samples = [];

    this.data = this.buffer.getChannelData(0);
    for (var i = 0; i < this.N; i++) {
      this.data[i] = 0;
    }

    this.node.buffer = this.buffer;
    this.node.loop = true;
  }


  addProcessor (f) {

    this.processor = this.audiocontext.createScriptProcessor(this.N, 2, 2);
    this.processor.f = f;
    this.processor.frq = Math.PI*2*80;
    this.processor.time = 0;
    this.processor.T = 1 / this.audiocontext.sampleRate;

    var t = 0;
    let that = this;

  	this.processor.onaudioprocess = function(e) {

      var outputs = [];
      outputs[0] = e.outputBuffer.getChannelData(0);
      outputs[1] = e.outputBuffer.getChannelData(1);


      for (let i=0; i<this.bufferSize; i++) {

        var data = this.f(this);

        outputs[0][i] = data[0];
        outputs[1][i] = data[1];

        this.time += this.T;
         // if (that.samples.length>0)
         //   output[i] = that.samples[0].data[that.frameCnt%that.samples[0].len];
      }

    }
  	this.processor.connect (this.audiocontext.destination);
  }

  addSample (file, id) {

    var request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.responseType = 'arraybuffer';

    var that = this;
    request.onload = function() {
      var audioData = request.response;
      that.audiocontext.decodeAudioData(audioData, function(buffer) {

        that.samples[id] = buffer;
      },
      function(e) {"Error with decoding audio data" + e.err});
    }
    request.send();
  }

  playSample (id) {
    var src = this.audiocontext.createBufferSource(); // creates a sound source
    src.buffer = this.samples[id];                    // tell the source which sound to play
    src.connect(this.audiocontext.destination);       // connect the source to the context's destination (the speakers)
    src.start();
  }
}

export {Audio};
