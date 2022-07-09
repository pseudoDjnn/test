// Import CSS
// import './style.css';
// import light from "./light"
import * as THREE from "three";
// import { RBGELoader } from "three/examples/jsm/loaders/RGBELoader";
import vert from "./shaders/vertexBG.glsl";
import frag from "./shaders/fragmentBG.glsl";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import fragmentShader1 from "./shaders/fragment1.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import landscape from '/images/void.png';
import particle from '/images/alpha.png';

// Import Post Processing
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
// import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";







const renderer = new THREE.WebGLRenderer({
  // antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color('#21282a'));
renderer.setPixelRatio(window.devicePixelRatio)
// renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const controls = new OrbitControls(camera, renderer.domElement)
// controls.panSpeed = 2;
// controls.rotateSpeed = 2;
// controls.enableDamping = true;
// controls.dampingFactor = 0.2;
// controls.dampingFactor = 0.1;
// controls.autoRotate = true;
// controls.autoRotateSpeed = -0.5;
controls.target = new THREE.Vector3(15, -8, -25);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

camera.position.set(0, 0, 0)
// camera.position.offset(.5)

// Post Processing
// const composer = new EffectComposer(renderer);
// composer.addPass(new RenderPass(scene, camera));
// composer.addPass(new FilmPass(0.35, 0.025, 648, true,));
// composer.addPass(new GlitchPass());



// TODO: this is a tester when code breaks
// const boxGeometry = new THREE.BoxGeometry();
// const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);


// const textureLoader = new THREE.TextureLoader();
// const loader = new RBGELoader();
// loader.load(particle, funtion(texture), {
//   background: texture,
// });
// scene.background = textureLoader.load(spiral);
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//   spiral,
//   spiral,
//   particle,
//   particle,
//   particle,
//   particle
// ]);


const material = new THREE.ShaderMaterial({
  extensions: { derivatives: "#extension GL_OES_standard_derivatives: enable" },
  side: THREE.DoubleSide,
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() },
  },
  // wireframe: true,
  // transparent: true,
  vertexShader: vert,
  fragmentShader: frag,
});
const geometry = new THREE.SphereBufferGeometry(1.5, 32, 32);
const plane = new THREE.Mesh(geometry, material);
// scene.add(plane);

plane.rotation.x = -.4 * Math.PI;
// plane.rotation.y = .6 * Math.PI;
plane.rotation.z = 10.7 * Math.PI;
// plane.receiveShadow = true;


let t = new THREE.TextureLoader().load(landscape);
t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;

// Texture in foreground using vert and frag
const sphereGeometry = new THREE.IcosahedronGeometry(1, 1);
const sphereGeometry1 = new THREE.IcosahedronBufferGeometry(1.001, 1);

let length = sphereGeometry1.attributes.position.array.length;

let bary = [];

for (let i = 0; i < length / 3.001; i++) {
  bary.push(0, 0, .2,
    0, .5, 0,
    .9, 0.001, 0)
}

let aBary = new Float32Array(bary);
sphereGeometry1.setAttribute('aBary', new THREE.BufferAttribute(aBary, 3),);


const sphereMaterial = new THREE.ShaderMaterial({
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable"
  },
  uniforms: {
    time: { type: 'f', value: 0, },
    radius: { value: 20.0 },
    landscape: { value: new THREE.TextureLoader().load(landscape || particle) },
    resolution: { type: 'v4', value: new THREE.Vector4(), },
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    },
  },
  // wireframe: true,
  // transparent: true,
  side: THREE.DoubleSide,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});
const sphereMaterial1 = new THREE.ShaderMaterial({
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable"
  },
  uniforms: {
    time: { type: 'f', value: 0, },
    landscape: { value: new THREE.TextureLoader().load(landscape) },
    resolution: { type: 'v4', value: new THREE.Vector4(), },
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    },
  },
  // wireframe: true,
  // transparent: true,
  side: THREE.DoubleSide,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader1,
});
// TODO: 
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphere1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
scene.add(sphere);
scene.add(sphere1);
scene.environment = sphere;
scene.environment = sphere1;
sphere.position.set(0, 0, 0);
sphere1.position.set(0, 0, 0);
sphere.receiveShadow = true;
sphere.castShadow = true;
sphere1.receiveShadow = true;
sphere1.castShadow = true;

// const meshObj = new THREE.Object3D();
// meshObj.add(sphere);
// meshObj.rotateY(.0048)
// sphere.exposure = 0.705;

// TODO:sphereGeometry randomization when browser is loaded
// const { array } = sphere.geometry.attributes.position;
// for (let i = 0; i < array.length; i++) {
//   const x = array[i]
//   const y = array[i + 1]
//   const z = array[i + 2]
//   array[i + 2] = z
// }
// sphere.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([0, 0, 1]), 3))

