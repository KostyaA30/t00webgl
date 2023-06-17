import { webgl } from "./webgl/webgl.js";
import { camera } from "./mth/camera.js";
import { cameraController } from "./mth/camera.js";
import { gridFloor } from "./prim/gridfloor.js";
import { render } from "./render/render.js";
import { shaderBuilder } from "./render/shaders/shaders.js";
import { model } from "./prim/models.js";
import { primitivies } from "./prim/prims.js";
import { UBO } from "./render/ubo.js";
    
let gl, gRLoop, gShader, gModel, gCamera, gCameraCtrl;
let gGridFloor, aPrims, mDebugVerts, mDebugLine;

export function onLoad(idCanvas) {
    let webGL = webgl();

    gl = webGL.init(idCanvas).fitScreen(0.95, 0.9).fClear();

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

    UBO.Cache["MatTransform"].update("matProjection",gCamera.projectionMatrix);

    onReady();
}

function onReady(){
    gShader = shaderBuilder(gl)
        .prepareUniforms("uMVMatrix", "mat4")
        .prepareUniformBlocks(UBO.Cache["MatTransform"], 0)

    let cubeMesh = primitivies.cube.createMesh(gl, "cube", 1, 1, 1, 0, 0, 0, false);
    gModel = model(cubeMesh).setPosition(0,0.5,0);
    
    gRLoop.start();
}

function onRender(dt) {
    gl.fClear();
    gCamera.updateViewMatrix();
    UBO.Cache["MatTransform"].update("matCameraView", gCamera.viewMatrix.toArray());

    gGridFloor.render(gCamera);
    gShader.preRender().renderModel(gModel.preRender());
}