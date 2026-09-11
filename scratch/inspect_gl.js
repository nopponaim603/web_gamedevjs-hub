const fs = require('fs');
const glSrc = fs.readFileSync('public/games/echo-abyss/render-gl.js', 'utf8');

// mock window
global.window = {};
global.document = { addEventListener: () => {} };
eval(glSrc);
console.log('Window keys from render-gl:', Object.keys(window));
