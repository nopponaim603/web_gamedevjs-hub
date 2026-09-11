/**
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
