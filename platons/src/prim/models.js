import { transform } from "../mth/transform.js";

class _model {
    constructor(meshData) {
        this.transform = transform();
        this.mesh = meshData;
    }

    setScale(x, y, z) {
        this.transform.scale.set(x, y, z);
        return this;
    }
    setPosition(x, y, z) {
        this.transform.position.set(x, y, z);
        return this;
    }
    setRotation(x, y, z) {
        this.transform.rotation.set(x, y, z);
        return this;
    }

    addScale(x, y, z) {
        this.transform.scale.x += x;
        this.transform.scale.y += y;
        this.transform.scale.y += y;
        return this;
    }
    addPosition(x, y, z) {
        this.transform.position.x += x;
        this.transform.position.y += y;
        this.transform.position.z += z;
        return this;
    }
    addRotation(x, y, z) {
        this.transform.rotation.x += x;
        this.transform.rotation.y += y;
        this.transform.rotation.z += z;
        return this;
    }

    preRender() {
        this.transform.updateMatrix();
        return this;
    }
}

export function model(...arg) {
    return new _model(...arg);
}