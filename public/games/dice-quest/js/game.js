/**
 * Dice Quest — Monopoly Board Game (G010)
 * Core Controller & Game Loop
 */

const {
    TILE_COUNT,
    START_MONEY,
    PASS_GO_MONEY,
    WIN_AMOUNT,
    PASS_TURN_LIMIT,
    TILE_TYPES,
    TILE_CONFIG,
    CHANCE_CARDS,
    PLAYER_NAMES,
    PLAYER_COLORS,
    PLAYER_ICONS
} = window.DQ_CONFIG;

// ═══════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════

const state = {
    currentPlayer: 0,
    players: [],
    gameOver: false,
    rolled: false,
    rolls: 0,
    maxRolls: PASS_TURN_LIMIT,
    phase: 'waiting', // waiting, rolling, moving, result
};

function initPlayers() {
    state.players = [];
    for (let i = 0; i < 4; i++) {
        state.players.push({
            id: i,
            name: PLAYER_NAMES[i],
            color: PLAYER_COLORS[i],
            position: 0,
            money: START_MONEY,
            jailed: false,
            jailTurns: 0,
            properties: [],
            multiplier: 1,
            multiplierUntil: -1,
        });
    }
}

// ═══════════════════════════════════════════════
// BOARD RENDERING (CSS Grid)
// ═══════════════════════════════════════════════

function renderBoard() {
    const board = document.getElementById('board');
    if (!board) return;
    const existingTiles = board.querySelectorAll('.tile');
    existingTiles.forEach(el => el.remove());

    const boardSize = board.clientWidth || 500;
    const centerX = boardSize / 2;
    const centerY = boardSize / 2;
    const radius = boardSize * 0.36;
    const tileSize = boardSize < 400 ? 21 : 28;

    for (let i = 0; i < TILE_COUNT; i++) {
        const angle = (i / TILE_COUNT) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - tileSize;
        const y = centerY + radius * Math.sin(angle) - tileSize;
        const tile = TILE_CONFIG[i];

        const tileEl = document.createElement('div');
        tileEl.className = 'tile';
        tileEl.style.left = x + 'px';
        tileEl.style.top = y + 'px';

        const typeColors = {
            [TILE_TYPES.CORNER]: '#374151',
            [TILE_TYPES.PROPERTY]: '#1e3a2f',
            [TILE_TYPES.CHANCE]: '#4a1d6a',
            [TILE_TYPES.TAX]: '#6a4a1d',
            [TILE_TYPES.FREEPARKING]: '#2a2a3a',
        };
        tileEl.style.backgroundColor = typeColors[tile.type] || '#1e293b';

        tileEl.innerHTML = `
            <div class="tile-icon">${tile.icon}</div>
            <div class="tile-label">${tile.label}</div>
            ${tile.type === TILE_TYPES.PROPERTY ? `<div class="tile-price">$${tile.price}</div>` : ''}
        `;
        board.appendChild(tileEl);
    }
}

// ═══════════════════════════════════════════════
// PAWN RENDERING
// ═══════════════════════════════════════════════

const pawnEls = [];

function renderPawns() {
    const board = document.getElementById('board');
    if (!board) return;
    pawnEls.forEach(el => el.remove());
    pawnEls.length = 0;

    const boardSize = board.clientWidth || 500;
    const centerX = boardSize / 2;
    const centerY = boardSize / 2;
    const radius = boardSize * 0.36;
    const pawnSize = boardSize < 400 ? 9 : 12;

    state.players.forEach((p, idx) => {
        if (p.money <= 0) return;

        const angle = (p.position / TILE_COUNT) * 2 * Math.PI - Math.PI / 2;
        const offsetX = (idx - 1.5) * (boardSize < 400 ? 6 : 8);
        const x = centerX + radius * Math.cos(angle) + offsetX - pawnSize;
        const y = centerY + radius * Math.sin(angle) - pawnSize;

        const pawnEl = document.createElement('div');
        pawnEl.className = 'pawn';
        pawnEl.style.left = x + 'px';
        pawnEl.style.top = y + 'px';
        pawnEl.style.backgroundColor = p.color;
        pawnEl.textContent = PLAYER_ICONS[idx];
        pawnEl.dataset.playerId = idx;
        board.appendChild(pawnEl);
        pawnEls.push(pawnEl);
    });

    const currentPawn = pawnEls[state.currentPlayer];
    if (currentPawn) {
        currentPawn.classList.add('active');
        board.style.border = `2px solid ${PLAYER_COLORS[state.currentPlayer]}`;
    }
}

