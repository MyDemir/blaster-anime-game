//import { createScene } from './Game';

//const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
//const scene = createScene(canvas);

// İleride buraya oyun döngüsü, input kontrolleri, model yükleme vs. eklenecek
import { Game } from './game';

const game = new Game();
game.start();
