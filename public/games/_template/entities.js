/**
 * Game Template — Entity & Game Object Classes
 */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 24;
        this.targetX = x;
        this.color = window.GAME_CONFIG.COLORS.PRIMARY;
    }

    setTarget(targetX) {
        this.targetX = targetX;
    }

    update(dt) {
        // Smooth lerp to target
        this.x += (this.targetX - this.x) * Math.min(1, 15 * dt);
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

window.Player = Player;
