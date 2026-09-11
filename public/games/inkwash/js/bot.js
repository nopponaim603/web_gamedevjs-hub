import { BAL } from './balance.js';
import { mulberry32 } from './sim.js';

export const PERSONA = {
  farmer: {
    loopScale: 0.5,
    threatR: 12,
    huntR: 0,
    huntBias: 0,
    safety: 0.55,
    boostFlee: true,
    boostHunt: false,
  },
  hunter: {
    loopScale: 0.7,
    threatR: 9,
    huntR: 20,
    huntBias: 0.9,
    safety: 0.6,
    boostFlee: true,
    boostHunt: true,
  },
  raider: {
    loopScale: 1.35,
    threatR: 6,
    huntR: 12,
    huntBias: 0.4,
    safety: 0.72,
    boostFlee: false,
    boostHunt: true,
  },
};

export const PERSONAS = ['farmer', 'hunter', 'raider'];

/**
 * Returns a deterministic persona for a given player slot.
 */
export function personaFor(slot) {
  const rotation = [
    'farmer',
    'hunter',
    'raider',
    'raider',
    'farmer',
    'hunter',
    'raider',
    'farmer',
    'hunter',
    'raider',
  ];
  return rotation[slot % rotation.length];
}

/**
 * Creates an autonomous AI Bot controller for a player slot.
 *
 * @param {Object} gameClient - Sim / Game state container (with .S and .sendInput / .localInput)
 * @param {number} slot - Player slot index (0..9)
 * @param {string} personaType - 'farmer' | 'hunter' | 'raider'
 * @param {number} seed - Random number generator seed
 */
