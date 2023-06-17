const ATTR_POSITION_NAME = "a_position";
const ATTR_POSITION_LOC = 0;
const ATTR_NORMAL_NAME = "a_norm";
const ATTR_NORMAL_LOC = 1;
const ATTR_UV_NAME = "a_uv";
const ATTR_UV_LOC = 2;

class _shaderBuilder {
    constructor(gl, vertShaders, fragShaders) {
        if (vertShaders === undefined || vertShader === null || vertShaders.length < 20) {
            vertShaders = `#version 300 es

in vec4 a_position;
in vec3 a_norm;
in vec2 a_uv;

uniform MatTransform {
    mat4 matProjection;
    mat4 matCameraView;
};

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

out highp vec2 vUV;
out lowp vec3 color;

void main( void ) {
    if (a_position.w == 0.0)
        color = vec3(1.0, 0.0, 0.0);
    else if (a_position.w == 1.0)
        color = vec3(0.0, 1.0, 0.0);
    else
        color = vec3(0.6, 0.6, 0.6);

    vUV = a_uv;
    gl_Position = matProjection * matCameraView * uMVMatrix * vec4(a_position.xyz, 1.0);
}`;
        fragShaders = `#version 300 es
        
precision mediump float;
in highp vec2 vUV;
in lowp vec3 color;
out vec4 outColor;

void main( void ) {
    outColor = vec4(color,1.0);
}`;
        // this.loadFromFile(vertShaders, fragShaders);
        }
        this.program = shadersUtil.createProgramFromText(gl, vertShaders, fragShaders, true);

        if (this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.mUniformList = [];
            this.mTextureList = [];

            this.noCulling = false;
            this.doBlending = false;
        }
    }

    loadFromFile(vs, fs) {
    }

    prepareUniforms() {
        if (arguments.length % 2 != 0) {
            console.log("prepareUniforms needs arguments to be in pairs.");
            return this;
        }

        let loc = 0;
        for (let i = 0; i < arguments.length; i += 2) {
            loc = this.gl.getUniformLocation(this.program, arguments[i]);
            if (loc != null) this.mUniformList[arguments[i]] = { loc: loc, type: arguments[i + 1] };
        }
        return this;
    }

    prepareUniformBlocks(ubo, blockIndex) {
        let ind = 0;
        for (let i = 0; i < arguments.length; i += 2) {
            this.gl.uniformBlockBinding(this.program, arguments[i + 1], arguments[i].blockPoint);
        }
        return this;
    }

    prepareTextures() {
        if (arguments.length % 2 != 0) {
            console.log("prepareTextures needs arguments to be in pairs.");
            return this;
        }

        let loc = 0,
            tex = "";
        for (let i = 0; i < arguments.length; i += 2) {
            tex = this.gl.mTextureCache[arguments[i + 1]];
            if (tex === undefined) {
                console.log("Texture not found in cache " + arguments[i + 1]);
                continue;
            }

            loc = this.gl.getUniformLocation(this.program, arguments[i]);
            if (loc != null) this.mTextureList.push({ loc: loc, tex: tex });
        }
        return this;
    }

    setUniforms() {
        if (arguments.length % 2 != 0) {
            console.log("setUniforms needs arguments to be in pairs.");
            return this;
        }

        let name;
        for (let i = 0; i < arguments.length; i += 2) {
            name = arguments[i];
            if (this.mUniformList[name] === undefined) {
                console.log("uniform not found " + name);
                return this;
            }

            switch (this.mUniformList[name].type) {
                case "2fv":
                    this.gl.uniform2fv(this.mUniformList[name].loc, new Float32Array(arguments[i + 1]));
                    break;
                case "3fv":
                    this.gl.uniform3fv(this.mUniformList[name].loc, new Float32Array(arguments[i + 1]));
                    break;
                case "4fv":
                    this.gl.uniform4fv(this.mUniformList[name].loc, new Float32Array(arguments[i + 1]));
                    break;
                case "mat4":
                    this.gl.uniformMatrix4fv(this.mUniformList[name].loc, false, arguments[i + 1]);
                    break;
                default:
                    console.log("unknown uniform type for " + name);
                    break;
            }
        }

        return this;
    }

    activate() {
        this.gl.useProgram(this.program);
        return this;
    }
    deactivate() {
        this.gl.useProgram(null);
        return this;
    }

    dispose() {
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    }

    preRender() {
        this.gl.useProgram(this.program);

        if (arguments.length > 0) this.setUniforms.apply(this, arguments);

        if (this.mTextureList.length > 0) {
            let texSlot;
            for (let i = 0; i < this.mTextureList.length; i++) {
                texSlot = this.gl["TEXTURE" + i];
                this.gl.activeTexture(texSlot);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.mTextureList[i].tex);
                this.gl.uniform1i(this.mTextureList[i].loc, i);
            }
        }

