class Vertex {
  constructor (attributes) {
    for (var key of Object.keys(attributes)) {
      this[key] = attributes[key];
    }
  }
}

class Mesh {
      
      constructor (gl) {
        this.vertices = [];
        this.gl = gl;
        this.len = 0;

        this.posData = [];
        this.texcoordData = [];
        this.colorData = [];
        this.N = 0;
      }



      addVertex(v) {
        this.vertices.push(v);
      }

      populate (f, N) {
        
      }
      init () {

        for (var i=0; i<this.N; i++) {
          this.vertices.push(new Vertex())
        }

        var _data = {};
        // default attributes
        for (var v of this.vertices) {
          this.posData.push(v.pos.x, v.pos.y);
          this.texcoordData.push(v.texcoord.x, v.texcoord.y);
          this.colorData.push(v.color.r, v.color.g, v.color.b);

          for (var key of Object.keys(v)) {
            if (key == "pos") continue;
            if (key == "color") continue;
            if (key == "texcoord") continue;
            if (!(key in _data)) _data[key] = [];
            for (var v of v[key]) {
              _data[key].push(v);
            }
          }
        }


          this.len = this.vertices.length;

          this.posData =      new Float32Array(this.posData);
          this.texcoordData = new Float32Array(this.texcoordData);
          this.colorData =    new Float32Array(this.colorData);

          this.vertexPosBuffer = this.gl.createBuffer();
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexPosBuffer);
          this.gl.bufferData (this.gl.ARRAY_BUFFER, this.posData, this.gl.STATIC_DRAW);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.vertexTexBuffer = this.gl.createBuffer();
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexTexBuffer);
          this.gl.bufferData (this.gl.ARRAY_BUFFER, this.texcoordData, this.gl.STATIC_DRAW);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.vertexColorBuffer = this.gl.createBuffer();
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
          this.gl.bufferData (this.gl.ARRAY_BUFFER, this.colorData, this.gl.STATIC_DRAW);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.vertexArray = this.gl.createVertexArray();
          this.gl.bindVertexArray (this.vertexArray);

         
          this.vertexPosLocation = 0; // set with GLSL layout qualifier
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexPosBuffer);
          this.gl.vertexAttribPointer (this.vertexPosLocation, 2, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray (this.vertexPosLocation);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.vertexTexLocation = 4; // set with GLSL layout qualifier
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexTexBuffer);
          this.gl.vertexAttribPointer (this.vertexTexLocation, 2, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray (this.vertexTexLocation);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.vertexColorLocation = 8; // set with GLSL layout qualifier
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
          this.gl.vertexAttribPointer (this.vertexColorLocation, 3, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray (this.vertexColorLocation);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.buf = this.gl.createBuffer();
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.buf);
          var datLocation = 14; // set with GLSL layout qualifier

          for (var key of Object.keys(_data)) {
            var arrayData = new Float32Array(_data[key]);
            this.gl.vertexAttribPointer (datLocation, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.bufferData (this.gl.ARRAY_BUFFER, arrayData, this.gl.STATIC_DRAW);  
          }
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          

          
          

          this.gl.bindVertexArray(null);
        }

        draw() {
          this.gl.bindVertexArray(this.vertexArray);
          this.gl.drawArraysInstanced (this.gl.LINES, 0, this.len, 1);
        }
      }


      class LineMesh extends Mesh {
          
        constructor(gl) {
          super(gl);
        }

        draw() {
          this.gl.bindVertexArray(this.vertexArray);
          this.gl.drawArraysInstanced (this.gl.LINES, 0, this.len, 1);
        }
      }

      class TriangleMesh extends Mesh {
          
        constructor(gl) {
          super(gl);
        }

        draw() {
          this.gl.bindVertexArray(this.vertexArray);
          this.gl.drawArraysInstanced (this.gl.TRIANGLES, 0, this.len, 1);
        }
      }

      class QuadMesh extends Mesh {
          
        constructor(gl) {
          super(gl);
        }

        draw() {
          this.gl.bindVertexArray(this.vertexArray);
          this.gl.drawArraysInstanced (this.gl.QUADS, 0, this.len, 1);
        }
      }



      export {Vertex, Mesh, LineMesh, TriangleMesh, QuadMesh};