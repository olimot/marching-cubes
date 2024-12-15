import { mat4, ReadonlyVec3, vec3 } from "gl-matrix";
import rawURL from "../u8-mri-200x160x160.raw?url";
import triTableURL from "../u8-tri-table-256x16.bin?url";
import vertSrc from "./marching-cubes.vert?raw";

const triTable = await fetch(triTableURL).then(async (res) => {
  return new Uint8Array(await res.arrayBuffer());
});

const buffer = await fetch(rawURL).then((res) => res.arrayBuffer());
const original = new Uint8Array(buffer);
const field = {
  width: 200,
  height: 160,
  depth: 160,
  src: new Uint8Array(original),
};

for (let z = 0; z < field.depth; z += 1) {
  for (let y = 0; y < field.height; y += 1) {
    for (let x = 0; x < field.width; x += 1) {
      field.src[z * field.width * field.height + y * field.width + x] =
        original[
          (field.depth - y) * field.width * field.height +
            (field.depth - z) * field.width +
            x
        ];
    }
  }
}

// # setup canvas
const canvas = document.getElementById("screen") as HTMLCanvasElement;
canvas.style.touchAction = "none";

// ## setup resize handler
let resizeTask: number = 0;
new ResizeObserver(([entry]) => {
  clearTimeout(resizeTask);
  const [{ inlineSize, blockSize }] = entry.devicePixelContentBoxSize;
  const size = { width: inlineSize, height: blockSize };
  resizeTask = setTimeout(() => Object.assign(canvas, size), 150);
}).observe(canvas, { box: "content-box" });

// # setup camera
const up: ReadonlyVec3 = vec3.fromValues(0, 1, 0);
const eye = vec3.fromValues(field.width / 2, field.height / 2, field.depth * 2);
const target = vec3.fromValues(
  field.width / 2,
  field.height / 2,
  field.depth / 2,
);
const view = mat4.lookAt(mat4.create(), eye, target, up);
const projection = mat4.create();
const viewProjection = mat4.identity(mat4.create());
const invViewProj = mat4.identity(mat4.create());
const near = 0.01;
const far = 1024;
const yfov = Math.PI / 4;

function updateCameraMatrices(target = canvas) {
  const aspectRatio = target.clientWidth / target.clientHeight;
  mat4.perspective(projection, yfov, aspectRatio, near, far);
  mat4.multiply(viewProjection, projection, view);
  mat4.invert(invViewProj, viewProjection);
}

// ## add camera control
const raycastToTargetPlane = (() => {
  const temp = vec3.create();
  const temp2 = vec3.create();
  const temp3 = vec3.create();
  return (out: vec3, x: number, y: number) => {
    temp[0] = (x / canvas.clientWidth) * 2 - 1;
    temp[1] = (-y / canvas.clientHeight) * 2 + 1;
    temp[2] = -1;
    const P_0 = vec3.transformMat4(temp, temp, invViewProj);
    const N = vec3.normalize(temp2, vec3.sub(temp2, eye, target));
    const V = vec3.normalize(temp3, vec3.sub(temp3, P_0, eye));
    const d = vec3.dot(target, N);

    // $P = P_0 + \dfrac {-(P_0 \cdot N + d)} {V \cdot N}V$
    const t = -(vec3.dot(P_0, N) + d) / vec3.dot(V, N);
    return vec3.scaleAndAdd(out, P_0, V, t);
  };
})();

