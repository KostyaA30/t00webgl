#version 300 es
precision highp float;

in vec2 vTextureCoord;
out vec4 outputColor;

uniform float time;
uniform float aspectRatio;

#define ZOOM_LENGTH 2.0

float mandelbrot(vec2 p) 
{
    int iterations = 0;
    int max = 1000;
    vec2 c = vec2(p.x, p.y);
    
    for (int i = 0; i < 1000; i++)
    {
        p = vec2(p.x * p.x - p.y * p.y, 2.0 * p.x * p.y) + c;
        if (length(p) > 2.0)
            break;

        iterations++;
    }

    return iterations == max ? 0.0 : float(iterations) / float(max);
}

void main(void) {
    vec2 uv = vTextureCoord;
    uv.x *= aspectRatio;

    float fzoom = 0.8 + 0.30 * cos(time / ZOOM_LENGTH * 1.5);
    float zoom = pow(fzoom, ZOOM_LENGTH) - 0.24;
    
    vec2 center = vec2(-0.80, 0.18);
    uv *= zoom;
    uv += center;
    
    float c = mandelbrot(uv);
    
    vec3 color = vec3(c); 
    color.x = c * 8.0;
    color.y = c * 4.7;
    color.z = c * 3.0;
    
    outputColor = vec4(color, 1.0);
}