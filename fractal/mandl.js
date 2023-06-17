let gl, canvas;
let timeLoc = 0;
let aspectRatioLoc = 0;
let startTime = 0;

function initGL() {
    // Create canvas
    canvas = document.getElementById("webgl");

    // Canvas size
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    document.body.appendChild(canvas);

    // Create WebGL2 Rendering context 
    gl = canvas.getContext("webgl2");
    // Check by access
    if (!gl)
    {
      console.log("Error in making WebGL2 rendering context!");
      return;
    }

    // Data of vertex and fragment shaders
    let vs, fs;

    // Load text
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

    // Create promiss data
    const allData = Promise.all([ft1, ft2]);

    // Start process
    allData.then((res) => {
        // Create and check shaders
        if (!initShaders(gl, vs, fs)) {
            console.log('Failed to intialize shaders.');
            return;
        }

        // Create shader location
        const positionLoc = gl.getAttribLocation(gl.program, "position");
        
        // Set time location
        timeLoc = gl.getUniformLocation(gl.program, "time");
        aspectRatioLoc = gl.getUniformLocation(gl.program, "aspectRatio");
        
        // Create buffer
        const buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);
        
        // Create vertex array
        let vao = gl.createVertexArray();
        
        // Set data
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        startTime = Date.now();

        // Rendering
        Render();
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

    return true;
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

function Render() {
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000.);
    gl.uniform1f(aspectRatioLoc, gl.canvas.width / gl.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    window.requestAnimationFrame(Render);
}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}