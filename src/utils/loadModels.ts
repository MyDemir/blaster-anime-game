import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Sahneyi oluştur
const scene = new THREE.Scene();

// Kamera oluştur ve sahneyi görecek şekilde ayarla
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // Yukarıdan ve biraz uzaktan bakış
camera.lookAt(0, 0, 0);

// Renderer oluştur
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Işık ekle
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Yumuşak beyaz ışık
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

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
      const model = gltf.scene;
      model.position.set(0, 0, 0); // Varsayılan pozisyon
      scene.add(model);
      console.log(`Model yüklendi: ${path}`);
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
