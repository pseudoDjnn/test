// TODO: Lights
export const light = (function () {

  const ambientLigh = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x2b241d, 0.5)
  scene.add(directionalLight);
  directionalLight.position.set(-30, 50, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.bottom = -12;
  directionalLight.shadow.camera.top = -12;
  // directctionalLight.shadow.camera.right = 12;

  // const directionalHelp = new THREE.DirectionalLightHelper(directionalLight, 5);
  // scene.add(directionalHelp);
  // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(dLightShadowHelper);

  const spotLight = new THREE.SpotLight(0x205b6c);
  scene.add(spotLight);
  spotLight.position.set(-100, 100, 0);
  spotLight.castShadow = true;
  spotLight.angle = 0.1;
  const SLHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(SLHelper);
  scene.fog = new THREE.FogExp2(0x000000, 0.01);


  // Hemispheric light
  // const upper = 0xffffff;
  // const lower = 0xffffff;
  // const light3 = new THREE.HemisphereLight(upper, lower, 3.0);
  // scene.add(light3);

  // camera.position.x = -138.25 * (Math.random(sphere, sphereMaterial) * -0.00008);
  // camera.position.z = 28.3;
  // camera.lookAt(follow);
});