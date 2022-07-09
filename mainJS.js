// import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';





const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x21282a)

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);





const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneBufferGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -.5 * Math.PI;
plane.receiveShadow = true;

const sphereGeometry = new THREE.SphereBufferGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;





const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.1;


const directionalHelp = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalHelp);
const directionalSHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalSHelper);

const SLHelper = new THREE.SpotLightHelper(spotLight)
scene.add(SLHelper);

// scene.fog = new THREE.Fog(0x000000, 0, 200);
scene.fog = new THREE.FogExp2(0x000000, 0.01);




let step = 0;

function animate(time) {
  box.rotation.x = time / 500;
  box.rotation.y = time / 500;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  SLHelper.update();

  renderer.render(scene, camera);
}





const gui = new dat.GUI();
const options = {
  sphereColor: '#ffea00',
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};
gui.addColor(options, 'sphereColor').onChange(function (e) {
  sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function (e) { sphere.material.wireframe = e; });
gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
orbit.update();
renderer.setAnimationLoop(animate);