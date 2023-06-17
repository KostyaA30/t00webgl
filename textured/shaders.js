export function initShaders( gl, vs, fs ) {
    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    if (!vertexSh || !fragmentSh) {
        return;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexSh);
    gl.attachShader(shaderProgram, fragmentSh);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(shaderProgram);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(shaderProgram);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return undefined;
    }

    return shader;
}