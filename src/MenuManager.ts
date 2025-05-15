import { EventEmitter } from './EventEmitter';

export class MenuManager {
    private menus: Map<string, HTMLElement>;
    private activeMenu: string | null = null;
    private selectedCharacter: string | null = null;
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.menus = new Map();
        this.eventEmitter = eventEmitter;
        this.initializeMenus();
        this.setupEventListeners();
    }

    private initializeMenus(): void {
        this.menus.set('main', document.getElementById('main-menu')!);
        this.menus.set('character', document.getElementById('character-select')!);
        this.menus.set('scoreboard', document.getElementById('scoreboard')!);
        this.menus.set('settings', document.getElementById('settings')!);
        this.menus.set('pause', document.getElementById('pause-menu')!);
        this.menus.set('gameOver', document.getElementById('game-over')!);

        this.createCharacterGrid();
    }

    private createCharacterGrid(): void {
        const characterGrid = document.querySelector('.character-grid');
        if (!characterGrid) return;

        // Karakter listesi
        const characters = [
            {
                id: 'ninja',
                name: 'Ninja',
                stats: { speed: 90, power: 70 }
            },
            {
                id: 'samurai',
                name: 'Samuray',
                stats: { speed: 70, power: 90 }
            }
        ];

        // Karakter kartlarını oluştur
        characterGrid.innerHTML = characters.map(char => `
            <div class="character-card" data-character="${char.id}">
                <div class="character-image">
                    <img src="/models/character/${char.id}.glb" alt="${char.name}">
                </div>
                <div class="character-info">
                    <h3>${char.name}</h3>
                    <div class="character-stats">
                        <div class="stat">
                            <span class="stat-label">Hız</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${char.stats.speed}%"></div>
                            </div>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Güç</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${char.stats.power}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.setupCharacterCardListeners();
    }

    private setupCharacterCardListeners(): void {
        const cards = document.querySelectorAll('.character-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const characterId = card.getAttribute('data-character');
                if (characterId) {
                    this.selectCharacter(characterId);
                }
            });
        });
    }

    private setupEventListeners(): void {
        document.getElementById('characterSelectBtn')?.addEventListener('click', () => this.showMenu('character'));
        document.getElementById('scoreboardBtn')?.addEventListener('click', () => this.showMenu('scoreboard'));
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.showMenu('settings'));

        document.getElementById('backFromCharSelect')?.addEventListener('click', () => this.showMenu('main'));
        document.getElementById('backFromScoreboard')?.addEventListener('click', () => this.showMenu('main'));
        document.getElementById('backFromSettings')?.addEventListener('click', () => this.showMenu('main'));
    }

    public showMenu(menuId: string): void {
        if (this.activeMenu) {
            const currentMenu = this.menus.get(this.activeMenu);
            if (currentMenu) {
                currentMenu.classList.add('hidden');
            }
        }

        if (menuId !== 'none') {
            const newMenu = this.menus.get(menuId);
            if (newMenu) {
                newMenu.classList.remove('hidden');
                this.activeMenu = menuId;
            }
        } else {
            this.activeMenu = null;
        }
    }

    private selectCharacter(characterId: string): void {
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });

        const selectedCard = document.querySelector(`[data-character="${characterId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            this.selectedCharacter = characterId;
            selectedCard.classList.add('character-selected-animation');
            setTimeout(() => {
                selectedCard.classList.remove('character-selected-animation');
            }, 500);
        }
    }

    public getSelectedCharacter(): string | null {
        return this.selectedCharacter;
    }

    public updateScoreboard(scores: Array<{name: string, score: number}>): void {
        const scoreboardList = document.querySelector('.scoreboard-list');
        if (scoreboardList) {
            scoreboardList.innerHTML = scores
                .map((score, index) => `
                    <div class="score-item">
                        <span class="rank">#${index + 1}</span>
                        <span class="player-name">${score.name}</span>
                        <span class="score">${score.score}</span>
                    </div>
                `)
                .join('');
        }
    }
}
