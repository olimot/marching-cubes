import triTableURL from "./u8-tri-table-256x16.bin?url";

export const triTable = await fetch(triTableURL).then(async (res) => {
  return new Uint8Array(await res.arrayBuffer());
});

export const edgeTable = [
  0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c, 0x80c, 0x905, 0xa0f,
  0xb06, 0xc0a, 0xd03, 0xe09, 0xf00, 0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f,
  0x795, 0x69c, 0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90, 0x230,
  0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c, 0xa3c, 0xb35, 0x83f, 0x936,
  0xe3a, 0xf33, 0xc39, 0xd30, 0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5,
  0x4ac, 0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0, 0x460, 0x569,
  0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c, 0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a,
  0x963, 0xa69, 0xb60, 0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc,
  0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0, 0x650, 0x759, 0x453,
  0x55a, 0x256, 0x35f, 0x55, 0x15c, 0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53,
  0x859, 0x950, 0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc, 0xfcc,
  0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0, 0x8c0, 0x9c9, 0xac3, 0xbca,
  0xcc6, 0xdcf, 0xec5, 0xfcc, 0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9,
  0x7c0, 0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c, 0x15c, 0x55,
  0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650, 0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6,
  0xfff, 0xcf5, 0xdfc, 0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
  0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c, 0x36c, 0x265, 0x16f,
  0x66, 0x76a, 0x663, 0x569, 0x460, 0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af,
  0xaa5, 0xbac, 0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0, 0xd30,
  0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c, 0x53c, 0x435, 0x73f, 0x636,
  0x13a, 0x33, 0x339, 0x230, 0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895,
  0x99c, 0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190, 0xf00, 0xe09,
  0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c, 0x70c, 0x605, 0x50f, 0x406, 0x30a,
  0x203, 0x109, 0x0,
];

const edge0 = new Float32Array(3);
const edge1 = new Float32Array(3);
const edge2 = new Float32Array(3);
const edge3 = new Float32Array(3);
const edge4 = new Float32Array(3);
const edge5 = new Float32Array(3);
const edge6 = new Float32Array(3);
const edge7 = new Float32Array(3);
const edge8 = new Float32Array(3);
const edge9 = new Float32Array(3);
const edge10 = new Float32Array(3);
const edge11 = new Float32Array(3);
const norm0 = new Float32Array(3);
const norm1 = new Float32Array(3);
const norm2 = new Float32Array(3);
const norm3 = new Float32Array(3);
const norm4 = new Float32Array(3);
const norm5 = new Float32Array(3);
const norm6 = new Float32Array(3);
const norm7 = new Float32Array(3);
const norm8 = new Float32Array(3);
const norm9 = new Float32Array(3);
const norm10 = new Float32Array(3);
const norm11 = new Float32Array(3);
const normalEdges = [
  norm0,
  norm1,
  norm2,
  norm3,
  norm4,
  norm5,
  norm6,
  norm7,
  norm8,
  norm9,
  norm10,
  norm11,
];
const edges = [
  edge0,
  edge1,
  edge2,
  edge3,
  edge4,
  edge5,
  edge6,
  edge7,
  edge8,
  edge9,
  edge10,
  edge11,
];

