import * as THREE from 'three';
import { loadCharacterModel } from './utils/loadModels';

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private waveNumber: number;
  private enemiesLeft: number;
  private playerScore: number;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    this.waveNumber = 1;
    this.enemiesLeft = 0;
    this.playerScore = 0;

    this.init();
  }

  private init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Kamera ve ışık ayarları
    this.camera.position.z = 5;
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    this.scene.add(light);

    // İlk karakter modelini yükle
    loadCharacterModel(this.scene);

    // İlk dalgayı başlat
    this.startWave();
  }

  private startWave() {
    console.log(`Dalga ${this.waveNumber} başladı!`);
    this.enemiesLeft = this.waveNumber * 5; // Dalga başına düşman sayısı
    this.spawnEnemies();
  }

  private spawnEnemies() {
    for (let i = 0; i < this.enemiesLeft; i++) {
      const enemy = this.createEnemy();
      this.scene.add(enemy);
      enemy.position.set(Math.random() * 10 - 5, Math.random() * 5, 0); // Rastgele pozisyon
    }
  }

  private createEnemy(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    return new THREE.Mesh(geometry, material);
  }

  private endWave() {
    console.log(`Dalga ${this.waveNumber} tamamlandı!`);
    this.waveNumber++;
    this.playerScore += this.waveNumber * 100; // Skor artışı
    this.startWave();
  }

  public start() {
    const animate = () => {
      requestAnimationFrame(animate);

      // Oyun döngüsü: sahneyi sürekli render et
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}
