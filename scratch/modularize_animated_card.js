const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, '..', 'public', 'games', 'animated-card-game');
const gameJsPath = path.join(gameDir, 'game.js');
const rawJs = fs.readFileSync(gameJsPath, 'utf8');

// 1. Extract SoundHapticEngine -> audio.js
const audioCode = `/**
 * FOOL THE GAME — Audio & Haptics Engine
 * Web Audio API synthesized sound effects & tactile feedback
 */

class SoundHapticEngine {
  constructor() {
    this.ctx = null;
    this.initAudio();
  }

  initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  vibrate(pattern) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1, pitchShift = 0) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq + pitchShift, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playCardSwish() {
    this.playTone(350, 'triangle', 0.08, 0.08);
    this.vibrate(5);
  }

  playCardDrop() {
    this.playTone(180, 'sine', 0.12, 0.2);
    this.vibrate(20);
  }

  playButtonClick() {
    this.playTone(520, 'sine', 0.06, 0.15);
    this.vibrate(10);
  }

  playTakeCards() {
    this.playTone(220, 'sawtooth', 0.2, 0.12);
    this.vibrate([30, 40, 30]);
  }

  playDiscard() {
    this.playTone(440, 'triangle', 0.15, 0.15);
    this.vibrate(15);
  }

  playCoinSound(pitchIndex = 0) {
    const baseFreq = 800;
    this.playTone(baseFreq + pitchIndex * 60, 'sine', 0.1, 0.12);
  }

  playWinFanfare() {
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.15), i * 120);
    });
    this.vibrate([50, 50, 50, 100]);
  }
}

window.SoundHapticEngine = SoundHapticEngine;
`;

fs.writeFileSync(path.join(gameDir, 'audio.js'), audioCode, 'utf8');
console.log('Created animated-card-game/audio.js');

// 2. Extract ParticleSystem -> particles.js
const particlesCode = `/**
 * FOOL THE GAME — Particle & FX Engine
 * Juicy coin particles & victory confetti
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnCoins(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 240;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 80,
        size: 6 + Math.random() * 6,
        color: ['#FBBF24', '#F59E0B', '#FDE68A', '#38BDF8'][Math.floor(Math.random() * 4)],
        alpha: 1,
        life: 0.8 + Math.random() * 0.5,
        maxLife: 0.8 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }
  }

  spawnConfetti(w, h, count = 50) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: -20,
        vx: (Math.random() - 0.5) * 60,
        vy: 100 + Math.random() * 180,
        size: 8 + Math.random() * 8,
        color: ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
        alpha: 1,
        life: 2.5 + Math.random() * 1.5,
        maxLife: 4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 220 * dt; // gravity
      p.rotation += p.rotSpeed * dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
    }
  }

  draw(ctx) {
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-p.size / 2, -p.size / 2, p.size, p.size, 2);
      ctx.fill();
      ctx.restore();
    });
  }

  clear() {
    this.particles = [];
  }
}

window.ParticleSystem = ParticleSystem;
`;

fs.writeFileSync(path.join(gameDir, 'particles.js'), particlesCode, 'utf8');
console.log('Created animated-card-game/particles.js');

