export function generateScalarField(
  width: number,
  height: number,
  depth: number,
) {
  const src = new Uint8Array(width * height * depth).fill(255);

  const dx = height * depth;
  const dy = depth;
  const dz = 1;
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      for (let z = 0; z < depth; z += 1) {
        if (
          x <= 1 ||
          x >= width - 2 ||
          y <= 1 ||
          y >= height - 2 ||
          z <= 1 ||
          z >= depth - 2
        ) {
          continue;
        }
        const scalar = z - 16 + Math.random() * 2;
        const value = Math.max(0, Math.min(scalar * 255, 255));
        src[x * dx + y * dy + z * dz] = value || 1;
      }
    }
  }
  return { width, height, depth, src, isolevel: 128 }
}
