uniform float uMinY;
uniform float uMaxY;
uniform float uMinZ;
uniform float uMaxZ;
uniform sampler2D uSkyTexture;
varying vec3 vPosition;
varying vec2 vUv;

vec2 scaleUV(vec2 uv, float scale) {
    float center = 0.5;
    return ((uv - center) * scale) + center;
}

void main() {
    vec2 offsetUV = vec2(vUv.x + 0.025, vUv.y - 0.0015);

    vec3 skyTexture = texture2D(uSkyTexture, scaleUV(offsetUV, 15.0)).rgb;
    if (
    vPosition.y >= uMinY && vPosition.y <= uMaxY &&
    vPosition.x >= uMinZ && vPosition.x <= uMaxZ
    ) {
        gl_FragColor = vec4(skyTexture, 1.0);
    } else {
        discard;
    }
}