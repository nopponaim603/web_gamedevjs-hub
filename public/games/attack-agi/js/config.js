/**
 * Attack AGI — Configuration & Game Balance Data
 */

window.AGI_CONFIG = {
    STORAGE_KEY_HIGHSCORE: 'attack-agi-highscore',
    STORAGE_KEY_MUTED: 'attack-agi-muted',

    // Player Stats
    PLAYER: {
        MAX_HEALTH: 100,
        MOVE_SPEED: 14,
        SPRINT_SPEED: 22,
        JUMP_FORCE: 12,
        GRAVITY: 32,
        HEIGHT: 1.8,
        RADIUS: 0.6,
        DODGE_SPEED: 28,
        DODGE_DURATION: 0.25,
        DODGE_COOLDOWN: 1.2
    },

    // Weapon Arsenal
    WEAPONS: [
        {
            id: 'rifle',
            name: 'PULSE RIFLE',
            slot: 1,
            damage: 25,
            fireRate: 0.12, // seconds per shot
            magSize: 30,
            reloadTime: 1.4,
            range: 80,
            spread: 0.02,
            icon: '⚡',
            color: '#38bdf8'
        },
        {
            id: 'shotgun',
            name: 'SCATTER CANNON',
            slot: 2,
            damage: 18, // per pellet
            pellets: 8,
            fireRate: 0.75,
            magSize: 8,
            reloadTime: 2.0,
            range: 35,
            spread: 0.08,
            icon: '💥',
            color: '#f59e0b'
        },
        {
            id: 'molotov',
            name: 'EMP FIREBALL',
            slot: 3,
            damage: 80, // direct hit
            aoeDamage: 30, // damage per sec in pool
            aoeRadius: 6,
            aoeDuration: 5.0,
            fireRate: 1.2,
            magSize: 3,
            reloadTime: 2.5,
            throwSpeed: 22,
            icon: '🔥',
            color: '#ef4444'
        }
    ],

    // Enemy Types
    ENEMIES: {
        DRONE: {
            name: 'Scout Drone',
            hp: 40,
            speed: 8.5,
            damage: 15,
            score: 100,
            scale: 0.7,
            color: 0xef4444,
            isFlying: true,
            altitude: 2.2
        },
        STALKER: {
            name: 'Cyber Hound',
            hp: 80,
            speed: 12.0,
            damage: 20,
            score: 250,
            scale: 1.0,
            color: 0xf59e0b,
            isFlying: false
        },
        ENFORCER: {
            name: 'Heavy Mech',
            hp: 250,
            speed: 5.5,
            damage: 35,
            score: 600,
            scale: 1.6,
            color: 0x8b5cf6,
            isFlying: false
        },
        SENTINEL: {
            name: 'AGI Core Sentinel (BOSS)',
            hp: 1200,
            speed: 4.0,
            damage: 50,
            score: 3000,
            scale: 2.8,
            color: 0x06b6d4,
            isFlying: true,
            altitude: 4.0
        }
    },

    // Wave Progression
    WAVES: [
        { count: 6, types: ['DRONE'], spawnInterval: 2.0 },
        { count: 12, types: ['DRONE', 'STALKER'], spawnInterval: 1.6 },
        { count: 18, types: ['DRONE', 'STALKER', 'ENFORCER'], spawnInterval: 1.3 },
        { count: 25, types: ['DRONE', 'STALKER', 'ENFORCER'], spawnInterval: 1.0 },
        { count: 32, types: ['DRONE', 'STALKER', 'ENFORCER', 'SENTINEL'], spawnInterval: 0.9 }
    ],

    // Arena Bounds
    ARENA: {
        SIZE: 90,
        WALL_HEIGHT: 8
    }
};
