import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Scene } from 'three';

export class ModelsLoader {
    private loader: GLTFLoader;
    private scene: Scene;

    constructor(scene: Scene) {
        this.loader = new GLTFLoader();
        this.scene = scene;
    }

    async loadCharacterModels(): Promise<void> {
        try {
            const ninjaModel = await this.loader.loadAsync('/models/character/ninja.glb');
            const samuraiModel = await this.loader.loadAsync('/models/character/samurai.glb');

            // Model ayarlarını yap
            ninjaModel.scene.scale.set(1, 1, 1);
            samuraiModel.scene.scale.set(1, 1, 1);

            // Modelleri sakla veya işle
            // this.scene.add(ninjaModel.scene);
            // this.scene.add(samuraiModel.scene);

        } catch (error) {
            console.error('Karakter modelleri yüklenirken hata:', error);
            throw error;
        }
    }

    async loadBlasterModels(): Promise<void> {
        try {
            // Silah modellerini yükle
            const blasterModel = await this.loader.loadAsync('/models/weapons/blaster.glb');
            
            // Model ayarlarını yap
            blasterModel.scene.scale.set(1, 1, 1);

            // Modeli sakla veya işle
            // this.scene.add(blasterModel.scene);

        } catch (error) {
            console.error('Silah modelleri yüklenirken hata:', error);
            throw error;
        }
    }
}
