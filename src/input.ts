import { vec3 } from "gl-matrix";

export type InputState = {
  buttons: number;
  position: vec3;
  movement: vec3;
  delta: vec3;
  keys: Record<string, boolean>;
  wheel: number;
};

export function listenInputEvents(
  canvas: HTMLCanvasElement,
  onChange: (state: InputState) => void,
) {
  const state: InputState = {
    buttons: 0,
    position: vec3.create(),
    movement: vec3.create(),
    delta: vec3.create(),
    keys: {},
    wheel: 0,
  };

  const isMac = navigator.userAgent.includes("Mac");
  let isActive = false;

  document.addEventListener("keydown", (e) => {
    let { code } = e;
    if (isMac) code = code.replace(/^Alt/, "Control");
    state.keys[code] = true;
    canvas.requestPointerLock();
    onChange(state);
  });

  document.addEventListener("keyup", (e) => {
    let { code } = e;
    if (isMac) code = code.replace(/^Alt/, "Control");
    delete state.keys[code];

    if (state.buttons === 0 && Object.keys(state.keys).length === 0) {
      state.delta[0] = 0;
      state.delta[1] = 0;
      state.movement[0] = 0;
      state.movement[1] = 0;
      document.exitPointerLock();
    }
    onChange(state);
  });

  document.addEventListener("pointerlockchange", () => {
    isActive = document.pointerLockElement === canvas;
  });

  document.addEventListener("pointerlockerror", () => void 0);
  canvas.addEventListener("mousedown", () => canvas.requestPointerLock());
  canvas.addEventListener("mouseup", (e) => {
    if (e.buttons === 0) {
      state.delta[0] = 0;
      state.delta[1] = 0;
      state.movement[0] = 0;
      state.movement[1] = 0;

      document.exitPointerLock();
    }
    onChange(state);
  });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  const onMouseEvent = (e: {
    offsetX: number;
    offsetY: number;
    movementX: number;
    movementY: number;
    buttons?: number;
  }) => {
    if (isActive) {
      state.delta[0] = -(e.movementX / canvas.offsetWidth) * 2;
      state.delta[1] = (e.movementY / canvas.offsetHeight) * 2;
      state.movement[0] += state.delta[0];
      state.movement[1] += state.delta[1];
    } else {
      state.position[0] = (e.offsetX / canvas.offsetWidth) * 2 - 1;
      state.position[1] = 1 - (e.offsetY / canvas.offsetHeight) * 2;
    }
    if (e.buttons !== undefined) {
      state.buttons = e.buttons;
    }
    onChange(state);
  };

  canvas.addEventListener("mousedown", onMouseEvent);
  canvas.addEventListener("mouseenter", onMouseEvent);
  canvas.addEventListener("mousemove", onMouseEvent);
  canvas.addEventListener("mouseup", onMouseEvent);
  canvas.addEventListener("mouseleave", onMouseEvent);
  window.addEventListener(
    "wheel",
    ((e: WheelEvent & { wheelDelta: number }) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
      const { wheelDelta } = e as WheelEvent & { wheelDelta: number };
      let normalizedWheelDelta;
      if (wheelDelta === e.deltaY * -3) {
        normalizedWheelDelta = (e.deltaY / canvas.offsetHeight) * 2;
      } else {
        normalizedWheelDelta =
          wheelDelta / window.devicePixelRatio / window.screen.height;
      }
      state.wheel = state.wheel + normalizedWheelDelta;
      onChange(state);
    }) as EventListenerOrEventListenerObject,
    { passive: false },
  );

  return state;
}
