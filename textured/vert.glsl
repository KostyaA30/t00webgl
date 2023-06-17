#version 300 es
in highp vec4 a_Position;
in highp vec2 a_TexCoord;
out highp vec2 v_TexCoord;

void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
}