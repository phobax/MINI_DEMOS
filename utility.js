
    var getShaderSource = function(id) {
        return document.getElementById(id).textContent.replace(/^\s+|\s+$/g, '');
    }

    var createShader = function(gl, source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    var createProgram = function(gl, vertexShaderSource, fragmentShaderSource) {
        var program = gl.createProgram();
        var vshader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        var fshader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        gl.attachShader(program, vshader);
        gl.deleteShader(vshader);
        gl.attachShader(program, fshader);
        gl.deleteShader(fshader);
        gl.linkProgram(program);

        var log = gl.getProgramInfoLog(program);
        if (log) {
            console.log(log);
        }

        log = gl.getShaderInfoLog(vshader);
        if (log) {
            console.log(log);
        }

        log = gl.getShaderInfoLog(fshader);
        if (log) {
            console.log(log);
        }

        return program;
    }

    var loadImages = function (...urls) {

      var promises = [];
      for (var url of urls) {
        promises.push(loadImage(url));
      }
      return Promise.all(promises)
    }

    var loadImage = function(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", err => reject(err));
        img.src = src;
      });
    }

// loadImage("example.com/house.jpg")
//   .then(img => console.log(`w: ${img.width} | h: ${img.height}`))
//   .catch(err => console.error(err));


    // window.loadImage = function(url, onload) {
    //     var img = new Image();
    //     img.src = url;
    //     img.onload = function() {
    //         onload(img);
    //     };
    //     return img;
    // };

    // window.loadImages = function(urls, onload) {
    //     var imgs = [];
    //     var imgsToLoad = urls.length;
    //
    //     function onImgLoad() {
    //         if (--imgsToLoad <= 0) {
    //             onload(imgs);
    //         }
    //     }
    //
    //     for (var i = 0; i < imgsToLoad; ++i) {
    //         imgs.push(loadImage(urls[i], onImgLoad));
    //     }
    // };

    var loadObj = function(url, onload) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function(e) {
            var mesh = new OBJ.Mesh(this.response);
            onload(mesh);
        };
        xhr.send();
    }

export {getShaderSource, createShader, createProgram, loadImages, loadImage, loadObj}
