import * as THREE from 'three';
import { loadGLBModel } from './utils/loadModels';

export class Game {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  light: THREE.DirectionalLight;
  ground: THREE.Mesh;

  constructor() {
    // Sahne oluştur
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    // Kamera oluştur
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 6);

    // Mevcut HTML'deki canvas'ı kullan
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    // Işıklar
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(5, 10, 7);
    this.light.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Zemin
    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  async loadModels() {
    const modelPaths = [
      '/models/kit/blaster-a.glb',
      '/models/kit/blaster-b.glb',
      '/models/kit/blaster-c.glb',
      '/models/kit/blaster-d.glb',
    ];

    for (let i = 0; i < modelPaths.length; i++) {
      try {
        const model = await loadGLBModel(modelPaths[i]);
        model.position.x = i * 2 - 3;
        model.position.y = 0.5;
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
