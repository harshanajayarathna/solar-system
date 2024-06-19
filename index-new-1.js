import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// First Earth-like planet
const earthGroup1 = new THREE.Group();
earthGroup1.position.x = -2;  // Position adjustment for the first planet
scene.add(earthGroup1);

const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);

const material1 = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh1 = new THREE.Mesh(geometry, material1);
earthGroup1.add(earthMesh1);

const lightsMat1 = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh1 = new THREE.Mesh(geometry, lightsMat1);
earthGroup1.add(lightsMesh1);

const cloudsMat1 = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh1 = new THREE.Mesh(geometry, cloudsMat1);
cloudsMesh1.scale.setScalar(1.003);
earthGroup1.add(cloudsMesh1);

const fresnelMat = getFresnelMat();
const glowMesh1 = new THREE.Mesh(geometry, fresnelMat);
glowMesh1.scale.setScalar(1.01);
earthGroup1.add(glowMesh1);

// Second Earth-like planet
const earthGroup2 = new THREE.Group();
earthGroup2.position.x = 2;  // Position adjustment for the second planet
scene.add(earthGroup2);

const material2 = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),  // Use the same texture for simplicity
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh2 = new THREE.Mesh(geometry, material2);
earthGroup2.add(earthMesh2);

const lightsMat2 = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh2 = new THREE.Mesh(geometry, lightsMat2);
earthGroup2.add(lightsMesh2);

const cloudsMat2 = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh2 = new THREE.Mesh(geometry, cloudsMat2);
cloudsMesh2.scale.setScalar(1.003);
earthGroup2.add(cloudsMesh2);

// Lights and Animation (assuming you want the same for both planets)
const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  earthMesh1.rotation.y += 0.002;
  lightsMesh1.rotation.y += 0.002;
  cloudsMesh1.rotation.y += 0.0023;

  earthMesh2.rotation.y += 0.002;
  lightsMesh2.rotation.y += 0.002;
  cloudsMesh2.rotation.y += 0.0023;

  stars.rotation.y -= 0.0004;

  renderer.render(scene, camera);
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);

animate();
