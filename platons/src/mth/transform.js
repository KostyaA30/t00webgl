import { vec3 } from "./vec3.js"
import { matr4 } from "./matr4.js"

class _transform {
    constructor() {
        this.deg2Rad = Math.PI / 180;
        this.position = vec3(0, 0, 0);
        this.scale = vec3(1, 1, 1);
        this.rotation = vec3(0, 0, 0);
        this.matView = new matr4();
        this.matNormal = new Float32Array(9);
        this.distance = 15;

        this.forward = new Float32Array(4);
        this.up = new Float32Array(4);
        this.right = new Float32Array(4);
    }

    updateMatrix() {
        this.matView
            .reset()
            .translate(this.position)
            .rotateY(this.rotation.y * this.deg2Rad)
            .rotateX(this.rotation.x * this.deg2Rad)
            .rotateZ(this.rotation.z * this.deg2Rad)
            .scale(this.scale);

        matr4.normalMat3(this.matNormal, this.matView.m);

        matr4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.m);
        matr4.transformVec4(this.up, [0, 1, 0, 0], this.matView.m);
        matr4.transformVec4(this.right, [1, 0, 0, 0], this.matView.m);

        return this.matView.m;
    }

    updateDirection() {
        matr4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.m);
        matr4.transformVec4(this.up, [0, 1, 0, 0], this.matView.m);
        matr4.transformVec4(this.right, [1, 0, 0, 0], this.matView.m);
        return this;
    }

    getViewMatrix() {
        return this.matView;
    }
    getNormalMatrix() {
        return this.matNormal;
    }

    reset() {
        this.position.set(0, 0, 0);
        this.scale.set(1, 1, 1);
        this.rotation.set(0, 0, 0);
    }
}

export function transform(...arg) {
    return new _transform(...arg);
}
