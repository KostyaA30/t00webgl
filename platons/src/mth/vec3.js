import { quaternion } from "./quat.js";
import { vec4 } from "./vec4.js"

class _vec3 {
    /* Constructor functgion
     * ARGUMENTS:
     *   - coordinate:
     *       x, y, x;
     * RETURNS: None.
    */
    constructor(x, y, z) {
        if (x == undefined) {
            this.x = 0, this.y = 0, this.z = 0;
        }
        else if (typeof x == "object") {
            if (x.length == 3) {
                this.x = x[0], this.y = x[1], this.z = x[0];
            } else {
                this.x = x.x, this.y = x.y, this.z = x.z;
            }
        }
        else {
            if (y == undefined && z == undefined) {
                this.x = x, this.y = x, this.y = y;
            } else {
                this.x = x, this.y = y, this.z = z;
            }
        }
    } /* End of 'constructor' function */

    /* Set new coordinates function
     * ARGUMENTS:
     *   - new coordinates:
     *       x, y, x;
     * RETURNS:
     *   - result new vector: this.
    */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    } /* End of 'set' function */

    /* Opposite vector
     * ARGUMENTS: None.
     * RETURNS:
     *   - result opposite vector: this;
    */
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    } /* End of 'neg' function */

    /* Get quad vector's length fucntion:
     * ARGUMENTS: None.
     * RETURNS:
     *   - quad lentgh.
    */
    length2() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    } /* End of 'length2' function */

    /* Get vector's length fucntion:
     * ARGUMENTS: None.
     * RETURNS:
     *   - vector's lentgh.
    */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    } /* End of 'length' function */

    /* Adding vector function
     * ARGUMENTS:
     *   - second vector: V;
     * RETURNS:
     *   - vector that is sum of two other vectors (this).
    */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    } /* End of 'add' function */

    /* Substraction vector function
     * ARGUMENTS:
     *   - second vector: V;
     * RETURNS:
     *   - vector that is substraction of two other vectors (this).
    */
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    } /* End of 'sub' function */

    /* Multiplication by number function
     * ARGUMENTS:
     *   - number: n;
     * RETURNS:
     *   - vector that is multiplication of vector by number (this).
    */
    mul(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    } /* End of 'mul' function */

    /* Division by number function
     * ARGUMENTS:
     *   - number: n;
     * RETURNS:
     *   - vector that is division of vector by number (this).
    */
    div(n) {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    } /* End of 'div' function */

    /* Scalar product function
     * ARGUMENTS:
     *   - second vector: v;
     * RETURNS:
     *   - scalar product of two vectors (number).
    */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    } /* End of 'dot' function */

    /* Cross product function
     * ARGUMENTS:
     *   - second vector: v;
     * RETURNS:
     *   - cross product of two vectors (vector).
    */
    cross(v) {
        return this.set(this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x);
    } /* End of 'cross' function */

    /* Normalize vector function
     * ARGUMENTS: None.
     * RETURNS:
     *   - normilize vector (vector).
    */
    normalize() {
        let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.div(len);
        return this;
    }

    magnitude(v) {
        if (v === undefined) return this.length();

        let x = v.x - this.x,
            y = v.y - this.y,
            z = v.z - this.z;

        return vec3(x, y, x).length();
    }

    radians(degrees) {
        return degrees * Math.PI / 180.0;
    }
    
    toArray() {
        return [this.x, this.y, this.z];
    }
    
    toFloatArray() {
        return new Float32Array([this.x, this.y, this.z]);
    }

    clone() {
        return vec3(this.x, this.y, this.z);
    }
}

export function vec3(...arg) {
    return new _vec3(...arg);
}