class _mthutil {
    static map(x, xMin, xMax, zMin, zMax) {
        return ((x - xMin) / (xMax - xMin)) * (zMax - zMin) + zMin;
    }

    static smoothStep(edge1, edge2, val) {
        let x = Math.max(0, Math.min(1, (val - edge1) / (edge2 - edge1)));
        return x * x * (3 - 2 * x);
    }
}

export class matr4 {
    m = [[], [], [], []];

    constructor (m) {
        if (m == undefined) {
            this.setIdentity();
        } else {
            if (typeof m == "object" && m.length == 4) {
                if (m[0] != undefined) {
                    this.m = m;
                } else {
                    this.m[0] = m;
                    this.m[1] = m;
                    this.m[2] = m;
                    this.m[3] = m;
                }
            } else if (typeof m == "object" && m.length == 16) {
                this.setall(...m);
            }
        }
    }

    setall(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
        matr4.setall(this.m,
             a1,  a2,  a3,  a4,
             a5,  a6,  a7,  a8,
             a9, a10, a11, a12,
            a13, a14, a15, a16);
    }

    setIdentity() {
        this.setall(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);

        return this;
    }

    translate(v) {
        if (v === undefined) {
            matr4.translate(this.m, x, y, z);
        } else {
            matr4.translate(this.m, v.x, v.y, v.z);
        }

        return this;
    }

    rotateX(rad) {
        matr4.rotateX(this.m, rad);

        return this;
    }

    rotateY(rad) {
        matr4.rotateY(this.m, rad);

        return this;
    }

    rotateZ(rad) {
        matr4.rotateZ(this.m, rad);

        return this;
    }

    scale(v3) {
        if (v3 === undefined) {
            matr4.scale(this.m, x, y, z);
        } else {
            matr4.scale(this.m, v3.x, v3.y, v3.z);
        }

        return this;
    }

    invert() {
        matr4.invert(this.m);

        return this;
    }

    resetRotation() {
        for (let i = 0; i < this.m.length; i++) {
            for (let j = 0; j < this.m[0].length; j++) {
                if (i == 3 && j < 3) continue;
                this.m[i][j] = (i * this.m[0].length + j) % 5 == 0 ? 1 : 0;
            }
        }

        return this;
    }

    reset() {
        for (let i = 0; i < this.m.length; i++) {
            for (let j = 0; j < this.m[0].length; j++) {
                this.m[i][j] = (i * this.m[0].length + j) % 5 == 0 ? 1 : 0;
            }
        }

        return this;
    }

