/**
 * Interactive Force-Directed Graph Engine for Rubik's State Space (Cayley Graph)
 * Renders nodes (Cube States) and edges (Move Transitions) on HTML5 2D Canvas with 60FPS physics.
 */
import { MOVE_COLORS, COLOR_MAP, invertMove } from './cube-core.js';

export class GraphVisualizer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onNodeClick = options.onNodeClick || (() => {});
    this.onNodeHover = options.onNodeHover || (() => {});

    // Graph Data
    this.nodes = new Map(); // hash -> NodeObject
    this.edges = [];        // [{ fromHash, toHash, move, color }]
    this.activeHash = null;
    this.solvedHash = null;
    this.highlightPath = []; // Array of hashes in active path

    // Camera / Pan-Zoom
    this.transform = { x: 0, y: 0, scale: 1 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.hoveredNode = null;
    this.draggedNode = null;

    // Simulation parameters
    this.repulsion = 4200;
    this.springLength = 85;
    this.springK = 0.05;
    this.damping = 0.85;
    this.isRunning = true;

    // Pulse / Animation timer
    this.animTime = 0;

    this._setupEvents();
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    if (this.transform.x === 0 && this.transform.y === 0) {
      this.transform.x = this.width / 2;
      this.transform.y = this.height / 2;
    }
  }

  _setupEvents() {
    const c = this.canvas;

    c.addEventListener('mousedown', (e) => {
      const pos = this._screenToWorld(e.clientX, e.clientY);
      const clicked = this._findNodeAt(pos.x, pos.y);
      if (clicked) {
        this.draggedNode = clicked;
        this.onNodeClick(clicked);
      } else {
        this.isDragging = true;
        this.dragStart = { x: e.clientX - this.transform.x, y: e.clientY - this.transform.y };
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = c.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        if (!this.isDragging && !this.draggedNode) return;
      }

      if (this.draggedNode) {
        const pos = this._screenToWorld(e.clientX, e.clientY);
        this.draggedNode.x = pos.x;
        this.draggedNode.y = pos.y;
        this.draggedNode.vx = 0;
        this.draggedNode.vy = 0;
      } else if (this.isDragging) {
        this.transform.x = e.clientX - this.dragStart.x;
        this.transform.y = e.clientY - this.dragStart.y;
      } else {
        const pos = this._screenToWorld(e.clientX, e.clientY);
        const hovered = this._findNodeAt(pos.x, pos.y);
        if (hovered !== this.hoveredNode) {
          this.hoveredNode = hovered;
          this.canvas.style.cursor = hovered ? 'pointer' : 'grab';
          this.onNodeHover(hovered, e.clientX, e.clientY);
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.draggedNode = null;
    });

    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const rect = c.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const wx = (mx - this.transform.x) / this.transform.scale;
      const wy = (my - this.transform.y) / this.transform.scale;

      this.transform.scale = Math.max(0.15, Math.min(3.5, this.transform.scale * zoomFactor));
      this.transform.x = mx - wx * this.transform.scale;
      this.transform.y = my - wy * this.transform.scale;
    }, { passive: false });

    // Touch support
    let lastTouchDist = 0;
    c.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const pos = this._screenToWorld(t.clientX, t.clientY);
        const clicked = this._findNodeAt(pos.x, pos.y);
        if (clicked) {
          this.draggedNode = clicked;
          this.onNodeClick(clicked);
        } else {
          this.isDragging = true;
          this.dragStart = { x: t.clientX - this.transform.x, y: t.clientY - this.transform.y };
        }
      } else if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    c.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        if (this.draggedNode) {
          const pos = this._screenToWorld(t.clientX, t.clientY);
          this.draggedNode.x = pos.x;
          this.draggedNode.y = pos.y;
        } else if (this.isDragging) {
          this.transform.x = t.clientX - this.dragStart.x;
          this.transform.y = t.clientY - this.dragStart.y;
        }
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastTouchDist > 0) {
          const factor = dist / lastTouchDist;
          this.transform.scale = Math.max(0.15, Math.min(3.5, this.transform.scale * factor));
        }
        lastTouchDist = dist;
      }
    });

    c.addEventListener('touchend', () => {
      this.isDragging = false;
      this.draggedNode = null;
      lastTouchDist = 0;
    });
  }

  _screenToWorld(screenX, screenY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = screenX - rect.left;
    const y = screenY - rect.top;
    return {
      x: (x - this.transform.x) / this.transform.scale,
      y: (y - this.transform.y) / this.transform.scale
    };
  }

  _findNodeAt(wx, wy) {
    for (const node of this.nodes.values()) {
      const dist = Math.hypot(node.x - wx, node.y - wy);
      if (dist <= node.radius + 6) return node;
    }
    return null;
  }

  reset() {
    this.nodes.clear();
    this.edges = [];
    this.activeHash = null;
    this.solvedHash = null;
    this.highlightPath = [];
  }

  addNode(hash, cubeInstance, isSolved = false, depth = 0) {
    if (this.nodes.has(hash)) {
      const n = this.nodes.get(hash);
      if (isSolved) n.isSolved = true;
      return n;
    }

    // Spawn near active node or center
    let x = (Math.random() - 0.5) * 60;
    let y = (Math.random() - 0.5) * 60;
    if (this.activeHash && this.nodes.has(this.activeHash)) {
      const parent = this.nodes.get(this.activeHash);
      const angle = Math.random() * Math.PI * 2;
      x = parent.x + Math.cos(angle) * this.springLength;
      y = parent.y + Math.sin(angle) * this.springLength;
    }

    const node = {
      hash,
      cube: cubeInstance.clone(),
      isSolved,
      depth,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: isSolved ? 20 : 16,
      color: isSolved ? '#F59E0B' : '#0284C7'
    };

    if (isSolved) {
      this.solvedHash = hash;
      node.x = 0;
      node.y = 0;
    }

    this.nodes.set(hash, node);
    return node;
  }

  addEdge(fromHash, toHash, move) {
    const exists = this.edges.some(e => 
      (e.fromHash === fromHash && e.toHash === toHash && e.move === move) ||
      (e.fromHash === toHash && e.toHash === fromHash)
    );
    if (!exists) {
      this.edges.push({
        fromHash,
        toHash,
        move,
        color: MOVE_COLORS[move] || '#94A3B8'
      });
    }
  }

  setActive(hash) {
    this.activeHash = hash;
  }

  setHighlightPath(pathHashes) {
    this.highlightPath = pathHashes || [];
  }

  centerOnNode(hash) {
    const node = this.nodes.get(hash);
    if (!node) return;
    this.transform.x = this.width / 2 - node.x * this.transform.scale;
    this.transform.y = this.height / 2 - node.y * this.transform.scale;
  }

  // Force-directed physics step
  updatePhysics() {
    const nodes = Array.from(this.nodes.values());
    const count = nodes.length;
    if (count === 0) return;

    // 1. Repulsion between all node pairs
    for (let i = 0; i < count; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < count; j++) {
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        let dist = Math.hypot(dx, dy) || 1;
        if (dist < 400) {
          const force = this.repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }
    }

    // 2. Spring attraction along edges
    for (const edge of this.edges) {
      const n1 = this.nodes.get(edge.fromHash);
      const n2 = this.nodes.get(edge.toHash);
      if (!n1 || !n2) continue;

      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.hypot(dx, dy) || 1;
      const displacement = dist - this.springLength;
      const force = displacement * this.springK;

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      n1.vx += fx;
      n1.vy += fy;
      n2.vx -= fx;
      n2.vy -= fy;
    }

    // 3. Central gravity (pull towards center slightly)
    for (const n of nodes) {
      if (n.hash === this.solvedHash) {
        // Anchor solved state near center
        n.vx -= n.x * 0.05;
        n.vy -= n.y * 0.05;
      } else {
        n.vx -= n.x * 0.003;
        n.vy -= n.y * 0.003;
      }

      // Apply damping & velocity
      n.vx *= this.damping;
      n.vy *= this.damping;

      if (n !== this.draggedNode) {
        n.x += n.vx;
        n.y += n.vy;
      }
    }
  }

  render() {
    this.animTime += 0.03;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Background Cyber Grid
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, w, h);

    // Apply Camera pan/zoom
    ctx.translate(this.transform.x, this.transform.y);
    ctx.scale(this.transform.scale, this.transform.scale);

    // Draw Grid Lines in world space
    this._drawGrid(ctx);

    // 1. Draw Edges
    for (const edge of this.edges) {
      const n1 = this.nodes.get(edge.fromHash);
      const n2 = this.nodes.get(edge.toHash);
      if (!n1 || !n2) continue;

      const isPathEdge = this._isEdgeInPath(edge.fromHash, edge.toHash);

      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);

      if (isPathEdge) {
        // High-energy glowing gold laser edge
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 15;
      } else {
        ctx.strokeStyle = edge.color || 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Move badge on midpoint
      const mx = (n1.x + n2.x) / 2;
      const my = (n1.y + n2.y) / 2;
      this._drawMoveBadge(ctx, mx, my, edge.move, isPathEdge);
    }

    // 2. Draw Nodes
    for (const node of this.nodes.values()) {
      const isActive = node.hash === this.activeHash;
      const isSolved = node.isSolved;
      const isHovered = node === this.hoveredNode;
      const isInPath = this.highlightPath.includes(node.hash);

      ctx.save();
      ctx.translate(node.x, node.y);

      // Outer Glow Rings
      if (isSolved) {
        const pulse = 1 + Math.sin(this.animTime * 3) * 0.2;
        ctx.beginPath();
        ctx.arc(0, 0, (node.radius + 10) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (isActive) {
        const pulse = 1 + Math.cos(this.animTime * 4) * 0.25;
        ctx.beginPath();
        ctx.arc(0, 0, (node.radius + 12) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#22D3EE';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 18;
        ctx.stroke();
      }

      // Base Node Circle
      ctx.beginPath();
      ctx.arc(0, 0, node.radius, 0, Math.PI * 2);

      let grad = ctx.createRadialGradient(0, 0, 2, 0, 0, node.radius);
      if (isSolved) {
        grad.addColorStop(0, '#FEF08A');
        grad.addColorStop(1, '#D97706');
      } else if (isActive) {
        grad.addColorStop(0, '#A5F3FC');
        grad.addColorStop(1, '#0891B2');
      } else if (isInPath) {
        grad.addColorStop(0, '#FED7AA');
        grad.addColorStop(1, '#EA580C');
      } else {
        grad.addColorStop(0, '#38BDF8');
        grad.addColorStop(1, '#0F172A');
      }

      ctx.fillStyle = grad;
      ctx.shadowColor = isSolved ? '#F59E0B' : (isActive ? '#00F2FE' : '#38BDF8');
      ctx.shadowBlur = (isActive || isSolved) ? 14 : (isHovered ? 10 : 4);
      ctx.fill();

      // Border
      ctx.lineWidth = (isActive || isSolved || isHovered) ? 3 : 1.5;
      ctx.strokeStyle = isSolved ? '#FFFFFF' : (isActive ? '#E0F2FE' : 'rgba(255, 255, 255, 0.4)');
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Mini 2x2/3x3 Face Preview Inside Node
      this._drawMiniCube(ctx, node.cube, node.radius * 0.65);

      ctx.restore();
    }

    ctx.restore();
  }

  _drawGrid(ctx) {
    const gridSize = 80;
    const count = 30;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -gridSize * count; x <= gridSize * count; x += gridSize) {
      ctx.moveTo(x, -gridSize * count);
      ctx.lineTo(x, gridSize * count);
    }
    for (let y = -gridSize * count; y <= gridSize * count; y += gridSize) {
      ctx.moveTo(-gridSize * count, y);
      ctx.lineTo(gridSize * count, y);
    }
    ctx.stroke();
  }

  _drawMoveBadge(ctx, x, y, move, isPath) {
    ctx.save();
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textWidth = ctx.measureText(move).width + 6;

    ctx.fillStyle = isPath ? '#B45309' : '#0F172A';
    ctx.strokeStyle = isPath ? '#F59E0B' : 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.roundRect(x - textWidth / 2, y - 7, textWidth, 14, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPath ? '#FEF08A' : '#F8FAFC';
    ctx.fillText(move, x, y);
    ctx.restore();
  }

  _drawMiniCube(ctx, cube, size) {
    if (!cube) return;
    const is2x2 = cube.state.length === 24;
    const dim = is2x2 ? 2 : 3;
    const tileSize = size * 2 / dim;
    const startX = -size;
    const startY = -size;

    // Draw the Up face (or composite view)
    for (let row = 0; row < dim; row++) {
      for (let col = 0; col < dim; col++) {
        const idx = row * dim + col;
        const colorKey = cube.state[idx];
        const color = COLOR_MAP[colorKey] || '#FFFFFF';

        ctx.fillStyle = color;
        ctx.fillRect(startX + col * tileSize + 0.5, startY + row * tileSize + 0.5, tileSize - 1, tileSize - 1);
      }
    }
  }

  _isEdgeInPath(h1, h2) {
    if (this.highlightPath.length < 2) return false;
    for (let i = 0; i < this.highlightPath.length - 1; i++) {
      const a = this.highlightPath[i];
      const b = this.highlightPath[i + 1];
      if ((a === h1 && b === h2) || (a === h2 && b === h1)) return true;
    }
    return false;
  }

  /**
   * Ultra-fast BFS search over the ALREADY VISIBLE graph nodes and edges (0.01 ms).
   * Finds the exact trail from fromHash back to toHash (Root Solved State).
   */
  findShortestPathInGraph(fromHash, toHash) {
    if (fromHash === toHash) return { moves: [], hashes: [fromHash] };
    if (!this.nodes.has(fromHash) || !this.nodes.has(toHash)) return null;

    const queue = [fromHash];
    const visited = new Map();
    visited.set(fromHash, { prevHash: null, move: null });

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === toHash) break;

      for (const edge of this.edges) {
        let neighbor = null;
        let move = null;

        if (edge.fromHash === curr) {
          neighbor = edge.toHash;
          move = edge.move;
        } else if (edge.toHash === curr) {
          neighbor = edge.fromHash;
          move = invertMove(edge.move);
        }

        if (neighbor && !visited.has(neighbor)) {
          visited.set(neighbor, { prevHash: curr, move });
          queue.push(neighbor);
        }
      }
    }

    if (!visited.has(toHash)) return null;

    const moves = [];
    const hashes = [toHash];
    let curr = toHash;
    while (curr !== fromHash) {
      const info = visited.get(curr);
      if (!info || !info.prevHash) break;
      moves.unshift(info.move);
      hashes.unshift(info.prevHash);
      curr = info.prevHash;
    }

    return { moves, hashes };
  }
}

