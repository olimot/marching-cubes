import { mat4, ReadonlyVec3, vec3 } from "gl-matrix";
import { up } from "./config";

const tmp = vec3.create();
const deg = Math.PI / 180;
const eye = vec3.create();
const matrix = mat4.create();
/** Camera Rotate; Camera translation and rotation using spherical coordinate system w/ target as origin */
export function rotateOrbit(view: mat4, target: vec3, delta: ReadonlyVec3) {
  mat4.invert(matrix, view);
  mat4.getTranslation(eye, matrix);
  const radius = vec3.distance(eye, target);

  vec3.subtract(tmp, eye, target);
  const direction = vec3.scale(tmp, tmp, 1 / radius);

  const theta = Math.atan2(direction[0], direction[2]) + delta[0];
  let phi = Math.acos(direction[1]) + delta[1];
  phi = Math.min(Math.max(0 * deg + 1.01e-5, phi), 180 * deg - 1.01e-5);
  const newDirectionX = Math.sin(phi) * Math.sin(theta);
  const newDirectionY = Math.cos(phi);
  const newDirectionZ = Math.sin(phi) * Math.cos(theta);

  vec3.set(eye, newDirectionX, newDirectionY, newDirectionZ);
  vec3.scale(eye, eye, radius);
  vec3.add(eye, eye, target);
  mat4.lookAt(view, eye, target, up);
}

/** Camera Pinch; Camera translation using spherical coordinate system w/ target as origin */
export function pinchOrbit(view: mat4, target: vec3, delta: ReadonlyVec3) {
  mat4.invert(matrix, view);
  const zNear = 1e-5;
  mat4.getTranslation(eye, matrix);
  const radius = vec3.distance(eye, target);

  vec3.subtract(tmp, eye, target);
  const direction = vec3.scale(tmp, tmp, 1 / radius);

  let newRadius = radius + delta[0] * radius;
  newRadius = Math.min(Math.max(zNear, newRadius), 1024);

  vec3.scale(eye, direction, newRadius);
  vec3.add(eye, eye, target);
  mat4.lookAt(view, eye, target, up);
}

const displacement = vec3.create();
const tmpMat4 = mat4.create();

/** Grab; Camera translation of y direction */
export function moveZ(view: mat4, target: vec3, delta: ReadonlyVec3) {
  mat4.invert(matrix, view);
  const zNear = 1e-5;
  mat4.getTranslation(eye, matrix);
  const radius = vec3.distance(eye, target);

  vec3.subtract(tmp, eye, target);
  const direction = vec3.scale(tmp, tmp, 1 / radius);

  let newRadius = radius + delta[0] * radius;
  newRadius = Math.min(Math.max(zNear, newRadius), 1024);

  vec3.scale(displacement, direction, newRadius);
  vec3.add(eye, target, displacement);
  vec3.scale(displacement, direction, radius);
  vec3.subtract(target, eye, displacement);
  mat4.lookAt(view, eye, target, up);
}

/** Grab; Camera translation of xz direction */
export function moveXY(view: mat4, target: vec3, delta: ReadonlyVec3) {
  mat4.invert(matrix, view);
  mat4.getTranslation(eye, matrix);
  const radius = vec3.distance(eye, target);

  vec3.scale(displacement, delta, radius);

  const tempMatrix = mat4.copy(tmpMat4, matrix);
  tempMatrix[12] = 0;
  tempMatrix[13] = 0;
  tempMatrix[14] = 0;
  vec3.transformMat4(displacement, displacement, tempMatrix);
  vec3.add(eye, eye, displacement);
  vec3.add(target, target, displacement);
  mat4.lookAt(view, eye, target, up);
}
