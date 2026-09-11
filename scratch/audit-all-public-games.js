const fs = require('fs');
const path = require('path');

const gamesDir = 'C:\\Users\\noppon\\source\\06-WEB\\webJS\\public\\games';
const folders = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());

const gameList = [];

for (const folder of folders) {
  const fPath = path.join(gamesDir, folder);
  const files = [];

  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      if (item === 'node_modules' || item === '.git') continue;
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) walk(full);
      else files.push(full);
    }
  }
  walk(fPath);

  const htmlFiles = files.filter(f => f.endsWith('.html'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));

  let html = htmlFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let css = cssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let js = jsFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const inlineStyles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  css += '\n' + inlineStyles.join('\n');

  // Engine detection
  let engine = 'DOM / HTML5';
  if (/Phaser\.AUTO|Phaser\.CANVAS|Phaser\.WEBGL|new Phaser\.Game/i.test(js) || /phaser/i.test(html)) {
    engine = 'Phaser 3';
  } else if (/BABYLON\.Engine|new BABYLON/i.test(js) || /babylon\.js/i.test(html)) {
    engine = 'Babylon.js (3D)';
  } else if (/THREE\.WebGLRenderer|new THREE\./i.test(js) || /three(\.min)?\.js/i.test(html)) {
    engine = 'Three.js (3D)';
  } else if (/PIXI\.Application|new PIXI\./i.test(js) || /pixi(\.min)?\.js/i.test(html)) {
    engine = 'Pixi.js';
  } else if (/<canvas/i.test(html) || /getContext\(['"]2d['"]\)/i.test(js)) {
    engine = 'Canvas 2D';
  }

  // Sizing and Scaling Strategy
  let scaleStrategy = '';
  let isSquashed = false;
  let notes = '';

  if (engine === 'Phaser 3') {
    const scaleMode = js.match(/mode:\s*Phaser\.Scale\.([A-Z_]+)/i);
    const mode = scaleMode ? scaleMode[1] : 'FIT';
    const hasObjFit = /object-fit\s*:\s*contain/i.test(css);
    scaleStrategy = `Scale.${mode}` + (hasObjFit ? ' + object-fit: contain' : '');
    if (mode === 'EXACT_FIT') {
      isSquashed = true;
      notes = 'EXACT_FIT stretches canvas';
    } else {
      notes = 'Auto-letterboxing (Preserves aspect ratio)';
    }
  } else if (engine.includes('3D') || engine === 'Pixi.js') {
    const hasResize = /addEventListener\(['"]resize['"]/i.test(js) || /onresize/i.test(js) || /engine\.resize/i.test(js) || /renderer\.setSize/i.test(js);
    scaleStrategy = hasResize ? 'Dynamic Viewport Resize' : 'Static Viewport';
    notes = '3D Projection matrix / Dynamic aspect ratio';
  } else if (engine === 'Canvas 2D') {
    const hasRatio = /aspect-ratio/i.test(css);
    const hasObjFit = /object-fit/i.test(css);
    const hasJsBufferResize = /canvas\.width\s*=\s*/i.test(js);
    const hasMaxWidth = /max-width/i.test(css);

    if (hasRatio) {
      scaleStrategy = 'CSS aspect-ratio';
      notes = 'Aspect ratio locked via CSS';
    } else if (hasJsBufferResize) {
      scaleStrategy = 'JS Dynamic Buffer Resize';
      notes = 'Canvas buffer matches display rect (* DPR)';
    } else if (hasMaxWidth) {
      scaleStrategy = 'Centered Container (max-width)';
      notes = 'Container bounds maintain proportions';
    } else {
      scaleStrategy = 'Canvas 2D';
      notes = 'Checked canvas styles';
    }
  } else {
    // DOM / HTML5
    const hasMaxWidth = /max-width/i.test(css);
    const hasFlexCenter = /justify-content\s*:\s*center/i.test(css);
    scaleStrategy = hasMaxWidth ? 'Centered Layout (max-width)' : 'Responsive Fluid';
    notes = 'Flex/Grid responsive elements';
  }

  gameList.push({
    folder,
    engine,
    scaleStrategy,
    isSquashed,
    notes
  });
}

console.log(`Audited ${gameList.length} folders in C:\\Users\\noppon\\source\\06-WEB\\webJS\\public\\games:\n`);
console.table(gameList.map(g => ({
  Game: g.folder,
  Engine: g.engine,
  Strategy: g.scaleStrategy,
  'Squashed?': g.isSquashed ? 'YES ❌' : 'NO ✅'
})));

const squashedOnes = gameList.filter(g => g.isSquashed);
console.log('\nTotal squashed:', squashedOnes.length);
