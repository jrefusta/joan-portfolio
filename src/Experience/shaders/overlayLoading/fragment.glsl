// Fragment Shader

// 'uAlpha' is a uniform variable passed from the application code, representing the alpha value of the overlay
uniform float uAlpha;
uniform vec3 uColor;

void main()
{
    gl_FragColor = vec4(uColor, uAlpha);
}