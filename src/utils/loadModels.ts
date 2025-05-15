import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Scene } from 'three';

export class ModelsLoader {
    private loader: GLTFLoader;
    private scene: Scene;
    private models: Map<string, any>;

    constructor(scene: Scene) {
        this.loader = new GLTFLoader();
        this.scene = scene;
        this.models = new Map();
    }

    async loadCharacterModels(): Promise<void> {
        try {
            const modelPaths = {
                ninja: '/models/character/ninja.glb',
                samurai: '/models/character/samurai.glb'
            };

            console.log('Ninja modeli yükleniyor...');
            const ninjaModel = await this.loader.loadAsync(modelPaths.ninja);
            this.models.set('ninja', ninjaModel);
            console.log('Ninja modeli yüklendi');

            console.log('Samuray modeli yükleniyor...');
            const samuraiModel = await this.loader.loadAsync(modelPaths.samurai);
            this.models.set('samurai', samuraiModel);
            console.log('Samuray modeli yüklendi');

            ninjaModel.scene.scale.set(1, 1, 1);
            samuraiModel.scene.scale.set(1, 1, 1);

        } catch (error) {
            console.error('Karakter modelleri yüklenirken hata:', error);
            throw error;
        }
    }

    async loadBlasterModels(): Promise<void> {
        try {
            const blasterPath = '/models/kit/blaster.glb';

            console.log('Blaster modeli yükleniyor...');
            const blasterModel = await this.loader.loadAsync(blasterPath);
            this.models.set('blaster', blasterModel);
            console.log('Blaster modeli yüklendi');

            blasterModel.scene.scale.set(1, 1, 1);

        } catch (error) {
            console.error('Silah modelleri yüklenirken hata:', error);
            throw error;
        }
    }

    getModel(modelId: string) {
        return this.models.get(modelId);
    }
}
