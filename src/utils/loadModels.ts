import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Scene } from 'three';

export const loadCharacterModel = (scene: Scene) => {
  const loader = new GLTFLoader();

  loader.load('/models/character/character-male-c.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 1, 0);
    scene.add(model);
  }, undefined, (error) => {
    console.error('Model yüklenemedi:', error);
  });
};