export function createBot(gameClient, slot, personaType, seed = 1) {
  const persona = PERSONA[personaType] || PERSONA.farmer;
  const rng = mulberry32((seed ^ (slot * 0x9e3779b1)) >>> 0);
  const gridSize = gameClient.S.G;

  const bot = {
    state: 'plan', // 'plan' | 'loop' | 'hunt' | 'return'
    waypoints: [],
    wpIndex: 0,
    huntSlot: -1,
    lastDecideTick: -1000,
    reactMs: 0,
  };

  const getPlayer = () => gameClient.S.players[slot];
  const isMyCell = (cellIdx) => gameClient.S.grid[cellIdx] === slot + 1;

  /**
   * Finds the nearest cell owned by this bot using an expanding ring search.
   */
  function findNearestTerritory(x, y) {
    for (let radius = 0; radius < gridSize; radius++) {
      const minX = Math.max(0, (x | 0) - radius);
      const maxX = Math.min(gridSize - 1, (x | 0) + radius);
      const minY = Math.max(0, (y | 0) - radius);
      const maxY = Math.min(gridSize - 1, (y | 0) + radius);

      for (let cy = minY; cy <= maxY; cy++) {
        for (let cx = minX; cx <= maxX; cx++) {
          // Only check perimeter of the current search box
          if (cy !== minY && cy !== maxY && cx !== minX && cx !== maxX) continue;
          if (isMyCell(cy * gridSize + cx)) {
            return [cx + 0.5, cy + 0.5];
          }
        }
      }
    }
    return null;
  }

  /**
   * Finds the closest alive enemy player.
   */
  function findNearestEnemy() {
    const me = getPlayer();
    let nearestEnemy = null;
    let minDistance = 1e9;

    for (const other of gameClient.S.players) {
      if (!other || other.slot === slot || !other.alive) continue;
      if (gameClient.S.tick < other.spawnProtUntil) continue;

      const dist = Math.hypot(other.x - me.x, other.y - me.y);
      if (dist < minDistance) {
        minDistance = dist;
        nearestEnemy = other;
      }
    }
    return [nearestEnemy, minDistance];
  }

  /**
   * Samples 16 directions around the bot to find the most profitable expansion heading.
   */
  function pickExpansionHeading() {
    const me = getPlayer();
    let bestHeading = 0;
    let bestScore = -1e9;

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      let score = rng() * 0.4;

      // Sample outward along the ray
      for (let dist = 3; dist <= 21; dist += 3) {
        const sampleX = me.x + cosA * dist;
        const sampleY = me.y + sinA * dist;

        // Penalize proximity to board boundaries
        if (sampleX < 3 || sampleY < 3 || sampleX > gridSize - 3 || sampleY > gridSize - 3) {
          score -= 2.5;
          continue;
        }

        const cellOwner = gameClient.S.grid[(sampleY | 0) * gridSize + (sampleX | 0)];
        if (cellOwner === 0) {
          score += 1.0; // Unclaimed neutral territory
        } else if (cellOwner !== slot + 1) {
          score += 1.35; // Enemy territory to conquer
        }
      }

      // Penalize heading into close proximity with active enemies
      for (const other of gameClient.S.players) {
        if (!other || other.slot === slot || !other.alive) continue;
        const enemyDist = Math.hypot(other.x - (me.x + cosA * 10), other.y - (me.y + sinA * 10));
        if (enemyDist < 16) {
          score -= (16 - enemyDist) * 0.6;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestHeading = angle;
      }
    }
    return bestHeading;
  }

  /**
   * Generates waypoints for a rectangular loop to capture territory.
   */
  function planExpansionLoop() {
    const me = getPlayer();
    const heading = pickExpansionHeading();
    const maxPathDist = (me.ink / BAL.inkDrainOut) * BAL.speed * persona.loopScale;

    const loopLength = Math.max(5, Math.min(34, maxPathDist * 0.3 * persona.safety));
    const loopWidth = Math.max(4, Math.min(26, maxPathDist * 0.2 * persona.safety));
    const turnSign = rng() < 0.5 ? 1 : -1;

    const cosH = Math.cos(heading);
    const sinH = Math.sin(heading);
    const perpX = -sinH * turnSign;
    const perpY = cosH * turnSign;

    const clampCoord = (val, min, max) => Math.min(max, Math.max(min, val));
    const makePt = (x, y) => [clampCoord(x, 2, gridSize - 2), clampCoord(y, 2, gridSize - 2)];

    bot.waypoints = [
      makePt(me.x + cosH * loopLength, me.y + sinH * loopLength),
      makePt(me.x + cosH * loopLength + perpX * loopWidth, me.y + sinH * loopLength + perpY * loopWidth),
      makePt(me.x + perpX * loopWidth, me.y + perpY * loopWidth),
      makePt(me.x, me.y),
    ];
    bot.wpIndex = 0;
    bot.state = 'loop';
  }

  /**
   * Attempts to hunt an enemy trail if an intercept is viable.
   */
  function attemptTrailHunt() {
    if (!persona.huntR || rng() > persona.huntBias) return false;

    const me = getPlayer();
    let targetPoint = null;
    let closestDist = 1e9;
    let targetEnemySlot = -1;

    for (const enemy of gameClient.S.players) {
      if (!enemy || enemy.slot === slot || !enemy.alive) continue;
      if (gameClient.S.tick < enemy.spawnProtUntil) continue;
      if (enemy.trailCells.length < 6) continue;

      // Sample points along enemy's active trail
      for (let i = 0; i < enemy.trailCells.length; i += 2) {
        const cellIdx = enemy.trailCells[i];
        const cellX = (cellIdx % gridSize) + 0.5;
        const cellY = ((cellIdx / gridSize) | 0) + 0.5;
        const dist = Math.hypot(cellX - me.x, cellY - me.y);

        if (dist < closestDist) {
          closestDist = dist;
          targetPoint = [cellX, cellY];
          targetEnemySlot = enemy.slot;
        }
      }
    }

    if (!targetPoint || closestDist > persona.huntR) return false;

    const targetEnemy = gameClient.S.players[targetEnemySlot];
    const enemyHome = findEnemyHome(targetEnemy);
    const enemyTimeToHome = enemyHome
      ? Math.hypot(targetEnemy.x - enemyHome[0], targetEnemy.y - enemyHome[1]) / BAL.speed
      : 3;

    const myTimeToTarget = closestDist / (BAL.speed * (persona.boostHunt ? BAL.boostMult : 1));
    if (myTimeToTarget > enemyTimeToHome * 0.9 + 0.7) {
      return false; // Enemy will close their loop before we can reach them
    }

    bot.state = 'hunt';
    bot.huntSlot = targetEnemySlot;
    bot.waypoints = [targetPoint];
    bot.wpIndex = 0;
    return true;
  }

  /**
   * Finds nearest home territory for an enemy to estimate return time.
   */
  function findEnemyHome(enemy) {
    for (let r = 0; r < 40; r++) {
      const minX = Math.max(0, (enemy.x | 0) - r);
      const maxX = Math.min(gridSize - 1, (enemy.x | 0) + r);
      const minY = Math.max(0, (enemy.y | 0) - r);
      const maxY = Math.min(gridSize - 1, (enemy.y | 0) + r);

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (y !== minY && y !== maxY && x !== minX && x !== maxX) continue;
          if (gameClient.S.grid[y * gridSize + x] === enemy.slot + 1) {
            return [x + 0.5, y + 0.5];
          }
        }
      }
    }
    return null;
  }

  /**
   * Sends movement and boost commands towards a target location.
   */
  function steerTowards(targetX, targetY, boost) {
    const me = getPlayer();
    const angle = Math.atan2(targetY - me.y, targetX - me.x);
    const inputHandler = gameClient.localInput || gameClient.sendInput;
    if (typeof inputHandler === 'function') {
      inputHandler(slot, { angle, boost: !!boost });
    }
  }

  /**
   * Main bot tick logic and state machine.
   */
  function update() {
    const me = getPlayer();
    if (!me || !me.alive) {
      bot.state = 'plan';
      bot.huntSlot = -1;
      return;
    }

    const currentCellIdx = (me.y | 0) * gridSize + (me.x | 0);
    const isInDangerZone = me.trailCells.length > 0 || !isMyCell(currentCellIdx);
    const isDecideTick = gameClient.S.tick - bot.lastDecideTick >= Math.round(20 / BAL.botDecideHz);

    if (isDecideTick) {
      bot.lastDecideTick = gameClient.S.tick;
      const [nearestEnemy, enemyDist] = findNearestEnemy();

      if (isInDangerZone) {
        // High risk situation: evaluate emergency retreat
        const trailLen = me.trailCells.length;
        const enemyThreatThreshold = persona.threatR + Math.min(10, trailLen * 0.12);
        const shouldFlee = (nearestEnemy && enemyDist < enemyThreatThreshold) || me.ink < 8;

        if (shouldFlee) {
          const safeCell = findNearestTerritory(me.x, me.y);
          if (safeCell) {
            bot.state = 'return';
            bot.waypoints = [safeCell];
            bot.wpIndex = 0;
          }
        }
      } else {
        // Safe inside territory: hunt or start a new loop
        if (bot.state !== 'hunt' || bot.huntSlot < 0) {
          if (!attemptTrailHunt()) {
            if (bot.state !== 'loop' || bot.wpIndex >= bot.waypoints.length) {
              planExpansionLoop();
            }
          }
        }
      }

      // Update hunt tracking
      if (bot.state === 'hunt') {
        const targetEnemy = gameClient.S.players[bot.huntSlot];
        if (!targetEnemy || !targetEnemy.alive || targetEnemy.trailCells.length === 0) {
          bot.state = isInDangerZone ? 'return' : 'plan';
          bot.huntSlot = -1;
          if (bot.state === 'return') {
            const home = findNearestTerritory(me.x, me.y);
            if (home) {
              bot.waypoints = [home];
              bot.wpIndex = 0;
            }
          }
        } else {
          // Re-target the closest point on the active enemy trail
          let closestPoint = null;
          let minTrailDist = 1e9;
          for (let i = 0; i < targetEnemy.trailCells.length; i += 2) {
            const cIdx = targetEnemy.trailCells[i];
            const px = (cIdx % gridSize) + 0.5;
            const py = ((cIdx / gridSize) | 0) + 0.5;
            const d = Math.hypot(px - me.x, py - me.y);
            if (d < minTrailDist) {
              minTrailDist = d;
              closestPoint = [px, py];
            }
          }
          if (closestPoint) {
            bot.waypoints = [closestPoint];
            bot.wpIndex = 0;
          }
        }
      }
    }

    if (bot.state === 'plan') {
      planExpansionLoop();
    }

    // Navigate to active waypoint
    if (bot.wpIndex < bot.waypoints.length) {
      const [targetX, targetY] = bot.waypoints[bot.wpIndex];
      const distToWaypoint = Math.hypot(targetX - me.x, targetY - me.y);

      if (distToWaypoint < 1.2) {
        bot.wpIndex++;
      } else {
        const shouldUseBoost =
          (bot.state === 'hunt' && persona.boostHunt) ||
          (bot.state === 'return' && persona.boostFlee && me.ink > 25) ||
          (gameClient.S.frenzy && me.ink > 10);

        steerTowards(targetX, targetY, shouldUseBoost);
        return;
      }
    }

    // On completing waypoints sequence
    if (bot.wpIndex >= bot.waypoints.length) {
      if (bot.state === 'loop' && !isInDangerZone) {
        bot.state = 'plan';
      } else if (bot.state === 'loop' && isInDangerZone) {
        const retreatHome = findNearestTerritory(me.x, me.y);
        if (retreatHome) {
          bot.waypoints = [retreatHome];
          bot.wpIndex = 0;
        }
      } else if (bot.state === 'return' && !isInDangerZone) {
        bot.state = 'plan';
      } else if (bot.state === 'return' && isInDangerZone) {
        const retreatHome = findNearestTerritory(me.x, me.y);
        if (retreatHome) {
          bot.waypoints = [retreatHome];
          bot.wpIndex = 0;
        }
      } else if (bot.state === 'hunt') {
        bot.state = 'plan';
        bot.huntSlot = -1;
      }
    }
  }

  return {
    update,
    persona: personaType,
    get state() {
      return bot.state;
    },
  };
}

/**
 * Creates and manages a pool of AI bots for all bot players in the match.
 */
export function createBotPool(gameClient, seed = 1) {
  const botsMap = new Map();

  const sync = () => {
    for (const player of gameClient.S.players) {
      if (player && player.bot && !botsMap.has(player.slot)) {
        botsMap.set(player.slot, createBot(gameClient, player.slot, player.bot, seed));
      }
    }
    for (const slotKey of [...botsMap.keys()]) {
      if (!gameClient.S.players[slotKey] || !gameClient.S.players[slotKey].bot) {
        botsMap.delete(slotKey);
      }
    }
  };

  sync();

  return {
    sync,
    update() {
      sync();
      for (const botInstance of botsMap.values()) {
        botInstance.update();
      }
    },
    get size() {
      return botsMap.size;
    },
  };
}
