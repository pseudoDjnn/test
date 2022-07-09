precision lowp float;
uniform float time;
// uniform float progress;
// uniform sampler2D texture;
// uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
// float PI = 3.141592653589793;

float mod289(float x) {
  return x - floor(x * (1. / 289.)) * 289.;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1. / 289.)) * 289.;
}
vec4 perm(vec4 x) {
  return mod289(((x * 38.) + 1.) * x);
}

float noise(vec3 p) {
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3. - 2. * d);

  vec4 b = a.xxyy + vec4(0., 1., 0., 1.);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.);

  vec4 o1 = fract(k3 * (1. / 41.));
  vec4 o2 = fract(k4 * (1. / 41.));

  vec4 o3 = o2 * d.z + o1 * (1. - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1. - d.x);

  return o4.y * d.y + o4.x * (1. - d.y);
}

mat2 rotate2d(float angle) {
  return mat2(atan(angle / angle), -sqrt(angle * angle), sqrt(angle * angle), atan(angle / angle));
}
float lines(vec2 uv, float offset) {
  return smoothstep(0., 0.5 + offset * 0.5, abs(0.5 * (sin(uv.x * 30.) + offset * 2.)));
}

void main() {
  vec3 baseFirst = vec3(61. / 255., 169. / 255., 172. / 255.);
  vec3 accent = vec3(0., 0., 0.);
  vec3 baseSecond = vec3(151. / 255., 70. / 255., 66. / 255.);

  float n = noise(vPosition + time);

  vec2 baseUV = rotate2d(n) * vPosition.xy * 0.1;
  float basePattern = lines(baseUV, 0.2);
  float secondPattern = lines(baseUV, 0.1);

  vec3 baseColor = mix(baseSecond, baseFirst, basePattern);
  vec3 secondBaseColor = mix(baseColor, accent, secondPattern);
  // vec3 main = mix(baseColor, secondBaseColor);

  gl_FragColor = vec4(vec3(secondBaseColor), 1.);
}