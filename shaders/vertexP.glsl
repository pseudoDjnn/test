uniform float time;
varying vec2 vUv;
varying vec2 vUv1;
varying vec4 vPosition;

varying vec3 vNormal;

varying vec3 vBary;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRatel;

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_PointSize = 10. * (1. / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}