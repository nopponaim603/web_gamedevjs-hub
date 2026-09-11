const fs = require('fs');
let gameSrc = fs.readFileSync('public/games/echo-abyss/game.js', 'utf8');

// evaluate the decoder
const match = gameSrc.match(/function _o7p570g_v\([^)]*\)\{[\s\S]*?return v;\}/);
const funcN = gameSrc.match(/function _o7p570g_n\(\)\{[\s\S]*?return _o7p570g_n\(\);\}/);
const helper = funcN[0] + '\n' + match[0] + '\n; global._v = _o7p570g_v;';
eval(helper);

// Replace any alias(0x...)
let count = 0;
const deobfuscated = gameSrc.replace(/\b[a-zA-Z0-9_$]+\((0x[0-9a-fA-F]+)\)/g, (m, hex) => {
  try {
    const num = parseInt(hex, 16);
    const val = global._v(num);
    if (typeof val === 'string') {
      count++;
      return JSON.stringify(val);
    }
  } catch (e) {}
  return m;
});

console.log(`Replaced ${count} string lookups.`);
fs.writeFileSync('scratch/game_deobfuscated.js', deobfuscated, 'utf8');
