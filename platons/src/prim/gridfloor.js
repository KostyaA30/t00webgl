import { transform } from "../mth/transform.js";
import { shadersUtil } from "../render/shaders/shaders.js";

class _gridFloor {
    constructor(gl, incAxis) {
        this.transform = transform();
        this.gl = gl;
        this.createMesh(gl, incAxis || false);
        this.createShader();
    }

    createShader() {
        let vShader =
            "#version 300 es\n" +
            "in vec3 a_position;" +
            "layout(location = 4) in float a_color;" +
            "uniform mat4 uPMatrix;" +
            "uniform mat4 uMVMatrix;" +
            "uniform mat4 uCameraMatrix;" +
            "uniform vec3 uColorArray[4];" +
            "out lowp vec4 color;" +
            "void main( void ) {" +
            "  color = vec4(uColorArray[int(a_color)], 1.0);" +
            "  gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);" +
            "}";
        let fShader =
          "#version 300 es\n" + 
          "precision mediump float;" +
          "in vec4 color;" +
          "out vec4 finalColor;" +
          "void main( void ) {" + 
          "  finalColor = color;" + 
          "}";

        this.mShader = shadersUtil.createProgramFromText(this.gl, vShader, fShader, true);
        this.mUniformColor = this.gl.getUniformLocation(this.mShader, "uColorArray");
        this.mUniformProj = this.gl.getUniformLocation(this.mShader, "uPMatrix");
        this.mUniformCamera = this.gl.getUniformLocation(this.mShader, "uCameraMatrix");
        this.mUniformModelV = this.gl.getUniformLocation(this.mShader, "uMVMatrix");

        this.gl.useProgram(this.mShader);
        this.gl.uniform3fv(this.mUniformColor, new Float32Array([0.3, 0.47, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]));
        this.gl.useProgram(null);
    }

    render(camera) {
        this.transform.updateMatrix();

        this.gl.useProgram(this.mShader);
        this.gl.bindVertexArray(this.mesh.vao);

        this.gl.uniformMatrix4fv(this.mUniformProj, false, camera.projectionMatrix.toArray());
        this.gl.uniformMatrix4fv(this.mUniformCamera, false, camera.viewMatrix.toArray());
        this.gl.uniformMatrix4fv(this.mUniformModelV, false, this.transform.getViewMatrix().toArray());

        this.gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);

        this.gl.bindVertexArray(null);
        this.gl.useProgram(null);
    }

    renderVR(vr) {
        this.transform.updateMatrix();

        this.gl.useProgram(this.mShader);
        this.gl.bindVertexArray(this.mesh.vao);

        this.gl.uniformMatrix4fv(this.mUniformModelV, false, this.transform.getViewMatrix().toArray());

        this.gl.viewport(0, 0, this.gl.fWidth * 0.5, this.gl.fHeight);
        this.gl.uniformMatrix4fv(this.mUniformProj, false, vr.fFrameData.leftProjectionMatrix);
        this.gl.uniformMatrix4fv(this.mUniformCamera, false, vr.fFrameData.leftViewMatrix);
        this.gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);

        gl.viewport(this.gl.fWidth * 0.5, 0, this.gl.fWidth * 0.5, this.gl.fHeight);
        this.gl.uniformMatrix4fv(this.mUniformProj, false, vr.fFrameData.rightProjectionMatrix);
        this.gl.uniformMatrix4fv(this.mUniformCamera, false, vr.fFrameData.rightViewMatrix);
        this.gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);

        this.gl.bindVertexArray(null);
    }

    createMesh(gl, incAxis) {
        let verts = [],
            size = 10,
            div = 100.0,
            step = size / div,
            half = size / 2;

        let p;
        for (let i = 0; i <= div; i++) {
            p = -half + i * step;
            verts.push(p);
            verts.push(0);
            verts.push(half);
            verts.push(0);

            verts.push(p);
            verts.push(0);
            verts.push(-half);
            verts.push(0);

            p = half - i * step;
            verts.push(-half);
            verts.push(0);
            verts.push(p);
            verts.push(0);

            verts.push(half);
            verts.push(0);
            verts.push(p);
            verts.push(0);
        }

        if (incAxis) {
            verts.push(-1.1);
            verts.push(0);
            verts.push(0);
            verts.push(1);

            verts.push(1.1);
            verts.push(0);
            verts.push(0);
            verts.push(1);

            verts.push(0);
            verts.push(-1.1);
            verts.push(0);
            verts.push(2);

            verts.push(0);
            verts.push(1.1);
            verts.push(0);
            verts.push(2);

            verts.push(0);
            verts.push(0);
            verts.push(-1.1);
            verts.push(3);

            verts.push(0);
            verts.push(0);
            verts.push(1.1);
            verts.push(3);
        }

        let attrColorLoc = 4,
            strideLen,
            mesh = {
                drawMode: gl.LINES,
                vao: gl.createVertexArray()
            };

        mesh.vertexComponentLen = 4;
        mesh.vertexCount = verts.length / mesh.vertexComponentLen;
        strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColorLoc);

        gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, strideLen, 0);
        gl.vertexAttribPointer(attrColorLoc, 1, gl.FLOAT, false, strideLen, Float32Array.BYTES_PER_ELEMENT * 3);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.mMeshCache["grid"] = mesh;
        this.mesh = mesh;
    }   
}

export function gridFloor(...arg) {
    return new _gridFloor(...arg);
}