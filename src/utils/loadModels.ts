import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Sahneyi oluştur
const scene = new THREE.Scene();

// Kamera oluştur
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer oluştur
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Işık ekle
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// GLTF Loader
const loader = new GLTFLoader();

// Model yolları
const modelPaths = [
  '/models/kit/blaster-a.glb',
  '/models/kit/blaster-b.glb',
  '/models/kit/blaster-c.glb',
  '/models/kit/blaster-d.glb',
];

// Modelleri yükle ve sahneye ekle
modelPaths.forEach((path) => {
  loader.load(
    path,
    (gltf) => {
      scene.add(gltf.scene);
    },
    undefined,
    (error) => {
      console.error(`Model yüklenirken bir hata oluştu: ${path}`, error);
    }
  );
});

// Sahneyi sürekli render et
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
