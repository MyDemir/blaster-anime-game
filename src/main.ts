import { createScene } from './Game.ts';

const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
const scene = createScene(canvas);

// İleride buraya oyun döngüsü, input kontrolleri, model yükleme vs. eklenecek