// TODO: REMEBER ME!
// const planeGeometry = new THREE.PlaneBufferGeometry(25, 25, 128);
// const planeMaterial = new THREE.MeshStandardMaterial({
//   envMap: landscape,
//   roughness: -2,
//   metalness: 0.7,
//   color: 0xffffff,
//   side: THREE.DoubleSide,
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);
// scene.environment = sphere;
// plane.rotation.x = -.5 * Math.PI;
// plane.rotation.y = -.9 * Math.PI;
// plane.rotation.z = -.5 / Math.PI;
// plane.receiveShadow = true;


// BG
// const particlesGeometry = new THREE.BufferGeometry;
// const particlesCnt = 5000;
// const posArray = new Float32Array(particlesCnt * 3);
// for (let i = 0; i < particlesCnt * 2; i++) {
//   posArray[i] = (Math.random() - .7) * (Math.random() * -48) * (Math.random() * 2.0 * 2.0);
// }
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.014,
//   map: cross,
//   transparent: true,
//   color: 0xfdae38,
//   opacity: 0.2,

// displacementMap: beta,
// vertexColors: true,
// blending: THREE.CustomBlending,
// blendEquation: THREE.AddEquation,
// blendSrc: THREE.OneFactor,
// blendDst: THREE.OneMinusSrcAlphaFactor,

// depthTest: true,
// depthWrite: true,
// polygonOffset: true,
// polygonOffsetFactor: -1,

// color: 0x0a9797,
// emissive: 0xa17544,
// emissiveIntensity: 0.4,
// specular: 0xac372b,
// specularMap: height,
// map: alpha,
// displacementMap: height,
// displacementScale: 0.7,
// alphaMap: alpha,
// bumpMap: beta,
// bumpScale: 0.2,
// combine: THREE.MixOperation,
// reflectivity: 0.2,
// aoMap: cross,
// transparent: true,
// depthTest: false,
// depthWrite: true,
// side: THREE.DoubleSide,
// vertexColors: true,
// flatShading: THREE.FlatShading,
// refractionRatio: 1.7,
// dithering: true,
// });


// Particle assignment set random inside buffer
// particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

// const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(sphere, particlesMesh);

//TODO: Event listener to move particles when loading in and when viewer moves mouse
// document.addEventListener("mousemove", animateParticles);
// let mouseX = 0
// let mouseY = 0
// function animateParticles(event) {
//   mouseX = event.clientX
//   mouseY = event.clientY
// }
// const clock = new THREE.Clock();
// const tick = () => {
//   const elapsedTime = clock.getElapsedTime()
//   particlesMesh.rotation.z = .007 * elapsedTime

//   if (mouseX > 0) {
//     particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.000007)
//     particlesMesh.rotation.y = mouseX * (elapsedTime * 0.000003)
//   }
//   renderer.render(scene, camera)

//   window.requestAnimationFrame(tick)

// }
// tick()

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 - 1;
});

const ray_caster = new THREE.Raycaster();
// const sphereId = sphere.id;
// sphere.name = 'theSphere';


const position_clone = JSON.parse(JSON.stringify(sphere.geometry.attributes.position.array), new Float32Array);
const normals_clone = JSON.parse(JSON.stringify(sphere.geometry.attributes.position.array), new Float32Array);