function polygonize(
  data: { width: number; height: number; depth: number; src: Uint8Array },
  isolevel: number,
) {
  const positions = [];
  const normals = [];
  let vIdx = 0;
  const dz = data.width * data.height;
  const dy = data.width;
  const dx = 1;
  for (let z = 0; z < data.depth; z += 1) {
    for (let y = 0; y < data.height; y += 1) {
      for (let x = 0; x < data.width; x += 1) {
        const dataindex = x * dx + y * dy + z * dz;
        const v0 = data.src[dataindex];
        const v1 = data.src[dataindex + dx];
        const v2 = data.src[dataindex + dx + dz];
        const v3 = data.src[dataindex + dz];
        const v4 = data.src[dataindex + dy];
        const v5 = data.src[dataindex + dx + dy];
        const v6 = data.src[dataindex + dx + dy + dz];
        const v7 = data.src[dataindex + dy + dz];
        let cubeindex = 0;
        if (v0 < isolevel) cubeindex += 1;
        if (v1 < isolevel) cubeindex += 2;
        if (v2 < isolevel) cubeindex += 4;
        if (v3 < isolevel) cubeindex += 8;
        if (v4 < isolevel) cubeindex += 16;
        if (v5 < isolevel) cubeindex += 32;
        if (v6 < isolevel) cubeindex += 64;
        if (v7 < isolevel) cubeindex += 128;
        const edge = edgeTable[cubeindex];
        if (edge !== 0) {
          const norm0x = v1 - data.src[dataindex - dx];
          const norm0y = v4 - data.src[dataindex - dy];
          const norm0z = v3 - data.src[dataindex - dz];

          const norm1x = data.src[dataindex + dx * 2] - v0;
          const norm1y = v5 - data.src[dataindex + dx - dy];
          const norm1z = v2 - data.src[dataindex + dx - dz];

          const norm2x = data.src[dataindex + dx * 2 + dz] - v3;
          const norm2y = v6 - data.src[dataindex + dx - dy + dz];
          const norm2z = data.src[dataindex + dx + dz * 2] - v1;

          const norm3x = v2 - data.src[dataindex - dx + dz];
          const norm3y = v7 - data.src[dataindex - dy + dz];
          const norm3z = data.src[dataindex + dz * 2] - v0;

          const norm4x = v5 - data.src[dataindex - dx + dy];
          const norm4y = data.src[dataindex + dy * 2] - v0;
          const norm4z = v7 - data.src[dataindex + dy - dz];

          const norm5x = data.src[dataindex + dx * 2 + dy] - v4;
          const norm5y = data.src[dataindex + dx + dy * 2] - v1;
          const norm5z = v6 - data.src[dataindex + dx + dy - dz];

          const norm6x = data.src[dataindex + dx * 2 + dy + dz] - v7;
          const norm6y = data.src[dataindex + dx + dy * 2 + dz] - v2;
          const norm6z = data.src[dataindex + dx + dy + dz * 2] - v5;

          const norm7x = v6 - data.src[dataindex - dx + dy + dz];
          const norm7y = data.src[dataindex + dy * 2 + dz] - v3;
          const norm7z = data.src[dataindex + dy + dz * 2] - v4;

          if (edge & 1) {
            const mu = (isolevel - v0) / (v1 - v0);
            edge0[0] = x + mu;
            edge0[1] = y;
            edge0[2] = z;
            norm0[0] = norm0x * (1 - mu) + norm1x * mu;
            norm0[1] = norm0y * (1 - mu) + norm1y * mu;
            norm0[2] = norm0z * (1 - mu) + norm1z * mu;
          }
          if (edge & 2) {
            const mu = (isolevel - v1) / (v2 - v1);
            edge1[0] = x + 1;
            edge1[1] = y;
            edge1[2] = z + mu;
            norm1[0] = norm1x * (1 - mu) + norm2x * mu;
            norm1[1] = norm1y * (1 - mu) + norm2y * mu;
            norm1[2] = norm1z * (1 - mu) + norm2z * mu;
          }
          if (edge & 4) {
            const mu = (isolevel - v2) / (v3 - v2);
            edge2[0] = x + 1 - mu;
            edge2[1] = y;
            edge2[2] = z + 1;
            norm2[0] = norm2x * (1 - mu) + norm3x * mu;
            norm2[1] = norm2y * (1 - mu) + norm3y * mu;
            norm2[2] = norm2z * (1 - mu) + norm3z * mu;
          }
          if (edge & 8) {
            const mu = (isolevel - v3) / (v0 - v3);
            edge3[0] = x;
            edge3[1] = y;
            edge3[2] = z + 1 - mu;
            norm3[0] = norm3x * (1 - mu) + norm0x * mu;
            norm3[1] = norm3y * (1 - mu) + norm0y * mu;
            norm3[2] = norm3z * (1 - mu) + norm0z * mu;
          }
          if (edge & 16) {
            const mu = (isolevel - v4) / (v5 - v4);
            edge4[0] = x + mu;
            edge4[1] = y + 1;
            edge4[2] = z;
            norm4[0] = norm4x * (1 - mu) + norm5x * mu;
            norm4[1] = norm4y * (1 - mu) + norm5y * mu;
            norm4[2] = norm4z * (1 - mu) + norm5z * mu;
          }
          if (edge & 32) {
            const mu = (isolevel - v5) / (v6 - v5);
            edge5[0] = x + 1;
            edge5[1] = y + 1;
            edge5[2] = z + mu;
            norm5[0] = norm5x * (1 - mu) + norm6x * mu;
            norm5[1] = norm5y * (1 - mu) + norm6y * mu;
            norm5[2] = norm5z * (1 - mu) + norm6z * mu;
          }
          if (edge & 64) {
            const mu = (isolevel - v6) / (v7 - v6);
            edge6[0] = x + 1 - mu;
            edge6[1] = y + 1;
            edge6[2] = z + 1;
            norm6[0] = norm6x * (1 - mu) + norm7x * mu;
            norm6[1] = norm6y * (1 - mu) + norm7y * mu;
            norm6[2] = norm6z * (1 - mu) + norm7z * mu;
          }
          if (edge & 128) {
            const mu = (isolevel - v7) / (v4 - v7);
            edge7[0] = x;
            edge7[1] = y + 1;
            edge7[2] = z + 1 - mu;
            norm7[0] = norm7x * (1 - mu) + norm4x * mu;
            norm7[1] = norm7y * (1 - mu) + norm4y * mu;
            norm7[2] = norm7z * (1 - mu) + norm4z * mu;
          }
          if (edge & 256) {
            const mu = (isolevel - v0) / (v4 - v0);
            edge8[0] = x;
            edge8[1] = y + mu;
            edge8[2] = z;
            norm8[0] = norm0x * (1 - mu) + norm4x * mu;
            norm8[1] = norm0y * (1 - mu) + norm4y * mu;
            norm8[2] = norm0z * (1 - mu) + norm4z * mu;
          }
          if (edge & 512) {
            const mu = (isolevel - v1) / (v5 - v1);
            edge9[0] = x + 1;
            edge9[1] = y + mu;
            edge9[2] = z;
            norm9[0] = norm1x * (1 - mu) + norm5x * mu;
            norm9[1] = norm1y * (1 - mu) + norm5y * mu;
            norm9[2] = norm1z * (1 - mu) + norm5z * mu;
          }
          if (edge & 1024) {
            const mu = (isolevel - v2) / (v6 - v2);
            edge10[0] = x + 1;
            edge10[1] = y + mu;
            edge10[2] = z + 1;
            norm10[0] = norm2x * (1 - mu) + norm6x * mu;
            norm10[1] = norm2y * (1 - mu) + norm6y * mu;
            norm10[2] = norm2z * (1 - mu) + norm6z * mu;
          }
          if (edge & 2048) {
            const mu = (isolevel - v3) / (v7 - v3);
            edge11[0] = x;
            edge11[1] = y + mu;
            edge11[2] = z + 1;
            norm11[0] = norm3x * (1 - mu) + norm7x * mu;
            norm11[1] = norm3y * (1 - mu) + norm7y * mu;
            norm11[2] = norm3z * (1 - mu) + norm7z * mu;
          }

          for (let i = 0; i < 15; i++) {
            const tvIdx = triTable[(255 - cubeindex) * 16 + i];
            if (tvIdx === 255) break;
            const e = edges[tvIdx];
            const n = normalEdges[tvIdx];
            positions[vIdx] = e[0];
            normals[vIdx] = n[0];
            vIdx++;
            positions[vIdx] = e[1];
            normals[vIdx] = n[1];
            vIdx++;
            positions[vIdx] = e[2];
            normals[vIdx] = n[2];
            vIdx++;
          }
        }
      }
    }
  }

  return [new Float32Array(positions), new Float32Array(normals)];
}

export default polygonize;
