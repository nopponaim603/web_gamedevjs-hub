/**
 * VOLTA — Local Storage & High Score SDK
 */

export function createSafeStorage(prefix = 'volta') {
    const memoryFallback = new Map();
    let isStorageAvailable = false;
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(prefix + ':probe', '1');
            localStorage.removeItem(prefix + ':probe');
            isStorageAvailable = true;
        }
    } catch {
        isStorageAvailable = false;
    }

    return {
        get(key) {
            try {
                if (isStorageAvailable) {
                    const val = localStorage.getItem(prefix + ':' + key);
                    if (val !== null) return JSON.parse(val);
                }
            } catch {}
            return memoryFallback.has(key) ? memoryFallback.get(key) : null;
        },
        set(key, value) {
            memoryFallback.set(key, value);
            try {
                if (isStorageAvailable) {
                    localStorage.setItem(prefix + ':' + key, JSON.stringify(value));
                }
            } catch {}
        }
    };
}

export function normalizeSave(data) {
    const obj = (data && typeof data === 'object') ? data : {};
    const best = (obj.best && typeof obj.best === 'object') ? obj.best : {};
    return {
        v: 1,
        best: {
            score: +best.score || 0,
            dist: +best.dist || 0,
            zone: +best.zone || 0
        },
        runs: +obj.runs || 0,
        dodges: +obj.dodges || 0,
        muted: !!obj.muted,
        lang: obj.lang === 'zh' ? 'zh' : 'en',
        updatedAt: +obj.updatedAt || 0
    };
}

export function createSDK() {
    const storage = createSafeStorage('volta');
    let hasSubmitted = false;

    return {
        present: false,
        ready() {},
        track(event, meta = {}) {},
        newRun() {
            hasSubmitted = false;
        },
        get submitted() {
            return hasSubmitted;
        },
        submitScore(score, meta = {}) {
            if (hasSubmitted) return false;
            hasSubmitted = true;
            return true;
        },
        async load() {
            const saved = storage.get('save');
            return saved ? normalizeSave(saved) : null;
        },
        save(data, immediate = false) {
            data.updatedAt = Date.now();
            storage.set('save', data);
        },
        flush() {}
    };
}
