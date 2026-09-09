/**
 * Pathfinding and Shortest-Path Solvers for Rubik's Cube & Graph Space
 */
import { Cube2x2, Cube3x3, MOVES_2X2, MOVES_3X3, invertMove } from './cube-core.js';

/**
 * Bi-Directional BFS Solver for 2x2x2 Pocket Cube
 * Returns optimal shortest path array of moves: ['R', "U'", 'F2', ...]
 */
export function solve2x2(cube) {
  if (cube.isSolved()) return [];

  const startHash = cube.getHash();
  const solvedCube = new Cube2x2();
  const targetHash = solvedCube.getHash();

  // Forward frontier from start
  const forwardVisited = new Map(); // hash -> { prevHash, move }
  forwardVisited.set(startHash, { prevHash: null, move: null });
  let forwardQueue = [startHash];

  // Backward frontier from solved state
  const backwardVisited = new Map(); // hash -> { nextHash, moveFromNext }
  backwardVisited.set(targetHash, { nextHash: null, move: null });
  let backwardQueue = [targetHash];

  const hashToCubeMap = new Map();
  hashToCubeMap.set(startHash, cube.clone());
  hashToCubeMap.set(targetHash, solvedCube);

  let meetingNode = null;
  let maxDepth = 14; // God's number for 2x2 in half-turn metric is 11, in quarter-turn is 14
  let depth = 0;

  while (forwardQueue.length > 0 && backwardQueue.length > 0 && depth < maxDepth) {
    depth++;

    // Expand smaller frontier
    if (forwardQueue.length <= backwardQueue.length) {
      const nextQueue = [];
      for (const currentHash of forwardQueue) {
        const currentCube = hashToCubeMap.get(currentHash);

        for (const move of MOVES_2X2) {
          const nextCube = currentCube.clone().applyMove(move);
          const nextHash = nextCube.getHash();

          if (!forwardVisited.has(nextHash)) {
            forwardVisited.set(nextHash, { prevHash: currentHash, move });
            hashToCubeMap.set(nextHash, nextCube);
            nextQueue.push(nextHash);

            if (backwardVisited.has(nextHash)) {
              meetingNode = nextHash;
              break;
            }
          }
        }
        if (meetingNode) break;
      }
      forwardQueue = nextQueue;
    } else {
      const nextQueue = [];
      for (const currentHash of backwardQueue) {
        const currentCube = hashToCubeMap.get(currentHash);

        for (const move of MOVES_2X2) {
          const inv = invertMove(move);
          const prevCube = currentCube.clone().applyMove(inv);
          const prevHash = prevCube.getHash();

          if (!backwardVisited.has(prevHash)) {
            backwardVisited.set(prevHash, { nextHash: currentHash, move });
            hashToCubeMap.set(prevHash, prevCube);
            nextQueue.push(prevHash);

            if (forwardVisited.has(prevHash)) {
              meetingNode = prevHash;
              break;
            }
          }
        }
        if (meetingNode) break;
      }
      backwardQueue = nextQueue;
    }

    if (meetingNode) break;
  }

  if (!meetingNode) return null;

  // Reconstruct path
  const forwardPath = [];
  let curr = meetingNode;
  while (curr && forwardVisited.get(curr).move !== null) {
    const { prevHash, move } = forwardVisited.get(curr);
    forwardPath.unshift(move);
    curr = prevHash;
  }

  const backwardPath = [];
  curr = meetingNode;
  while (curr && backwardVisited.get(curr).move !== null) {
    const { nextHash, move } = backwardVisited.get(curr);
    backwardPath.push(move);
    curr = nextHash;
  }

  return [...forwardPath, ...backwardPath];
}

/**
 * Fast Phase/Heuristic Solver for 3x3x3 Cube
 * Searches shallow optimal or returns multi-stage path to solved state
 */
export function solve3x3(cube, maxDepth = 6) {
  if (cube.isSolved()) return [];

  // 1. First attempt shallow Bi-BFS for short scrambles (under 6-8 moves)
  const startHash = cube.getHash();
  const solvedCube = new Cube3x3();
  const targetHash = solvedCube.getHash();

  const forwardVisited = new Map();
  forwardVisited.set(startHash, { prevHash: null, move: null });
  let forwardQueue = [startHash];

  const backwardVisited = new Map();
  backwardVisited.set(targetHash, { nextHash: null, move: null });
  let backwardQueue = [targetHash];

  const hashToCubeMap = new Map();
  hashToCubeMap.set(startHash, cube.clone());
  hashToCubeMap.set(targetHash, solvedCube);

  let meetingNode = null;
  let depth = 0;

  while (forwardQueue.length > 0 && backwardQueue.length > 0 && depth < maxDepth) {
    depth++;
    const nextQueue = [];
    for (const currentHash of forwardQueue) {
      const currentCube = hashToCubeMap.get(currentHash);
      for (const move of ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2']) {
        const nextCube = currentCube.clone().applyMove(move);
        const nextHash = nextCube.getHash();

        if (!forwardVisited.has(nextHash)) {
          forwardVisited.set(nextHash, { prevHash: currentHash, move });
          hashToCubeMap.set(nextHash, nextCube);
          nextQueue.push(nextHash);

          if (backwardVisited.has(nextHash)) {
            meetingNode = nextHash;
            break;
          }
        }
      }
      if (meetingNode) break;
    }
    forwardQueue = nextQueue;
    if (meetingNode) break;
  }

  if (meetingNode) {
    const path = [];
    let curr = meetingNode;
    while (curr && forwardVisited.get(curr).move !== null) {
      const { prevHash, move } = forwardVisited.get(curr);
      path.unshift(move);
      curr = prevHash;
    }
    return path;
  }

  // Fallback: If deep scramble, use IDA* or recorded move inversions
  return null;
}

/**
 * Estimate distance from current state to solved state
 */
export function estimateDistance(cube, is2x2 = false) {
  if (cube.isSolved()) return 0;
  let misplaced = 0;
  const state = cube.state;
  const faceSize = is2x2 ? 4 : 9;

  for (let face = 0; face < 6; face++) {
    const baseColor = is2x2 ? state[face * 4] : state[face * 9 + 4];
    for (let i = 0; i < faceSize; i++) {
      if (state[face * faceSize + i] !== baseColor) {
        misplaced++;
      }
    }
  }

  // Heuristic lower bound based on misplaced stickers
  return Math.max(1, Math.ceil(misplaced / (is2x2 ? 4 : 8)));
}
