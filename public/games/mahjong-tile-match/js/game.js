/**
 * Mahjong Tile Match — Game Manager & State Controller
 */

class TileGame {
    constructor() {
        this.container = document.getElementById('tileContainer');
        this.trayContainer = document.getElementById('trayTiles');
        this.levelLabel = document.getElementById('levelLabel');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.tray = [];
        this.tiles = [];
        this.history = [];
        this.level = 1;
        this.score = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isAnimating = false;
        this.timerStarted = false;

        this.init();
        this.attachEvents();
    }

    init() {
        this.tray = [];
        this.tiles = [];
        this.history = [];
        this.container.innerHTML = '';
        this.trayContainer.innerHTML = '';
        if (this.levelLabel) this.levelLabel.textContent = this.level;

        if (this.level === 1) {
            this.score = 0;
            this.updateScore(0);
        }
        this.resetTimer();
        this.timerStarted = false;

        this.generateLevel(this.level);
        this.updateLockStatus();
    }

    attachEvents() {
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.onclick = () => {
                this.hideOverlay('gameOverOverlay');
                this.init();
            };
        }

        const nextLevelBtn = document.getElementById('nextLevelBtn');
        if (nextLevelBtn) {
            nextLevelBtn.onclick = () => {
                this.hideOverlay('victoryOverlay');
                this.level++;
                this.init();
            };
        }

