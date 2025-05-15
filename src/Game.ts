import * as THREE from 'three';
import { loadGLBModel } from './utils/loadModels';

export class Game {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  light: THREE.DirectionalLight;

  constructor() {
    // Sahne
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222); // Daha sinematik bir fon

    // Kamera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Canvas içinden WebGL renderer oluştur
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Işık
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(10, 10, 10).normalize();
    this.scene.add(this.light);
  }

  async loadModels() {
    const modelPaths = [
      '/models/kit/blaster-a.glb',
      '/models/kit/blaster-h.glb',
      '/models/kit/blaster-g.glb',
      '/models/kit/blaster-d.glb',
    ];

    for (let i = 0; i < modelPaths.length; i++) {
      try {
        const model = await loadGLBModel(modelPaths[i]);
        model.position.x = i * 2 - 3;
        this.scene.add(model);
      } catch (error) {
        console.error('Model yüklenirken hata:', modelPaths[i], error);
      }
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  async start() {
    await this.loadModels();
    this.animate();
  }
}
