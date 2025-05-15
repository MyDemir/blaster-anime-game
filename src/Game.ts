import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ModelsLoader } from './utils/loadModels';
import { EventEmitter } from './utils/EventEmitter';
import { MenuManager } from './utils/MenuManager';

export class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    
    private modelsLoader: ModelsLoader;
    private eventEmitter: EventEmitter;
    private menuManager: MenuManager;
    
    private gameState = {
        isStarted: false,
        isPaused: false,
        score: 0,
        health: 100,
        ammo: 30,
        selectedCharacter: null as string | null,
        highScore: 0,
        currentUser: 'MyDemir',
        lastPlayTime: '2025-05-15 22:56:55'
    };
    
    private ui = {
        score: document.getElementById('score') as HTMLElement,
        health: document.getElementById('health') as HTMLElement,
        ammo: document.getElementById('ammo') as HTMLElement,
        uiContainer: document.getElementById('ui') as HTMLElement,
        loadingScreen: document.getElementById('loading-screen') as HTMLElement
    };
    
    private player: THREE.Object3D | null = null;
    private blasters: THREE.Object3D[] = [];
    private enemies: THREE.Object3D[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.eventEmitter = new EventEmitter();
        this.menuManager = new MenuManager(this.eventEmitter);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xbfd1e5);

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 1, 0);

        this.modelsLoader = new ModelsLoader(this.scene);

        this.setupWorld();
        this.setupEventListeners();
        this.loadHighScore();

        this.loadGameModels().then(() => {
            this.animate();
        });

        this.ui.uiContainer.classList.add('hidden');
    }

    private loadHighScore(): void {
        const savedHighScore = localStorage.getItem('highScore');
        if (savedHighScore) {
            this.gameState.highScore = parseInt(savedHighScore);
        }
    }

    private saveHighScore(): void {
        if (this.gameState.score > this.gameState.highScore) {
            this.gameState.highScore = this.gameState.score;
            localStorage.setItem('highScore', this.gameState.highScore.toString());
        }
    }

    private async loadGameModels(): Promise<void> {
        try {
            console.log('Model yükleme başlıyor...');
            await Promise.all([
                this.modelsLoader.loadCharacterModels(),
                this.modelsLoader.loadBlasterModels()
            ]);
            
            console.log('Modeller başarıyla yüklendi');
            
            if (this.ui.loadingScreen) {
                this.ui.loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    if (this.ui.loadingScreen) {
                        this.ui.loadingScreen.style.display = 'none';
                    }
                    this.menuManager.showMenu('main');
                }, 500);
            }
        } catch (error) {
            console.error('Model yükleme hatası:', error);
            const loadingContent = this.ui.loadingScreen?.querySelector('.loading-content');
            const loadingSpinner = this.ui.loadingScreen?.querySelector('.loading-spinner');
            const loadingText = this.ui.loadingScreen?.querySelector('.loading-text');
            
            if (loadingSpinner) {
                loadingSpinner.remove();
            }
            
            if (loadingText) {
                loadingText.textContent = 'Yükleme hatası! Lütfen sayfayı yenileyin.';
                loadingText.classList.add('error-text');
            }
        }
    }

    private setupWorld(): void {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
        
        this.scene.add(dirLight);

        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(10, 0.5, 10),
            new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.7,
                metalness: 0.1
            })
        );
        
        platform.receiveShadow = true;
        platform.position.y = -0.25;
        this.scene.add(platform);
    }

    private setupEventListeners(): void {
        window.addEventListener('resize', () => this.onWindowResize());
        
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        this.eventEmitter.on('playerDamage', (damage: number) => {
            this.gameState.health -= damage;
            this.updateUI();
            if (this.gameState.health <= 0) {
                this.endGame();
            }
        });

        this.eventEmitter.on('scoreUpdate', (points: number) => {
            this.gameState.score += points;
            this.updateUI();
        });

        document.getElementById('startBtn')?.addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('resumeBtn')?.addEventListener('click', () => {
            this.resumeGame();
        });

        document.getElementById('restartBtn')?.addEventListener('click', () => {
            this.restartGame();
        });

        document.getElementById('exitToMainBtn')?.addEventListener('click', () => {
            this.exitToMain();
        });
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (!this.gameState.isStarted || this.gameState.isPaused) return;
        
        switch(event.code) {
            case 'KeyW':
            case 'ArrowUp':
                // İleri hareket
                break;
            case 'KeyS':
            case 'ArrowDown':
                // Geri hareket
                break;
            case 'KeyA':
            case 'ArrowLeft':
                // Sola hareket
                break;
            case 'KeyD':
            case 'ArrowRight':
                // Sağa hareket
                break;
            case 'Space':
                // Zıplama
                break;
            case 'Escape':
                this.togglePause();
                break;
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        // Tuş bırakma işlemleri
    }

    private onMouseDown(event: MouseEvent): void {
        if (!this.gameState.isStarted || this.gameState.isPaused) return;
        
        if (event.button === 0) { // Sol tık
            this.shoot();
        }
    }

    private onMouseUp(event: MouseEvent): void {
        // Mouse bırakma işlemleri
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this.gameState.isStarted || this.gameState.isPaused) return;
        // Karakter döndürme
    }

    private startGame(): void {
        const selectedCharacter = this.menuManager.getSelectedCharacter();
        if (!selectedCharacter) {
            alert('Lütfen bir karakter seçin!');
            this.menuManager.showMenu('character');
            return;
        }

        this.gameState.isStarted = true;
        this.gameState.isPaused = false;
        this.gameState.score = 0;
        this.gameState.health = 100;
        this.gameState.ammo = 30;
        
        this.ui.uiContainer.classList.remove('hidden');
        this.menuManager.showMenu('none');
        this.updateUI();
    }

    private resumeGame(): void {
        this.gameState.isPaused = false;
        this.menuManager.showMenu('none');
    }

    private restartGame(): void {
        this.saveHighScore();
        this.startGame();
    }

    private exitToMain(): void {
        this.gameState.isStarted = false;
        this.gameState.isPaused = false;
        this.saveHighScore();
        this.ui.uiContainer.classList.add('hidden');
        this.menuManager.showMenu('main');
    }

    private endGame(): void {
        this.gameState.isStarted = false;
        this.saveHighScore();
        
        const finalScoreElement = document.getElementById('final-score');
        const highScoreElement = document.getElementById('high-score');
        if (finalScoreElement) {
            finalScoreElement.textContent = `Skor: ${this.gameState.score}`;
        }
        if (highScoreElement) {
            highScoreElement.textContent = `En Yüksek Skor: ${this.gameState.highScore}`;
        }
        
        this.menuManager.showMenu('gameOver');
    }

    private shoot(): void {
        if (this.gameState.ammo <= 0) {
            this.eventEmitter.emit('outOfAmmo');
            return;
        }
        
        this.gameState.ammo--;
        this.eventEmitter.emit('weaponFired', this.gameState.ammo);
        this.updateUI();
    }

    private togglePause(): void {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            this.menuManager.showMenu('pause');
        } else {
            this.menuManager.showMenu('none');
        }
    }

    private updateUI(): void {
        this.ui.score.textContent = `Skor: ${this.gameState.score}`;
        this.ui.health.textContent = `Can: ${this.gameState.health}`;
        this.ui.ammo.textContent = `Mermi: ${this.gameState.ammo}`;

        // Kullanıcı ve zaman bilgisini güncelle
        const userInfoDiv = document.createElement('div');
        userInfoDiv.classList.add('user-info');
        userInfoDiv.innerHTML = `
            <div>Oyuncu: ${this.gameState.currentUser}</div>
            <div>Tarih: ${this.gameState.lastPlayTime}</div>
        `;

        // Eğer UI panelinde bu bilgiler yoksa ekle
        const existingUserInfo = this.ui.uiContainer.querySelector('.user-info');
        if (!existingUserInfo) {
            this.ui.uiContainer.querySelector('.ui-panel')?.appendChild(userInfoDiv);
        } else {
            existingUserInfo.innerHTML = userInfoDiv.innerHTML;
        }
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        
        if (!this.gameState.isPaused && this.gameState.isStarted) {
            const deltaTime = 1/60;
            this.gameLoop(deltaTime);
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    private gameLoop(deltaTime: number): void {
        this.updatePlayerMovement(deltaTime);
        this.updateEnemies(deltaTime);
        this.checkCollisions();
    }

    private updatePlayerMovement(deltaTime: number): void {
        // Karakter hareket mantığı
    }

    private updateEnemies(deltaTime: number): void {
        // Düşman hareket mantığı
    }

    private checkCollisions(): void {
        // Çarpışma kontrol mantığı
    }
}
