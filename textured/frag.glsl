#version 300 es

#ifdef GL_ES
    precision mediump float;
#endif

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
in vec2 v_TexCoord;
out vec4 out_color;

void main() {               
    vec4 color0 = texture(u_Sampler0, v_TexCoord);
    vec4 color1 = texture(u_Sampler1, v_TexCoord);
    out_color = color0 * color1;
}