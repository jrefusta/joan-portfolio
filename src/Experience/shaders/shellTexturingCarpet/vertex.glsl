varying vec2 vUv;
varying vec3 vNormal;

uniform float uShellCount;
uniform float uShellIndex;
uniform float uShellLength;

void main() {
  float shellHeight = uShellIndex / uShellCount;
  shellHeight = pow(shellHeight, 0.1);

  vec3 vPosition = position;
  vPosition += normal.xyz * uShellLength * shellHeight;
  vUv = uv;
  vNormal = normalize(mat3(normalMatrix) * normal);
  float k = pow(shellHeight, 0.1);
  vPosition +=  k * 0.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}