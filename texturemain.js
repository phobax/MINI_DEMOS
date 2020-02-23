'use strict';

import {v_shader_tex, f_shader_tex} from "/shaders.js";
import {Vertex, Mesh, LineMesh, TriangleMesh, QuadMesh} from "/mesh.js";

      // -- Mouse Behaviour
      var scale = 1.0;
      var mouseDown = false;
      var lastMouseY = 0;

      var uniformMvpLocation;
      var uniformTexture0Location;
      var uniformTexture1Location;
      var uniformLodBiasLocation;
      var uniformTimeLocation;

      var textures = [];
      var test;
      var time = 0;

      var Corners = {
        TOP_LEFT: 0,
        TOP_RIGHT: 1,
        BOTTOM_RIGHT: 2,
        BOTTOM_LEFT: 3,
        MAX: 4
      };


      function render() {
        test.render();
        requestAnimationFrame(render);
      }

      window.onload  = ()=>{

        test = new TextureTest();
        test.init()
        .then(ret=>{
          requestAnimationFrame(render);
        })
        .catch(err=>{
          console.log(err);
        })

      }

      class Texture {

	     constructor (gl, imgData) {

        this.gl = gl;
        this.tex = gl.createTexture();

        gl.bindTexture   (gl.TEXTURE_2D, this.tex);
        gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D    (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);

        gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameterf (gl.TEXTURE_2D, gl.TEXTURE_MIN_LOD, 0.0);
        gl.texParameterf (gl.TEXTURE_2D, gl.TEXTURE_MAX_LOD, 10.0);

        gl.generateMipmap(gl.TEXTURE_2D);
      }

      bind() {
        this.gl.bindTexture (this.gl.TEXTURE_2D, this.tex);
      }

	   bindAndActivate (ch) {
          if (ch==0)
              this.gl.activeTexture (this.gl.TEXTURE0);
          if (ch==1)
              this.gl.activeTexture (this.gl.TEXTURE1);
          if (ch==2)
              this.gl.activeTexture (this.gl.TEXTURE2);
          if (ch==3)
              this.gl.activeTexture (this.gl.TEXTURE3);

          this.gl.bindTexture (this.gl.TEXTURE_2D, this.tex);
        }
      }


      

      class TextureTest {

        constructor() {


          var canvas = document.createElement('canvas');
          canvas.width = Math.min(window.innerWidth, window.innerHeight);
          canvas.height = canvas.width;
          document.body.appendChild(canvas);

          this.gl = canvas.getContext( 'webgl2', { antialias: false } );
          var isWebGL2 = !!this.gl;
          if(!isWebGL2) {
            document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';
            return;
          }


          this.mesh0 = new LineMesh (this.gl);
          

          // for (var i=0; i<10000; i++) {
          //   var x = Math.random()*2-1;
          //   var y = Math.random()*2-1;
          //   var d = Math.random()*0.004+0.001;
          //   this.mesh0.addVertex (new Vertex({pos:{x:x, y:y, z:0}, texcoord:{x:x,y:y}, color:{r:1.0, g:1.0, b:1.0}}));
          //   this.mesh0.addVertex (new Vertex({pos:{x:x, y:y+d, z:0}, texcoord:{x:x,y:y+d}, color:{r:1.0, g:1.0, b:1.0}}));
          //   this.mesh0.addVertex (new Vertex({pos:{x:x+d, y:y+d, z:0}, texcoord:{x:x+d,y:y+d}, color:{r:1.0, g:1.0, b:1.0}}));
          // }
          this.mesh0.populate ((i)=>{

          },100);


          this.mesh1 = new TriangleMesh(this.gl);
          this.mesh1.addVertex (new Vertex({pos:{x:-0.5, y:-0.5, z:0}, texcoord:{x:0,y:0}, color:{r:1.0, g:1.0, b:1.0}}));
          this.mesh1.addVertex (new Vertex({pos:{x:-0.5, y:0, z:0}, texcoord:{x:1,y:0}, color:{r:1.0, g:Math.random(), b:1.0}}));
          this.mesh1.addVertex (new Vertex({pos:{x:1, y:1, z:0}, texcoord:{x:1,y:1}, color:{r:1.0, g:1.0, b:1.0}}));
          // this.mesh1.addVertex (new Vertex({pos:{x:0, y:1, z:0}, texcoord:{x:0,y:1}, color:{r:1.0, g:1.0, b:1.0}}));
          this.mesh1.init()

          this.viewport = new Array(Corners.MAX);

          // -- Divide viewport
          this.windowSize = {
            x: canvas.width,
            y: canvas.height
          };

          this.viewport[Corners.BOTTOM_LEFT] = {
            x: 0,
            y: 0,
            z: this.windowSize.x / 2,
            w: this.windowSize.y / 2
          };

          this.viewport[Corners.BOTTOM_RIGHT] = {
            x: this.windowSize.x / 2,
            y: 0,
            z: this.windowSize.x / 2,
            w: this.windowSize.y / 2
          };

          this.viewport[Corners.TOP_RIGHT] = {
            x: this.windowSize.x / 2,
            y: this.windowSize.y / 2,
            z: this.windowSize.x / 2,
            w: this.windowSize.y / 2
          };

          this.viewport[Corners.TOP_LEFT] = {
            x: 0,
            y: this.windowSize.y / 2,
            z: this.windowSize.x / 2,
            w: this.windowSize.y / 2
          };

          this.program = createProgram (this.gl, v_shader_tex, f_shader_tex);
          uniformMvpLocation      = this.gl.getUniformLocation (this.program, "mvp");
          uniformTexture0Location = this.gl.getUniformLocation (this.program, "texture0");
          uniformTexture1Location = this.gl.getUniformLocation (this.program, "texture1");
          uniformLodBiasLocation  = this.gl.getUniformLocation (this.program, "lodBias");
          uniformTimeLocation     = this.gl.getUniformLocation (this.program, "uTime");
        }

        init() {

          return new Promise((res, rej) =>{

            loadImages ('/Di-3d.png', "/mittelgebirge.png")
            .then(images=>{
              this.gl.pixelStorei (this.gl.UNPACK_ALIGNMENT, 1);

              textures.push (new Texture (this.gl, images[0]));
              textures.push (new Texture (this.gl, images[1]));

              res();
            })
            .catch(err=>{
              rej(err);
            })
          })
        }

        render() {

          // Clear color buffer
          this.gl.clearColor (0.0, 0.0, 0.0, 1.0);
          this.gl.clear (this.gl.COLOR_BUFFER_BIT);

          // Bind program
          this.gl.useProgram (this.program);

          var matrix = new Float32Array([
              scale, 0.0, 0.0, 0.0,
              0.0, scale, 0.0, 0.0,
              0.0, 0.0, scale, 0.0,
              0.0, 0.0, 0.0, 1.0
          ]);


          this.gl.uniformMatrix4fv (uniformMvpLocation, false, matrix);
          this.gl.uniform1i (uniformTexture0Location, 0);
          this.gl.uniform1i (uniformTexture1Location, 1);
          this.gl.uniform1f (uniformTimeLocation, time);
          time += 0.01;


          textures[0].bindAndActivate(0);
          textures[1].bindAndActivate(1);


          //this.gl.bindVertexArray (this.vertexArray);

          

          var lodBiasArray = [0.0, 1.0, 2.0, 13.0];



          // this.gl.viewport (this.viewport[0].x, this.viewport[0].y, this.viewport[0].z, this.viewport[0].w);
          // this.gl.uniform1f(uniformLodBiasLocation, lodBiasArray[i]);

            //this.gl.drawArraysInstanced (this.gl.TRIANGLES, 0, this.mesh.len, 1);
            
          this.mesh1.draw();

          // this.gl.viewport (this.viewport[1].x, this.viewport[1].y, this.viewport[1].z, this.viewport[1].w);
          // this.mesh1.draw();          
        }








        close() {
          gl.deleteBuffer(vertexPosBuffer);
          gl.deleteBuffer(vertexTexBuffer);
          
          for (var j=0; j<textures.length; ++j) {
            gl.deleteTexture(textures[j]);
          }
          gl.deleteVertexArray(vertexArray);
          gl.deleteProgram(program);
        }
      }