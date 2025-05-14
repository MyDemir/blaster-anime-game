// main.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let player: THREE.Object3D;
let keys: { [key: string]: boolean } = {};

init();
animate();

function init() {
  // Sahne, kamera ve renderer
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Işık
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  // Oyuncu modelini yükle
  const loader = new GLTFLoader();
  loader.load('/models/blaster.glb', (gltf) => {
    player = gltf.scene;
    player.scale.set(0.5, 0.5, 0.5);
    scene.add(player);
  });

  // Klavye dinleyicileri
  window.addEventListener('keydown', (e) => keys[e.key] = true);
  window.addEventListener('keyup', (e) => keys[e.key] = false);

  // Pencere yeniden boyutlandırıldığında
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Oyuncu hareketi (X ekseninde)
  if (player) {
    if (keys['ArrowLeft'] || keys['a']) player.position.x -= 0.1;
    if (keys['ArrowRight'] || keys['d']) player.position.x += 0.1;
    if (keys['ArrowUp'] || keys['w']) player.position.y += 0.1;
    if (keys['ArrowDown'] || keys['s']) player.position.y -= 0.1;
  }

  renderer.render(scene, camera);
}
