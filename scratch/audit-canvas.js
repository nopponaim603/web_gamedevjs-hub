const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const games = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory() && f !== '_template');

const detailedAudit = [];

for (const g of games) {
  const gDir = path.join(gamesDir, g);
  
  // Read index.html
  const htmlPath = path.join(gDir, 'index.html');
  const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';

  // Get all css files and inline styles
  let cssText = '';
  const inlineStyles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  cssText += inlineStyles.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');

  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      if (['node_modules', '.git', 'vendor', 'assets', 'lib', 'libs'].includes(f)) continue;
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (f.endsWith('.css')) cssText += '\n' + fs.readFileSync(full, 'utf8');
    }
  }
  walk(gDir);

  // Read JS files
  let jsText = '';
  function walkJs(d) {
    for (const f of fs.readdirSync(d)) {
      if (['node_modules', '.git', 'vendor', 'assets', 'lib', 'libs'].includes(f)) continue;
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) walkJs(full);
      else if (f.endsWith('.js') || f.endsWith('.mjs')) jsText += '\n' + fs.readFileSync(full, 'utf8');
    }
  }
  walkJs(gDir);

  // Canvas elements
  const canvasTags = html.match(/<canvas[^>]*>/gi) || [];
  
  // Check how canvas or main container is sized
  // 1. Fixed canvas attribute
  let fixedCanvasAttr = null;
  for (const ct of canvasTags) {
    const w = ct.match(/width=["']?(\d+)["']?/i);
    const h = ct.match(/height=["']?(\d+)["']?/i);
    if (w && h) {
      fixedCanvasAttr = { width: parseInt(w[1]), height: parseInt(h[1]), tag: ct };
    }
  }

  // 2. CSS sizing for canvas
  const hasCanvasCss100 = /(^|[\s\},])(canvas|#game-canvas|#canvas|\.game-canvas)[^{]*\{[^}]*(width\s*:\s*100%|width\s*:\s*100vw)[^}]*(height\s*:\s*100%|height\s*:\s*100vh)/i.test(cssText) ||
                          /(^|[\s\},])(canvas|#game-canvas|#canvas|\.game-canvas)[^{]*\{[^}]*(height\s*:\s*100%|height\s*:\s*100vh)[^}]*(width\s*:\s*100%|width\s*:\s*100vw)/i.test(cssText);

  const hasObjectFitContain = /(canvas|#game-canvas|#canvas|\.game-canvas)[^{]*\{[^}]*object-fit\s*:\s*contain/i.test(cssText);
  const hasAspectRatio = /aspect-ratio/i.test(cssText);

  // 3. Container wrapping canvas
  // Does the container have max-width / aspect-ratio / flex centering?
  const hasCenteredContainer = /(#game-container|#app-container|#game-wrapper|\.container|\.game-box)[^{]*\{[^}]*max-width/i.test(cssText) ||
                               /body[^{]*\{[^}]*display\s*:\s*flex[^}]*justify-content\s*:\s*center/i.test(cssText);

  // 4. JS dynamic canvas sizing
  const hasJsResize = /addEventListener\(['"]resize['"]/i.test(jsText) || /onresize/i.test(jsText) || /engine\.resize/i.test(jsText);
  const jsCanvasResize = /canvas\.width\s*=\s*(Math|window|container|rect|w|innerWidth)/i.test(jsText);

  // 5. Phaser scale mode
  let phaserScale = null;
  if (/Phaser\./i.test(jsText)) {
    const m = jsText.match(/mode:\s*Phaser\.Scale\.([A-Z_]+)/i);
    phaserScale = m ? m[1] : 'NOT_FOUND';
  }

  detailedAudit.push({
    game: g,
    canvasTags,
    fixedCanvasAttr,
    hasCanvasCss100,
    hasObjectFitContain,
    hasAspectRatio,
    hasCenteredContainer,
    hasJsResize,
    jsCanvasResize,
    phaserScale
  });
}

// Print all with potential squashing
console.log('=== GAMES WITH FIXED CANVAS ATTRIBUTE IN HTML ===');
for (const a of detailedAudit.filter(x => x.fixedCanvasAttr)) {
  console.log(`[${a.game}] attr: ${a.fixedCanvasAttr.width}x${a.fixedCanvasAttr.height}, css100: ${a.hasCanvasCss100}, objFit: ${a.hasObjectFitContain}, aspectCss: ${a.hasAspectRatio}, jsResize: ${a.jsCanvasResize}`);
}

console.log('\n=== PHASER GAMES AUDIT ===');
for (const a of detailedAudit.filter(x => x.phaserScale)) {
  console.log(`[${a.game}] mode: ${a.phaserScale}, css100: ${a.hasCanvasCss100}, objFit: ${a.hasObjectFitContain}`);
}
