import { defineConfig } from "vite";

export default defineConfig({
  base: "/marching-cubes/",
  root: "src",
  build: {
    target: "esnext",
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/index.html",
        cpu: "src/cpu/index.html",
        gpu: "src/gpu/index.html",
      },
    },
  },
});
