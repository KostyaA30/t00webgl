export class objLoader {
    static domToMesh(meshName, elmID, flipYUV, keepRawData) {
        var d = objLoader.parseFromDom(elmID, flipYUV);
        var mesh = gl.сreateMeshVAO(meshName, d[0], d[1], d[2], d[3], 3);

        if (keepRawData) {
            mesh.aIndex = d[0];
            mesh.aVert = d[1];
            mesh.aNorm = d[2];
        }

        return mesh;
    }

    static parseFromDom(elmID, flipYUV) {
        return objLoader.parseObjText(document.getElementById(elmID).innerHTML, flipYUV);
    }

    static parseObjText(txt, flipYUV) {
        txt = txt.trim() + "\n";

        var line,
            itm,
            ary,
            i,
            chr,
            ind,
            isQuad = false,
            aCache = [],
            cVert = [],
            cNorm = [],
            cUV = [],
            fVert = [],
            fNorm = [],
            fUV = [],
            fIndex = [],
            fIndexCnt = 0,
            posA = 0,
            posB = txt.indexOf("\n", 0);

        while (posB > posA) {
            line = txt.substring(posA, posB).trim();

            switch (line.charAt(0)) {
                case "v":
                    chr = line.charAt(1);
                    itm = line.substring(3).split(" ");
                    switch (line.charAt(1)) {
                        case " ":
                            cVert.push(parseFloat(itm[0]), parseFloat(itm[1]), parseFloat(itm[2]));
                            break;
                        case "t":
                            cUV.push(parseFloat(itm[0]), parseFloat(itm[1]));
                            break;
                        case "n":
                            cNorm.push(parseFloat(itm[0]), parseFloat(itm[1]), parseFloat(itm[2]));
                            break;
                    }
                    break;

                case "f":
                    itm = line.split(" ");
                    itm.shift();
                    isQuad = false;

                    for (i = 0; i < itm.length; i++) {
                        if (i == 3 && !isQuad) {
                            i = 2;
                            isQuad = true;
                        }

                        if (itm[i] in aCache) {
                            fIndex.push(aCache[itm[i]]);
                        } else {
                            ary = itm[i].split("/");

                            ind = (parseInt(ary[0]) - 1) * 3;
                            fVert.push(cVert[ind], cVert[ind + 1], cVert[ind + 2]);

                            ind = (parseInt(ary[2]) - 1) * 3;
                            fNorm.push(cNorm[ind], cNorm[ind + 1], cNorm[ind + 2]);

                            if (ary[1] != "") {
                                ind = (parseInt(ary[1]) - 1) * 2;
                                fUV.push(cUV[ind], !flipYUV ? cUV[ind + 1] : 1 - cUV[ind + 1]);
                            }

                            aCache[itm[i]] = fIndexCnt;
                            fIndex.push(fIndexCnt);
                            fIndexCnt++;
                        }

                        if (i == 3 && isQuad) fIndex.push(aCache[itm[0]]);
                    }
                    break;
            }

            posA = posB + 1;
            posB = txt.indexOf("\n", posA);
        }

        return [fIndex, fVert, fNorm, fUV];
    }
}