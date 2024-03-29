varying vec2 vUv;
uniform vec2 uCurvature;
uniform vec2 uScreenResolution;
uniform vec2 uScanLineOpacity;
uniform vec3 uBaseColor;
uniform vec3 uColor;
uniform float uVignetteOpacity;
uniform float uBrightness;
uniform float uVignetteRoundness;
float PI = 3.1415926538;

vec2 curveRemapUV(vec2 uv)
{
    // as we near the edge of our screen apply greater distortion using a sinusoid.
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(uCurvature.x, uCurvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

vec4 scanLineIntensity(float uv, float resolution, float opacity)
{
    float intensity = sin(uv * resolution * PI * 2.0);
    intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
    return vec4(vec3(pow(intensity, opacity)), 1.0);
}

vec4 vignetteIntensity(vec2 uv, vec2 resolution, float opacity, float roundness)
{
    float intensity = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    return vec4(vec3(clamp(pow((resolution.x / roundness) * intensity, opacity), 0.0, 1.0)), 1.0);
}

void main(void)
{
    vec2 remappedUV = curveRemapUV(vec2(vUv.x, vUv.y));
    vec4 baseColor = vec4(uBaseColor, 0.00001);

    baseColor *= vignetteIntensity(remappedUV, uScreenResolution, uVignetteOpacity, uVignetteRoundness);

    baseColor *= scanLineIntensity(remappedUV.x, uScreenResolution.y, uScanLineOpacity.x);
    baseColor *= scanLineIntensity(remappedUV.y, uScreenResolution.x, uScanLineOpacity.y);

    baseColor *= vec4(vec3(uBrightness), 1.0);

    if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0){
        gl_FragColor = vec4(uColor, 0.001);
    } else {
        gl_FragColor = baseColor;
    }
}