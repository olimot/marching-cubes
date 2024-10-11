import { defineConfig } from "vite";

export default defineConfig({
  base: "/marching-cubes/",
  root: "src",
  build: {
    target: 'esnext',
    outDir: "../dist",
    emptyOutDir: true,
  },
});
