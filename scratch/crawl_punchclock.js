const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://punch-clock-game.vercel.app';
const TARGET_DIR = path.join(process.cwd(), 'public', 'games', 'punch-clock');

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
  'styles.css',
  'DESIGN.md',
  'favicon-48.png',
  'apple-touch-icon.png',
  'og.jpg',
  'src/main.js',
  'src/config.js',
  'src/feed.js',
  'src/clip.js',
  'src/arena.js',
  'src/fighter.js',
  'src/player.js',
  'src/fx.js',
  'src/post.js',
  'src/input.js',
  'src/fight.js',
  'src/ui.js',
  'src/audio.js',
  'src/materials.js',
  'src/spring.js',
  'src/shift.js',
  'vendor/three/three.module.js',
  'vendor/three/addons/postprocessing/UnrealBloomPass.js',
  'vendor/three/addons/postprocessing/Pass.js',
  'vendor/three/addons/shaders/FXAAShader.js',
  'vendor/three/addons/shaders/CopyShader.js',
  'vendor/three/addons/shaders/LuminosityHighPassShader.js'
].forEach(enqueue);

// Regex patterns to find imports and assets
const IMPORT_RE = /(?:import\s+(?:[\w*\s{},]*from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
const FETCH_RE = /(?:fetch|loadAsync|load)\s*\(\s*['"`]([^'"`$]+)['"`]/g;
const CSS_URL_RE = /url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/g;

async function crawl() {
  console.log('Starting PUNCH CLOCK crawl to:', TARGET_DIR);

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
      const isText = contentType.includes('javascript') || contentType.includes('html') || contentType.includes('css') || contentType.includes('json') || contentType.includes('markdown') || relPath.endsWith('.js') || relPath.endsWith('.html') || relPath.endsWith('.css') || relPath.endsWith('.json') || relPath.endsWith('.md');

      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      if (isText) {
        const text = await res.text();
        fs.writeFileSync(destPath, text, 'utf-8');

        const currentDir = path.dirname(relPath);

        // Find ES module imports
        let match;
        while ((match = IMPORT_RE.exec(text)) !== null) {
          const importTarget = match[1] || match[2];
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
    resolved = 'vendor/three/addons/' + target.replace('three/addons/', '');
  } else if (target === 'three') {
    resolved = 'vendor/three/three.module.js';
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
