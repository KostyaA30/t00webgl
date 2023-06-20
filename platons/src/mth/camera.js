import { matr4 } from "./matr4.js";
import { transform } from "./transform.js";

class _camera {
    constructor(gl, fov, near, far) {
        this.projectionMatrix = new matr4()
        let ratio = gl.canvas.width / gl.canvas.height;
        matr4.perspective(this.projectionMatrix.m, fov || 70, ratio, near || 0.1, far || 150.0);

        this.transform = transform();
        this.viewMatrix = new matr4();

        this.mode = _camera.MODE_ORBIT;
    }

    panX(v) {
        if (this.mode == _camera.MODE_ORBIT) return;
        this.updateViewMatrix();
        this.transform.position.x += this.transform.right[0] * v;
        this.transform.position.y += this.transform.right[1] * v;
        this.transform.position.z += this.transform.right[2] * v;
    }

    panY(v) {
        this.updateViewMatrix();
        this.transform.position.y += this.transform.up[1] * v;
        if (this.mode == _camera.MODE_ORBIT) return;
        this.transform.position.x += this.transform.up[0] * v;
        this.transform.position.z += this.transform.up[2] * v;
    }

    panZ(v) {
        this.updateViewMatrix();
        if (this.mode == _camera.MODE_ORBIT) {
            this.transform.position.z += v;
        } else {
            this.transform.position.x += this.transform.forward[0] * v;
            this.transform.position.y += this.transform.forward[1] * v;
            this.transform.position.z += this.transform.forward[2] * v;
        }
    }

    updateViewMatrix() {
        if (this.mode == _camera.MODE_FREE) {
            this.transform.matView
                .reset()
                .translate(this.transform.position)
                .rotateY(this.transform.rotation.y * this.transform.deg2Rad)
                .rotateX(this.transform.rotation.x * this.transform.deg2Rad);
        } else {
            this.transform.matView
                .reset()
                .rotateY(this.transform.rotation.y * this.transform.deg2Rad)
                .rotateX(this.transform.rotation.x * this.transform.deg2Rad)
                .translate(this.transform.position);
        }

        this.transform.updateDirection();

        matr4.invert(this.viewMatrix.m, this.transform.matView.m);
        return this.viewMatrix;
    }

    getTranslatelessMatrix() {
        let mat = new Float32Array(this.viewMatrix.toArray());
        mat[12] = mat[13] = mat[14] = 0.0;
        return mat;
    }
}

_camera.MODE_FREE = 0;
_camera.MODE_ORBIT = 1;

class _cameraController {
    constructor(gl, camera) {
        let oThis = this;
        let box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;
        this.camera = camera;

        this.rotateRate = -300;
        this.panRate = 5;
        this.zoomRate = 200;

        this.offsetX = box.left;
        this.offsetY = box.top;

        this.initX = 0;
        this.initY = 0;
        this.prevX = 0;
        this.prevY = 0;

        this.onUpHandler = function (e) {
            oThis.onMouseUp(e);
        };
        this.onMoveHandler = function (e) {
            oThis.onMouseMove(e);
        };

        this.canvas.addEventListener("mousedown", function (e) {
            oThis.onMouseDown(e);
        });
        this.canvas.addEventListener("mousewheel", function (e) {
            oThis.onMouseWheel(e);
        });
    }

    getMouseVec2(e) {
        return { x: e.pageX - this.offsetX, y: e.pageY - this.offsetY };
    }

    onMouseDown(e) {
        this.initX = this.prevX = e.pageX - this.offsetX;
        this.initY = this.prevY = e.pageY - this.offsetY;

        this.canvas.addEventListener("mouseup", this.onUpHandler);
        this.canvas.addEventListener("mousemove", this.onMoveHandler);
    }

    onMouseUp(e) {
        this.canvas.removeEventListener("mouseup", this.onUpHandler);
        this.canvas.removeEventListener("mousemove", this.onMoveHandler);
    }

    onMouseWheel(e) {
        let delta = Math.max(-1, Math.min(1, -e.wheelDelta || -e.detail));
        this.camera.panZ(delta * (this.zoomRate / this.canvas.height));
    }

    onMouseMove(e) {
        let x = e.pageX - this.offsetX,
            y = e.pageY - this.offsetY,
            dx = x - this.prevX,
            dy = y - this.prevY;

        if (e.which == 1) {
            if (!e.shiftKey) {
                this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width) / 3.0;
                this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height) / 3.0;
            } else {
                this.camera.panX(-dx * (this.panRate / this.canvas.width));
                this.camera.panY(dy * (this.panRate / this.canvas.height));
            }
        } else if (e.which == 3) {
            this.camera.panX(-dx * (this.rotateRate / this.canvas.width) / 100.0);
            this.camera.panZ(dy * (this.rotateRate / this.canvas.height) / 100.0);
            this.camera.transform.position.x += dx * (this.rotateRate / this.canvas.width) / 100.0;
            this.camera.transform.position.y -= dy * (this.rotateRate / this.canvas.height) / 100.0;
        }

        this.prevX = x;
        this.prevY = y;
    }
}

export function camera(...arg) {
    return new _camera(...arg);
}

export function cameraController(...arg) {
    return new _cameraController(...arg);
}