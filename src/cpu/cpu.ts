import { mat4, vec3 } from "gl-matrix";
import { up } from "../config";
import { listenInputEvents } from "../input";
import polygonize from "../marching-cubes";
import { moveXY, pinchOrbit, rotateOrbit } from "../orbital";
import rawURL from "../u8-mri-200x160x160.raw?url";

const projection = mat4.create();
const target = vec3.fromValues(100, 80, 80);
const view = mat4.create();
const viewProjection = mat4.identity(mat4.create());
const buffer = await fetch(rawURL).then((res) => res.arrayBuffer());
const original = new Uint8Array(buffer);
const field = {
  width: 200,
  height: 160,
  depth: 160,
  src: new Uint8Array(original.length),
};

for (let z = 0; z < field.depth; z += 1) {
  for (let y = 0; y < field.height; y += 1) {
    for (let x = 0; x < field.width; x += 1) {
      field.src[z * field.width * field.height + y * field.width + x] =
        original[
          (field.depth - y) * field.width * field.height +
            (field.depth - z) * field.width +
            (field.width - x)
        ];
    }
  }
}

console.time("Marching Cubes");
const [position, normal] = polygonize(field, 90);
console.timeEnd("Marching Cubes");

const canvas = document.getElementById("screen") as HTMLCanvasElement;

mat4.lookAt(view, [100, 80, -320], target, up);

listenInputEvents(canvas, ({ keys, delta, buttons }) => {
  if ((keys.Space && keys.ShiftLeft) || buttons === 5) {
    rotateOrbit(view, target, delta);
  } else if ((keys.Space && keys.ControlLeft) || buttons === 6) {
    pinchOrbit(view, target, delta);
  } else if (keys.Space || buttons === 4) {
    moveXY(view, target, delta);
  } else {
    return;
  }
});

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

const vertexArray = gl.createVertexArray();
gl.bindVertexArray(vertexArray);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, normal, gl.STATIC_DRAW);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
gl.bindVertexArray(null);

const vert = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
const frag = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
gl.shaderSource(
  vert,
  /* glsl */ `#version 300 es 
  uniform mat4 viewProjection;
  in vec4 POSITION;
  in vec3 NORMAL;
  out vec3 vPosition;
  out vec3 vNormal;
  void main() {
    vPosition = POSITION.xyz;
    vNormal = normalize(NORMAL);
    gl_Position = viewProjection * POSITION;
  }
`,
);
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
gl.bindAttribLocation(program, 0, "POSITION");
gl.bindAttribLocation(program, 1, "NORMAL");
gl.linkProgram(program);
console.log(gl.getShaderInfoLog(vert));
console.log(gl.getShaderInfoLog(frag));

gl.useProgram(program);
const viewProjectionLoc = gl.getUniformLocation(program, "viewProjection");

let resizeTask: number = 0;
const observer = new ResizeObserver(([entry]) => {
  const width = entry.devicePixelContentBoxSize[0].inlineSize;
  const height = entry.devicePixelContentBoxSize[0].blockSize;
  clearTimeout(resizeTask);
  resizeTask = setTimeout(() => {
    canvas.width = width;
    canvas.height = height;
  }, 150);
});
observer.observe(canvas, { box: "content-box" });

requestAnimationFrame(function frame() {
  const aspectRatio = canvas.clientWidth / canvas.clientHeight;
  mat4.ortho(projection, -100, 100, -80, 80, 0, 320); // alternatively
  mat4.perspective(projection, Math.PI / 4, aspectRatio, 0.01, +Infinity);
  mat4.multiply(viewProjection, projection, view);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  gl.uniformMatrix4fv(viewProjectionLoc, false, viewProjection);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.bindVertexArray(vertexArray);
  gl.drawArrays(gl.TRIANGLES, 0, position.length);
  gl.bindVertexArray(null);

  requestAnimationFrame(frame);
});

export {};
