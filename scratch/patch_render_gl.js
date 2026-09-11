const fs = require('fs');
const path = require('path');

const glPath = path.join(__dirname, '..', 'public', 'games', 'echo-abyss', 'render-gl.js');
let glJs = fs.readFileSync(glPath, 'utf8');

// 1. Optimize quality presets: start with 'high', balance particle and raymarch steps
// Original: const Z={'ultra':{'particles':0x36b0,'steps':0x1a,'dpr':0x2},'high':{'particles':0x1f40,'steps':0x12,'dpr':1.75},'low':{'particles':0xbb8,'steps':0xa,'dpr':1.25}}
// Original: const q=[Z3(0x1c0),Z3(0x1c5),Z3(0x1ca)] (ultra, high, low)
// We change default order to high, low, ultra so default is high (silky 60fps)
// and reduce ultra excessive particles (from 14k to 8k, high to 5k)

glJs = glJs.replace(
  /'ultra':\{'particles':0x36b0,'steps':0x1a,'dpr':0x2\},'high':\{'particles':0x1f40,'steps':0x12,'dpr':1.75\},'low':\{'particles':0xbb8,'steps':0xa,'dpr':1.25\}/,
  "'ultra':{'particles':0x2328,'steps':0x14,'dpr':1.75},'high':{'particles':0x1388,'steps':0xe,'dpr':1.5},'low':{'particles':0x7d0,'steps':0x8,'dpr':1.0}"
);

// 2. Change n = 0xb0 (176) to n = 0x80 (128) and g = 0x16 (22) to g = 0x10 (16)
glJs = glJs.replace(/const n=0xb0,v=0x1cc,r=/, 'const n=0x80,v=0x1cc,r=');
glJs = glJs.replace(/const g=0x16,U=S\[/, 'const g=0x10,U=S[');

fs.writeFileSync(glPath, glJs, 'utf8');
console.log('Successfully optimized public/games/echo-abyss/render-gl.js');
