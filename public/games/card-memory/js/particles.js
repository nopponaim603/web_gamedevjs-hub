/**
 * Card Memory Match — Particle System
 * Particle Sparkles & Victory Effects
 */

class CardParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnSparkles(x, y, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        size: 3 + Math.random() * 5,
        color: ['#fbbf24', '#34d399', '#38bdf8', '#f472b6'][Math.floor(Math.random() * 4)],
        alpha: 1,
        life: 0.6 + Math.random() * 0.4,
      });
    }
    if (this.particles.length > 60) {
      this.particles.splice(0, this.particles.length - 60);
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
      p.vy += 120 * dt; // gravity
      p.alpha = p.life;
    }
  }

  draw(ctx) {
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  clear() {
    this.particles = [];
  }
}

window.CardParticleSystem = CardParticleSystem;
