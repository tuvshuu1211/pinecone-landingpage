varying vec3 vColor;
varying float vTime;
varying vec2 vUv;
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main(){

    vec2 rotateUV = rotate(gl_PointCoord, 3.14 * 0.25, vec2(0.5));
    vec2 lightUvX = vec2( (rotateUV.x * 0.1) + 0.45,  rotateUV.y * 0.5 + 0.25 );
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    
    vec2 lightUvY = vec2( (rotateUV.y * 0.1) + 0.45,  rotateUV.x * 0.5 + 0.25 );
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    
    // float strength = step(0.25, lightX * lightY);
    float strength = lightX * lightY;
    // float strength = 1.0 - step(0.35, abs(distance(vec2(lightX, lightY), vec2(0.5)) - 1.0));
    // float strength = pow(lightX * lightY, 5.0);

    //Light
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = 1.0 - strength;
    // strength = pow(strength, 10.0);

    //Final Color
    vec3 color = mix(vec3( 5. / 255.), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
}