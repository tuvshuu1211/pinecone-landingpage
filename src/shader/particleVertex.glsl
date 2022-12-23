uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
// uniform vec2 uFrequency;

attribute vec3 position;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position , 1.0);
}