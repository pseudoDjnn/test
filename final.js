import * as THREE from 'three';

import vert from "./shaders/vertexBG.glsl";
import vert1 from "./shaders/vertexParticles.glsl";
import frag from "./shaders/fragmentBG.glsl";
import frag1 from "./shaders/fragmentBG1.glsl";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import fragmentShader1 from "./shaders/fragment1.glsl";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
// import * as dat from 'dat.gui';

import landscape from "./images/echo.png";
import displacement from "./images/void.png";
import noisetexture from "./images/flower.jpg";
import t from "./images/void.png";




export default class Template {
  constructor() {
    this._Init();
  }

  _Init() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._scene = new THREE.Scene();
    // this.clock = new THREE.Clock();
    // this.container = options.dom;
    // this.width = this.container.offsetWidth;
    // this.height = this.container.offsetHeight;

    this._threejs.setPixelRatio(Math.min(window.devicePixelRatio));
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.setClearColor(new THREE.Color(0x21282a));
    this._threejs.physicallyCorrectLights = true;
    this._threejs.outputEncoding = THREE.sRGBEncoding;

    // this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.toneMapping = THREE.CineonToneMapping;
    // this._threejs.toneMappingExposure = 1.0;

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener("resize", () => {
      this._OnWindowResize();
    }, false);

