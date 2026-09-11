// ============================================================
// Card Memory Match — Main Game Controller
// Engine: HTML5 Canvas 2D API | Assets: Kenney Playing Cards
// ============================================================

(function () {
  'use strict';

  // --- Constants ---
  const ASSETS_PATH = '/assets/kenney_playing-cards-pack/PNG/Cards (medium)/';
  const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
  const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const TOTAL_PAIRS = 8;
  const GRID_COLS = 4;
  const GRID_ROWS = 4;

  // --- Canvas Setup ---
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  let width = 800;
  let height = 600;
  let dpr = 1;

  // --- Subsystems ---
  const audio = new window.CardSoundEngine();
  const particleSys = new window.CardParticleSystem();

  // --- Asset Preloader & Texture Pool ---
  const images = {};
  let imagesLoadedCount = 0;
  const TOTAL_DECK_IMAGES = 53; // 1 card_back + 52 playing cards
  let isPreloading = true;

  function getCardFilename(suit, value) {
    let formattedValue = value;
    if (!isNaN(value) && parseInt(value, 10) < 10) {
      formattedValue = '0' + value;
    }
    return `card_${suit}_${formattedValue}.png`;
  }

  function loadImage(key, src) {
    return new Promise((resolve) => {
      if (images[key]) {
        resolve(images[key]);
        return;
      }
      const img = new Image();
      img.onload = () => {
        images[key] = img;
        imagesLoadedCount++;
        resolve(img);
      };
      img.onerror = () => {
        images[key] = null;
        resolve(null);
      };
      img.src = src;
    });
  }

  async function preloadAllAssets() {
    isPreloading = true;
    imagesLoadedCount = 0;

    const promises = [];
    promises.push(loadImage('card_back', ASSETS_PATH + 'card_back.png'));

    for (const suit of SUITS) {
      for (const value of VALUES) {
        const filename = getCardFilename(suit, value);
        const key = `${suit}_${value}`;
        promises.push(loadImage(key, ASSETS_PATH + filename));
      }
    }

    await Promise.all(promises);
    isPreloading = false;
    initGame();
  }

  // --- Game State ---
  let cards = [];
  let flippedCards = [];
  let locked = false;
  let moves = 0;
  let matchedPairs = 0;
  let secondsElapsed = 0;
  let timerInterval = null;
  let gameStarted = false;
  let gameOver = false;

  // Interactive Buttons on Canvas
  let buttons = [];
  let mousePos = { x: -1, y: -1 };
  let victoryBtn = null;

  // --- Game Mechanics ---
  function initGame() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;

    secondsElapsed = 0;
    moves = 0;
    matchedPairs = 0;
    gameStarted = false;
    gameOver = false;
    locked = false;
    flippedCards = [];
    particleSys.clear();

    // Select 8 random pairs
    const pool = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        pool.push({ suit, value });
      }
    }
    // Shuffle pool and take 8
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const chosen8 = pool.slice(0, TOTAL_PAIRS);
    const cardList = [];
    chosen8.forEach((data) => {
      const key = `${data.suit}_${data.value}`;
      cardList.push({ suit: data.suit, value: data.value, key });
      cardList.push({ suit: data.suit, value: data.value, key });
    });

    // Shuffle 16 cards
    for (let i = cardList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
    }

    cards = cardList.map((item, idx) => new window.Card(idx, item.suit, item.value, item.key));
    layoutGrid();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!gameOver) {
        secondsElapsed++;
      }
    }, 1000);
  }

  function handleCardClick(card) {
    audio.initAudio();
    if (locked || gameOver) return;
    if (card.isFlipped || card.isMatched) return;
    if (flippedCards.length >= 2) return;

    if (!gameStarted) {
      gameStarted = true;
      startTimer();
    }

    card.isFlipped = true;
    card.targetFlip = 1;
    flippedCards.push(card);
    audio.playFlip();

    if (flippedCards.length === 2) {
      locked = true;
      moves++;

      const [c1, c2] = flippedCards;
      if (c1.suit === c2.suit && c1.value === c2.value) {
        // MATCH!
        setTimeout(() => {
          c1.isMatched = true;
          c2.isMatched = true;
          matchedPairs++;
          audio.playMatch();
          particleSys.spawnSparkles(c1.x + c1.width / 2, c1.y + c1.height / 2, 20);
          particleSys.spawnSparkles(c2.x + c2.width / 2, c2.y + c2.height / 2, 20);
          flippedCards = [];
          locked = false;

          if (matchedPairs >= TOTAL_PAIRS) {
            handleVictory();
          }
        }, 300);
      } else {
        // MISMATCH!
        setTimeout(() => {
          c1.shakeX = 12;
          c2.shakeX = 12;
          audio.playMismatch();
        }, 300);

        setTimeout(() => {
          c1.isFlipped = false;
          c1.targetFlip = 0;
          c2.isFlipped = false;
          c2.targetFlip = 0;
          flippedCards = [];
          locked = false;
        }, 1100);
      }
    }
  }

  function handleVictory() {
    gameOver = true;
    if (timerInterval) clearInterval(timerInterval);

    audio.playVictory();
    saveHighScore();
  }

  function calculateScore(m, t) {
    const base = 1000;
    const movePenalty = Math.max(0, (m - 8) * 30);
    const timePenalty = Math.max(0, (t - 40) * 5);
    return Math.max(100, base - movePenalty - timePenalty);
  }

  function calculateRating(m, t) {
    if (m <= 10 && t <= 35) return 5;
    if (m <= 14 && t <= 60) return 4;
    if (m <= 18 && t <= 90) return 3;
    if (m <= 22 && t <= 120) return 2;
    return 1;
  }

  function saveHighScore() {
    try {
      const score = calculateScore(moves, secondsElapsed);
      const prev = localStorage.getItem('card-memory-best');
      if (!prev || score > JSON.parse(prev).score) {
        localStorage.setItem(
          'card-memory-best',
          JSON.stringify({ score, moves, time: secondsElapsed })
        );
      }
    } catch {}
  }

  function getHighScore() {
    try {
      const prev = localStorage.getItem('card-memory-best');
      return prev ? JSON.parse(prev) : null;
    } catch {
      return null;
    }
  }

  // --- Responsive Layout Positioning ---
  function layoutGrid() {
    const isSmallScreen = width < 480;
    const topHudHeight = isSmallScreen ? 56 : 70;
    const availableWidth = width;
    const availableHeight = height - topHudHeight - 20;

    const padding = isSmallScreen ? 6 : 12;
    const maxCardW = Math.floor((availableWidth - (GRID_COLS + 1) * padding) / GRID_COLS);
    const maxCardH = Math.floor((availableHeight - (GRID_ROWS + 1) * padding) / GRID_ROWS);

    let cardW = Math.min(maxCardW, Math.floor(maxCardH / 1.4));
    let cardH = Math.floor(cardW * 1.4);

    cardW = Math.max(44, Math.min(110, cardW));
    cardH = Math.floor(cardW * 1.4);

    const totalGridW = GRID_COLS * cardW + (GRID_COLS - 1) * padding;
    const totalGridH = GRID_ROWS * cardH + (GRID_ROWS - 1) * padding;

    const startX = Math.floor((width - totalGridW) / 2);
    const startY = topHudHeight + Math.floor((availableHeight - totalGridH) / 2);

    cards.forEach((card, idx) => {
      const col = idx % GRID_COLS;
      const row = Math.floor(idx / GRID_COLS);
      card.x = startX + col * (cardW + padding);
      card.y = startY + row * (cardH + padding);
      card.width = cardW;
      card.height = cardH;
    });
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    layoutGrid();
  }

  window.addEventListener('resize', resizeCanvas);

  // --- Input Handlers ---
  function handleInput(px, py, isClick = false) {
    if (isClick) audio.initAudio();

    mousePos = { x: px, y: py };

    // Check canvas buttons
    buttons.forEach((btn) => {
      btn.isHovered = btn.containsPoint(px, py);
      if (isClick && btn.isHovered) {
        btn.onClick();
      }
    });

    if (gameOver) {
      if (isClick && victoryBtn && victoryBtn.containsPoint(px, py)) {
        initGame();
      }
      return;
    }

    // Check cards
    cards.forEach((card) => {
      card.isHovered = card.containsPoint(px, py);
      if (isClick && card.isHovered) {
        handleCardClick(card);
      }
    });
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    handleInput(e.clientX - rect.left, e.clientY - rect.top, false);
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    handleInput(e.clientX - rect.left, e.clientY - rect.top, true);
  });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      handleInput(touch.clientX - rect.left, touch.clientY - rect.top, true);
    }
  }, { passive: false });

  // --- Render Loop ---
  let lastTime = performance.now();

  function render(time) {
    const dt = Math.min(0.1, (time - lastTime) / 1000);
    lastTime = time;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Background
    const bgGradient = ctx.createRadialGradient(
      width / 2, height / 2, 50,
      width / 2, height / 2, Math.max(width, height) * 0.8
    );
    bgGradient.addColorStop(0, '#1e1b4b');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    if (isPreloading) {
      drawLoadingScreen(ctx);
    } else {
      // Update & Draw cards
      cards.forEach((card) => {
        card.update(dt);
        card.draw(ctx, images);
      });

      // Update & Draw particles
      particleSys.update(dt);
      particleSys.draw(ctx);

      // Top HUD
      drawHUD(ctx);

      // Victory Modal Overlay
      if (gameOver) {
        drawVictoryModal(ctx);
      }
    }

    ctx.restore();
    requestAnimationFrame(render);
  }

  function drawLoadingScreen(ctx) {
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('กำลังโหลดการ์ด...', width / 2, height / 2 - 20);

    const progress = Math.min(1, imagesLoadedCount / TOTAL_DECK_IMAGES);
    const barW = Math.min(260, width - 60);
    const barH = 12;
    const barX = (width - barW) / 2;
    const barY = height / 2 + 20;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 6);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * progress, barH, 6);
    ctx.fill();
  }

  function drawHUD(ctx) {
    buttons = [];
    const isSmall = width < 480;
    const hudY = isSmall ? 10 : 16;
    const hudH = isSmall ? 40 : 48;

    // Header Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.beginPath();
    ctx.roundRect(12, hudY, width - 24, hudH, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Stats layout
    const mins = Math.floor(secondsElapsed / 60);
    const secs = secondsElapsed % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    ctx.fillStyle = '#f8fafc';
    ctx.font = isSmall ? 'bold 13px sans-serif' : 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const statY = hudY + hudH / 2;
    ctx.fillText(`⏱️ ${timeStr}`, 24, statY);
    ctx.fillText(`🔄 ครั้ง: ${moves}`, isSmall ? 105 : 140, statY);
    ctx.fillText(`✨ คู่: ${matchedPairs}/${TOTAL_PAIRS}`, isSmall ? 180 : 250, statY);

    // Top Right Controls (Restart & Sound)
    const btnSize = isSmall ? 32 : 36;
    const soundX = width - 12 - btnSize - 8 - btnSize - 6;
    const restartX = width - 12 - btnSize - 6;

    // Sound button
    const soundBtn = {
      x: soundX,
      y: hudY + (hudH - btnSize) / 2,
      w: btnSize,
      h: btnSize,
      isHovered: false,
      containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
      },
      onClick() {
        audio.soundEnabled = !audio.soundEnabled;
      },
    };
    buttons.push(soundBtn);

    ctx.fillStyle = soundBtn.isHovered ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(soundBtn.x, soundBtn.y, soundBtn.w, soundBtn.h, 8);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.font = '16px sans-serif';
    ctx.fillText(audio.soundEnabled ? '🔊' : '🔇', soundBtn.x + soundBtn.w / 2, soundBtn.y + soundBtn.h / 2);

    // Restart button
    const restartBtn = {
      x: restartX,
      y: hudY + (hudH - btnSize) / 2,
      w: btnSize,
      h: btnSize,
      isHovered: false,
      containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
      },
      onClick() {
        initGame();
      },
    };
    buttons.push(restartBtn);

    ctx.fillStyle = restartBtn.isHovered ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h, 8);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillText('🔄', restartBtn.x + restartBtn.w / 2, restartBtn.y + restartBtn.h / 2);
  }

  function drawVictoryModal(ctx) {
    // Backdrop
    ctx.fillStyle = 'rgba(7, 9, 19, 0.85)';
    ctx.fillRect(0, 0, width, height);

    const cardW = Math.min(380, width - 40);
    const cardH = 340;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    // Glass Card
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Victory Title
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 ยินดีด้วย! ชนะแล้ว! 🏆', width / 2, cardY + 45);

    // Star Rating
    const rating = calculateRating(moves, secondsElapsed);
    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    ctx.font = '24px sans-serif';
    ctx.fillText(stars, width / 2, cardY + 85);

    // Score & Stats Box
    const score = calculateScore(moves, secondsElapsed);
    const mins = Math.floor(secondsElapsed / 60);
    const secs = secondsElapsed % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const statBoxY = cardY + 115;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(cardX + 24, statBoxY, cardW - 48, 110, 12);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText('คะแนนรวม (SCORE)', width / 2, statBoxY + 22);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`${score}`, width / 2, statBoxY + 54);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px sans-serif';
    ctx.fillText(`เวลาที่ใช้: ${timeStr}  |  จำนวนครั้ง: ${moves}`, width / 2, statBoxY + 88);

    // High Score Display
    const best = getHighScore();
    if (best) {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText(`🏆 สถิติดีที่สุด: ${best.score} คะแนน`, width / 2, cardY + 250);
    }

    // Play Again Button
    const btnW = cardW - 60;
    const btnH = 46;
    const btnX = (width - btnW) / 2;
    const btnY = cardY + cardH - 65;

    victoryBtn = {
      x: btnX,
      y: btnY,
      w: btnW,
      h: btnH,
      isHovered: false,
      containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
      },
    };
    victoryBtn.isHovered = victoryBtn.containsPoint(mousePos.x, mousePos.y);

    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
    if (victoryBtn.isHovered) {
      btnGrad.addColorStop(0, '#0284c7');
      btnGrad.addColorStop(1, '#0369a1');
    } else {
      btnGrad.addColorStop(0, '#0ea5e9');
      btnGrad.addColorStop(1, '#0284c7');
    }

    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('🔄 เล่นใหม่อีกครั้ง (PLAY AGAIN)', width / 2, btnY + btnH / 2);
  }

  // --- Bootstrapping ---
  resizeCanvas();
  preloadAllAssets();
  requestAnimationFrame(render);
})();