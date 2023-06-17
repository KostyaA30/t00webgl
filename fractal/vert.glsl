#version 300 es
        
in vec4 position;
out vec2 vTextureCoord;

void main() {
    gl_Position = position;
    vTextureCoord = vec2(position.xy);
}