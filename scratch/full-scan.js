const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const games = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory() && f !== '_template');

const results = [];

for (const g of games) {
  const gDir = path.join(gamesDir, g);
  
  function getAllFiles(d) {
    let out = [];
    for (const item of fs.readdirSync(d)) {
      if (item === 'node_modules' || item === '.git') continue;
      const full = path.join(d, item);
      if (fs.statSync(full).isDirectory()) out = out.concat(getAllFiles(full));
      else out.push(full);
    }
    return out;
  }

  const allFiles = getAllFiles(gDir);
  const cssFiles = allFiles.filter(f => f.endsWith('.css'));
  const jsFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
  const htmlFiles = allFiles.filter(f => f.endsWith('.html'));

  let css = cssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let js = jsFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let html = htmlFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

  // Check canvas tags in html
  const canvasTags = html.match(/<canvas[^>]*>/gi) || [];

  // Check CSS for canvas stretch without aspect-ratio or object-fit
  // Specifically: does canvas have width: 100% and height: 100% (or 100vw/100vh)?
  const canvasStretchedInCss = /canvas[^{]*\{[^}]*(width\s*:\s*100(%|vw)[^}]*height\s*:\s*100(%|vh)|height\s*:\s*100(%|vh)[^}]*width\s*:\s*100(%|vw))/i.test(css);
  const canvasHasObjectFit = /canvas[^{]*\{[^}]*object-fit\s*:\s*(contain|scale-down)/i.test(css);
  const canvasHasAspectRatio = /canvas[^{]*\{[^}]*aspect-ratio/i.test(css);

  // Check if JS updates canvas buffer on resize (e.g. canvas.width = ...)
  const jsUpdatesCanvasBuffer = /canvas\.width\s*=/i.test(js) || /setSize\(/i.test(js) || /engine\.resize\(/i.test(js);

  // Check Phaser scale mode
  let phaserScaleMode = null;
  if (/Phaser\.Scale/i.test(js)) {
    const m = js.match(/mode:\s*Phaser\.Scale\.([A-Z_]+)/i);
    phaserScaleMode = m ? m[1] : 'SET_BUT_UNKNOWN';
  }

  // Check fixed resolution in canvas tag
  let fixedBuffer = null;
  for (const ct of canvasTags) {
    const wm = ct.match(/width=["']?(\d+)["']?/i);
    const hm = ct.match(/height=["']?(\d+)["']?/i);
    if (wm && hm) {
      fixedBuffer = `${wm[1]}x${hm[1]}`;
    }
  }

  // SQUASH/STRETCH ISSUE CRITERIA:
  // 1. Fixed canvas buffer in HTML (e.g. 800x600) + CSS width:100% & height:100% + NO object-fit + NO aspect-ratio + NO JS resize of buffer
  // 2. Phaser Scale mode EXACT_FIT
  // 3. Canvas CSS 100%/100% + NO object-fit + NO aspect-ratio + 2D canvas drawing at fixed coordinates without scaling
  let isDistorted = false;
  let reason = '';

  if (phaserScaleMode === 'EXACT_FIT') {
    isDistorted = true;
    reason = 'Phaser EXACT_FIT forces stretched canvas without preserving aspect ratio';
  } else if (fixedBuffer && canvasStretchedInCss && !canvasHasObjectFit && !canvasHasAspectRatio && !jsUpdatesCanvasBuffer) {
    isDistorted = true;
    reason = `Canvas has fixed HTML attribute ${fixedBuffer} but CSS forces 100% width and 100% height without object-fit: contain or aspect-ratio`;
  }

  results.push({
    game: g,
    isDistorted,
    reason,
    phaserScaleMode,
    canvasTagsCount: canvasTags.length,
    fixedBuffer,
    canvasStretchedInCss,
    canvasHasObjectFit,
    canvasHasAspectRatio,
    jsUpdatesCanvasBuffer
  });
}

console.log('=== FULL SCAN REPORT (INCLUDING INTERNAL ASSETS) ===');
console.log('Total games scanned:', results.length);
const issues = results.filter(r => r.isDistorted);
console.log('Games with confirmed squashing/stretching:', issues.length);
for (const iss of issues) {
  console.log(`❌ [${iss.game}]: ${iss.reason}`);
}

console.log('\n--- Status of all Phaser Games ---');
for (const r of results.filter(x => x.phaserScaleMode)) {
  console.log(`  [${r.game}]: scaleMode=${r.phaserScaleMode}, css100=${r.canvasStretchedInCss}, objectFit=${r.canvasHasObjectFit}`);
}

console.log('\n--- Games with Fixed Canvas HTML Buffer ---');
for (const r of results.filter(x => x.fixedBuffer)) {
  console.log(`  [${r.game}]: buffer=${r.fixedBuffer}, css100=${r.canvasStretchedInCss}, objFit=${r.canvasHasObjectFit}, aspectCss=${r.canvasHasAspectRatio}, jsResize=${r.jsUpdatesCanvasBuffer}`);
}