const onPointerEvent = (() => {
  const temp = vec3.create();
  const temp2 = vec3.create();
  const temp3 = vec3.create();
  return (e: PointerEvent) => {
    if (!e.buttons || (!e.movementX && !e.movementY)) return;
    const { offsetX: x, offsetY: y, movementX: dX, movementY: dY } = e;

    if (e.buttons & 1) {
      const r = vec3.distance(eye, target);
      const targetToEye = vec3.normalize(temp, vec3.sub(temp, eye, target));
      const dTheta = -(dX / canvas.clientWidth) * 2;
      const dPhi = -(dY / canvas.clientHeight) * 2;
      const theta = Math.atan2(targetToEye[0], targetToEye[2]) + dTheta;
      let phi = Math.acos(targetToEye[1]) + dPhi;
      phi = Math.min(Math.max(0.001, phi), Math.PI - 0.001);
      targetToEye[0] = Math.sin(phi) * Math.sin(theta);
      targetToEye[1] = Math.cos(phi);
      targetToEye[2] = Math.sin(phi) * Math.cos(theta);
      vec3.scaleAndAdd(eye, target, targetToEye, r);
    } else if (e.buttons & 2) {
      const position = raycastToTargetPlane(temp, x, y);
      const prev = raycastToTargetPlane(temp2, x - dX, y - dY);
      const delta = vec3.subtract(temp3, position, prev);
      const rDelta = -Math.sign(dX || dY) * vec3.length(delta);
      const targetToEye = vec3.sub(temp3, eye, target);
      const r = vec3.length(targetToEye);
      vec3.scaleAndAdd(eye, target, targetToEye, (r + rDelta) / r);
    } else if (e.buttons & 4) {
      const position = raycastToTargetPlane(temp, x, y);
      const prev = raycastToTargetPlane(temp2, x - dX, y - dY);
      const delta = vec3.subtract(temp3, position, prev);
      vec3.sub(target, target, delta);
      vec3.sub(eye, eye, delta);
    }

    mat4.lookAt(view, eye, target, up);
    updateCameraMatrices();
  };
})();

canvas.addEventListener("contextmenu", (e) => !e.ctrlKey && e.preventDefault());
canvas.addEventListener("pointerdown", onPointerEvent);
canvas.addEventListener("pointermove", onPointerEvent);
canvas.addEventListener("pointerup", onPointerEvent);

const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.depthFunc(gl.LEQUAL);
gl.blendFuncSeparate(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA,
  gl.ONE,
  gl.ONE_MINUS_SRC_ALPHA,
);
gl.blendEquation(gl.FUNC_ADD);
gl.colorMask(true, true, true, true);
gl.clearColor(31 / 255, 31 / 255, 31 / 255, 1);
gl.clearDepth(1);

const vert = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
const frag = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
gl.shaderSource(vert, vertSrc);
gl.shaderSource(
  frag,
  /* glsl */ `#version 300 es
  precision highp float;
  in vec3 vPosition;
  in vec3 vNormal;
  out vec4 finalColor;
  void main() {
    vec3 normal;
    normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    normal = vNormal;
    finalColor = vec4((normal + 1.f) / 2.f, 1.f);
  }
`,
);
gl.compileShader(vert);
gl.compileShader(frag);
const program = gl.createProgram() as WebGLProgram;
gl.attachShader(program, vert);
gl.attachShader(program, frag);
gl.linkProgram(program);
console.log(gl.getShaderInfoLog(vert));
console.log(gl.getShaderInfoLog(frag));

gl.useProgram(program);

const fieldSizeLoc = gl.getUniformLocation(program, "fieldSize");
const isolevelLoc = gl.getUniformLocation(program, "isolevel");
const triTableLoc = gl.getUniformLocation(program, "triTable");
const fieldLoc = gl.getUniformLocation(program, "field");
const viewProjectionLoc = gl.getUniformLocation(program, "viewProjection");

gl.uniform1f(isolevelLoc, 20);
gl.uniform3iv(fieldSizeLoc, [field.width, field.height, field.depth]);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.R8UI,
  16,
  256,
  0,
  gl.RED_INTEGER,
  gl.UNSIGNED_BYTE,
  triTable,
);
gl.uniform1i(triTableLoc, 0);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_3D, gl.createTexture());
gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
gl.texImage3D(
  gl.TEXTURE_3D,
  0,
  gl.R8UI,
  field.width,
  field.height,
  field.depth,
  0,
  gl.RED_INTEGER,
  gl.UNSIGNED_BYTE,
  field.src,
);
gl.uniform1i(fieldLoc, 1);

requestAnimationFrame(function frame(time) {
  gl.uniform1f(isolevelLoc, Math.abs(((time / 30) % 511) - 255));
  const aspectRatio = canvas.clientWidth / canvas.clientHeight;
  mat4.ortho(projection, -100, 100, -80, 80, 0, 320); // alternatively
  mat4.perspective(projection, Math.PI / 4, aspectRatio, 0.01, +Infinity);
  mat4.multiply(viewProjection, projection, view);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniformMatrix4fv(viewProjectionLoc, false, viewProjection);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  const count = (field.width - 1) * (field.height - 1) * (field.depth - 1) * 15;
  gl.drawArrays(gl.TRIANGLES, 0, count);

  requestAnimationFrame(frame);
});

Object.assign(window, {
  setIsolevel(n: number) {
    gl.uniform1f(isolevelLoc, n);
  },
});

export { };