let damping = .1;
let bounce = 10;
let pytha = 5 * 5 + 4 * 4 + 3 * 3;
let gorea = 8 * 8 + 15 * 15 + 17 * 17;
let thero = Math.floor(pytha + gorea, 0.7)
let count = sphere.geometry.attributes.position.count
let count1 = sphere1.geometry.attributes.position.count
// const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
// Animation loop for sphere rotation animation
function animate(time) {
  const now = Date.now() / 6144;

  for (let i = 0; i < count + count1 * 1. + 3.; i++) {
    // indices
    const ix = i * 3
    const iy = i * 3 + 1
    const iz = i * 3 + 2

    // use uvs to calculate wave
    const uX = sphere.geometry.attributes.uv.getX(i) * Math.PI * 16
    const uY = sphere.geometry.attributes.uv.getY(i) * Math.PI * 16
    // let xY = uX + uY
    // let xYz = xY * bounce - bounceSQR / count + xY * revBounce

    // calculate current vertex wave height
    const xangle = (uX + now)
    const xsin = Math.sin(xangle) * damping
    const yangle = (uY + now)
    const ycos = Math.cos(yangle) * damping

    // set new position
    sphere.geometry.attributes.position.setX(i, position_clone[ix] + normals_clone[ix] * (xsin ^ ycos))
    sphere.geometry.attributes.position.setY(i, position_clone[iy] + normals_clone[iy] * (xsin ^ ycos))
    sphere.geometry.attributes.position.setZ(i, -position_clone[iz] + normals_clone[iz] * (xsin ^ ycos))

    sphere1.geometry.attributes.position.setX(i, position_clone[ix] + normals_clone[ix] * (xsin + ycos))
    sphere1.geometry.attributes.position.setY(i, position_clone[iy] + normals_clone[iy] * (xsin + ycos))
    sphere1.geometry.attributes.position.setZ(i, position_clone[iz] + normals_clone[iz] * (xsin + ycos))
    // TODO: REMEMER ME!
    // for (let i = 0; i < -time; i++) {
    //   const x = plane.geometry.attributes.position.getY(i);
    //   const xsin = Math.sin(x + now)
    //   plane.geometry.attributes.position.setZ(i, xsin)
    // }

    // scene.rotation.x = Math.tan(-time);
    // scene.rotation.y = Math.tan(-time);

  }
  plane.geometry.computeVertexNormals();
  plane.geometry.attributes.position.needsUpdate = true
  sphere.geometry.computeVertexNormals();
  sphere.geometry.attributes.position.needsUpdate = true;
  sphere1.geometry.computeVertexNormals();
  sphere1.geometry.attributes.position.needsUpdate = true;






  // sphere.time += 0.001;
  // sphere.rotation.x = -Math.floor(time);
  // sphere.rotation.y = -Math.sin(time);

  // SAVE
  // bounce += options.speed;
  // spotLight.angle = options.angle;
  // spotLight.penumbra = options.penumbra;
  // spotLight.intensity = options.intensity;
  // SLHelper.update();


  // sphere.transform(1, 0, 0, 1, 0, -array.length);
  // sphere.rotateOnAxis(array.length * Math.PI / 180);
  // sphere.rotateOnAxis(-array.length * Math.PI / 180);


  // sphere.position.y = 10 * Math.cos(Math.sin(bounce));
  // sphere1.position.y = 10 * Math.cos(Math.sin(bounce));

  // requestAnimationFrame(animate);
  // sphere.material.uniforms.u_time.value = time / 1000;

  // ray_caster.setFromCamera(mousePosition, camera);
  // const intersects = ray_caster.intersectObjects(scene.children);
  // console.log(intersects);

  // for (let i = 0; i < intersects.length; i++) {
  //   if (intersects[i].object.id === sphereId)
  //     intersects[i].object.material.color.set(0x527bc5);

  //   if (intersects[i].object.name === 'theSphere') {
  //     intersects[i].object.rotation.x = time / 500;
  //     intersects[i].object.rotation.y = time / 500;
  //   }
  // }
  // plane2.geometry.attributes.position.array[0] = 10 * Math.random();
  // plane2.geometry.attributes.position.array[1] = 10 * Math.random();
  // plane2.geometry.attributes.position.array[2] = 10 * Math.random();
  // plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
  // plane2.geometry.attributes.position.needsUpdate = true;

  sphere.rotation.x -= .001
  sphere1.rotation.x -= .001
  sphere.rotation.y += .0005
  sphere1.rotation.y += .0005

  // sphere.rotation.y = .0064 * Math.random() * -.000512 * Math.PI * 2.0 * Math.random() * -.000512 * Math.PI * 2.0
  // sphere.rotation.z -= .00064 * (Math.random() - .000512 * 64.32131) / (Math.random() - .000000001024 * 2.0) / Math.PI * 0.048 * 48.7
  controls.update();
  // sphere.material.uniforms.time.value = clock.getElapsedTime();
  // sphere1.material.uniforms.time.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}
// animate();

//Textures
// const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(spiral);
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([spiral,
//   spiral, spiral, spiral, spiral, spiral]);
// const CubeTextureLoader = new THREE.CubeTextureLoader();

// const texture = await loader.loadAsync('./images/avatar.png');
// const alpha = loader.load('images/alpha.png');
// const height = loader.load('images/space.png');
// const charlie = loader.load('images/moon2.png');
// const beta = loader.load('images/avatar.png');
// const cross = loader.load('images/cross2.png');


// SAVE GUI 4 REFFERENCE
// const gui = new dat.GUI();
// const options = {
// sphereColor: '#ffffff',
// wireframe: false,
// speed: 0.0,
// angle: 0.21,
// penumbra: 1.,
// intensity: 1.,
// };
// gui.addColor(options, 'sphereColor').onChange(function (e) {
//   sphere.material.color.set(e);
// });
// gui.add(options, 'wireframe').onChange(function (e) { sphere.material.wireframe = e; });
// gui.add(options, 'speed', 0, 0.1);
// gui.add(options, 'angle', 0, 1);
// gui.add(options, 'penumbra', 0, 1);
// gui.add(options, 'intensity', 0, 1);

// const gridH = new THREE.GridHelper(30);
// scene.add(gridH);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
// composer.render();
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});