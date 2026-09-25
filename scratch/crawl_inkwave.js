const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://inkwave-six.vercel.app';
const TARGET_DIR = path.join(process.cwd(), 'public', 'games', 'inkwave');

const visited = new Set();
const queue = [];

function enqueue(relUrl) {
  if (!relUrl) return;
  let clean = relUrl.split('?')[0].split('#')[0];
  if (clean.startsWith('./')) clean = clean.slice(2);
  if (clean.startsWith('/')) clean = clean.slice(1);
  if (!clean || visited.has(clean)) return;
  visited.add(clean);
  queue.push(clean);
}

// Initial entry points
[
  'index.html',
  'styles/ui.css',
  'styles/hud.css',
  'assets/fonts/TitanOne-latin.woff2',
  'assets/fonts/Rubik-latin.woff2',
  'src/main.js',
  'src/config.js',
  'src/core/ctx.js',
  'src/core/renderer.js',
  'src/core/input.js',
  'src/world/level.js',
  'src/world/maps.js',
  'src/world/paint.js',
  'src/world/levelMaterial.js',
  'src/world/decor.js',
  'src/world/murals.js',
  'src/world/mapThumb.js',
  'src/world/dressing.js',
  'src/world/props.js',
  'src/world/texlib.js',
  'src/world/environment.js',
  'src/game/physics.js',
  'src/game/nav.js',
  'src/game/weapons.js',
  'src/game/cameraRig.js',
  'src/game/match.js',
  'src/game/minimap.js',
  'src/game/showcase.js',
  'src/game/character.js',
  'src/game/actor.js',
  'src/game/bots.js',
  'src/game/player.js',
  'src/fx/fx.js',
  'src/fx/fxHooks.js',
  'src/fx/screenfx.js',
  'src/audio/audio.js',
  'src/audio/music.js',
  'src/ui/menus.js',
  'src/ui/hud.js',
  'src/dev/stubs.js',
  'assets/lightmaps/tidewater.json',
  'assets/lightmaps/tidewater.png',
  'assets/lightmaps/kelpline.json',
  'assets/lightmaps/kelpline.png'
].forEach(enqueue);

// Regex patterns to find imports and assets
const IMPORT_RE = /(?:import\s+(?:[\w*\s{},]*from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|loadModule\s*\(\s*['"]([^'"]+)['"])/g;
const FETCH_RE = /(?:fetch|loadAsync|load)\s*\(\s*['"`]([^'"`$]+)['"`]/g;
const CSS_URL_RE = /url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/g;

async function crawl() {
  console.log('Starting comprehensive INKWAVE crawl to:', TARGET_DIR);

  while (queue.length > 0) {
    const relPath = queue.shift();
    const fullUrl = `${BASE_URL}/${relPath}`;
    const destPath = path.join(TARGET_DIR, relPath);

    try {
      console.log(`[Fetching] ${relPath}`);
      const res = await fetch(fullUrl);
      if (!res.ok) {
        console.warn(`[${res.status}] ${fullUrl}`);
        continue;
      }

      const contentType = res.headers.get('content-type') || '';
      const isText = contentType.includes('javascript') || contentType.includes('html') || contentType.includes('css') || contentType.includes('json') || relPath.endsWith('.js') || relPath.endsWith('.html') || relPath.endsWith('.css') || relPath.endsWith('.json') || relPath.endsWith('.svg');

      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      if (isText) {
        const text = await res.text();
        fs.writeFileSync(destPath, text, 'utf-8');

        const currentDir = path.dirname(relPath);

        // Find ES module imports
        let match;
        while ((match = IMPORT_RE.exec(text)) !== null) {
          const importTarget = match[1] || match[2] || match[3];
          if (importTarget && !importTarget.startsWith('http') && !importTarget.startsWith('data:')) {
            resolveAndEnqueue(importTarget, currentDir);
          }
        }

        // Find fetch() & loadAsync calls
        while ((match = FETCH_RE.exec(text)) !== null) {
          const fetchTarget = match[1];
          if (fetchTarget && !fetchTarget.startsWith('http') && !fetchTarget.startsWith('data:') && !fetchTarget.includes('${')) {
            resolveAndEnqueue(fetchTarget, currentDir);
          }
        }

        // Find CSS url(...)
        if (relPath.endsWith('.css')) {
          while ((match = CSS_URL_RE.exec(text)) !== null) {
            const cssTarget = match[1];
            if (cssTarget && !cssTarget.startsWith('http') && !cssTarget.startsWith('data:')) {
              resolveAndEnqueue(cssTarget, currentDir);
            }
          }
        }
      } else {
        const arrayBuf = await res.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(arrayBuf));
      }
    } catch (err) {
      console.error(`[Error fetching ${relPath}]:`, err.message);
    }
  }

  console.log(`\nCrawl finished! Total files checked: ${visited.size}`);
}

function resolveAndEnqueue(target, currentDir) {
  let resolved;
  if (target.startsWith('three/addons/')) {
    resolved = 'vendor/three/jsm/' + target.replace('three/addons/', '');
  } else if (target === 'three') {
    resolved = 'vendor/three/build/three.module.js';
  } else if (target.startsWith('/')) {
    resolved = target.slice(1);
  } else if (target.startsWith('./') || target.startsWith('../')) {
    resolved = path.posix.normalize(path.posix.join(currentDir, target));
  } else {
    resolved = path.posix.normalize(path.posix.join(currentDir, target));
  }
  enqueue(resolved);
}

crawl();
