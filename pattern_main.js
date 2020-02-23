'use strict';

import {v_shader_tex, f_shader_tex} from "/shaders01.js";
import {Texture} from "/texture.js";
import {Vertex, Mesh, LineMesh, TriangleMesh, QuadMesh} from "/mesh.js";
import {createProgram, loadImages} from "/utility.js";

      // -- Mouse Behaviour
      var scale = 1.0;
      var mouseDown = false;
      var lastMouseY = 0;

      var uniformMvpLocation;
      var uniformTexture0Location;
      var uniformTexture1Location;
      var uniformLodBiasLocation;
      var uniformTimeLocation;

      var texture0;
      var test;
      var time = 0;
      var gl;
      var program;
      var mesh1;




      function render() {
        _render();
        requestAnimationFrame(render);
      }

      window.onload  = ()=>{

        gl = new GLContext().gl;

        program = createProgram (gl, v_shader_tex, f_shader_tex);
        uniformMvpLocation      = gl.getUniformLocation (program, "mvp");
        uniformTexture0Location = gl.getUniformLocation (program, "texture0");
        uniformTexture1Location = gl.getUniformLocation (program, "texture1");
        uniformLodBiasLocation  = gl.getUniformLocation (program, "lodBias");
        uniformTimeLocation     = gl.getUniformLocation (program, "uTime");

        mesh1 = new TriangleMesh(gl);
        mesh1.addVertex (new Vertex({pos:{x:-1, y:-1, z:0}, texcoord:{x:0,y:0}, color:{r:1.0, g:1.0, b:1.0}, cl:[Math.random(),Math.random()]}));
        mesh1.addVertex (new Vertex({pos:{x:1, y:-1, z:0}, texcoord:{x:1,y:0}, color:{r:1.0, g:0.4, b:1.0}, cl:[Math.random(),Math.random()]}));
        mesh1.addVertex (new Vertex({pos:{x:1, y:1, z:0}, texcoord:{x:1,y:1}, color:{r:1.0, g:1.0, b:1.0}, cl:[Math.random(),Math.random()]}));
        // this.mesh1.addVertex (new Vertex({pos:{x:0, y:1, z:0}, texcoord:{x:0,y:1}, color:{r:1.0, g:1.0, b:1.0}}));
        mesh1.init()

        loadImages ('/Di-3d.png')
        .then(images=>{
          gl.pixelStorei (gl.UNPACK_ALIGNMENT, 1);
          texture0 = new Texture (gl, images[0]);
        })
        .catch(err=>{
          
        })

        render();
      }

      


      

      class GLContext {

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



      function _render() {

          // Clear color buffer
          gl.clearColor (0.0, 0.0, 0.0, 1.0);
          gl.clear (gl.COLOR_BUFFER_BIT);

          // Bind program
          gl.useProgram (program);

          var matrix = new Float32Array([
              scale, 0.0, 0.0, 0.0,
              0.0, scale, 0.0, 0.0,
              0.0, 0.0, scale, 0.0,
              0.0, 0.0, 0.0, 1.0
          ]);


          gl.uniformMatrix4fv (uniformMvpLocation, false, matrix);
          gl.uniform1i (uniformTexture0Location, 0);
          gl.uniform1i (uniformTexture1Location, 1);
          gl.uniform1f (uniformTimeLocation, time);
          time += 0.01;


          //textures[0].bindAndActivate(0);
          //textures[1].bindAndActivate(1);


          //this.gl.bindVertexArray (this.vertexArray);

          

          var lodBiasArray = [0.0, 1.0, 2.0, 13.0];



          // this.gl.viewport (this.viewport[0].x, this.viewport[0].y, this.viewport[0].z, this.viewport[0].w);
          // this.gl.uniform1f(uniformLodBiasLocation, lodBiasArray[i]);

            //this.gl.drawArraysInstanced (this.gl.TRIANGLES, 0, this.mesh.len, 1);
            
          mesh1.draw();

          // this.gl.viewport (this.viewport[1].x, this.viewport[1].y, this.viewport[1].z, this.viewport[1].w);
          // this.mesh1.draw();          
        }

/*
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

        


*/
        