class _glutil {
    static rgbArray() {
        if (arguments.length == 0) return null;
        let rtn = [];

        for (let i = 0, c, p; i < arguments.length; i++) {
            if (arguments[i].length < 6) continue;
            c = arguments[i];
            p = c[0] == "#" ? 1 : 0;

            rtn.push(parseInt(c[p] + c[p + 1], 16) / 255.0, parseInt(c[p + 2] + c[p + 3], 16) / 255.0, parseInt(c[p + 4] + c[p + 5], 16) / 255.0);
        }
        return rtn;
    }
}

class _webgl {
    constructor() {
    }

    init(idCanvas) {
        this.canvas = document.getElementById(idCanvas);
        this.gl = this.canvas.getContext("webgl2");

        if (!this.gl) {
            console.error("WebGL rendering context is not available");
            return null;
        }
        
        this.gl.mMeshCache = [];
        this.gl.mTextureCache = [];

        this.gl.cullFace(this.gl.BACK);
        this.gl.frontFace(this.gl.CCW);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

        this.gl.fCreateArrayBuffer = function(floatArray, isStatic) {
            if (isStatic === undefined) {
                isStatic = true;
            }

            let buf = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, buf);
            this.bufferData(this.ARRAY_BUFFER, floatArray, isStatic ? this.DYNAMIC_DRAW : this.STATIC_DRAW);
            this.bindBuffer(this.ARRAY_BUFFER, null);
            
            return buf;
        }

        this.gl.fClear = function() {
            this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
            return this;
        }

        this.gl.fCreateMeshVAO = function(name, arrayInd, arrayVert, arrayColor, arrayNorm, arrayUV, vertLen) {
            let rtn = { drawMode: this.TRIANGLES };

            rtn.vao = this.createVertexArray();
            this.bindVertexArray(rtn.vao);

            if (arrayVert !== undefined && arrayVert != null) {
                rtn.bufVerticies = this.createBuffer();
                rtn.vertexComponentLen = vertLen || 3;
                rtn.vertexCount = arrayVert.length / rtn.vertexComponentLen;

                this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVerticies);
                this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrayVert), this.STATIC_DRAW);
                this.enableVertexAttribArray(ATTR_POSITION_LOC);

                this.vertexAttribPointer(ATTR_POSITION_LOC, rtn.vertexComponentLen, this.FLOAT, false, 0, 0);
            }

            if (arrayColor !== undefined && arrayColor != null) {
                rtn.bufColors = this.createBuffer();

                this.bindBuffer(this.ARRAY_BUFFER, rtn.bufColors);
                this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrayColor), this.STATIC_DRAW);
                this.enableVertexAttribArray(ATTR_COLOR_LOC);

                this.vertexAttribPointer(ATTR_COLOR_LOC, 3, this.FLOAT, false, 0, 0);
            }
            
            if (arrayNorm !== undefined && arrayNorm != null) {
                rtn.bufNormals = this.createBuffer();
                this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
                this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrayNorm), this.STATIC_DRAW);
                this.enableVertexAttribArray(ATTR_NORMAL_LOC);

                this.vertexAttribPointer(ATTR_NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
            }
            
            if (arrayUV !== undefined && arrayUV != null) {
                rtn.bufUV = this.createBuffer();
                this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
                this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrayUV), this.STATIC_DRAW);
                this.enableVertexAttribArray(ATTR_UV_LOC);

                this.vertexAttribPointer(ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0);
            }
            
            if (arrayInd !== undefined && arrayInd != null) {
                rtn.bufInd = this.createBuffer();
                rtn.indexCount = arrayInd.length;
                this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufInd);
                this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrayInd), this.STATIC_DRAW);
            }

            this.bindVertexArray(null);
            this.bindBuffer(this.ARRAY_BUFFER, null);
            if (arrayInd != null && arrayInd !== undefined) {
                this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
            }

            this.mMeshCache[name] = rtn;
            return rtn;
        }

        this.gl.fLoadTexture = function (name, img, doYFlip, noMips) {
            let tex = this.createTexture();
            this.mTextureCache[name] = tex;
            return this.fUpdateTexture(name, img, doYFlip, noMips);
        };
    
        this.gl.fUpdateTexture = function (name, img, doYFlip, noMips) {
            let tex = this.mTextureCache[name];
            if (doYFlip == true) {
                this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);
            }
    
            this.bindTexture(this.TEXTURE_2D, tex);
            this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);
    
            if (noMips === undefined || noMips == false) {
                this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
                this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);
                this.generateMipmap(this.TEXTURE_2D);
            } else {
                this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.NEAREST);
                this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.NEAREST);
                this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
                this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
            }
    
            this.bindTexture(this.TEXTURE_2D, null);
    
            if (doYFlip == true) this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, false);
            return tex;
        };

        this.gl.fLoadCubeMap = function(name, imgArray) {
            if (imgArray.length != 6) {
                return null;
            }

            let tex = this.createTexture();
            this.bindTexture(this.TEXTURE_CUBE_MAP, tex);

            for (let i = 0; i < 6; i++) {
                this.texParamateri(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, imgArray[i]);
            }

            this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR);
            this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR);
            this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
            this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
            this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_R, this.CLAMP_TO_EDGE);

            this.bindTexture(this.TEXTURE_CUBE_MAP, null);
            this.mTextureCache[name] = tex;
            return tex;
        }

        this.gl.fSetSize = function(w, h) {
            this.canvas.style.width = w + "px";
            this.canvas.style.height = h + "px";
            this.canvas.width = w;
            this.canvas.height = h;

            this.viewport(0, 0, w, h);
            this.fWidth = w;
            this.fHeight = h;
            return this;
        }

        this.gl.fFitScreen = function(wp, hp) {
            return this.fSetSize(window.innerWidth * (wp || 1), window.innerHeight * (hp || 1));
        }
        
        return this.gl;
    }
}

export function webgl(...arg) {
    return new _webgl(...arg);
}