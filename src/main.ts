import { Game } from './Game';

const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

if (canvas) {
    const game = new Game(canvas);
} else {
    console.error('Canvas elementi bulunamadı!');
}
