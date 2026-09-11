export function createSafeStorage(namespace) {
  const memory = new Map();
  return {
    read(key, fallback = null) {
      try {
        const value = window.localStorage.getItem(`${namespace}:${key}`);
        return value == null
          ? memory.has(key)
            ? memory.get(key)
            : fallback
          : JSON.parse(value);
      } catch {
        return memory.has(key) ? memory.get(key) : fallback;
      }
    },
    write(key, value) {
      memory.set(key, value);
      try {
        window.localStorage.setItem(
          `${namespace}:${key}`,
          JSON.stringify(value),
        );
      } catch {}
    },
  };
}

export function createTelemetry() {
  const queue = [];
  let runCount = 0;
  let started = false;
  let ended = false;

  const dispatch = (bridge, item) => {
    const method = item.method;
    if (typeof bridge[method] !== "function") return false;
    try {
      const promise = bridge[method](...item.args);
      if (promise?.catch) promise.catch(() => {});
    } catch {}
    return true;
  };

  const flush = () => {
    const bridge = window.AIGameShare;
    if (!bridge) return;
    for (let i = 0; i < queue.length;) {
      if (dispatch(bridge, queue[i])) {
        queue.splice(i, 1);
      } else {
        i++;
      }
    }
  };

  const enqueue = (method, ...args) => {
    queue.push({ method, args });
    flush();
  };

  return {
    newRun() {
      runCount++;
      started = false;
      ended = false;
    },
    start(extra = {}) {
      if (started) return;
      started = true;
      enqueue("track", "game_start", {
        game: "grapple-knight-storm-siege",
        run: runCount,
        ...extra,
      });
    },
    end(score, extra = {}) {
      if (ended || !started) return;
      ended = true;
      const meta = {
        game: "grapple-knight-storm-siege",
        run: runCount,
        ...extra,
      };
      enqueue("track", "game_end", { ...meta, score });
      if (Number.isFinite(score)) {
        enqueue("submitScore", "score", Math.max(0, Math.floor(score)), {
          meta,
        });
      }
    },
    flush,
  };
}

export function createCloudSettings({ read, apply }) {
  let initialLoaded = false;
  let loading = false;
  let dirty = false;
  let saving = false;
  let version = 0;
  let disabled = false;
  const cloudKey = "settings";

  function flush() {
    const cloud = window.AIGameShare?.cloudSave;
    if (
      disabled ||
      !cloud ||
      typeof cloud.get !== "function" ||
      typeof cloud.set !== "function"
    )
      return;

    if (!initialLoaded && !loading) {
      loading = true;
      const currentVer = version;
      Promise.resolve()
        .then(() => cloud.get(cloudKey))
        .then((payload) => {
          if (payload && typeof payload === "object") {
            const local = read();
            const remoteData =
              payload.data && typeof payload.data === "object"
                ? payload.data
                : payload;
            const merged = {
              ...local,
              best: Math.max(local.best || 0, Number(remoteData.best) || 0),
            };
            if (version === currentVer && version === 0) {
              if (remoteData.language === "en" || remoteData.language === "zh")
                merged.language = remoteData.language;
              if (typeof remoteData.muted === "boolean")
                merged.muted = remoteData.muted;
            }
            apply(merged);
          }
          initialLoaded = true;
        })
        .catch(() => {
          disabled = true;
        })
        .finally(() => {
          loading = false;
        });
      return;
    }

    if (!initialLoaded || !dirty || saving) return;
    dirty = false;
    saving = true;
    const currentSettings = read();
    Promise.resolve()
      .then(() => cloud.set(cloudKey, { schema: 1, ...currentSettings }))
      .catch(() => {
        disabled = true;
      })
      .finally(() => {
        saving = false;
      });
  }

  return {
    flush,
    save() {
      version++;
      dirty = true;
    },
  };
}