        const undoBtn = document.getElementById('undoBtn');
        if (undoBtn) undoBtn.onclick = () => this.undo();

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.onclick = () => {
                window.parent.postMessage('backToMenu', '*');
                if (window === window.top) {
                    window.location.href = '../index.html';
                }
            };
        }
    }

    generateLevel(level) {
        const { EMOJIS, getLevelLayout } = window.MahjongData;
        const layout = getLevelLayout(this.container, level);

        // Ensure tiles count is a multiple of 3
        const tileCount = layout.length;
        const remainder = tileCount % 3;
        const finalLayout = layout.slice(0, tileCount - remainder);

        // Assign random emojis in triplets
        const typesNeeded = finalLayout.length / 3;
        const emojiPool = [];
        for (let i = 0; i < typesNeeded; i++) {
            const emoji = EMOJIS[i % EMOJIS.length];
            emojiPool.push(emoji, emoji, emoji);
        }
        this.shuffle(emojiPool);

        finalLayout.forEach((pos, index) => {
            const tile = this.createTile(pos.x, pos.y, pos.z, emojiPool[index], index);
            this.tiles.push(tile);
            this.container.appendChild(tile.el);
        });
    }

    createTile(x, y, z, emoji, id) {
        const { height: TILE_HEIGHT } = window.MahjongData.getTileDimensions();
        const el = document.createElement('div');
        el.className = 'tile';
        el.innerHTML = emoji;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.zIndex = z;
        el.style.fontSize = `${TILE_HEIGHT * 0.45}px`;

        const tile = {
            id,
            x,
            y,
            z,
            emoji,
            el,
            status: 'board' // board, tray, cleared
        };

        el.onclick = () => this.handleTileClick(tile);
        return tile;
    }

    handleTileClick(tile) {
        if (this.isAnimating || tile.status !== 'board' || this.isLocked(tile)) return;

        if (!this.timerStarted) {
            this.startTimer();
        }

        tile.status = 'moving';
        this.history.push(tile);
        this.animateToTray(tile);
    }

    isLocked(tile) {
        return this.tiles.some(other => {
            if (other.status === 'board' && other.z > tile.z) {
                return this.isOverlapping(tile, other);
            }
            return false;
        });
    }

    isOverlapping(a, b) {
        const { width: TILE_WIDTH, height: TILE_HEIGHT } = window.MahjongData.getTileDimensions();
        const margin = 5;
        return !(a.x + TILE_WIDTH - margin <= b.x ||
            a.x + margin >= b.x + TILE_WIDTH ||
            a.y + TILE_HEIGHT - margin <= b.y ||
            a.y + margin >= b.y + TILE_HEIGHT);
    }

    updateLockStatus() {
        this.tiles.forEach(tile => {
            if (tile.status === 'board') {
                if (this.isLocked(tile)) {
                    tile.el.classList.add('locked');
                } else {
                    tile.el.classList.remove('locked');
                }
            }
        });
    }

    animateToTray(tile) {
        this.isAnimating = true;

        let insertionIndex = 0;
        for (let i = 0; i < this.tray.length; i++) {
            if (tile.emoji.localeCompare(this.tray[i].emoji) >= 0) {
                insertionIndex = i + 1;
            } else {
                break;
            }
        }

        const rect = tile.el.getBoundingClientRect();
        const traySlots = document.querySelectorAll('.slot');
        const targetSlot = traySlots[insertionIndex] || traySlots[traySlots.length - 1];
        const targetRect = targetSlot.getBoundingClientRect();

        const dx = targetRect.left - rect.left;
        const dy = targetRect.top - rect.top;

        tile.el.classList.add('moving');
        tile.el.style.transform = `translate(${dx}px, ${dy}px)`;

        setTimeout(() => {
            tile.status = 'tray';
            tile.el.classList.remove('moving');
            tile.el.style.transform = '';

            this.tray.splice(insertionIndex, 0, tile);
            this.renderTray();
            this.updateLockStatus();
            this.checkMatches();
            this.checkGameState();
            this.isAnimating = false;
        }, 300);
    }

    renderTray() {
        const { height: TILE_HEIGHT } = window.MahjongData.getTileDimensions();
        this.trayContainer.innerHTML = '';
        this.tray.forEach(tile => {
            const trayEl = document.createElement('div');
            trayEl.className = 'tray-tile';
            trayEl.innerHTML = tile.emoji;
            trayEl.style.fontSize = `${TILE_HEIGHT * 0.45}px`;
            this.trayContainer.appendChild(trayEl);
            tile.el.style.display = 'none';
        });
    }

    checkMatches() {
        const counts = {};
        this.tray.forEach(t => counts[t.emoji] = (counts[t.emoji] || 0) + 1);

        for (const emoji in counts) {
            if (counts[emoji] >= 3) {
                this.handleMatch(emoji);
                break;
            }
        }
    }

    handleMatch(emoji) {
        this.isAnimating = true;

        const trayTiles = Array.from(this.trayContainer.children);
        const matchIndices = [];
        this.tray.forEach((t, i) => {
            if (t.emoji === emoji) matchIndices.push(i);
        });

        const toRemoveIndices = matchIndices.slice(0, 3);
        toRemoveIndices.forEach(idx => {
            if (trayTiles[idx]) trayTiles[idx].classList.add('combo-out');
        });

        setTimeout(() => {
            const matchedTiles = this.tray.filter((t, i) => toRemoveIndices.includes(i));
            this.tray = this.tray.filter((t, i) => !toRemoveIndices.includes(i));
            this.history = this.history.filter(t => !matchedTiles.includes(t));

            this.renderTray();
            this.isAnimating = false;
            this.updateScore(10);
            this.checkWin();
        }, 400);
    }

    checkGameState() {
        const { TRAY_SIZE } = window.MahjongData;
        if (this.tray.length >= TRAY_SIZE) {
            this.stopTimer();
            this.showOverlay('gameOverOverlay');
        }
    }

    checkWin() {
        const boardTiles = this.tiles.filter(t => t.status === 'board').length;
        if (boardTiles === 0 && this.tray.length === 0) {
            this.stopTimer();
            this.showOverlay('victoryOverlay');
        }
    }

    updateScore(points) {
        this.score += points;
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.score;
        }
    }

    startTimer() {
        this.timerStarted = true;
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    resetTimer() {
        this.stopTimer();
        if (this.timerDisplay) {
            this.timerDisplay.textContent = "00:00";
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        if (!this.startTime || !this.timerDisplay) return;
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.timerDisplay.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showOverlay(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    }

    hideOverlay(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    }

    undo() {
        if (this.isAnimating || this.history.length === 0) return;

        const lastTile = this.history.pop();
        this.tray = this.tray.filter(t => t.id !== lastTile.id);

        lastTile.status = 'board';
        lastTile.el.style.display = 'flex';
        lastTile.el.style.transform = '';
        lastTile.el.classList.remove('moving');

        this.renderTray();
        this.updateLockStatus();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.tileGame = new TileGame();
});
