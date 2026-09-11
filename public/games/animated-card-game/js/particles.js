/**
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
