const fs = require('fs');

const code = fs.readFileSync('public/games/scribble-jump/js/game.js', 'utf-8');

// In scribble-jump:
// _osm68b_n is array:
const arrayMatch = code.match(/function _osm68b_n\(\)\{const qN=\[([\s\S]*?)\];/);
const arrayItems = eval('[' + arrayMatch[1] + ']');

// The rotator rotated the array:
// (function(Z,q){ ... }(_osm68b_n, 0xb5f9c))
function rotate(arr, target) {
    function decodeHex(val) {
        return parseInt(val, 16);
    }
    const n = arr;
    // We can simulate the rotation loop
    // But even better, we can extract the decoder algorithm directly:
}

// Let's implement the exact decoder in pure JS:
function base64Decode(W) {
    const L = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
    let z = '',
        I = '',
        Y = z + base64Decode;
    for (let w = 0x0, b, s, m = 0x0; s = W.charAt(m++); ~s && (b = w % 0x4 ? b * 0x40 + s : s, w++ % 0x4) ? z += Y.charCodeAt(m + 0xa) - 0xa !== 0x0 ? String.fromCharCode(0xff & b >> (-0x2 * w & 0x6)) : w : 0x0) {
        s = L.indexOf(s);
    }
    for (let l = 0x0, i = z.length; l < i; l++) {
        I += '%' + ('00' + z.charCodeAt(l).toString(0x10)).slice(-0x2);
    }
    return decodeURIComponent(I);
}

// Run the rotation:
const arr = arrayItems.slice();
while (true) {
    try {
        // Rotator formula from scribble-jump:
        // const v = -parseInt(Z8(0x285))/0x1 + parseInt(Z8(0x257))/0x2*(parseInt(Z8(0x2e1))/0x3) + parseInt(Z8(0x1e6))/0x4*(parseInt(Z8(0x221))/0x5) + -parseInt(Z8(0x2ae))/0x6*(parseInt(Z8(0x286))/0x7) + -parseInt(Z8(0x1cb))/0x8 + parseInt(Z8(0x1f8))/0x9 + parseInt(Z8(0x2de))/0xa;
        const Z8 = (idx) => {
            const raw = arr[idx - 0x18c];
            try {
                return base64Decode(raw);
            } catch (e) {
                return raw;
            }
        };
        const v = -parseInt(Z8(0x285)) / 0x1 + parseInt(Z8(0x257)) / 0x2 * (parseInt(Z8(0x2e1)) / 0x3) + parseInt(Z8(0x1e6)) / 0x4 * (parseInt(Z8(0x221)) / 0x5) + -parseInt(Z8(0x2ae)) / 0x6 * (parseInt(Z8(0x286)) / 0x7) + -parseInt(Z8(0x1cb)) / 0x8 + parseInt(Z8(0x1f8)) / 0x9 + parseInt(Z8(0x2de)) / 0xa;
        if (v === 0xb5f9c) break;
        else arr.push(arr.shift());
    } catch (e) {
        arr.push(arr.shift());
    }
}

const decodeCache = {};

function decodeString(idx) {
    if (decodeCache[idx]) return decodeCache[idx];
    const raw = arr[idx - 0x18c];
    try {
        const res = base64Decode(raw);
        decodeCache[idx] = res;
        return res;
    } catch (e) {
        decodeCache[idx] = raw;
        return raw;
    }
}

console.log('Rotation successful! Testing string resolution:');
for (let i = 0x18c; i <= 0x2ea; i++) {
    const s = decodeString(i);
    if (s && s.length < 50) {
        console.log(`0x${i.toString(16)}: ${JSON.stringify(s)}`);
    }
}
