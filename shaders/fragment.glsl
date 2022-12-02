uniform float time;
uniform float progress;
uniform sampler2D landscape;
uniform sampler2D displacement;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vNormal;
varying float vNoise;
varying vec3 eyeVector;
varying vec3 vBary;

vec2 hash22(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
  return fract(vec2(p.x * p.y * 92.9898, p.xy * p.y * 78.233));
}

void main() {
  vec3 X = dFdx(vNormal);
  vec3 Y = dFdy(vNormal);
  vec3 normal = normalize(cross(X, Y));
  float diffuse = dot(normal, vec3(1.));

  vec2 rand = hash22(vec2(floor(diffuse * 7.83)));

  vec2 uVv = vec2(sign(rand.x - 0.5) * 1. + (rand.x - 0.5) * .6, sign(rand.y - 0.5) * 1. + (-rand.y - 0.5 * 1.5) * .6);

  vec2 uv = uVv * gl_FragCoord.xy / vec2(1000.);

  vec3 refracted = refract(eyeVector, normal, 1. / 3.);
  uv += -2.2 * refracted.xy;

  // vec4 texture = texture2D(image, uv);
  // float effect = abs(asin(texture.x * u_time));
  // vec3 effect = eyeVector;
  // gl_FragColor = vec4(vec3(eyeVector), 1.0);
  vec4 displacement = texture2D(displacement, -uv.yx);
  vec2 displacementUV = vec2(uv.x, uv.y + displacement);

  displacementUV.y = mix(vUv.y, -displacement.r - 2.2, vUv.x);

  vec4 t = texture2D(landscape, uv);
  gl_FragColor = t + displacement;
  // gl_FragColor = vec4(vBary, 1.0);
  // gl_FragColor = vec4(eyeVector, 1.);
}