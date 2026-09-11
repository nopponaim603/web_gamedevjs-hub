const fs = require('fs');
const src = fs.readFileSync('scratch/game_deobfuscated.js', 'utf8');

const idx = src.indexOf("qK['render']");
console.log('qK render context:');
console.log(src.substring(idx - 200, idx + 400));

const idx2 = src.indexOf("qK=");
console.log('qK assignment context:');
console.log(src.substring(idx2 - 200, idx2 + 400));
