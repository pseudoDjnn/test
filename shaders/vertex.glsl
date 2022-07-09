precision highp int;
uniform float time;
uniform float radius;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
varying vec3 vNormal;
varying vec3 eyeVector;
varying vec3 vBary;
attribute vec3 aBary;
float PI = 3.141592653589793;

void main() {
  vUv = uv;
  vBary = aBary;
  vNormal = normalize(normalMatrix * normal);

  // vec3 v = vec3(-delta, position.y, position.z);
  // vec3 v = vec3(delta, position.y, position.z);
  // vec3 v = position;

  // float delta = sin(position.x * time) * sin(position.y * time) + sin(time + 1.0);
  // delta /= 7.;
  // vec3 v = normalize(position) * radius + vec3(delta, position.y, position.z);
  // vec3 pos = mix(-position, -v, -delta);
  // vec4 worldPosition = modelMatrix * vec4(v, 1.0);
  // eyeVector = normalize(worldPosition.xyz - cameraPosition);

  vec3 newView = position;
  vec4 view = modelMatrix * vec4(newView, 1.0);
  eyeVector = normalize(view.xyz - cameraPosition);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}