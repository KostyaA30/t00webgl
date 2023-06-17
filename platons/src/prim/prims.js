import { model } from "./models.js";

let primitivies = {};

primitivies.cubeBad = class cubeBad {
    static createModel(gl) {
        return model(this.createMesh(gl));
    }
    static createMesh(gl) {
        let aVert = [
            -0.5,  0.5,  0, 0, -0.5, -0.5,  0, 0,
             0.5, -0.5,  0, 0,  0.5,  0.5,  0, 0,
             0.5,  0.5, -1, 1,  0.5, -0.5, -1, 1,
            -0.5, -0.5, -1, 1, -0.5,  0.5, -1, 1],
            aUV = [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
            aIndex = [
                0, 1, 2, 2, 3, 0, 4, 5,
                6, 6, 7, 4, 3, 2, 5, 5,
                4, 3, 7, 0, 3, 3, 4, 7,
                7, 6, 1, 1, 0, 7];
        return gl.сreateMeshVAO("cubeBad", aIndex, aVert, null, aUV, 4);
    }
}

primitivies.cube = class {
    static createModel(gl, name, keepRawData) {
        return model(primitivies.cube.createMesh(gl, name || "cube", 1, 1, 1, 0, 0, 0, keepRawData));
    }
    static createMesh(gl, name, width, height, depth, x, y, z, keepRawData) {
        let w = width * 0.5,
            h = height * 0.5,
            d = depth * 0.5;
        let x0 = x - w,
            x1 = x + w,
            y0 = y - h,
            y1 = y + h,
            z0 = z - d,
            z1 = z + d;

        let aVert = [
            x0, y1, z1, 0,  x0, y0, z1, 0,  x1, y0, z1, 0,  x1, y1, z1, 0,
            x1, y1, z0, 1,  x1, y0, z0, 1,  x0, y0, z0, 1,  x0, y1, z0, 1,
            x0, y1, z0, 2,  x0, y0, z0, 2,  x0, y0, z1, 2,  x0, y1, z1, 2,
            x0, y0, z1, 3,  x0, y0, z0, 3,  x1, y0, z0, 3,  x1, y0, z1, 3,
            x1, y1, z1, 4,  x1, y0, z1, 4,  x1, y0, z0, 4,  x1, y1, z0, 4,
            x0, y1, z0, 5,  x0, y1, z1, 5,  x1, y1, z1, 5,  x1, y1, z0, 5,
        ];

        let aIndex = [];
        for (let i = 0; i < aVert.length / 4; i += 2) {
            aIndex.push(i, i + 1, Math.floor(i / 4) * 4 + ((i + 2) % 4));
        }

        let aUV = [];
        for (let i = 0; i < 6; i++) {
            aUV.push(0, 0, 0, 1, 1, 1, 1, 0);
        }

        let aNorm = [
            0,  0, 1, 0,   0,  1, 0,  0,   1, 0, 0,  1,  0, 0, -1, 0,
            0, -1, 0, 0,  -1,  0, 0, -1,  -1, 0, 0, -1,  0, 0, -1, 0,
            0, -1, 0, 0,   0, -1, 0,  0,  -1, 0, 0, -1,  0, 0, -1, 0,
            1,  0, 0, 1,   0,  0, 1,  0,   0, 1, 0,  0,  0, 1,  0, 0,
            1,  0, 0, 1,   0,  0, 1,  0];

        let mesh = gl.createMeshVAO(name, aIndex, aVert, aNorm, aUV, 4);
        mesh.noCulling = true;

        if (keepRawData) {
            mesh.aIndex = aIndex;
            mesh.aVert = aVert;
            mesh.aNorm = aNorm;
        }

        return mesh;
    }
}

primitivies.quad = class quad {
    static createModel(gl) {
        return model(this.createMesh(gl));
    }
    static createMesh(gl) {
        let aVert = [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0],
            aUV = [0, 0, 0, 1, 1, 1, 1, 0],
            aIndex = [0, 1, 2, 2, 3, 0];
        let mesh = gl.сreateMeshVAO("quad", aIndex, aVert, null, aUV);
        mesh.noCulling = true;
        mesh.doBlending = true;
        return mesh;
    }
}

primitivies.multiQuad = class multiQuad {
    static createModel(gl) {
        return model(this.createMesh(gl));
    }
    static createMesh(gl) {
        let aIndex = [],
            aUV = [],
            aVert = [];

        for (let i = 0; i < 10; i++) {
            let size = 0.2 + 0.8 * Math.random(),
                half = size * 0.5,
                angle = Math.PI * 2 * Math.random(),
                dx = half * Math.cos(angle),
                dy = half * Math.sin(angle),
                x = -2.5 + Math.random() * 5,
                y = -2.5 + Math.random() * 5,
                z = 2.5 - Math.random() * 5,
                p = i * 4;

            aVert.push(x - dx, y + half, z - dy);
            aVert.push(x - dx, y - half, z - dy);
            aVert.push(x + dx, y - half, z + dy);
            aVert.push(x + dx, y + half, z + dy);

            aUV.push(0, 0, 0, 1, 1, 1, 1, 0);
            aIndex.push(p, p + 1, p + 2, p + 2, p + 3, p);
        }

        let mesh = gl.сreateMeshVAO("multiQuad", aIndex, aVert, null, aUV);
        mesh.noCulling = true;
        mesh.doBlending = true;
        return mesh;
    }
};

primitivies.gridAxis = class gridAxis {
    static createModel(gl, incAxis) {
        return model(this.createMesh(gl, incAxis));
    }
    static createMesh(gl, incAxis) {
        let verts = [],
            size = 2,
            div = 10.0,
            step = size / div,
            half = size / 2;

        let p;
        for (let i = 0; i <= div; i++) {
            p = -half + i * step;
            verts.push(p);
            verts.push(0);
            verts.push(half);
            verts.push(0);

            verts.push(p);
            verts.push(0);
            verts.push(-half);
            verts.push(0);

            p = half - i * step;
            verts.push(-half);
            verts.push(0);
            verts.push(p);
            verts.push(0);

            verts.push(half);
            verts.push(0);
            verts.push(p);
            verts.push(0);
        }

        if (incAxis) {
            verts.push(-1.1);
            verts.push(0);
            verts.push(0);
            verts.push(1);

            verts.push(1.1);
            verts.push(0);
            verts.push(0);
            verts.push(1);

            verts.push(0);
            verts.push(-1.1);
            verts.push(0);
            verts.push(2);

            verts.push(0);
            verts.push(1.1);
            verts.push(0);
            verts.push(2);

            verts.push(0);
            verts.push(0);
            verts.push(-1.1);
            verts.push(3);

            verts.push(0);
            verts.push(0);
            verts.push(1.1);
            verts.push(3);
        }

        let attrColorLoc = 4,
            strideLen,
            mesh = {
                drawMode: gl.LINES,
                vao: gl.createVertexArray()
            };

        mesh.vertexComponentLen = 4;
        mesh.vertexCount = verts.length / mesh.vertexComponentLen;
        strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColorLoc);

        gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, strideLen, 0);

        gl.vertexAttribPointer(attrColorLoc, 1, gl.FLOAT, false, strideLen, Float32Array.BYTES_PER_ELEMENT * 3);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.mMeshCache["grid"] = mesh;
        return mesh;
    }
}

export { primitivies };