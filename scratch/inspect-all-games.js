const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const games = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory() && f !== '_template');

const report = [];

for (const game of games) {
  const gDir = path.join(gamesDir, game);
  const files = [];

  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      if (['node_modules', '.git', 'assets', 'vendor', 'libs', 'lib'].includes(f)) continue;
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else files.push(full);
    }
  }
  walk(gDir);

  const htmlFiles = files.filter(f => f.endsWith('.html'));
  const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  let htmlAll = htmlFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let jsAll = jsFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let cssAll = cssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

  // Also grab <style> in html
  const inlineStyles = htmlAll.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  cssAll += '\n' + inlineStyles.join('\n');

  // Engine
  let engine = 'Vanilla/DOM';
  if (/phaser/i.test(htmlAll) || /phaser/i.test(jsAll)) engine = 'Phaser';
  else if (/babylon/i.test(htmlAll) || /babylon/i.test(jsAll)) engine = 'Babylon.js';
  else if (/three(\.min)?\.js/i.test(htmlAll) || /three/i.test(jsAll)) engine = 'Three.js';
  else if (/pixi/i.test(htmlAll) || /pixi/i.test(jsAll)) engine = 'Pixi.js';
  else if (/getContext\(['"]2d['"]\)/i.test(jsAll) || /<canvas/i.test(htmlAll)) engine = 'Canvas 2D';

  // Phaser Scale Config
  let phaserScale = null;
  if (engine === 'Phaser') {
    const m = jsAll.match(/mode:\s*Phaser\.Scale\.([A-Z_]+)/i) ||
              jsAll.match(/scaleMode:\s*Phaser\.Scale\.([A-Z_]+)/i) ||
              jsAll.match(/scale:\s*\{[^}]*mode:\s*Phaser\.Scale\.([A-Z_]+)/i);
    const w = jsAll.match(/width:\s*(\d+)/i);
    const h = jsAll.match(/height:\s*(\d+)/i);
    phaserScale = {
      mode: m ? m[1] : 'NOT_SET',
      width: w ? w[1] : '?',
      height: h ? h[1] : '?'
    };
  }

  // Canvas elements in HTML
  const canvasMatches = htmlAll.match(/<canvas[^>]*>/gi) || [];

  // Canvas CSS properties
  const canvasCssRules = [];
  const matches = cssAll.match(/(^|[\s\},])(canvas|#game-canvas|#canvas|\.game-canvas)[^\{]*\{([^\}]+)\}/gi) || [];
  for (const m of matches) {
    canvasCssRules.push(m.trim().replace(/\s+/g, ' '));
  }

  // Check aspect-ratio in CSS
  const hasAspectRatioCss = /aspect-ratio/i.test(cssAll);
  const hasObjectFitContain = /object-fit\s*:\s*contain/i.test(cssAll);

  // Check body/container styles
  const bodyHasFlexOrGridCenter = /justify-content\s*:\s*center/i.test(cssAll) && /align-items\s*:\s*center/i.test(cssAll);

  // Check resize handler in JS
  const hasResizeListener = /addEventListener\(['"]resize['"]/i.test(jsAll) || /window\.onresize/i.test(jsAll) || /engine\.resize/i.test(jsAll) || /app\.resize/i.test(jsAll);

  report.push({
    game,
    engine,
    phaserScale,
    canvasMatches,
    canvasCssRules,
    hasAspectRatioCss,
    hasObjectFitContain,
    bodyHasFlexOrGridCenter,
    hasResizeListener
  });
}

// Print summary by engine
console.log('--- PHASER GAMES ---');
for (const r of report.filter(r => r.engine === 'Phaser')) {
  console.log(`[${r.game}] scaleMode: ${r.phaserScale?.mode}, baseSize: ${r.phaserScale?.width}x${r.phaserScale?.height}, canvasCss: ${r.canvasCssRules.slice(0,2).join(';')}`);
}

console.log('\n--- BABYLON / THREE / PIXI GAMES ---');
for (const r of report.filter(r => ['Babylon.js', 'Three.js', 'Pixi.js'].includes(r.engine))) {
  console.log(`[${r.game}] (${r.engine}) resizeListener: ${r.hasResizeListener}, canvasCss: ${r.canvasCssRules.slice(0,2).join(';')}`);
}

console.log('\n--- CANVAS 2D GAMES ---');
for (const r of report.filter(r => r.engine === 'Canvas 2D')) {
  console.log(`[${r.game}] canvasInHtml: ${r.canvasMatches.join(' | ')}, resizeListener: ${r.hasResizeListener}, canvasCss: ${r.canvasCssRules.slice(0,2).join(';')}`);
}

console.log('\n--- DOM / VANILLA GAMES ---');
for (const r of report.filter(r => r.engine === 'Vanilla/DOM')) {
  console.log(`[${r.game}] resizeListener: ${r.hasResizeListener}`);
}
