const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  
  // UI Elements
  const dayColorInput = document.querySelector("#dayColorInput");
  const nightColorInput = document.querySelector("#nightColorInput");
  const configBtn = document.querySelector("#configBtn");
  const configPanel = document.querySelector("#configPanel");
  const resetBtn = document.querySelector("#resetBtn");
  const playPauseBtn = document.querySelector("#playPauseBtn");
  const soundBtn = document.querySelector("#soundBtn");
  const playIcon = document.querySelector("#playIcon");
  const pauseIcon = document.querySelector("#pauseIcon");
  const soundIcon = document.querySelector("#soundIcon");
  const speedSlider = document.querySelector("#speedSlider");
  const speedVal = document.querySelector("#speedVal");
  
  const dayScoreNum = document.querySelector("#dayScoreNum");
  const nightScoreNum = document.querySelector("#nightScoreNum");
  const dayPct = document.querySelector("#dayPct");
  const nightPct = document.querySelector("#nightPct");
  const tugDay = document.querySelector("#tugDay");
  const tugNight = document.querySelector("#tugNight");
  const dayDot = document.querySelector("#dayDot");
  const nightDot = document.querySelector("#nightDot");

  // State Variables
  let GRID_COUNT = 24;
  let TILE_SIZE = canvas.width / GRID_COUNT;
  let MAX_SPEED = 9;
  let MIN_SPEED = 5;
  let ACCELERATION = 0.12;
  let speedMultiplier = 1;
  let ballsPerTeam = 1;

  let dayColor = "#FFFFFF";
  let nightColor = "#0F172A";
  let isPlaying = true;
  let isMuted = false;
  let animationFrameId = null;

  // Web Audio Synth
  let audioCtx = null;
  const dayNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
  const nightNotes = [130.81, 164.81, 196.00, 220.00, 261.63, 293.66]; // C3, E3, G3, A3, C4, D4

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(isDay) {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      const notes = isDay ? dayNotes : nightNotes;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      
      osc.type = isDay ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (isDay ? 0.25 : 0.4));
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + (isDay ? 0.26 : 0.41));
    } catch (_) {}
  }

  // Grid & Balls
  let ownership = [];
  let balls = [];

  function setupGrid() {
    TILE_SIZE = canvas.width / GRID_COUNT;
    ownership = new Array(GRID_COUNT * GRID_COUNT).fill(0).map((_, idx) => {
      const col = idx % GRID_COUNT;
      return col < GRID_COUNT / 2 ? 0 : 1; // 0 = Day territory, 1 = Night territory
    });
  }

  function setupBalls() {
    balls = [];
    for (let i = 0; i < ballsPerTeam; i++) {
      const offset = (i - (ballsPerTeam - 1) / 2) * 40;
      // Day ball spawns in Day side, moves toward Night
      balls.push({
        team: 0, // Day team
        x: canvas.width / 4,
        y: canvas.height / 2 + offset,
        vx: 6 + Math.random() * 2,
        vy: (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 2),
        radius: TILE_SIZE / 2.2
      });

      // Night ball spawns in Night side, moves toward Day
      balls.push({
        team: 1, // Night team
        x: (canvas.width / 4) * 3,
        y: canvas.height / 2 - offset,
        vx: -(6 + Math.random() * 2),
        vy: (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 2),
        radius: TILE_SIZE / 2.2
      });
    }
  }

  function updateThemeColors() {
    document.documentElement.style.setProperty('--day-color', dayColor);
    document.documentElement.style.setProperty('--night-color', nightColor);
    dayDot.style.background = dayColor;
    nightDot.style.background = nightColor;
    dayColorInput.value = dayColor;
    nightColorInput.value = nightColor;
    document.body.style.background = `linear-gradient(135deg, ${nightColor} 0%, ${dayColor} 100%)`;
  }

  function drawTile(col, row, team) {
    ctx.fillStyle = team === 0 ? dayColor : nightColor;
    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  function drawBall(ball) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    // Ball color is opposite of background it conquers
    ctx.fillStyle = ball.team === 0 ? nightColor : dayColor;
    ctx.shadowColor = ball.team === 0 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  function detectCollision(ball) {
    const ballLeft = ball.x - ball.radius;
    const ballRight = ball.x + ball.radius;
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;

    // Check neighboring tiles only for high performance
    const minCol = Math.max(0, Math.floor(ballLeft / TILE_SIZE));
    const maxCol = Math.min(GRID_COUNT - 1, Math.floor(ballRight / TILE_SIZE));
    const minRow = Math.max(0, Math.floor(ballTop / TILE_SIZE));
    const maxRow = Math.min(GRID_COUNT - 1, Math.floor(ballBottom / TILE_SIZE));

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const idx = r * GRID_COUNT + c;
        const currentOwner = ownership[idx];
        
        // If ball hits opposing territory
        if (currentOwner !== ball.team) {
          // Flip tile to ball's team
          ownership[idx] = ball.team;
          playChime(ball.team === 0);

          // Calculate bounce reflection vector
          const tileCenterX = c * TILE_SIZE + TILE_SIZE / 2;
          const tileCenterY = r * TILE_SIZE + TILE_SIZE / 2;
          const dx = ball.x - tileCenterX;
          const dy = ball.y - tileCenterY;

          if (Math.abs(dx) > Math.abs(dy)) {
            ball.vx = -ball.vx;
          } else {
            ball.vy = -ball.vy;
          }
          return;
        }
      }
    }
  }

  function checkBoundaries(ball) {
    if (ball.x - ball.radius < 0) {
      ball.vx = Math.abs(ball.vx);
      ball.x = ball.radius;
    } else if (ball.x + ball.radius > canvas.width) {
      ball.vx = -Math.abs(ball.vx);
      ball.x = canvas.width - ball.radius;
    }

    if (ball.y - ball.radius < 0) {
      ball.vy = Math.abs(ball.vy);
      ball.y = ball.radius;
    } else if (ball.y + ball.radius > canvas.height) {
      ball.vy = -Math.abs(ball.vy);
      ball.y = canvas.height - ball.radius;
    }
  }

  function updateBall(ball) {
    // Add subtle perturbation to avoid infinite repeating paths
    ball.vx += (Math.random() - 0.5) * ACCELERATION;
    ball.vy += (Math.random() - 0.5) * ACCELERATION;

    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed > MAX_SPEED) {
      const scale = MAX_SPEED / speed;
      ball.vx *= scale;
      ball.vy *= scale;
    }
    if (speed < MIN_SPEED) {
      const scale = MIN_SPEED / speed;
      ball.vx *= scale;
      ball.vy *= scale;
    }

    ball.x += ball.vx * speedMultiplier;
    ball.y += ball.vy * speedMultiplier;
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let dayCount = 0;
    let nightCount = 0;

    // Draw Grid
    for (let r = 0; r < GRID_COUNT; r++) {
      for (let c = 0; c < GRID_COUNT; c++) {
        const idx = r * GRID_COUNT + c;
        const owner = ownership[idx];
        drawTile(c, r, owner);
        if (owner === 0) dayCount++; else nightCount++;
      }
    }

    // Update Scores
    const totalTiles = GRID_COUNT * GRID_COUNT;
    const dayPercentage = Math.round((dayCount / totalTiles) * 100);
    const nightPercentage = 100 - dayPercentage;

    dayScoreNum.textContent = dayCount;
    nightScoreNum.textContent = nightCount;
    dayPct.textContent = `${dayPercentage}%`;
    nightPct.textContent = `${nightPercentage}%`;
    tugDay.style.width = `${dayPercentage}%`;
    tugNight.style.width = `${nightPercentage}%`;

    // Process Balls
    balls.forEach(ball => {
      drawBall(ball);
      detectCollision(ball);
      checkBoundaries(ball);
      updateBall(ball);
    });

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  function resetGame() {
    setupGrid();
    setupBalls();
    if (!isPlaying) togglePlayPause();
  }

  function togglePlayPause() {
    initAudio();
    isPlaying = !isPlaying;
    playIcon.style.display = isPlaying ? "none" : "block";
    pauseIcon.style.display = isPlaying ? "block" : "none";
    if (isPlaying) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  }

  // Interactive Paint / Tile Flip on Canvas Click or Touch
  function handleCanvasInteract(e) {
    initAudio();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);

    if (col >= 0 && col < GRID_COUNT && row >= 0 && row < GRID_COUNT) {
      const idx = row * GRID_COUNT + col;
      ownership[idx] = ownership[idx] === 0 ? 1 : 0;
      playChime(ownership[idx] === 0);
    }
  }

  let isPainting = false;
  canvas.addEventListener('mousedown', (e) => { isPainting = true; handleCanvasInteract(e); });
  canvas.addEventListener('mousemove', (e) => { if (isPainting) handleCanvasInteract(e); });
  window.addEventListener('mouseup', () => { isPainting = false; });
  
  canvas.addEventListener('touchstart', (e) => { isPainting = true; handleCanvasInteract(e); }, { passive: true });
  canvas.addEventListener('touchmove', (e) => { if (isPainting) handleCanvasInteract(e); }, { passive: true });
  window.addEventListener('touchend', () => { isPainting = false; });

  // Event Listeners
  configBtn.addEventListener("click", () => configPanel.classList.toggle("visible"));
  resetBtn.addEventListener("click", () => { initAudio(); resetGame(); });
  playPauseBtn.addEventListener("click", togglePlayPause);
  
  soundBtn.addEventListener("click", () => {
    initAudio();
    isMuted = !isMuted;
    soundBtn.style.opacity = isMuted ? "0.5" : "1";
  });

  dayColorInput.addEventListener("input", (e) => {
    dayColor = e.target.value;
    updateThemeColors();
  });

  nightColorInput.addEventListener("input", (e) => {
    nightColor = e.target.value;
    updateThemeColors();
  });

  // Preset Buttons
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      dayColor = btn.dataset.day;
      nightColor = btn.dataset.night;
      updateThemeColors();
    });
  });

  // Speed Slider
  speedSlider.addEventListener("input", (e) => {
    speedMultiplier = parseFloat(e.target.value);
    speedVal.textContent = `${speedMultiplier}x`;
  });

  // Ball Count Buttons
  document.querySelectorAll("#ballCountGroup button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#ballCountGroup button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      ballsPerTeam = parseInt(btn.dataset.balls, 10);
      setupBalls();
    });
  });

  // Grid Resolution Buttons
  document.querySelectorAll("#gridSizeGroup button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#gridSizeGroup button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      GRID_COUNT = parseInt(btn.dataset.size, 10);
      resetGame();
    });
  });

  // Initialize
  setupGrid();
  setupBalls();
  updateThemeColors();
  animationFrameId = requestAnimationFrame(render);