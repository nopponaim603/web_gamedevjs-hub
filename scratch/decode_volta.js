const fs = require('fs');

const code = fs.readFileSync('public/games/volta/js/main.js', 'utf-8');

// In volta/js/main.js:
const arrayMatch = code.match(/function _o1h4h6td_r\(\)\{const yu=\[([\s\S]*?)\];/);
const arrayItems = eval('[' + arrayMatch[1] + ']');

// The rotator:
// const _o1h4h6td_UP = _o1h4h6td_k;
// (function(U,y){ ... }(_o1h4h6td_r, 0x18dce));

const arr = arrayItems.slice();
while (true) {
    try {
        const UF = (idx) => {
            return arr[idx - 0x13e];
        };
        const k = -parseInt(UF(0x232)) / 0x1 + parseInt(UF(0x1d6)) / 0x2 * (-parseInt(UF(0x200)) / 0x3) + -parseInt(UF(0x189)) / 0x4 + -parseInt(UF(0x241)) / 0x5 + -parseInt(UF(0x245)) / 0x6 + parseInt(UF(0x177)) / 0x7 * (parseInt(UF(0x21a)) / 0x8) + -parseInt(UF(0x1b2)) / 0x9 * (-parseInt(UF(0x1e9)) / 0xa);
        if (k === 0x18dce) break;
        else arr.push(arr.shift());
    } catch (e) {
        arr.push(arr.shift());
    }
}

console.log('Volta string array rotated successfully! Length:', arr.length);
for (let i = 0x13e; i <= 0x13e + arr.length - 1; i++) {
    const s = arr[i - 0x13e];
    if (s && s.length < 50) {
        console.log(`0x${i.toString(16)}: ${JSON.stringify(s)}`);
    }
}
