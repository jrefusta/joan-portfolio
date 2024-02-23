uniform float minY;
uniform float maxY;
uniform float minZ;
uniform float maxZ;
uniform sampler2D sky;
varying vec3 vPosition;
varying vec2 vUv;

vec2 scaleUV(vec2 uv, float scale) {
    float center = 0.5;
    return ((uv - center) * scale) + center;
}

void main() {
    vec2 offsetUV = vec2(vUv.x + 0.025, vUv.y - 0.0015);

    vec3 skyTexture = texture2D(sky, scaleUV(offsetUV, 15.0)).rgb;
    if (
    vPosition.y >= minY && vPosition.y <= maxY &&
    vPosition.x >= minZ && vPosition.x <= maxZ
    ) {
        gl_FragColor = vec4(skyTexture, 1.0);
    } else {
        discard;
    }
}