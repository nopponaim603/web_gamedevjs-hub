/**
 * Card Memory Match — Card Entity
 * Represents an interactive memory card with flip and shake animations
 */

class Card {
  constructor(id, suit, value, imageKey) {
    this.id = id;
    this.suit = suit;
    this.value = value;
    this.imageKey = imageKey;

    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 140;

    this.isFlipped = false;
    this.isMatched = false;

    // Animation properties
    this.flipProgress = 0; // 0 = face down (back), 1 = face up (front)
    this.targetFlip = 0;
    this.scale = 1;
    this.shakeX = 0;
    this.bounceY = 0;
    this.isHovered = false;
  }

  update(dt) {
    // Flip animation interpolation
    if (Math.abs(this.flipProgress - this.targetFlip) > 0.01) {
      this.flipProgress += (this.targetFlip - this.flipProgress) * 14 * dt;
    } else {
      this.flipProgress = this.targetFlip;
    }

    // Shake animation for mismatch
    if (this.shakeX !== 0) {
      this.shakeX *= 0.85;
      if (Math.abs(this.shakeX) < 0.1) this.shakeX = 0;
    }

    // Hover animation
    const targetScale = this.isMatched ? 0.96 : this.isHovered ? 1.05 : 1.0;
    this.scale += (targetScale - this.scale) * 10 * dt;
  }

  draw(ctx, images) {
    ctx.save();
    const centerX = this.x + this.width / 2 + this.shakeX;
    const centerY = this.y + this.height / 2 + this.bounceY;

    ctx.translate(centerX, centerY);
    ctx.scale(this.scale, this.scale);

    // Cosine flip scale effect
    const flipScaleX = Math.cos(this.flipProgress * Math.PI);
    ctx.scale(Math.abs(flipScaleX), 1);

    const drawW = this.width;
    const drawH = this.height;
    const rx = -drawW / 2;
    const ry = -drawH / 2;
    const radius = 10;

    // Card Drop Shadow
    if (!this.isMatched) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = this.isHovered ? 18 : 10;
      ctx.shadowOffsetY = this.isHovered ? 8 : 4;
    }

    // Determine Front vs Back image
    const showFront = flipScaleX <= 0; // When flip passes 90 deg (scaleX crosses 0)
    const img = showFront ? images[this.imageKey] : images['card_back'];

    if (img && img.complete && img.naturalWidth !== 0) {
      // Draw rounded image
      ctx.beginPath();
      ctx.roundRect(rx, ry, drawW, drawH, radius);
      ctx.clip();
      ctx.drawImage(img, rx, ry, drawW, drawH);
    } else {
      // Fallback procedural card
      ctx.fillStyle = showFront ? '#ffffff' : '#2563eb';
      ctx.beginPath();
      ctx.roundRect(rx, ry, drawW, drawH, radius);
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (showFront) {
        ctx.fillStyle = (this.suit === 'hearts' || this.suit === 'diamonds') ? '#ef4444' : '#0f172a';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const suitIcon = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' }[this.suit] || '';
        ctx.fillText(`${this.value}${suitIcon}`, 0, 0);
      }
    }

    ctx.restore();

    // Highlight / Matched Glow Overlay
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(this.scale, this.scale);
    if (this.isMatched) {
      ctx.beginPath();
      ctx.roundRect(rx, ry, drawW, drawH, radius);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (this.isHovered && !this.isFlipped) {
      ctx.beginPath();
      ctx.roundRect(rx, ry, drawW, drawH, radius);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();
  }

  containsPoint(px, py) {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }
}

window.Card = Card;