        return this;
    }

    renderModel(model, doShaderClose) {
        this.setUniforms("uMVMatrix", model.transform.getViewMatrix().toArray());
        this.gl.bindVertexArray(model.mesh.vao);

        if (model.mesh.noCulling || this.noCulling) this.gl.disable(this.gl.CULL_FACE);
        if (model.mesh.doBlending || this.doBlending) this.gl.enable(this.gl.BLEND);

        if (model.mesh.indexCount) this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        else this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);

        this.gl.bindVertexArray(null);
        if (model.mesh.noCulling || this.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if (model.mesh.doBlending || this.doBlending) this.gl.disable(this.gl.BLEND);

        if (doShaderClose) this.gl.useProgram(null);

        return this;
    }

    renderModelVR(model, vr) {
        this.setUniforms("uMVMatrix", model.transform.getViewMatrix());
        this.gl.bindVertexArray(model.mesh.vao);

        if (model.mesh.noCulling || this.noCulling) this.gl.disable(this.gl.CULL_FACE);
        if (model.mesh.doBlending || this.doBlending) this.gl.enable(this.gl.BLEND);

        this.gl.viewport(0, 0, this.gl.fWidth * 0.5, this.gl.fHeight);
        this.gl.uniformMatrix4fv(this.mUniformList["uPMatrix"].loc, false, vr.fFrameData.leftProjectionMatrix);
        this.gl.uniformMatrix4fv(this.mUniformList["uCameraMatrix"].loc, false, vr.fGetEyeMatrix(0));

        if (model.mesh.indexCount) this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
        else this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);

        gl.viewport(this.gl.fWidth * 0.5, 0, this.gl.fWidth * 0.5, this.gl.fHeight);
        this.gl.uniformMatrix4fv(this.mUniformList["uPMatrix"].loc, false, vr.fFrameData.rightProjectionMatrix);
        this.gl.uniformMatrix4fv(this.mUniformList["uCameraMatrix"].loc, false, vr.fGetEyeMatrix(1));

        if (model.mesh.indexCount) this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
        else this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);

        this.gl.bindVertexArray(null);
        if (model.mesh.noCulling || this.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if (model.mesh.doBlending || this.doBlending) this.gl.disable(this.gl.BLEND);

        return this;
    }
}

export class shadersUtil {
    static domShaderSrc(elmID) {
        let elm = document.getElementById(elmID);
        if (!elm || elm.text == "") {
            console.log(elmID + " shader not found or no text.");
            return null;
        }

        return elm.text;
    }

    static createShader(gl, src, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static createProgram(gl, vShader, fShader, doValidate) {
        let prog = gl.createProgram();
        gl.attachShader(prog, vShader);
        gl.attachShader(prog, fShader);

        gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
        gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
        gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);

        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }

        if (doValidate) {
            gl.validateProgram(prog);
            if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                console.error("Error validating program", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }
        }

        gl.detachShader(prog, vShader);
        gl.detachShader(prog, fShader);
        gl.deleteShader(fShader);
        gl.deleteShader(vShader);

        return prog;
    }

    static domShaderProgram(gl, vectID, fragID, doValidate) {
        let vShaderTxt = shadersUtil.domShaderSrc(vectID);
        if (!vShaderTxt) return null;
        let fShaderTxt = shadersUtil.domShaderSrc(fragID);
        if (!fShaderTxt) return null;
        let vShader = shadersUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
        if (!vShader) return null;
        let fShader = shadersUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
        if (!fShader) {
            gl.deleteShader(vShader);
            return null;
        }

        return shadersUtil.createProgram(gl, vShader, fShader, true);
    }

    static createProgramFromText(gl, vShaderTxt, fShaderTxt, doValidate) {
        let vShader = shadersUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
        if (!vShader) return null;
        let fShader = shadersUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
        if (!fShader) {
            gl.deleteShader(vShader);
            return null;
        }

        return shadersUtil.createProgram(gl, vShader, fShader, true);
    }

    static getStandardAttribLocations(gl, program) {
        return {
            position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
            norm: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
            uv: gl.getAttribLocation(program, ATTR_UV_NAME),
        };
    }

    static getStandardUniformLocations(gl, program) {
        return {
            perspective: gl.getUniformLocation(program, "uPMatrix"),
            modalMatrix: gl.getUniformLocation(program, "uMVMatrix"),
            cameraMatrix: gl.getUniformLocation(program, "uCameraMatrix"),
            mainTexture: gl.getUniformLocation(program, "uMainTex"),
        };
    }
}

export function shaderBuilder(...arg) {
    return new _shaderBuilder(...arg);
}