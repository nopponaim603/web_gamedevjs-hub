/**
 * INKWASH — Game Balance, Grid Physics & Visual Tokens
 */

export const BAL = {
    grid: 110,
    tickMs: 50,
    roundSec: 180,
    frenzySec: 15,
    intermissionSec: 6,

    // Movement & Ink Dynamics
    speed: 7.5,
    turnRate: 12.0,
    boostMult: 1.55,
    drySpeedMult: 0.55,

    // Ink Capacity & Depletion
    inkMax0: 100,
    inkMaxPerCell: 0.02,
    inkMaxBonusCap: 80,
    inkRegen: 30,
    inkDrainOut: 7,
    inkDrainBoost: 18,
    inkKillReward: 25,

    // Spawning & Safety
    spawnProtSec: 2.0,
    respawnSec: 3.0,
    noRespawnLastSec: 15,
    selfCutGrace: 8,
    headOnDist: 0.8,
    spawnRadius: 2.5,
    spawnMinDist: 22,
    spawnWallPad: 10,

    // Lobby & Score
    entities: 10,
    maxHumans: 8,
    killScore: 50,

    // AI Bots
    botDecideHz: 5,
    botThreatR: 9,
    botHuntR: 18,

    // Network & Sync
    netEntityHz: 10,
    netInputHz: 10,
    netSnapshotSec: 3,
    netInterpMs: 100,
    netMsgBudget: 3500,

    // Camera & VFX
    viewCells: 34,
    particleCap: 240,

    // Aesthetics & Ink Palettes
    paper: '#F6F1E3',
    paperGrain: '#EAE3D1',
    vignette: 'rgba(30, 25, 20, 0.35)',

    colors: [
        ['#1F1E1B', '#3B3833'], // Sumi Black
        ['#C83C23', '#962B16'], // Vermilion
        ['#3EA882', '#2E8B6A'], // Jade Green
        ['#2A6F97', '#1D4D6B'], // Indigo Blue
        ['#8D5B9A', '#6B4277'], // Violet
        ['#38B2AC', '#2FA8B5'], // Teal
        ['#E08E45', '#B86F2C'], // Amber
        ['#9EAB4B', '#7A8C3C'], // Bamboo
        ['#B27351', '#8C5B3F'], // Sienna
        ['#5C5C66', '#45454E']  // Charcoal
    ],

    botNames: [
        'Sienna', 'Indigo Kid', 'Indigo', 'Old Slate', 'Vermilion', 'Rougelet',
        'Jade', 'Bamboo', 'Amber', 'Violet', 'Charcoal', 'Madder Max'
    ]
};

export const bp = cells => Math.round((cells / (BAL.grid * BAL.grid)) * 10000);