// ═══════════════════════════════════════════════
// HUD RENDERING
// ═══════════════════════════════════════════════

function renderHUD() {
    const row = document.getElementById('players-row');
    if (!row) return;
    row.innerHTML = '';

    state.players.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'player-card' + (i === state.currentPlayer ? ' active' : '');
        div.style.borderColor = p.color;
        div.innerHTML = `
            <div class="player-name">${p.name}</div>
            <div class="player-money">$${p.money}</div>
            <div class="player-properties">${p.properties.length} prop</div>
            ${p.jailed ? '<div class="jail-badge">⛓️ Jail</div>' : ''}
        `;
        row.appendChild(div);
    });
}

// ═══════════════════════════════════════════════
// DICE RENDERING
// ═══════════════════════════════════════════════

function renderDice(value1, value2) {
    const dice = document.getElementById('dice');
    if (!dice) return;
    dice.classList.remove('hidden');

    const die1 = document.getElementById('die1');
    const die2 = document.getElementById('die2');

    if (die1) die1.src = `/assets/kenney_boardgame-pack/PNG/Dice/dieRed${value1}.png`;
    if (die2) die2.src = `/assets/kenney_boardgame-pack/PNG/Dice/dieRed${value2}.png`;

    dice.classList.add('active');
}

function hideDice() {
    const dice = document.getElementById('dice');
    if (!dice) return;
    dice.classList.remove('active');
    dice.classList.add('hidden');
}

// ═══════════════════════════════════════════════
// STATUS & LOG
// ═══════════════════════════════════════════════

function setStatus(text, type) {
    const status = document.getElementById('status');
    if (!status) return;
    status.textContent = text;
    status.className = 'status ' + (type || '');
}

function addLog(text) {
    const log = document.getElementById('log');
    if (!log) return;
    const line = document.createElement('div');
    line.textContent = text;
    log.insertBefore(line, log.firstChild);
    if (log.children.length > 8) {
        log.removeChild(log.lastChild);
    }
}

// ═══════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════

function showModal(title, body, actions) {
    const modal = document.getElementById('modal');
    if (!modal) return;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent = body;

    const actionsEl = document.getElementById('modal-actions');
    actionsEl.innerHTML = '';

    if (actions && actions.length > 0) {
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-' + (action.type || 'default');
            btn.textContent = action.text;
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
                if (action.callback) action.callback();
            });
            actionsEl.appendChild(btn);
        });
    }

    modal.classList.remove('hidden');
}

function hideModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.add('hidden');
}

// ═══════════════════════════════════════════════
// GAME LOGIC & TURN PROCESSOR
// ═══════════════════════════════════════════════

function rollDice() {
    if (state.phase !== 'waiting') return;
    state.phase = 'rolling';
    state.rolled = false;

    window.audioManager.play('roll');

    const dice = document.getElementById('dice');
    if (dice) dice.classList.add('rolling');

    let rollInterval = setInterval(() => {
        renderDice(Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1);
    }, 80);

    setTimeout(() => {
        clearInterval(rollInterval);
        if (dice) dice.classList.remove('rolling');

        const v1 = Math.floor(Math.random() * 6) + 1;
        const v2 = Math.floor(Math.random() * 6) + 1;
        renderDice(v1, v2);

        state.rolls = v1 + v2;
        state.rolled = true;
        state.phase = 'moving';

        processTurn(v1 + v2, v1, v2);
    }, 800);
}