    static perspective(out, fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);
        matr4.setall(out,
            f / aspect, 0,                   0,  0,
                     0, f,                   0,  0,
                     0, 0,   (far + near) * nf, -1,
                     0, 0, 2 * far * near * nf,  0);
    }

    static ortho(out, left, right, bottom, top, near, far) {
        let lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far);
        matr4.setall(out,
                        -2 * lr,                   0,                 0, 0,
                              0,             -2 * bt,                 0, 0,
                              0,                   0,            2 * nf, 0,
            (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);
    }

    static transpose(out, a) {
        if (a === undefined) {
            matr4.setall(out,
                out[0][0], out[1][0], out[2][0], out[3][0],
                out[0][1], out[1][1], out[2][1], out[3][1],
                out[0][2], out[1][2], out[2][2], out[3][2],
                out[0][3], out[1][3], out[2][3], out[3][3]);
        } else {
            matr4.setall(out,
                a[0][0], a[1][0], a[2][0], a[3][0],
                a[0][1], a[1][1], a[2][1], a[3][1],
                a[0][2], a[1][2], a[2][2], a[3][2],
                a[0][3], a[1][3], a[2][3], a[3][3]);
        }

        return out;
    }

    static normalMat3(out, a) {
        let a00 = a[0][0], a01 = a[0][1], a02 = a[0][2], a03 = a[0][3],
            a10 = a[1][0], a11 = a[1][1], a12 = a[1][2], a13 = a[1][3],
            a20 = a[2][0], a21 = a[2][1], a22 = a[2][2], a23 = a[2][3],
            a30 = a[3][0], a31 = a[3][1], a32 = a[3][2], a33 = a[3][3],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) return null;

        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

        return out;
    }

    static fromRotationTranslation(out, q, v) {
        let x = q[0], y = q[1], z = q[2], w = q[3],
            x2 = x + x, y2 = y + y, z2 = z + z,
            xx = x * x2, xy = x * y2, xz = x * z2,
            yy = y * y2, yz = y * z2, zz = z * z2,
            wx = w * x2, wy = w * y2, wz = w * z2;

        matr4.setall(out,
            1 - (yy + zz),       xy + wz,       xz - wy, 0,
                  xy - wz, 1 - (xx + zz),       yz + wx, 0,
                  xz + wy,       yz - wx, 1 - (xx + yy), 0,
                     v[0],          v[1],          v[2], 1);

        return out;
    }

    static getTranslation(out, mat) {
        out[0][0] = mat[3][0];
        out[0][1] = mat[3][1];
        out[0][2] = mat[3][2];

        return out;
    }

    static getScaling(out, mat) {
        let m11 = mat[0][0],
            m12 = mat[0][1],
            m13 = mat[0][2],
            m21 = mat[1][0],
            m22 = mat[1][1],
            m23 = mat[1][2],
            m31 = mat[2][0],
            m32 = mat[2][1],
            m33 = mat[2][2];
        out[0][0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
        out[0][1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
        out[0][2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

        return out;
    }

    static getRotation(out, mat) {
        let trace = mat[0][0] + mat[1][1] + mat[2][2],
            S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out[0][3] = 0.25 * S;
            out[0][0] = (mat[1][2] - mat[2][1]) / S;
            out[0][1] = (mat[2][0] - mat[0][2]) / S;
            out[0][2] = (mat[0][1] - mat[1][0]) / S;
        } else if ((mat[0][0] > mat[1][1]) & (mat[0][0] > mat[2][2])) {
            S = Math.sqrt(1.0 + mat[0][0] - mat[1][1] - mat[2][2]) * 2;
            out[0][3] = (mat[1][2] - mat[2][1]) / S;
            out[0][0] = 0.25 * S;
            out[0][1] = (mat[0][1] + mat[1][0]) / S;
            out[0][2] = (mat[2][0] + mat[0][2]) / S;
        } else if (mat[1][1] > mat[2][2]) {
            S = Math.sqrt(1.0 + mat[1][1] - mat[0][0] - mat[2][2]) * 2;
            out[0][3] = (mat[2][0] - mat[0][2]) / S;
            out[0][0] = (mat[0][1] + mat[1][0]) / S;
            out[0][1] = 0.25 * S;
            out[0][2] = (mat[1][2] + mat[2][1]) / S;
        } else {
            S = Math.sqrt(1.0 + mat[2][2] - mat[0][0] - mat[1][1]) * 2;
            out[0][3] = (mat[0][1] - mat[1][0]) / S;
            out[0][0] = (mat[2][0] + mat[0][2]) / S;
            out[0][1] = (mat[1][2] + mat[2][1]) / S;
            out[0][2] = 0.25 * S;
        }

        return out;
    }

    static multiplyVector(mat4, v) {
        let x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];
        let c1r1 = mat4[0][0],
            c2r1 = mat4[0][1],
            c3r1 = mat4[0][2],
            c4r1 = mat4[0][3],
            c1r2 = mat4[1][0],
            c2r2 = mat4[1][1],
            c3r2 = mat4[1][2],
            c4r2 = mat4[1][3],
            c1r3 = mat4[2][0],
            c2r3 = mat4[2][1],
            c3r3 = mat4[2][2],
            c4r3 = mat4[2][3],
            c1r4 = mat4[3][0],
            c2r4 = mat4[3][1],
            c3r4 = mat4[3][2],
            c4r4 = mat4[3][3];

        return [x * c1r1 + y * c1r2 + z * c1r3 + w * c1r4,
            x * c2r1 + y * c2r2 + z * c2r3 + w * c2r4,
            x * c3r1 + y * c3r2 + z * c3r3 + w * c3r4,
            x * c4r1 + y * c4r2 + z * c4r3 + w * c4r4];
    }

    static transformVec4(out, v, m) {
        out[0] = m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2] + m[3][0] * v[3];
        out[1] = m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2] + m[3][1] * v[3];
        out[2] = m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2] + m[3][2] * v[3];
        out[3] = m[0][3] * v[0] + m[1][3] * v[1] + m[2][3] * v[2] + m[3][3] * v[3];

        return out;
    }

    static mult(out, a, b) {
        let a00 = a[0][0],
            a01 = a[0][1],
            a02 = a[0][2],
            a03 = a[0][3],
            a10 = a[1][0],
            a11 = a[1][1],
            a12 = a[1][2],
            a13 = a[1][3],
            a20 = a[2][0],
            a21 = a[2][1],
            a22 = a[2][2],
            a23 = a[2][3],
            a30 = a[3][0],
            a31 = a[3][1],
            a32 = a[3][2],
            a33 = a[3][3];

        let b0 = b[0][0],
            b1 = b[0][1],
            b2 = b[0][2],
            b3 = b[0][3];
        out[0][0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[0][1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[0][2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[0][3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[1][0];
        b1 = b[1][1];
        b2 = b[1][2];
        b3 = b[1][3];
        out[1][0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1][1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[1][2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[1][3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[2][0];
        b1 = b[2][1];
        b2 = b[2][2];
        b3 = b[2][3];
        out[2][0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[2][1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2][2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[2][3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[3][0];
        b1 = b[3][1];
        b2 = b[3][2];
        b3 = b[3][3];
        out[3][0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[3][1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[3][2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3][3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        return out;
    }

    static scale(out, x, y, z) {
        out[0][0] *= x;
        out[0][1] *= x;
        out[0][2] *= x;
        out[0][3] *= x;
        out[1][0] *= y;
        out[1][1] *= y;
        out[1][2] *= y;
        out[1][3] *= y;
        out[2][0] *= z;
        out[2][1] *= z;
        out[2][2] *= z;
        out[2][3] *= z;
        return out;
    }

    static rotateY(out, rad) {
        let s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = out[0][0],
            a01 = out[0][1],
            a02 = out[0][2],
            a03 = out[0][3],
            a20 = out[2][0],
            a21 = out[2][1],
            a22 = out[2][2],
            a23 = out[2][3];

        matr4.setall(out, a00 * c - a20 * s, a01 * c - a21 * s, a02 * c - a22 * s, a03 * c - a23 * s,
            out[1][0], out[1][1], out[1][2], out[1][3],
            a00 * s + a20 * c, a01 * s + a21 * c, a02 * s + a22 * c, a03 * s + a23 * c,
            out[3][0], out[3][1], out[3][2], out[3][3]);
        return out;
    }

    static rotateX(out, rad) {
        let s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = out[1][0],
            a11 = out[1][1],
            a12 = out[1][2],
            a13 = out[1][3],
            a20 = out[2][0],
            a21 = out[2][1],
            a22 = out[2][2],
            a23 = out[2][3];

        matr4.setall(out, out[0][0], out[0][1], out[0][2], out[0][3],
            a10 * c + a20 * s, a11 * c + a21 * s, a12 * c + a22 * s, a13 * c + a23 * s,
            a20 * c - a10 * s, a21 * c - a11 * s, a22 * c - a12 * s, a23 * c - a13 * s,
            out[3][0], out[3][1], out[3][2], out[3][3]);
        return out;
    }

    static rotateZ(out, rad) {
        let s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = out[0][0],
            a01 = out[0][1],
            a02 = out[0][2],
            a03 = out[0][3],
            a10 = out[1][0],
            a11 = out[1][1],
            a12 = out[1][2],
            a13 = out[1][3];

        out[0][0] = a00 * c + a10 * s;
        out[0][1] = a01 * c + a11 * s;
        out[0][2] = a02 * c + a12 * s;
        out[0][3] = a03 * c + a13 * s;
        out[1][0] = a10 * c - a00 * s;
        out[1][1] = a11 * c - a01 * s;
        out[1][2] = a12 * c - a02 * s;
        out[1][3] = a13 * c - a03 * s;
        matr4.setall(out, a00 * c + a10 * s, a01 * c + a11 * s, a02 * c + a12 * s, a03 * c + a13 * s,
            a10 * c - a00 * s, a11 * c - a01 * s, a12 * c - a02 * s, a13 * c - a03 * s, 
            out[2][0], out[2][1], out[2][2], out[2][3],
            out[3][0], out[3][1], out[3][2], out[3][3]);
        return out;
    }

    static rotate(out, rad, axis) {
        let x = axis[0],
            y = axis[1],
            z = axis[2],
            len = Math.sqrt(x * x + y * y + z * z),
            s, c, t,
            a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23,
            b00, b01, b02, b10, b11, b12, b20, b21, b22;

        if (Math.abs(len) < 0.000001) {
            return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = out[0][0];
        a01 = out[0][1];
        a02 = out[0][2];
        a03 = out[0][3];
        a10 = out[1][0];
        a11 = out[1][1];
        a12 = out[1][2];
        a13 = out[1][3];
        a20 = out[2][0];
        a21 = out[2][1];
        a22 = out[2][2];
        a23 = out[2][3];

        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;

        matr4.setall(out,
            a00 * b00 + a10 * b01 + a20 * b02, a01 * b00 + a11 * b01 + a21 * b02,
            a02 * b00 + a12 * b01 + a22 * b02, a03 * b00 + a13 * b01 + a23 * b02,
            a00 * b10 + a10 * b11 + a20 * b12, a01 * b10 + a11 * b11 + a21 * b12,
            a02 * b10 + a12 * b11 + a22 * b12, a03 * b10 + a13 * b11 + a23 * b12,
            a00 * b20 + a10 * b21 + a20 * b22, a01 * b20 + a11 * b21 + a21 * b22,
            a02 * b20 + a12 * b21 + a22 * b22, a03 * b20 + a13 * b21 + a23 * b22,
            out[3][0], out[3][1], out[3][2], out[3][3]);
    }

    static invert(out, mat) {
        if (mat === undefined) mat = out;

        let a00 = mat[0][0],
            a01 = mat[0][1],
            a02 = mat[0][2],
            a03 = mat[0][3],
            a10 = mat[1][0],
            a11 = mat[1][1],
            a12 = mat[1][2],
            a13 = mat[1][3],
            a20 = mat[2][0],
            a21 = mat[2][1],
            a22 = mat[2][2],
            a23 = mat[2][3],
            a30 = mat[3][0],
            a31 = mat[3][1],
            a32 = mat[3][2],
            a33 = mat[3][3],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) return false;
        det = 1.0 / det;

        matr4.setall(out,
            (a11 * b11 - a12 * b10 + a13 * b09) * det,
            (a02 * b10 - a01 * b11 - a03 * b09) * det,
            (a31 * b05 - a32 * b04 + a33 * b03) * det,
            (a22 * b04 - a21 * b05 - a23 * b03) * det,
            (a12 * b08 - a10 * b11 - a13 * b07) * det,
            (a00 * b11 - a02 * b08 + a03 * b07) * det,
            (a32 * b02 - a30 * b05 - a33 * b01) * det,
            (a20 * b05 - a22 * b02 + a23 * b01) * det,
            (a10 * b10 - a11 * b08 + a13 * b06) * det,
            (a01 * b08 - a00 * b10 - a03 * b06) * det,
            (a30 * b04 - a31 * b02 + a33 * b00) * det,
            (a21 * b02 - a20 * b04 - a23 * b00) * det,
            (a11 * b07 - a10 * b09 - a12 * b06) * det,
            (a00 * b09 - a01 * b07 + a02 * b06) * det,
            (a31 * b01 - a30 * b03 - a32 * b00) * det,
            (a20 * b03 - a21 * b01 + a22 * b00) * det);

        return true;
    }

    static translate(out, x, y, z) {
        out[3][0] = out[0][0] * x + out[1][0] * y + out[2][0] * z + out[3][0];
        out[3][1] = out[0][1] * x + out[1][1] * y + out[2][1] * z + out[3][1];
        out[3][2] = out[0][2] * x + out[1][2] * y + out[2][2] * z + out[3][2];
        out[3][3] = out[0][3] * x + out[1][3] * y + out[2][3] * z + out[3][3];
    }
    
    static setall(out, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
        out[0][0]  = a1;
        out[0][1]  = a2;
        out[0][2]  = a3;
        out[0][3]  = a4;
        out[1][0]  = a5;
        out[1][1]  = a6;
        out[1][2]  = a7;
        out[1][3]  = a8;
        out[2][0]  = a9;
        out[2][1] = a10;
        out[2][2] = a11;
        out[2][3] = a12;
        out[3][0] = a13;
        out[3][1] = a14;
        out[3][2] = a15;
        out[3][3] = a16;
    }

    toArray() {
        return [].concat(...this.m);
    }
}