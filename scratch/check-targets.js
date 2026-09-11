const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const targetList = [
  'dirtline',
  'dragon-roguelite-skywake',
  'skate-dog',
  'boat-roguelite-driftwake',
  'coin-pusher-3d-copper-cascade',
  'babylon-demo',
  'celadon',
  'crumple',
  'echo-abyss',
  'geeks-vs-zombies',
  'godawful',
  'ink-warden'
];

for (const t of targetList) {
  const tDir = path.join(gamesDir, t);
  console.log(`\n================== TARGET: ${t} ==================`);
  if (!fs.existsSync(tDir)) continue;

  const html = fs.existsSync(path.join(tDir, 'index.html')) ? fs.readFileSync(path.join(tDir, 'index.html'), 'utf8') : '';
  console.log('HTML Scripts:', (html.match(/<script[^>]*src=["'][^"']+["']/gi) || []).join(' ; '));
  console.log('HTML Style tags:', (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).map(s => s.slice(0, 150) + '...').join(' ; '));
  console.log('HTML Canvas:', (html.match(/<canvas[^>]*>/gi) || []).join(' ; '));

  // Check main JS files
  function findJs(d) {
    let out = [];
    for (const f of fs.readdirSync(d)) {
      if (['node_modules', '.git'].includes(f)) continue;
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) out = out.concat(findJs(full));
      else if (f.endsWith('.js')) out.push(full);
    }
    return out;
  }
  const jsFiles = findJs(tDir);
  console.log('JS files count:', jsFiles.length);
  for (const jf of jsFiles) {
    const text = fs.readFileSync(jf, 'utf8');
    const rel = path.relative(tDir, jf);
    // search for resize, setSize, width, height
    const m = text.match(/(window\.addEventListener\(['"]resize['"]|onresize|\.setSize\(|\.resize\(|aspect\s*=|targetRatio|aspectRatio|canvas\.width)/gi);
    if (m) {
      console.log(`  JS [${rel}] matches:`, m.slice(0, 6));
    }
  }
}
