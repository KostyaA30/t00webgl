let countElemTextureQuad;

let canvas, gl;

export function initGL() {
    canvas = document.getElementById('webgl');

    gl = canvas.getContext("webgl2");
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }

    let vs, fs;

    const ft1 = fetch("./vert.glsl")
      .then((res) => res.text())
      .then((data) => {
        vs = data;
    });
    const ft2 = fetch("./frag.glsl")
      .then((res) => res.text())
      .then((data) => {
        fs = data;
    });
    const allData = Promise.all([ft1, ft2]);

    allData.then((res) => {
        if (!initShaders(gl, vs, fs)) {
            console.log('Failed to intialize shaders.');
            return;
        }

        initVertexBuffers(gl);
        if (countElemTextureQuad < 0) {
            console.log('Failed to set the vertex information');
            return;
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        if (!initTextures(gl)) {
            console.log('Failed to intialize the texture.');
            return;
        }
    });
}

function initShaders(gl, vshader, fshader) {
    let program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return program;
}

function createProgram(gl, vshader, fshader) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    
    if (!vertexShader || !fragmentShader) {
        return undefined;
    }

    let program = gl.createProgram();
    if (!program) {
        return undefined;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        let error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return undefined;
    }

    return program;
}

function loadShader(gl, type, source) {
    let shader = gl.createShader(type);
    if (shader == undefined) {
        console.log('unable to create shader');
        return undefined;
    }

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initVertexBuffers(gl) {
    const verticesTexCoords = new Float32Array([
        -0.5,  0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
         0.5,  0.5, 1.0, 1.0,
         0.5, -0.5, 1.0, 0.0,
    ]);
    countElemTextureQuad = 4;

    let vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    let fsize = verticesTexCoords.BYTES_PER_ELEMENT;
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, fsize * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
      console.log('Failed to get the storage location of a_TexCoord');
      return -1;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, fsize * 4, fsize * 2);
    gl.enableVertexAttribArray(a_TexCoord);
}

function initTextures(gl) {
    let texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler0 || !u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler');
      return false;
    }
    let image0 = new Image();
    let image1 = new Image();
    if (!image0 || !image1) {
      console.log('Failed to create the images object');
      return false;
    }                                      
    image0.crossOrigin = "anonymous";
    image0.src = '../bin/img/logo.png'; 
    image0.onload = function(){ loadTexture(gl, texture, u_Sampler0, image0, 0); };
    //image1.onload = function(){ loadTexture(gl, texture, u_Sampler1, image1, 1); };

    return true;
}

let g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);       
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;      
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    gl.uniform1i(u_Sampler, texUnit);
}

export function Render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // if (g_texUnit0 && g_texUnit1) {    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, countElemTextureQuad);
    // }  
}
