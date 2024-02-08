varying vec2 vUv;
varying vec3 vNormal;

uniform float shellCount;
uniform float shellIndex;
uniform float shellLength;

void main() {
  float shellHeight = shellIndex / shellCount;
  shellHeight = pow(shellHeight, 0.1);

  vec3 vPosition = position;
  vPosition += normal.xyz * shellLength * shellHeight;
  vUv = uv;
  vNormal = normalize(mat3(normalMatrix) * normal);
  float k = pow(shellHeight, 0.1);
  vPosition +=  k * 0.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}