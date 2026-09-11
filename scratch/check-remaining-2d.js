const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const list = [
  'grapple-knight-storm-siege',
  'warfront',
  'stateIO',
  'geeks-vs-zombies',
  'godawful',
  'celadon',
  'crumple',
  'echo-abyss',
  'ink-warden',
  'webrtc-xo'
];

for (const g of list) {
  const gDir = path.join(gamesDir, g);
  console.log(`\n=================== [${g}] ===================`);
  
  function getFiles(d) {
    let res = [];
    for (const item of fs.readdirSync(d)) {
      if (['node_modules', '.git', 'vendor', 'assets', 'lib', 'libs'].includes(item)) continue;
      const full = path.join(d, item);
      if (fs.statSync(full).isDirectory()) res = res.concat(getFiles(full));
      else res.push(full);
    }
    return res;
  }

  const all = getFiles(gDir);
  const html = all.filter(f => f.endsWith('.html')).map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const css = all.filter(f => f.endsWith('.css')).map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const js = all.filter(f => f.endsWith('.js') || f.endsWith('.mjs')).map(f => ({ name: path.basename(f), text: fs.readFileSync(f, 'utf8') }));

  const canvasTags = html.match(/<canvas[^>]*>/gi) || [];
  console.log('Canvas tags:', canvasTags);

  // Check CSS for canvas
  const canvasCss = (css + '\n' + (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join('\n'))
    .match(/(canvas|#game-canvas|#canvas|\.game-canvas|#scene|#stage|#app)[^{]*\{[^}]+\}/gi) || [];
  console.log('CSS rules:', canvasCss.map(s => s.trim().replace(/\s+/g, ' ')));

  // Check JS for canvas sizing or resize
  for (const j of js) {
    const sizing = j.text.match(/(canvas\.width\s*=[^;\n]+|canvas\.height\s*=[^;\n]+|\.setSize\([^)]+\)|\.resize\([^)]*\)|resizeCanvas|addEventListener\(['"]resize['"][^)]+\))/gi);
    if (sizing) {
      console.log(`  JS [${j.name}] ->`, sizing.slice(0, 4));
    }
  }
}
