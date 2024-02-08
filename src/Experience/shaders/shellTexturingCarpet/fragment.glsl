
varying vec2 vUv;
uniform float shellCount;
uniform float shellIndex;
uniform float density;
uniform float thickness;

float hash(uint n) {
// Integer hash adapted for GLSL from Hugo Elias
  n = (n << 13U) ^ n;
  n = n * (n * n * 15731U + 0x789221U) + 0x13763125U;
  n = (n << 13U) ^ n;
  n = n * (n * n * 15731U + 0x789221U) + 0x89abcdefU;
  return float(n & 0x7fffffffU) / float(0x7fffffff);
}

void main() {
  vec2 newUV = vUv * density;
  vec2 localUV = fract(newUV) * 2.0 - 1.0;
  float localDistanceFromCenter = length(localUV);
  uvec2 tid = uvec2(uint(newUV.x), uint(newUV.y));
  uint seed = tid.x + uint(100.0) * tid.y + uint(100.0) * uint(10.0);

  float rand = hash(seed);

  float h = shellIndex / shellCount;
  bool outsideThickness = localDistanceFromCenter > (thickness * (rand - h));
  float distanceToCenter = distance(vUv, vec2(0.5, 0.5));
  if (outsideThickness && shellIndex > 0.0 || distanceToCenter > 0.5 || rand < h) {
    discard;
  }
  else {
    vec3 color = vec3(0.7529412, 0.5424671, 0.4392157) * pow(max(h, 0.125), 0.5);
    gl_FragColor = vec4(color, 1.0) ;
  }
}