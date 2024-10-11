import { mat4 } from "gl-matrix";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
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
gl.clearColor(0.3, 0.3, 0.3, 1);
gl.clearDepth(1);

const vert = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
const frag = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
gl.shaderSource(
  vert,
  /* glsl */ `#version 300 es 
  uniform mat4 viewProjection;
  in vec4 POSITION;
  in vec3 NORMAL;
  out vec3 vNormal;
  void main() {
    vNormal = NORMAL;
    gl_Position = viewProjection * POSITION;
  }
`,
);
gl.shaderSource(
  frag,
  /* glsl */ `#version 300 es
  precision highp float;
  in vec3 vNormal;
  out vec4 finalColor;
  void main() {
    finalColor = vec4((vNormal + 1.f) / 2.f, 1.f);
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
const viewProjectionLoc = gl.getUniformLocation(program, "viewProjection");

const projection = mat4.create();
const view = mat4.create();
const viewProjection = mat4.create();

const vertexArray = gl.createVertexArray();
gl.bindVertexArray(vertexArray);

const elements = new Uint32Array([0, 1, 2]);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);

const position = new Float32Array([-1, 0, 0, 0, 1, 0, 1, 0, 0]);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

const normal = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, normal, gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

gl.bindVertexArray(null);

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

requestAnimationFrame(() => {
  const aspectRatio = canvas.clientWidth / canvas.clientHeight;
  mat4.perspective(projection, Math.PI / 4, aspectRatio, 0.00001, +Infinity);
  mat4.invert(view, mat4.targetTo(view, [0, 0, -1], [0, 0, 0], [0, 1, 0]));
  mat4.multiply(viewProjection, projection, view);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vertexArray);
  gl.uniformMatrix4fv(viewProjectionLoc, false, viewProjection);
  gl.frontFace(gl.CCW);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.drawElements(gl.TRIANGLES, elements.length, gl.UNSIGNED_INT, 0);
});

export {};
