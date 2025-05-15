import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelsLoader {
  private loader: GLTFLoader;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.loader = new GLTFLoader();
    this.scene = scene;
  }

  // Blaster modellerini yükle
  loadBlasterModels() {
    const modelPaths = [
      '/models/kit/blaster-a.glb',
      '/models/kit/blaster-b.glb',
      '/models/kit/blaster-c.glb',
      '/models/kit/blaster-d.glb',
    ];

    modelPaths.forEach((path) => {
      this.loadModel(path);
    });
  }

  // Karakter modellerini yükle
  loadCharacterModels() {
    const characterPath = '/models/character/kenny.glb'; // Dosya adını kendi dosyanıza göre güncelleyin
    this.loadModel(characterPath, new THREE.Vector3(0, 0.25, 0)); // Platform üzerinde konumlandır
  }

  // Genel model yükleme fonksiyonu
  private loadModel(path: string, position?: THREE.Vector3) {
    this.loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        
        // Pozisyon varsa ayarla
        if (position) {
          model.position.copy(position);
        }

        // Gölge ayarları
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(model);
        console.log(`Model başarıyla yüklendi: ${path}`);
      },
      undefined,
      (error) => {
        console.error(`Model yüklenirken bir hata oluştu: ${path}`, error);
      }
    );
  }
}
