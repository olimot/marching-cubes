#version 300 es 

uniform highp usampler2D triTable;
uniform highp usampler3D field;
uniform mat4 viewProjection;
uniform float isolevel;
uniform ivec3 fieldSize;

out vec3 vPosition;
out vec3 vNormal;

float getScalar(ivec3 p) {
  return float(texelFetch(field, ivec3(p.x, p.y, p.z), 0).x);
}

vec4 getValue(ivec3 p) {
  vec4 value;
  value.w = getScalar(p);
  value.x = getScalar(ivec3(p.x - 1, p.y, p.z)) - getScalar(ivec3(p.x + 1, p.y, p.z));
  value.y = getScalar(ivec3(p.x, p.y - 1, p.z)) - getScalar(ivec3(p.x, p.y + 1, p.z));
  value.z = getScalar(ivec3(p.x, p.y, p.z - 1)) - getScalar(ivec3(p.x, p.y, p.z + 1));
  return value;
}

void main() {
  int width = fieldSize[0] - 1;
  int height = fieldSize[1] - 1;

  int z = gl_VertexID / (width * height * 15);
  int y = (gl_VertexID / (width * 15)) % height;
  int x = (gl_VertexID / 15) % width;
  int i = gl_VertexID % 15;

  ivec3 pos0 = ivec3(x, y, z);
  vec4 value0 = getValue(pos0);
  ivec3 pos1 = ivec3(x + 1, y, z);
  vec4 value1 = getValue(pos1);
  ivec3 pos2 = ivec3(x + 1, y, z + 1);
  vec4 value2 = getValue(pos2);
  ivec3 pos3 = ivec3(x, y, z + 1);
  vec4 value3 = getValue(pos3);
  ivec3 pos4 = ivec3(x, y + 1, z);
  vec4 value4 = getValue(pos4);
  ivec3 pos5 = ivec3(x + 1, y + 1, z);
  vec4 value5 = getValue(pos5);
  ivec3 pos6 = ivec3(x + 1, y + 1, z + 1);
  vec4 value6 = getValue(pos6);
  ivec3 pos7 = ivec3(x, y + 1, z + 1);
  vec4 value7 = getValue(pos7);

  int cubeindex = 0;
  if(value0.w < isolevel) {
    cubeindex += 1;
  }
  if(value1.w < isolevel) {
    cubeindex += 2;
  }
  if(value2.w < isolevel) {
    cubeindex += 4;
  }
  if(value3.w < isolevel) {
    cubeindex += 8;
  }
  if(value4.w < isolevel) {
    cubeindex += 16;
  }
  if(value5.w < isolevel) {
    cubeindex += 32;
  }
  if(value6.w < isolevel) {
    cubeindex += 64;
  }
  if(value7.w < isolevel) {
    cubeindex += 128;
  }

  uint tvIdx = texelFetch(triTable, ivec2(i, 255 - cubeindex), 0).x;

  if(tvIdx == 255u) {
    gl_Position = vec4(0, 0, 0, 0);
    vNormal = vec3(0, 0, 0);
  } else {
    ivec3 posA;
    ivec3 posB;
    vec4 valueA;
    vec4 valueB;
    switch(tvIdx) {
      case 0u:
        posA = pos0;
        posB = pos1;
        valueA = value0;
        valueB = value1;
        break;
      case 1u:
        posA = pos1;
        posB = pos2;
        valueA = value1;
        valueB = value2;
        break;
      case 2u:
        posA = pos2;
        posB = pos3;
        valueA = value2;
        valueB = value3;
        break;
      case 3u:
        posA = pos3;
        posB = pos0;
        valueA = value3;
        valueB = value0;
        break;
      case 4u:
        posA = pos4;
        posB = pos5;
        valueA = value4;
        valueB = value5;
        break;
      case 5u:
        posA = pos5;
        posB = pos6;
        valueA = value5;
        valueB = value6;
        break;
      case 6u:
        posA = pos6;
        posB = pos7;
        valueA = value6;
        valueB = value7;
        break;
      case 7u:
        posA = pos7;
        posB = pos4;
        valueA = value7;
        valueB = value4;
        break;
      case 8u:
        posA = pos0;
        posB = pos4;
        valueA = value0;
        valueB = value4;
        break;
      case 9u:
        posA = pos1;
        posB = pos5;
        valueA = value1;
        valueB = value5;
        break;
      case 10u:
        posA = pos2;
        posB = pos6;
        valueA = value2;
        valueB = value6;
        break;
      default:
        posA = pos3;
        posB = pos7;
        valueA = value3;
        valueB = value7;
        break;
    }

    float mu = (isolevel - valueA.w) / (valueB.w - valueA.w);
    vPosition = mix(vec3(posA), vec3(posB), mu);
    vNormal = normalize(mix(valueA.xyz, valueB.xyz, mu));
    gl_Position = viewProjection * vec4(vPosition, 1);
  }
}