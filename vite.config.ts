import { defineConfig } from "vite";

export default defineConfig({
  base: "/that-game-tetrominoes-fall/",
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
