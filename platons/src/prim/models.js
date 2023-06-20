import { transform } from "../mth/transform.js";

class _model {
    mesh = [];
    transform = [];

    constructor() {
    }

    add(meshData) {
        this.transform.push(transform());
        this.mesh.push(meshData);
    }

    setScale(x, y, z, ind) {
        if (ind !== undefined || ind !== null) {
            this.transform[ind].scale.set(x, y, z);
        } else {
            for (let i; i < this.transform.length; i++) {
                this.transform[i].scale.set(x, y, z);
            }
        }
        return this;
    }
    setPosition(x, y, z, ind) {
        if (ind !== undefined || ind !== null) {
            this.transform[ind].position.set(x, y, z);
        } else {
            for (let i; i < this.transform.length; i++) {
                this.transform[i].position.set(x, y, z);
            }
        }
        return this;
    }
    setRotation(x, y, z, ind) {
        if (ind !== undefined || ind !== null) {
            this.transform[ind].rotation.set(x, y, z);
        } else {
            for (let i; i < this.transform.length; i++) {
                this.transform[i].rotation.set(x, y, z);
            }
        }
        return this;
    }

    addScale(x, y, z, ind) {
        if (ind !== undefined || ind !== null) {
            this.transform[ind].scale.x += x;
            this.transform[ind].scale.y += y;
            this.transform[ind].scale.z += z;
        } else {
            for (let i; i < this.transform.length; i++) {
                this.transform[i].scale.x += x;
                this.transform[i].scale.y += y;
                this.transform[i].scale.z += z;
            }
        }
        return this;
    }
    addPosition(x, y, z, ind) {
        if (ind !== undefined || ind !== null) {
            this.transform[ind].position.x += x;
            this.transform[ind].position.y += y;
            this.transform[ind].position.z += z;
        } else {
            for (let i; i < this.transform.length; i++) {
                this.transform[i].position.x += x;
                this.transform[i].position.y += y;
                this.transform[i].position.z += z;
            }
        }
        return this;
    }
    addRotation(x, y, z, ind) {
        if (ind !== undefined || ind !== null) {
            this.transform[ind].rotation.x += x;
            this.transform[ind].rotation.y += y;
            this.transform[ind].rotation.z += z;
        } else {
            for (let i; i < this.transform.length; i++) {
            this.transform[i].rotation.x += x;
            this.transform[i].rotation.y += y;
            this.transform[i].rotation.z += z;
            }
        }
        return this;
    }

    preRender() {
        for (let i = 0; i < this.transform.length; i++) {
            this.transform[i].updateMatrix();
        }
        return this;
    }
}

export function model(...arg) {
    return new _model(...arg);
}