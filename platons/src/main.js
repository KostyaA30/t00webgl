import { webgl } from "./webgl/webgl.js";
import { camera } from "./mth/camera.js";
import { cameraController } from "./mth/camera.js";
import { gridFloor } from "./prim/gridfloor.js";
import { render } from "./render/render.js";
import { shaderBuilder } from "./render/shaders/shaders.js";
import { model } from "./prim/models.js";
import { primitivies } from "./prim/prims.js";
import { UBO } from "./render/ubo.js";
import { objLoader } from "./prim/objloader.js";

let gl, gRLoop, gShader, gModel, gCamera, gCameraCtrl;
let gGridFloor, aPrims, mDebugVerts, mDebugLine;

export function onLoad(idCanvas) {
    let webGL = webgl();

    gl = webGL.init(idCanvas).fFitScreen(0.95, 0.9).fClear();

    gCamera = camera(gl);
    gCamera.transform.position.set(0, 1, 3);
    gCameraCtrl = cameraController(gl, gCamera);

    gGridFloor = gridFloor(gl);
    gRLoop = render(onRender);

    UBO.create(gl,"MatTransform", 1, [
        {
            name: "matProjection",
            type:"mat4",
        },
        {
            name: "matCameraView",
            type: "mat4",
        },
    ]);

    UBO.Cache["MatTransform"].update("matProjection", gCamera.projectionMatrix.toArray());

    onReady();
}

let objMd, objMesh;

function onReady(){
    gShader = shaderBuilder(gl)
        .prepareUniforms("uMVMatrix", "mat4")
        .prepareUniformBlocks(UBO.Cache["MatTransform"], 0)

    gModel = model();
    let cubeMesh = primitivies.cube.createMesh(gl, "cube", 1, 1, 1, 0, 0, 0, false);
    let tetraMesh = primitivies.tetrahedron.createMesh(gl, "tetrahedron", 1.0, false);
    let octaMesh = primitivies.octahedron.createMesh(gl, "octahedron", 1.0, false);
    let dodMesh = primitivies.dodecahedron.createMesh(gl, "dodecahedron", false);
    let icoMesh = primitivies.icosahedron.createMesh(gl, "icosahedron", 1.0, false);
    objMd = new objLoader();
    objMd.LoadMeshFromFile(gl, "cow");
    gModel.add(cubeMesh);
    gModel.add(tetraMesh);
    gModel.add(octaMesh);
    gModel.add(dodMesh);
    gModel.add(icoMesh);
    gModel.setPosition(-4.0, 0.5, 0, 0);
    gModel.setRotation(45.0, 45.0, 45.0, 0);
    gModel.setPosition(-2.0, 0.5, 0.0, 1);
    gModel.setPosition(0.0, 0.5, 0.0, 2);
    gModel.setPosition(0.0, -1.5, 0.0, 3);
    gModel.setScale(0.05, 0.05, 0.05, 3);
    gModel.setPosition(4.0, 0.5, 0.0, 4);
    
    gRLoop.start();
}

let flg = 1;

function onRender(dt) {
    gl.fClear();
    gCamera.updateViewMatrix();
    UBO.Cache["MatTransform"].update("matCameraView", gCamera.viewMatrix.toArray());

    if (textObj !== undefined && flg) {
        objMesh = objMd.mesh;
        gModel.add(objMesh);
        gModel.setPosition(0.0, 0.0, 4.0, 5);
        gModel.setScale(0.1, 0.1, 0.1, 5);
        flg = 0;
    }

    gGridFloor.render(gCamera);
    for (let i = 0; i < gModel.transform.length; i++)
        gShader.preRender().renderModel(gModel.preRender(), false, i);
}