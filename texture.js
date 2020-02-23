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

      export {Texture}