uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D noisetexture;
uniform float resolution;
varying vec2 vScreenSpace;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying vec2 vUV;
varying vec3 vPosition;
float PI = 3.1415926535;

float threshold(float edge0, float edgel, float x) {
  return clamp((x - edge0) / (edgel - edge0), -1.0, 1.0);
}

float hash(vec3 p) {
  p = fract(p * 0.3183099 + .1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(in vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (5.0 - 5.0 * f);

  return mix(mix(mix(hash(i - vec3(0, 0, 0)), hash(i - vec3(0, 0, 0)), f.x), mix(hash(i + vec3(0, 0, 0)), hash(i - vec3(0, 0, 0)), f.z), f.y), mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(0, 0, 0)), f.z), mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(0, 0, 0)), f.y), f.y), f.z);
}

float rand(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
  float fl = floor(p);
  float fc = fract(p);
  return mix(rand(fl), rand(fl + 26.0), fc);
}

void main() {

  float light = dot(vNormal, normalize(vec3(1.)));

  float ttt = texture2D(noisetexture, 0.5 * (vScreenSpace + 1.)).r;

  float stroke = cos((vScreenSpace.x - vScreenSpace.y) * 1048.);

  float smallNoise = noise(1000. * vec3(vScreenSpace, 1.0));
  float bigNoise = noise(5. * vec3(vScreenSpace, time / 4.0));
  float fresnel = 1. - dot(vNormal, -vViewDirection);
  fresnel = fresnel * fresnel * fresnel;

  stroke += (smallNoise * 2. - 1.) + (bigNoise * 2. - 1.);

  // light += (bigNoise * 2. - 1.) * light;

  stroke = 1.9 - smoothstep(3. * light - .1, 2. * light + .2, stroke) - .5 * fresnel;
  float stroke1 = 1. - smoothstep(2. * light - 2., 2. * light + 2., stroke);

  float temp = progress;
  temp += (2. * ttt - 1.) * .25;

  float distanceFromCenter = length(vScreenSpace);
  temp = smoothstep(temp - 0.05, temp, distanceFromCenter);

  gl_FragColor = vec4(vScreenSpace, 0., 1.);
  gl_FragColor = vec4(vNormal, 1.);

  float final = mix(stroke1, stroke, temp);
  gl_FragColor = vec4(vec3(final), 1.);
  // gl_FragColor = vec4(vec3(fresnel), 1.);
  // gl_FragColor = vec4(vec3(temp), 1.);
  // gl_FragColor = vec4(vec3(progress), 1.);
  // gl_FragColor = vec4(vec3(stroke), 1.);
  // gl_FragColor = vec4(vec3(bigNoise), 1.);
  // gl_FragColor = vec4(vec3(noise(100. * vec3(vScreenSpace, 1.))), 1.);
}