
uniform float uAlpha;
uniform vec3 uColor;

void main()
{
    gl_FragColor = vec4(uColor, uAlpha);
}