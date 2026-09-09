/**
 * Rubik's Cube Core State Representation & Transformation Logic
 * Supports both 2x2x2 (Pocket Cube) and 3x3x3 (Standard Cube).
 * 
 * Faces: U (Up: White), D (Down: Yellow), F (Front: Green), B (Back: Blue), L (Left: Orange), R (Right: Red)
 * Standard Facelets Order:
 * - 2x2: 4 stickers per face * 6 faces = 24 facelets
 * - 3x3: 9 stickers per face * 6 faces = 54 facelets
 */

export const MOVES_2X2 = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2'];
export const MOVES_3X3 = ['U', "U'", 'U2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'B', "B'", 'B2'];

export const MOVE_COLORS = {
  'U': '#FFFFFF', "U'": '#E2E8F0', 'U2': '#CBD5E1',
  'D': '#FACC15', "D'": '#EAB308', 'D2': '#CA8A04',
  'F': '#22C55E', "F'": '#16A34A', 'F2': '#15803D',
  'B': '#3B82F6', "B'": '#2563EB', 'B2': '#1D4ED8',
  'L': '#F97316', "L'": '#EA580C', 'L2': '#C2410C',
  'R': '#EF4444', "R'": '#DC2626', 'R2': '#B91C1C'
};

export const COLOR_MAP = {
  'U': '#F8FAFC', // White
  'D': '#FACC15', // Yellow
  'F': '#22C55E', // Green
  'B': '#3B82F6', // Blue
  'L': '#F97316', // Orange
  'R': '#EF4444'  // Red
};

// ==========================================
// 2x2x2 CUBE IMPLEMENTATION
// 24 Facelets: U(0-3), R(4-7), F(8-11), D(12-15), L(16-19), B(20-23)
// ==========================================
export class Cube2x2 {
  constructor(state = null) {
    // Solved state: 4 of each face color
    this.state = state ? [...state] : [
      'U','U','U','U',
      'R','R','R','R',
      'F','F','F','F',
      'D','D','D','D',
      'L','L','L','L',
      'B','B','B','B'
    ];
  }

  clone() {
    return new Cube2x2(this.state);
  }

  isSolved() {
    for (let i = 0; i < 6; i++) {
      const faceColor = this.state[i * 4];
      for (let j = 1; j < 4; j++) {
        if (this.state[i * 4 + j] !== faceColor) return false;
      }
    }
    return true;
  }

  getHash() {
    return this.state.join('');
  }

  applyMove(move) {
    switch (move) {
      case 'U': this._permute([0,1,3,2], [8,9, 4,5, 20,21, 16,17]); break;
      case "U'": this._permute([0,2,3,1], [16,17, 20,21, 4,5, 8,9]); break;
      case 'U2': this.applyMove('U'); this.applyMove('U'); break;

      case 'R': this._permute([4,5,7,6], [1,3, 20,22, 13,15, 9,11]); break;
      case "R'": this._permute([4,6,7,5], [9,11, 13,15, 20,22, 1,3]); break;
      case 'R2': this.applyMove('R'); this.applyMove('R'); break;

      case 'F': this._permute([8,9,11,10], [2,3, 4,6, 13,12, 19,17]); break;
      case "F'": this._permute([8,10,11,9], [19,17, 13,12, 4,6, 2,3]); break;
      case 'F2': this.applyMove('F'); this.applyMove('F'); break;

      case 'D': this._permute([12,13,15,14], [10,11, 18,19, 22,23, 6,7]); break;
      case "D'": this._permute([12,14,15,13], [6,7, 22,23, 18,19, 10,11]); break;
      case 'D2': this.applyMove('D'); this.applyMove('D'); break;

      case 'L': this._permute([16,17,19,18], [0,2, 8,10, 12,14, 21,23]); break;
      case "L'": this._permute([16,18,19,17], [21,23, 12,14, 8,10, 0,2]); break;
      case 'L2': this.applyMove('L'); this.applyMove('L'); break;

      case 'B': this._permute([20,21,23,22], [1,0, 17,16, 14,15, 7,5]); break;
      case "B'": this._permute([20,22,23,21], [7,5, 14,15, 17,16, 1,0]); break;
      case 'B2': this.applyMove('B'); this.applyMove('B'); break;
    }
    return this;
  }

  _permute(faceCycle, sideCycle) {
    // Rotate face 4 stickers clockwise
    const s = this.state;
    const [f0, f1, f2, f3] = faceCycle;
    const tmpF = s[f3];
    s[f3] = s[f2]; s[f2] = s[f1]; s[f1] = s[f0]; s[f0] = tmpF;

    // Rotate 4 adjacent pairs (8 stickers)
    const [a0, a1, b0, b1, c0, c1, d0, d1] = sideCycle;
    const t0 = s[d0], t1 = s[d1];
    s[d0] = s[c0]; s[d1] = s[c1];
    s[c0] = s[b0]; s[c1] = s[b1];
    s[b0] = s[a0]; s[b1] = s[a1];
    s[a0] = t0;    s[a1] = t1;
  }
}

// ==========================================
// 3x3x3 CUBE IMPLEMENTATION
// 54 Facelets:
// U: 0-8, R: 9-17, F: 18-26, D: 27-35, L: 36-44, B: 45-53
// ==========================================
export class Cube3x3 {
  constructor(state = null) {
    this.state = state ? [...state] : [
      'U','U','U','U','U','U','U','U','U',
      'R','R','R','R','R','R','R','R','R',
      'F','F','F','F','F','F','F','F','F',
      'D','D','D','D','D','D','D','D','D',
      'L','L','L','L','L','L','L','L','L',
      'B','B','B','B','B','B','B','B','B'
    ];
  }

  clone() {
    return new Cube3x3(this.state);
  }

  isSolved() {
    for (let i = 0; i < 6; i++) {
      const faceColor = this.state[i * 9 + 4]; // Center color
      for (let j = 0; j < 9; j++) {
        if (this.state[i * 9 + j] !== faceColor) return false;
      }
    }
    return true;
  }

  getHash() {
    return this.state.join('');
  }

  applyMove(move) {
    switch (move) {
      case 'U':
        this._rotateFaceClockwise(0);
        this._cycle4([18,19,20], [9,10,11], [45,46,47], [36,37,38]);
        break;
      case "U'":
        this._rotateFaceCounterClockwise(0);
        this._cycle4([36,37,38], [45,46,47], [9,10,11], [18,19,20]);
        break;
      case 'U2': this.applyMove('U'); this.applyMove('U'); break;

      case 'D':
        this._rotateFaceClockwise(27);
        this._cycle4([24,25,26], [42,43,44], [51,52,53], [15,16,17]);
        break;
      case "D'":
        this._rotateFaceCounterClockwise(27);
        this._cycle4([15,16,17], [51,52,53], [42,43,44], [24,25,26]);
        break;
      case 'D2': this.applyMove('D'); this.applyMove('D'); break;

      case 'R':
        this._rotateFaceClockwise(9);
        this._cycle4([2,5,8], [45,48,51], [29,32,35], [20,23,26]);
        break;
      case "R'":
        this._rotateFaceCounterClockwise(9);
        this._cycle4([20,23,26], [29,32,35], [45,48,51], [2,5,8]);
        break;
      case 'R2': this.applyMove('R'); this.applyMove('R'); break;

      case 'L':
        this._rotateFaceClockwise(36);
        this._cycle4([0,3,6], [18,21,24], [27,30,33], [47,50,53]);
        break;
      case "L'":
        this._rotateFaceCounterClockwise(36);
        this._cycle4([47,50,53], [27,30,33], [18,21,24], [0,3,6]);
        break;
      case 'L2': this.applyMove('L'); this.applyMove('L'); break;

      case 'F':
        this._rotateFaceClockwise(18);
        this._cycle4([6,7,8], [9,12,15], [29,28,27], [44,41,38]);
        break;
      case "F'":
        this._rotateFaceCounterClockwise(18);
        this._cycle4([44,41,38], [29,28,27], [9,12,15], [6,7,8]);
        break;
      case 'F2': this.applyMove('F'); this.applyMove('F'); break;

      case 'B':
        this._rotateFaceClockwise(45);
        this._cycle4([2,1,0], [36,39,42], [33,34,35], [17,14,11]);
        break;
      case "B'":
        this._rotateFaceCounterClockwise(45);
        this._cycle4([17,14,11], [33,34,35], [36,39,42], [2,1,0]);
        break;
      case 'B2': this.applyMove('B'); this.applyMove('B'); break;
    }
    return this;
  }

  _rotateFaceClockwise(base) {
    const s = this.state;
    // Corners
    const tmp = s[base + 6];
    s[base + 6] = s[base + 8];
    s[base + 8] = s[base + 2];
    s[base + 2] = s[base + 0];
    s[base + 0] = tmp;
    // Edges
    const tmpE = s[base + 3];
    s[base + 3] = s[base + 7];
    s[base + 7] = s[base + 5];
    s[base + 5] = s[base + 1];
    s[base + 1] = tmpE;
  }

  _rotateFaceCounterClockwise(base) {
    this._rotateFaceClockwise(base);
    this._rotateFaceClockwise(base);
    this._rotateFaceClockwise(base);
  }

  _cycle4(a, b, c, d) {
    const s = this.state;
    for (let i = 0; i < 3; i++) {
      const tmp = s[d[i]];
      s[d[i]] = s[c[i]];
      s[c[i]] = s[b[i]];
      s[b[i]] = s[a[i]];
      s[a[i]] = tmp;
    }
  }
}

/**
 * Invert a move (e.g. R -> R', R' -> R, R2 -> R2)
 */
export function invertMove(move) {
  if (move.endsWith('2')) return move;
  if (move.endsWith("'")) return move.slice(0, -1);
  return move + "'";
}
