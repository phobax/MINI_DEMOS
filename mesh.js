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


      init (generateFunction=null, N=0) {

        if (generateFunction) {
          for (var i=0; i<N; i++) {
            var verticesAttributes = generateFunction(i);
            for (var vertexAttributes of verticesAttributes) {
              this.vertices.push(new Vertex(vertexAttributes));
              this.N += 1;
            }
          }
        }


        

        var _data = {};
        var _sizes = {};
        // default attributes
        for (var v of this.vertices) {
          
          if ("x" in v.pos) {
            this.posData.push(v.pos.x, v.pos.y, v.pos.z);
          }
          else {
            this.posData.push(v.pos[0], v.pos[1], v.pos[3]);
          }
          if ("x" in v.pos) {
            this.texcoordData.push(v.texcoord.x, v.texcoord.y);
          }
          else {
            this.texcoordData.push(v.texcoord[0], v.texcoord[1]);
          }
          if ("r" in v.color) {
            this.colorData.push(v.color.r, v.color.g, v.color.b);
          }
          else {
            this.colorData.push(v[0]);
            this.colorData.push(v[1]);
            this.colorData.push(v[2]);
          }

          for (var key of Object.keys(v)) {
            if (key == "pos") continue;
            if (key == "color") continue;
            if (key == "texcoord") continue;
            if (!(key in _data)) _data[key] = [];
            if (!(key in _sizes)) _sizes[key] = 0;
            for (var _v of v[key]) {
              _data[key].push(_v);
            }
            _sizes[key] = v[key].length;
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

          this.vertexTexLocation = 1; // set with GLSL layout qualifier
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexTexBuffer);
          this.gl.vertexAttribPointer (this.vertexTexLocation, 2, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray (this.vertexTexLocation);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.vertexColorLocation = 2; // set with GLSL layout qualifier
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
          this.gl.vertexAttribPointer (this.vertexColorLocation, 3, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray (this.vertexColorLocation);
          this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

          this.datLocation = 14;
          for (var key of Object.keys(_data)) {

            var arrayData = new Float32Array(_data[key]);
            var buf = this.gl.createBuffer();
            this.gl.bindBuffer (this.gl.ARRAY_BUFFER, buf);
            this.gl.bufferData (this.gl.ARRAY_BUFFER, arrayData, this.gl.STATIC_DRAW);  
            this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

            this.gl.bindBuffer (this.gl.ARRAY_BUFFER, buf);
            this.gl.vertexAttribPointer (this.datLocation, _sizes[key], this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray (this.datLocation);
            this.gl.bindBuffer (this.gl.ARRAY_BUFFER, null);

            this.datLocation += _sizes[key]*2;
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