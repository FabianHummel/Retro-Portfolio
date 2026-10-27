#version 300 es

in vec2 a_position;
out vec2 v_texCoord;

void main() {
    // Pass positions straight through (-1 to +1 Clip Space)
    gl_Position = vec4(a_position, 0.0, 1.0);

    // Convert Clip Space coordinates (-1 to 1) to Texture Coordinates (0 to 1)
    v_texCoord = a_position * 0.5 + 0.5;

    // Flip Y axis because WebGL textures are naturally upside down
    v_texCoord.y = 1.0 - v_texCoord.y;
}
