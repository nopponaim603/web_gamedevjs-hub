const fs = require('fs');
const src = fs.readFileSync('scratch/game_deobfuscated.js', 'utf8');

// Search for render / gl initialization
const keywords = ['create', 'EAGL', 'requestAnimationFrame', 'sdf', 'render', 'stepDown'];
for (const kw of keywords) {
  let idx = 0;
  console.log(`=== Matches for: ${kw} ===`);
  let found = 0;
  while ((idx = src.indexOf(kw, idx)) !== -1 && found < 5) {
    console.log(src.substring(Math.max(0, idx - 80), Math.min(src.length, idx + 120)));
    console.log('------------------');
    idx += kw.length;
    found++;
  }
}
