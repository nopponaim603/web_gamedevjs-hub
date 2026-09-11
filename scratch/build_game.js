const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'mogura_raw.html');
let html = fs.readFileSync(rawPath, 'utf8');

// 1. Remove the entire ad-banner DOM element & script
html = html.replace(/<div id="ad-banner">[\s\S]*?<\/div>/, '');

// 2. Remove ad-banner CSS
html = html.replace(/#ad-banner\s*\{[\s\S]*?\}/, '');

// 3. Fix #screen-overlay.title-mode padding that was offsetting for ad-banner
html = html.replace(
  /padding-top:\s*calc\(100%\s*\*\s*50\s*\/\s*320\s*\+\s*calc\(var\(--ui-scale,\s*1\)\s*\*\s*6px\)\);/,
  'padding-top: calc(var(--ui-scale, 1) * 20px);'
);

// 4. Add Sound Toggle Button in the overlay/game container
const soundToggleCss = `
    /* SOUND TOGGLE BUTTON */
    .sound-toggle-btn {
      position: absolute;
      top: calc(var(--ui-scale, 1) * 12px);
      right: calc(var(--ui-scale, 1) * 12px);
      width: calc(var(--ui-scale, 1) * 40px);
      height: calc(var(--ui-scale, 1) * 40px);
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: calc(var(--ui-scale, 1) * 18px);
      cursor: pointer;
      z-index: 600;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: all 0.2s ease;
      user-select: none;
    }
    .sound-toggle-btn:hover {
      background: rgba(30, 41, 59, 0.9);
      transform: scale(1.08);
      border-color: rgba(56, 189, 248, 0.6);
    }
    .sound-toggle-btn:active {
      transform: scale(0.92);
    }
`;

html = html.replace('</style>', `${soundToggleCss}\n  </style>`);

// Add sound toggle element inside #game-container
const soundToggleHtml = `<button id="sound-toggle-btn" class="sound-toggle-btn" title="Toggle Sound">🔊</button>`;
html = html.replace('<canvas id="webgl-canvas"></canvas>', `${soundToggleHtml}\n      <canvas id="webgl-canvas"></canvas>`);

// Add sound toggle JS logic
const soundToggleJs = `
    // Sound Toggle Logic
    let isMuted = false;
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isMuted = !isMuted;
        soundToggleBtn.textContent = isMuted ? '🔇' : '🔊';
        if (currentBgmAudio) {
          currentBgmAudio.muted = isMuted;
        }
      });
    }
`;

html = html.replace("const actionBtn = document.getElementById('action-btn');", `const actionBtn = document.getElementById('action-btn');\n${soundToggleJs}`);

// Ensure playSound honors mute
html = html.replace("function playSound(type) {", "function playSound(type) {\n      if (isMuted) return;");

// Update playCurrentBgm to honor isMuted
html = html.replace("currentBgmAudio.volume = 0.7;", "currentBgmAudio.volume = 0.7;\n      currentBgmAudio.muted = isMuted;");

// Fix HTML title
html = html.replace('<title>MoguraTatakanai</title>', '<title>🐾 Mogura Tatakanai - モグラ叩かない (Pet the Mole 3D)</title>');

const outPath = path.join(__dirname, '..', 'public', 'games', 'mogura-tatakanai', 'index.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Successfully wrote:', outPath);
