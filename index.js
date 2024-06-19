import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import { getSunFresnelMat } from "./src/getSunFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// start earth
const earthGroup = new THREE.Group();
earthGroup.position.x = 0

earthGroup.rotation.z = -23.4 * Math.PI / 180;
// scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(0.5, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/earth/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/earth/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/earth/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earth/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earth/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/earth/05_earthcloudmaptrans.jpg'),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

//start moon
const moonGroup = new THREE.Group();
moonGroup.position.x = - 1.5
moonGroup.position.y = 0.5
moonGroup.position.z = 1.5

moonGroup.rotation.z = -23.4 * Math.PI / 180;
// scene.add(moonGroup);

new OrbitControls(camera, renderer.domElement);
const detailMoon = 12;
const loaderMoon = new THREE.TextureLoader();
const geometryMoon = new THREE.IcosahedronGeometry(0.2, detailMoon);
const materialMoon = new THREE.MeshPhongMaterial({
  map: loaderMoon.load("./textures/moon/moonmap4k.jpg"),
  // specularMap: loaderMoon.load("./textures/moon/moonbump4k.jpg"),
  bumpMap: loaderMoon.load("./textures/moon/moonbump4k.jpg"),
  bumpScale: 0.04,
});
const moonMesh = new THREE.Mesh(geometryMoon, materialMoon);
moonGroup.add(moonMesh);

// Create a parent group for moon and earth
const celestialGroup = new THREE.Group();

celestialGroup.add(earthGroup);
celestialGroup.add(moonGroup);

// Add parent group to the scene
scene.add(celestialGroup);



// start stars
const stars = getStarfield({numStars: 2000});
scene.add(stars);

/*
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight); */


// sun
const sunGroup = new THREE.Group();
sunGroup.position.x = 0

scene.add(sunGroup);

const detailSun = 20;
const loaderSun = new THREE.TextureLoader();
const geometrySun = new THREE.IcosahedronGeometry(1.5, detailSun);
const materialSun = new THREE.MeshBasicMaterial({
  map: loaderSun.load("./textures/sun/sunmap.jpg"),
  // specularMap: loaderMoon.load("./textures/moon/moonbump4k.jpg"),
  // bumpMap: loaderSun.load("./textures/sun/sunmap.jpg"),
  bumpScale: 0.04,
});
const sunMesh = new THREE.Mesh(geometrySun, materialSun);
sunGroup.add(sunMesh);

const fresnelMatSun = getSunFresnelMat();
const glowMeshSun = new THREE.Mesh(geometrySun, fresnelMatSun);
glowMeshSun.scale.setScalar(1.0);
sunGroup.add(glowMeshSun);

const light1 = new THREE.PointLight( 0xFFF9D8, 30 );
// light1.add( new THREE.Mesh( geometrySun, new THREE.MeshBasicMaterial( { color: 0xff8f00 } ) ) );
light1.add( new THREE.Mesh( geometrySun, materialSun ) );
scene.add( light1 );


const moonOrbitRadius = 1.0; // Radius of the orbit
const moonRotationSpeed = 0.0005; // Speed of rotation

const celestialOrbitRadious =5.0;
const celestialRotationSpeed = 0.0001; 

// Animation parameters
// const sunPosition = new THREE.Vector3(0, 0, 0); // Sun's position
const earthOrbitSemiMajorAxis = 3.0; // Semi-major axis of the Earth's elliptical orbit
const earthOrbitSemiMinorAxis = 3.0; // Semi-minor axis of the Earth's elliptical orbit
// const earthOrbitRotationSpeed = 0.0005; // Speed of rotation for both earth and moon


function animate() {
  requestAnimationFrame(animate);

  
  // Update moon position to orbit around earth
  const timeMoon = Date.now() * moonRotationSpeed;
  const xMoon = Math.sin(timeMoon) * moonOrbitRadius;
  const zMoon = Math.cos(timeMoon) * moonOrbitRadius;
  moonGroup.position.set(xMoon, 0, zMoon);

  const timeCelestial = Date.now() * celestialRotationSpeed;
  const xCelestial = Math.sin(timeCelestial) * earthOrbitSemiMajorAxis;
  const zCelestial = Math.cos(timeCelestial) * earthOrbitSemiMinorAxis;

  celestialGroup.position.set(xCelestial, 0, zCelestial);
  
  celestialGroup.rotation.y += 0.0001;
  celestialGroup.rotation.x += 0.0001;



  // Rotate the moon mesh itself
  moonMesh.rotation.y += 0.0023;

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0004; 
 
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);