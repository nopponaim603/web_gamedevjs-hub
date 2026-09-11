const fs = require('fs');
const gameSrc = fs.readFileSync('public/games/echo-abyss/game.js', 'utf8');

// Find EAGL references
let idx = 0;
while ((idx = gameSrc.indexOf('EAGL', idx)) !== -1) {
  console.log('Found EAGL at:', idx, gameSrc.substring(Math.max(0, idx - 100), Math.min(gameSrc.length, idx + 100)));
  idx += 4;
}
