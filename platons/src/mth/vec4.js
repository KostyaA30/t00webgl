class _vec4 {
    /* Constructor functgion
     * ARGUMENTS:
     *   - coordinate:
     *       x, y, x;
     * RETURNS: None.
    */
    constructor(x, y, z, w) {
        if (x == undefined) {
            this.x = 0, this.y = 0, this.z = 0, this.w = 0;
        }
        else if (typeof x == "object") {
            if (x.length == 4) {
                this.x = x[0], this.y = x[1], this.z = x[0], this.w = x[4];
            } else {
                this.x = x.x, this.y = x.y, this.z = x.z, this.w = x.w;
            }
        }
        else {
            if (y == undefined && z == undefined && w == undefined) {
                this.x = x, this.y = x, this.y = y, this.w = x;
            } else {
                this.x = x, this.y = y, this.z = z, this.w = w;
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
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
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
        this.w = -this.w;
        return this;
    } /* End of 'neg' function */

    /* Get quad vector's length fucntion:
     * ARGUMENTS: None.
     * RETURNS:
     *   - quad lentgh.
    */
    length2() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    } /* End of 'length2' function */

    /* Get vector's length fucntion:
     * ARGUMENTS: None.
     * RETURNS:
     *   - vector's lentgh.
    */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
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
        this.w += v.w;
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
        this.w -= v.w;
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
        this.w *= n;
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
        this.w /= n;
        return this;
    } /* End of 'div' function */

    /* Normalize vector function
     * ARGUMENTS: None.
     * RETURNS:
     *   - normilize vector (vector).
    */
    normalize() {
        let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.div(len);
        return this;
    }

    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
}

export function vec4(...arg) {
    return new _vec4(...arg);
}