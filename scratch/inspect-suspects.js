const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');

// We want to inspect:
// 1. scribble-jump
// 2. animated-card-game
// 3. stateIO
// 4. Three.js games with resizeListener: false (boat-roguelite-driftwake, coin-pusher-3d-copper-cascade, dirtline, dragon-roguelite-skywake, skate-dog, starter-kit-racing, babylon-demo)
// 5. Canvas 2D games with resizeListener: false (celadon, crumple, echo-abyss, geeks-vs-zombies, godawful, ink-warden)
// 6. DOM/Vanilla games: do they have fixed containers that get squashed or do they adapt?

const suspectGames = [
  'scribble-jump',
  'animated-card-game',
  'stateIO',
  'boat-roguelite-driftwake',
  'coin-pusher-3d-copper-cascade',
  'dirtline',
  'dragon-roguelite-skywake',
  'skate-dog',
  'starter-kit-racing',
  'babylon-demo',
  'celadon',
  'crumple',
  'echo-abyss',
  'geeks-vs-zombies',
  'godawful',
  'ink-warden',
  'volta'
];

for (const g of suspectGames) {
  const gDir = path.join(gamesDir, g);
  console.log(`\n=================== [${g}] ===================`);
  
  // Read index.html
  const htmlPath = path.join(gDir, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const canvasTags = html.match(/<canvas[^>]*>/gi);
    if (canvasTags) console.log('Canvas tags:', canvasTags);
  }

  // Find all JS and look for resize / canvas sizing / aspect ratio / camera
  function getFiles(d) {
    let res = [];
    for (const item of fs.readdirSync(d)) {
      if (['node_modules', '.git', 'vendor', 'assets', 'lib', 'libs'].includes(item)) continue;
      const full = path.join(d, item);
      if (fs.statSync(full).isDirectory()) res = res.concat(getFiles(full));
      else if (item.endsWith('.js') || item.endsWith('.css')) res.push(full);
    }
    return res;
  }

  const files = getFiles(gDir);
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const rel = path.relative(gDir, f);

    // Look for canvas width/height
    const canvasSizing = content.match(/(canvas\.(width|height)\s*=[^;]+|renderer\.setSize\([^)]+\)|camera\.aspect\s*=[^;]+|engine\.resize\(\))/gi);
    if (canvasSizing) {
      console.log(`  ${rel} -> Sizing:`, canvasSizing.slice(0, 5));
    }

    // Look for window resize event
    const resizeEvents = content.match(/addEventListener\(['"]resize['"][^)]+\)/gi) || content.match(/onresize\s*=[^;]+/gi);
    if (resizeEvents) {
      console.log(`  ${rel} -> ResizeEvent:`, resizeEvents);
    }

    // Look for CSS canvas rules
    if (f.endsWith('.css')) {
      const cssRules = content.match(/(^|[\s\},])(canvas|#game-canvas|#canvas|\.game-canvas|#stage|#app)[^\{]*\{([^\}]+)\}/gi);
      if (cssRules) {
        console.log(`  ${rel} -> CSS Rules:`, cssRules.map(s => s.trim().replace(/\s+/g, ' ')));
      }
    }
  }
}