// 3. Extract Card Entity -> card.js
const cardCode = `/**
 * FOOL THE GAME — Card Entity & Canvas 2D Renderer
 */

const SUITS = [
  { symbol: '♠', color: '#1E293B', name: 'spades' },
  { symbol: '♥', color: '#EF4444', name: 'hearts' },
  { symbol: '♦', color: '#3B82F6', name: 'diamonds' },
  { symbol: '♣', color: '#10B981', name: 'clubs' }
];
const RANKS = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

class Card {
  constructor(rank, suit, id) {
    this.id = id;
    this.rank = rank;
    this.suit = suit;
    this.value = RANKS.indexOf(rank) + 6;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.angle = 0; // in degrees
    this.targetAngle = 0;
    this.scaleX = 1; // For 3D flip effect
    this.scaleY = 1;
    this.isFaceUp = true;
    this.isDragging = false;
    this.isHovered = false;
    this.width = 72;
    this.height = 104;
    this.slotIndex = -1;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.scale(this.scaleX, this.scaleY);

    const w = this.width;
    const h = this.height;
    const hoverOffset = this.isHovered ? -12 : 0;

    // Drop Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = this.isDragging ? 16 : 8;
    ctx.shadowOffsetY = this.isDragging ? 12 : 4 + hoverOffset;

    // Card Base (Rounded Rect)
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2 + hoverOffset, w, h, 10);
    
    if (!this.isFaceUp) {
      // Card Back Design
      ctx.fillStyle = '#312E81';
      ctx.fill();
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner Pattern
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 6, -h / 2 + hoverOffset + 6, w - 12, h - 12, 6);
      ctx.fillStyle = '#4338CA';
      ctx.fill();

      // Center Emblem
      ctx.fillStyle = '#818CF8';
      ctx.font = '700 16px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FOOL', 0, hoverOffset);
    } else {
      // Card Face Design
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = this.isDragging ? '#3B82F6' : '#E2E8F0';
      ctx.lineWidth = this.isDragging ? 3 : 1.5;
      ctx.stroke();

      // Rank Top-Left
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = this.suit.color;
      ctx.font = '800 15px Fredoka, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(this.rank, -w / 2 + 7, -h / 2 + hoverOffset + 18);
      ctx.font = '14px Outfit, sans-serif';
      ctx.fillText(this.suit.symbol, -w / 2 + 7, -h / 2 + hoverOffset + 32);

      // Center Big Symbol
      ctx.font = '28px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.suit.symbol, 0, hoverOffset + 2);

      // Rank Bottom-Right (Inverted)
      ctx.save();
      ctx.translate(w / 2 - 7, h / 2 + hoverOffset - 18);
      ctx.rotate(Math.PI);
      ctx.font = '800 15px Fredoka, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(this.rank, 0, 0);
      ctx.font = '14px Outfit, sans-serif';
      ctx.fillText(this.suit.symbol, 0, 14);
      ctx.restore();
    }

    ctx.restore();
  }

  contains(px, py) {
    const halfW = this.width / 2;
    const halfH = this.height / 2;
    return px >= this.x - halfW && px <= this.x + halfW && py >= this.y - halfH && py <= this.y + halfH;
  }
}

window.SUITS = SUITS;
window.RANKS = RANKS;
window.Card = Card;
`;

fs.writeFileSync(path.join(gameDir, 'card.js'), cardCode, 'utf8');
console.log('Created animated-card-game/card.js');

// 4. Clean up game.js to load GameManager
// Remove SoundHapticEngine, Card class definition, and ParticleSystem definition from game.js
let cleanGameJs = rawJs;
// Remove SoundHapticEngine class
cleanGameJs = cleanGameJs.replace(/\/\/ --- Audio & Haptics Engine ---[\s\S]*?const audioHaptic = new SoundHapticEngine\(\);/, 'const audioHaptic = new window.SoundHapticEngine();');
// Remove Card class and SUITS/RANKS
cleanGameJs = cleanGameJs.replace(/\/\/ --- Card Data Structure ---[\s\S]*?contains\(px, py\) \{[\s\S]*?\}\s*\}/, '');
// Remove ParticleSystem class
cleanGameJs = cleanGameJs.replace(/class ParticleSystem \{[\s\S]*?clear\(\) \{[\s\S]*?\}\s*\}/, '');

fs.writeFileSync(gameJsPath, cleanGameJs, 'utf8');
console.log('Updated animated-card-game/game.js');

// 5. Update index.html
const indexPath = path.join(gameDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('audio.js')) {
  indexHtml = indexHtml.replace(
    '<script src="game.js"></script>',
    '<script src="audio.js"></script>\n  <script src="particles.js"></script>\n  <script src="card.js"></script>\n  <script src="game.js"></script>'
  );
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('Updated animated-card-game/index.html');
}