    const fov = 75;
    const aspect = 800 / 600;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1.001, 1000)
    this._camera.position.set(0, 0, 0);


    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    this.time = 0;
    this.isPlaying = true;
    this._backgroundMesh();
    this._foregroundMesh();
    // this._Perlin();
    // this._clone();
    // this.settings();
    this.render();
  }


  _backgroundMesh() {
    // let that = this;
    this.material = new THREE.ShaderMaterial({
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

    this.geometry = new THREE.SphereBufferGeometry(8.5, 38, 38);

    this._background = new THREE.Mesh(this.geometry, this.material);

    // this._background.receiveShadow = true;


    this.material1 = new THREE.ShaderMaterial({
      extensions: { derivatives: "#extension GL_OES_standard_derivatives: enable" },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        noisetexture: { value: new THREE.TextureLoader().load(noisetexture) },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vert1,
      fragmentShader: frag1,
    });

    this.geometry1 = new THREE.SphereBufferGeometry(1, 38, 38);

    this._background1 = new THREE.Mesh(this.geometry1, this.material1);

    // this._scene.add(this._background);
    // this._scene.add(this._background1);
    this._background1.position.set(0.0, 0.0, 0)
    // this._background.receiveShadow = true;
  }




  _foregroundMesh() {
    // let that = this;
    let t = new THREE.TextureLoader().load(landscape);
    t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
    this.fMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      uniforms: {
        time: { type: 'f', value: 0, },
        radius: { value: 20.0 },
        landscape: { value: t },
        displacement: { value: "t", value: new THREE.TextureLoader().load(displacement) },
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



    this.fGeometry = new THREE.IcosahedronBufferGeometry(1.9, 1.);

    this.fShape = new THREE.Mesh(this.fGeometry, this.fMaterial);


    this.fMaterial1 = new THREE.ShaderMaterial({
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
      roughness: .34,
      metalness: .5,
      reflectivity: 1.,
      clearcoat: 0,
      // wireframe: true,
      // transparent: true,
      side: THREE.DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader1,
    });

    this.fGeometry1 = new THREE.IcosahedronBufferGeometry(1.9, 1.);
    let length = this.fGeometry1.attributes.position.array.length;


    let bary = [];

    for (let i = 0; i < length / 3.; i++) {
      bary.push(1, 1, 1.,
        0.5, 0, 0,
        1, 0.5, 0)
    }

    let aBary = new Float32Array(bary);
    this.fGeometry1.setAttribute('aBary', new THREE.BufferAttribute(aBary, 3.),);

    this.fShape1 = new THREE.Mesh(this.fGeometry1, this.fMaterial1);

    this._scene.add(this.fShape);
    this._scene.add(this.fShape1);
    this.fShape.position.set(-2.0, -1.0, -5.1);
    this.fShape1.position.set(-2.0, -1.0, -5.1);
    // this.fShape1.position.set(1, -1, 0.5);
    // this.fShape1.rotateY = (0.006);
  }


  // _Perlin() {
  //   let g = [];
  //   let n = 8;

  //   function _RUV() {
  //     let t = Math.random() * 2 * Math.PI;
  //     return {
  //       x: Math.cos(t),
  //       y: Math.sin(-t)
  //     }
  //   }
  //   for (let i = 0; i < n; i++) {
  //     let r = [];
  //     for (let j = 0; j < n; j++) {
  //       r.push(_RUV());
  //     }
  //     g.push(r);
  //   }
  //   // this.fShape.geometry.attributes.position.x = this._Perlin;
  // }




  // _clone(time) {
  //   const position_clone = JSON.parse(JSON.stringify(this.fShape.geometry.attributes.position.array), new Float32Array);
  //   const normals_clone = JSON.parse(JSON.stringify(this.fShape.geometry.attributes.position.array), new Float32Array);


  //   const position_clone1 = JSON.parse(JSON.stringify(this.fShape1.geometry.attributes.position.array), new Float32Array);
  //   const normals_clone1 = JSON.parse(JSON.stringify(this.fShape1.geometry.attributes.position.array), new Float32Array);


  //   let cols, rows;
  //   let scl = 10;
  //   let w = 1200;
  //   let h = 900;
  //   let g = [];
  //   let n = [];

  //   let translate = (w / 2, h / 2);
  //   cols = w / scl;
  //   rows = h / scl;
  //   translate = (-w / 2, -h / 2);

  //   const terrain = new Array(g, n);
  //   for (let x = 0; x < cols; x++) {
  //     for (let y = 0; y < rows - 1; y++) {
  //       terrain[x + y] = Math.random(-100, 100);
  //     }
  //   }


  //   let damping = .2;
  //   let bounce = translate;
  //   let pytha = 5 * 5 + 4 * 4 + 3 * 3;
  //   let gorea = 8 * 8 + 15 * 15 + 17 * 17;
  //   let thero = Math.floor(pytha + gorea, 0.7)
  //   let count = this.geometry.attributes.position.count
  //   let count1 = this.fShape1.geometry.attributes.position.count
  //   const now = Date.now() / 6144;

  //   for (let i = 0; i < count; i++) {
  //     for (let i = 0; i < count1 - 1; i++) {
  //       // indices
  //       const ix = i * 3
  //       const iy = i * 3 + 1
  //       const iz = i * 3 + 2

  //       // use uvs to calculate wave
  //       const uX = this.fShape.geometry.attributes.uv.getX(i) * Math.PI * 16
  //       const uY = this.fShape.geometry.attributes.uv.getY(i) * Math.PI * 16


  //       const uX1 = this.fShape1.geometry.attributes.uv.getX(i) * Math.PI * 16
  //       const uY1 = this.fShape1.geometry.attributes.uv.getY(i) * Math.PI * 16

  //       // let xY = uX + uY
  //       // let xYz = xY * bounce - bounceSQR / count + xY * revBounce

  //       // calculate current vertex wave height
  //       const xangle = (uX + now)
  //       const xsin = Math.sin(xangle) * damping
  //       const yangle = (uY + now)
  //       const ycos = Math.cos(yangle) * damping

  //       const xangle1 = (uX1 + now)
  //       const xsin1 = Math.sin(xangle1) * damping
  //       const yangle1 = (uY1 + now)
  //       const ycos1 = Math.cos(yangle1) * damping

  //       // set new position
  //       this.fShape.geometry.attributes.position.setX(i, position_clone[ix] + normals_clone[ix] * (xsin ^ ycos))
  //       this.fShape.geometry.attributes.position.setY(i, position_clone[iy] + normals_clone[iy] * (xsin ^ ycos))
  //       this.fShape.geometry.attributes.position.setZ(i, -position_clone[iz] + normals_clone[iz] * (xsin ^ ycos))

  //       this.fShape1.geometry.attributes.position.setX(i, position_clone1[ix] + normals_clone1[ix] * (xsin1 + ycos1))
  //       this.fShape1.geometry.attributes.position.setY(i, position_clone1[iy] + normals_clone1[iy] * (xsin1 + ycos1))
  //       this.fShape1.geometry.attributes.position.setZ(i, -position_clone1[iz] + normals_clone1[iz] * (xsin1 + ycos1))
  //     }
  //   }
  //   // this.fShape.geometry.computeVertexNormals();
  //   // this.fShape.geometry.attributes.position.needsUpdate = true;
  //   // this.fShape1.geometry.computeVertexNormals();
  //   // this.fShape1.geometry.attributes.position.needsUpdate = true;
  // }


  settings() {
    let that = this;
    this.settings = {
      progress: 0.19,
    },
      this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }



  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.automate()
    }
  }

  stop() {
    this.isPlaying = false;
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    if (!this.isPlaying) return;
    this.time += -0.005;
    this._background1.rotation.x = this.time;
    this._background1.rotation.y = this.time;
    this.fShape.rotation.y = this.time / -7.0;
    this.fMaterial.uniforms.time.value = this.time / 4.3;
    this.fMaterial1.uniforms.time.value = this.time / 3.6;
    this.fShape1.rotation.y = this.time / -7.0;
    this.material.uniforms.time.value = this.time / 38.;
    // this.material1.uniforms.progress.value = this.settings.progress;
    this.material1.uniforms.progress.value = -this.time / 127.;
    requestAnimationFrame(this.render.bind(this));
    // const elapsedTime = this.clock.getElapsedTime();
    // this.material.uniforms.time.value = elapsedTime;
    this._threejs.render(this._scene, this._camera);

  }
}


// new Template({
//   dom: document.getElementById("container")
// })



let _Application = null;

window.addEventListener("DOMContentLoaded", () => {
  _Application = new Template();
});
