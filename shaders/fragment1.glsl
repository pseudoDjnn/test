uniform float time;
uniform float progress;
uniform sampler2D landscape;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 eyeVector;
varying vec3 vBary;

vec2 hash22(vec2 p) {
  p = fract(p * vec2(5.3983, 5.4427));
  p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
  return fract(vec2(p.x * p.y * 95.4337, p.x * p.y * 97.597));
}

void main() {

  float width = 1.;
  vec3 d = fwidth(vBary);
  vec3 s = smoothstep(d * (width + 0.5), d * (width - 0.5), vBary);
  float line = max(s.x, max(s.y, s.z));
  if(line < 0.1)
    discard;

  // float b = vBary;
  float widthL = .27;

  float borderX = max(step(vUv.x, widthL), step(1. - vUv.x, widthL));
  float borderY = max(step(vUv.y, widthL), step(1. - vUv.y, widthL));
  float border = max(borderX, borderY);

  // float border = max(step(b.r, widthL), step(b.g, widthL));
  vec3 color = vec3(border);

  vec3 light = vec3(0.);
  vec3 sColor = vec3(0.89, 0.98, 0.98);
  vec3 gColor = vec3(0.61, 0.54, 0.2);
  vec3 lightDirection = normalize(vec3(1., 1., 1.));
  light += dot(lightDirection, vNormal);
  light = mix(sColor, gColor, dot(lightDirection, vNormal));

  gl_FragColor = vec4(mix(vec3(1.), vec3(0.), -line), 1.0);

  gl_FragColor = vec4(light * color, 0.3);
}