function processTurn(totalRoll, v1, v2) {
    const player = state.players[state.currentPlayer];
    addLog(`${player.name} rolled ${v1} + ${v2} = ${totalRoll}`);

    if (v1 === v2) {
        addLog('🎯 Doubles! Roll again!');
    }

    if (player.jailed) {
        handleJailedTurn(player, totalRoll);
        return;
    }

    const newPos = (player.position + totalRoll) % TILE_COUNT;
    if (newPos < player.position) {
        player.money += PASS_GO_MONEY;
        addLog('🏠 Passed GO! +$200');
        window.audioManager.play('buy');
    }

    player.position = newPos;
    const tile = TILE_CONFIG[newPos];
    addLog(`→ Landed on: ${tile.label}`);

    setTimeout(() => {
        renderPawns();
        processTileEffect(player, tile, totalRoll);
    }, 300);
}

function handleJailedTurn(player, totalRoll) {
    player.jailTurns++;
    if (player.jailTurns >= 3) {
        player.jailed = false;
        player.jailTurns = 0;
        addLog('⛓️ Served jail time. Free!');
        const newPos = (player.position + totalRoll) % TILE_COUNT;
        if (newPos < player.position) {
            player.money += PASS_GO_MONEY;
            addLog('🏠 Passed GO! +$200');
        }
        player.position = newPos;
        setTimeout(() => {
            renderPawns();
            processTileEffect(player, TILE_CONFIG[newPos], totalRoll);
        }, 300);
    } else {
        addLog(`⛓️ Still in jail. Turn ${player.jailTurns}/3`);
        endTurn();
    }
}

function processTileEffect(player, tile, roll) {
    switch (tile.type) {
        case TILE_TYPES.CORNER:
            if (player.position === 11 || player.position === 12) {
                addLog('🚔 Go to Jail!');
                player.position = 6;
                player.jailed = true;
                player.jailTurns = 0;
                setTimeout(() => {
                    renderPawns();
                    endTurn();
                }, 500);
            } else if (player.position === 17 || player.position === 20) {
                const totalTax = state.players.reduce((sum, p) => {
                    if (p !== player) {
                        const taxPaid = p.properties.reduce((s, idx) => sum + TILE_CONFIG[idx].price * 0.1, 0);
                        return sum + Math.floor(taxPaid);
                    }
                    return sum;
                }, 0);
                if (totalTax > 0) {
                    player.money += totalTax;
                    addLog(`🅿️ Free Parking! +$${totalTax}`);
                    window.audioManager.play('win');
                } else {
                    addLog('🅿️ Free Parking. Nothing to collect.');
                }
                setTimeout(() => endTurn(), 1000);
            } else {
                setTimeout(() => endTurn(), 1000);
            }
            break;

        case TILE_TYPES.PROPERTY:
            if (tile.price > 0) {
                const ownerId = tile.owner;
                if (ownerId !== undefined && ownerId !== null && ownerId !== -1) {
                    const owner = state.players[ownerId];
                    if (owner && owner !== player) {
                        const rent = tile.rent * (owner.multiplier || 1);
                        player.money -= rent;
                        owner.money += rent;
                        addLog(`💸 ${player.name} paid rent $${rent} to ${owner.name}`);
                        window.audioManager.play('bad');
                    }
                } else {
                    if (player.money >= tile.price) {
                        player.money -= tile.price;
                        tile.owner = state.currentPlayer;
                        player.properties.push(player.position);
                        addLog(`✅ ${player.name} bought ${tile.label} for $${tile.price}`);
                        window.audioManager.play('buy');
                    } else {
                        addLog(`❌ ${player.name} can't afford ${tile.label} ($${tile.price})`);
                    }
                }
            }
            setTimeout(() => endTurn(), 1000);
            break;

        case TILE_TYPES.CHANCE:
            const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
            addLog(card.text);
            card.action(player);
            window.audioManager.play('bad');
            checkBankruptcy(player);
            setTimeout(() => endTurn(), 1000);
            break;

        case TILE_TYPES.TAX:
            player.money -= tile.price;
            addLog(`💰 Paid tax $${tile.price}`);
            window.audioManager.play('bad');
            checkBankruptcy(player);
            setTimeout(() => endTurn(), 1000);
            break;
            
        default:
            setTimeout(() => endTurn(), 1000);
            break;
    }
}

