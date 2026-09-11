/**
 * INKWASH — Save System & Skin Unlocks
 */

const SLOT = 'inkwash_save_v1';
const VERSION = 1;

const DEFAULTS = () => ({
    v: VERSION,
    skin: 'default',
    name: '',
    lang: null,
    stats: {
        cells: 0,
        kills: 0,
        wins: 0,
        bestBp: 0,
        rounds: 0
    }
});

export const SKINS = [
    'default',
    'bamboo',
    'plum',
    'pine',
    'gingko',
    'lantern',
    'crane',
    'fish'
];

export function skinUnlocked(skinId, stats) {
    switch (skinId) {
        case 'default':
            return true;
        case 'bamboo':
            return (stats.cells || 0) >= 5000;
        case 'plum':
            return (stats.cells || 0) >= 20000;
        case 'pine':
            return (stats.kills || 0) >= 10;
        case 'gingko':
            return (stats.kills || 0) >= 50;
        case 'lantern':
            return (stats.bestBp || 0) >= 1500;
        case 'crane':
            return (stats.wins || 0) >= 1;
        case 'fish':
            return (stats.wins || 0) >= 10;
        default:
            return false;
    }
}

export function createSave() {
    let state = DEFAULTS();
    let isDirty = false;
    let saveTimeout = null;

    try {
        const raw = localStorage.getItem(SLOT);
        if (raw) mergeData(JSON.parse(raw));
    } catch {}

    function mergeData(incoming) {
        if (!incoming || incoming.v !== VERSION) return;
        const cur = state.stats;
        const inc = incoming.stats || {};

        state.stats = {
            cells: Math.max(cur.cells, inc.cells || 0),
            kills: Math.max(cur.kills, inc.kills || 0),
            wins: Math.max(cur.wins, inc.wins || 0),
            bestBp: Math.max(cur.bestBp, inc.bestBp || 0),
            rounds: Math.max(cur.rounds, inc.rounds || 0)
        };

        if (incoming.skin && skinUnlocked(incoming.skin, state.stats)) {
            state.skin = incoming.skin;
        }
        if (incoming.name) {
            state.name = incoming.name;
        }
        if (incoming.lang) {
            state.lang = incoming.lang;
        }
    }

    async function loadCloud() {
        try {
            const cloudSave = window.AIGameShare?.cloudSave;
            if (!cloudSave) return;
            const remote = await cloudSave.get(SLOT);
            if (remote) mergeData(remote);
        } catch {}
    }

    function flush() {
        try {
            localStorage.setItem(SLOT, JSON.stringify(state));
        } catch {}
        try {
            const cloudSave = window.AIGameShare?.cloudSave;
            if (cloudSave) cloudSave.set(SLOT, state).catch(() => {});
        } catch {}
        isDirty = false;
    }

    return {
        get data() {
            return state;
        },
        loadCloud,
        bump(statKey, delta = 1) {
            state.stats[statKey] = (state.stats[statKey] || 0) + delta;
            this.touch();
        },
        peak(statKey, value) {
            if (value > (state.stats[statKey] || 0)) {
                state.stats[statKey] = value;
                this.touch();
            }
        },
        set(key, value) {
            state[key] = value;
            this.touch();
        },
        touch() {
            isDirty = true;
            if (!saveTimeout) {
                saveTimeout = setTimeout(() => {
                    saveTimeout = null;
                    if (isDirty) flush();
                }, 1500);
            }
        },
        flush
    };
}