import * as THREE from "three";

import vert from "./shaders/vertexBG.glsl";
import vert1 from "./shaders/vertexParticles.glsl";
import frag from "./shaders/fragmentBG.glsl";
import frag1 from "./shaders/fragmentBG1.glsl";
import vertexShader from "./shaders/vertex.glsl";
import vertexShader1 from "./shaders/vertexP.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import fragmentShader1 from "./shaders/fragment1.glsl";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GUI } from 'dat.gui';
import * as dat from "dat.gui";

import landscape from "./images/echo.png";
import displacement from "./images/void.png";

import noisetexture from "./images/fur.png";
import { Clock } from "three";
// import t from "./images/void.png";

export default class Template {
  constructor() {
    this._Init();
  }

  _Init() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._scene = new THREE.Scene();
    this.clock = new THREE.Clock();
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

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    const fov = 45;
    const aspect = 800 / 600;
    const near = 0.1;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1.001, 1000)
    this._camera.position.set(0, 0, 5);

    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    this.time = 0;
    this.isPlaying = true;
    this._backgroundMesh();
    this._foregroundMesh();
    // this.settings();
    this.render();
  }

  _backgroundMesh() {
    // let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      },
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
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      },
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

    this.geometry1 = new THREE.SphereBufferGeometry(2, 38, 38);

    this._background1 = new THREE.Mesh(this.geometry1, this.material1);

    this._scene.add(this._background);
    // this._scene.add(this._background1);
    this._background1.position.set(0.9, 0.3, -1);
    // this._background.receiveShadow = true;
  }

  _foregroundMesh() {
    // let that = this;
    let t = new THREE.TextureLoader().load(landscape);
    t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
    this.fMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        time: { type: "f", value: 0 },
        radius: { value: 20.0 },
        landscape: { value: t },
        displacement: {
          value: "t",
          value: new THREE.TextureLoader().load(displacement),
        },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      // transparent: true,
      side: THREE.DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.fGeometry = new THREE.DodecahedronBufferGeometry(1.9, 1);

    this.fShape = new THREE.Mesh(this.fGeometry, this.fMaterial);

    this.fMaterial1 = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        time: { type: "f", value: 0 },
        landscape: { value: new THREE.TextureLoader().load(landscape) },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },

      // wireframe: true,
      // transparent: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader1,
    });

    let n = [];
    let inc = Math.PI * (3 - Math.sqrt(5));
    let off = 2 / n;
    let rad = 1.7;
    let positions = new Float32Array(n * 3);
    this.fGeometry1 = new THREE.BufferGeometry();

    for (let i = 0; i < n; i++) {
      let y = i * off - 1 + off / 2;
      let r = Math.sqrt(1 - y * y);
      let phi = i * inc;

      positions[3 * i] = rad * Math.cos(phi) * r;
      positions[3 * i + 1] = rad * y;
      positions[3 * i + 2] = rad * Math.cos(phi) * r;
    }
    this.fGeometry1.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    this.fGeometry1 = new THREE.TetrahedronBufferGeometry(1.9, 3);
    let length = this.fGeometry1.attributes.position.array.length / 3;

    let bary = [];

    for (let i = 0; i < length / 3; i++) {
      bary.push(0, 0, 6, 0, 6, 0, 0, 0, 6);
    }

    let aBary = new Float32Array(bary);
    this.fGeometry1.setAttribute(
      "aBary",
      new THREE.Float32BufferAttribute(aBary, 3)
    );

    this.fShape1 = new THREE.Mesh(this.fGeometry1, this.fMaterial1);

    this._scene.add(this.fShape);
    this._scene.add(this.fShape1);
    this.fShape.position.set(0.0, 0.0, -4.1);
    this.fShape1.position.set(0.0, 0.0001, -4.1);
    // this.fShape1.position.set(1, -1, 0.5);
    // this.fShape1.rotateY = (0.006);
  }

  settings() {
    let that = this;
    (this.settings = {
      progress: 0.19,
    }),
      (this.gui = new dat.GUI());
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.automate(Clock);
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
    this.time += -0.01;
    this._background1.rotation.x = this.time;
    this._background1.rotation.y = this.time;

    this.fShape.rotation.y = this.time / 7.83;
    this.fShape1.rotation.y = this.time / 7.83;

    this.fMaterial.uniforms.time.value = this.time / 7.83;
    this.fMaterial1.uniforms.time.value = this.time / 10.93;

    this.material.uniforms.time.value = this.time / 38;
    // this.material1.uniforms.progress.value = this.settings.progress;
    this.material1.uniforms.progress.value = -this.time / 127;
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
