import { defineConfig } from "vite";

export default defineConfig({
  base: "/marching-cubes/",
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