function checkBankruptcy(player) {
    if (player.money < 0) {
        addLog(`❌ ${player.name} is bankrupt!`);
        player.money = 0;
        const board = document.getElementById('board');
        const tiles = board ? board.querySelectorAll('.tile') : [];
        player.properties.forEach(idx => {
            if (TILE_CONFIG[idx]) {
                TILE_CONFIG[idx].owner = undefined;
            }
            if (tiles[idx]) {
                tiles[idx].classList.remove('owned');
            }
        });
        player.properties = [];

        const alivePlayers = state.players.filter(p => p.money > 0);
        if (alivePlayers.length === 1) {
            setTimeout(() => {
                showModal('🏆 Game Over!', `${alivePlayers[0].name} WINS!\nFinal money: $${alivePlayers[0].money}`, [
                    { text: '🔄 Play Again', type: 'primary', callback: resetGame }
                ]);
            }, 500);
        }
    }
}

function endTurn() {
    state.currentPlayer = (state.currentPlayer + 1) % 4;
    state.phase = 'waiting';

    renderHUD();
    renderPawns();
    renderBoard();

    const alivePlayers = state.players.filter(p => p.money > 0);
    if (alivePlayers.length === 1) {
        const winner = alivePlayers[0];
        showModal('🏆 Game Over!', `🏆 ${winner.name} WINS!\nFinal money: $${winner.money}`, [
            { text: '🔄 Play Again', type: 'primary', callback: resetGame }
        ]);
        return;
    }

    if (state.rolls >= state.maxRolls) {
        addLog('🎯 500 rolls complete. Game over!');
        showModal('🎯 Game Over!', '500 rolls reached. No winner!', [
            { text: '🔄 Play Again', type: 'primary', callback: resetGame }
        ]);
        return;
    }

    const p = state.players[state.currentPlayer];
    if (p.money <= 0) {
        endTurn();
        return;
    }

    const btnRoll = document.getElementById('btn-roll');
    if (state.currentPlayer === 0) {
        setStatus('ถึงตาคุณแล้ว! กดปุ่มทอยลูกเต๋า');
        if (btnRoll) {
            btnRoll.disabled = false;
            btnRoll.innerHTML = '🎲 ทอยลูกเต๋า';
        }
    } else {
        setStatus(`ถึงตาของ ${p.name}...`);
        if (btnRoll) {
            btnRoll.disabled = true;
            btnRoll.innerHTML = `⏳ ${p.name}...`;
        }
        setTimeout(() => {
            if (state.phase === 'waiting' && state.currentPlayer !== 0) {
                rollDice();
            }
        }, 900);
    }
}

function resetGame() {
    hideModal();
    state.currentPlayer = 0;
    state.gameOver = false;
    state.rolls = 0;
    state.phase = 'waiting';

    TILE_CONFIG.forEach(tile => { tile.owner = undefined; });

    state.players.forEach(p => {
        p.position = 0;
        p.money = START_MONEY;
        p.jailed = false;
        p.jailTurns = 0;
        p.properties = [];
    });

    addLog('Game reset!');
    renderBoard();
    renderHUD();
    renderPawns();
}

function init() {
    initPlayers();
    renderBoard();
    renderHUD();
    renderPawns();
    setStatus('กดปุ่มทอยลูกเต๋าเพื่อเริ่มเกม', 'normal');

    const btnRoll = document.getElementById('btn-roll');
    if (btnRoll) {
        btnRoll.addEventListener('click', rollDice);
    }

    for (let i = 1; i <= 6; i++) {
        const img = new Image();
        img.src = `/assets/kenney_boardgame-pack/PNG/Dice/dieRed${i}.png`;
    }

    fetch('/assets/kenney_boardgame-pack/PNG/Dice/dieRed1.png')
        .then(r => r.ok ? 'ok' : 'fail')
        .catch(() => 'fail')
        .then(status => {
            if (status === 'fail') {
                addLog('⚠️ Assets not found — using fallback dice');
            }
        });

    addLog('🎲 Welcome to Dice Quest!');
    addLog('💡 Tip: Try to reach $20,000 to win');
}

window.addEventListener('DOMContentLoaded', init);
