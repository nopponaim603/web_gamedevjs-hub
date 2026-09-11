const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const list = [
  'oxford-3000',
  'pretext-breaker',
  'silent-viper',
  'water-ring-toss',
  'jelly-baby'
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

  // find container / body / app rules
  const matches = (css + '\n' + (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join('\n'))
    .match(/(body|html|#app|#game|\.game-container|\.container|#stage)[^{]*\{[^}]+\}/gi) || [];
  console.log('Layout CSS:', matches.slice(0, 4).map(s => s.trim().replace(/\s+/g, ' ')));
}
