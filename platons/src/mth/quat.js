import { vec4 } from "./vec4.js";

class _quaternion {
    constructor( vector ) {
        let normalized = vec4(0, 0, 0, 0);
        normalized = vector;
        normalized.normalize();

        this.x = normalized.x;
        this.y = normalized.y;
        this.z = normalized.z;
        this.w = normalized.w;

        this.quaternion = true;
    }

    inverse() {
        return quaternion(vec4(-this.x, -this.y, -this.z, this.w));
    }

    mult(other) {
        let x, y, z, w;

        if (other.quaternion){
            w = (this.w * other.w) - (this.x * other.x) - (this.y * other.y) - (this.z * other.z);
            x = (this.x * other.w) + (this.w * other.x) + (this.y * other.z) - (this.z * other.y);
            y = (this.y * other.w) + (this.w * other.y) + (this.z * other.x) - (this.x * other.z);
            z = (this.z * other.w) + (this.w * other.z) + (this.x * other.y) - (this.y * other.x);
        } else {

            w = - (this.x * other.x) - (this.y * other.y) - (this.z * other.z);
            x =   (this.w * other.x) + (this.y * other.z) - (this.z * other.y);
            y =   (this.w * other.y) + (this.z * other.x) - (this.x * other.z);
            z =   (this.w * other.z) + (this.x * other.y) - (this.y * other.x);
        }

        return quaternion(vec4(x, y, z, w));
    }
}    

export function quaternion(...arg) {
    return new _quaternion(...arg);
}