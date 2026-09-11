const fs = require('fs');

const code = fs.readFileSync('public/games/volta/js/main.js', 'utf-8');
const arrayMatch = code.match(/function _o1h4h6td_r\(\)\{const yu=\[([\s\S]*?)\];/);
const arrayItems = eval('[' + arrayMatch[1] + ']');

const arr = arrayItems.slice();
while (true) {
    try {
        const UF = (idx) => arr[idx - 0x13e];
        const k = -parseInt(UF(0x232)) / 0x1 + parseInt(UF(0x1d6)) / 0x2 * (-parseInt(UF(0x200)) / 0x3) + -parseInt(UF(0x189)) / 0x4 + -parseInt(UF(0x241)) / 0x5 + -parseInt(UF(0x245)) / 0x6 + parseInt(UF(0x177)) / 0x7 * (parseInt(UF(0x21a)) / 0x8) + -parseInt(UF(0x1b2)) / 0x9 * (-parseInt(UF(0x1e9)) / 0xa);
        if (k === 0x18dce) break;
        else arr.push(arr.shift());
    } catch (e) {
        arr.push(arr.shift());
    }
}

function decodeStr(idx) {
    return arr[idx - 0x13e];
}

// Map of all resolved index values
const stringMap = {};
for (let i = 0x13e; i < 0x13e + arr.length; i++) {
    stringMap[i] = decodeStr(i);
}

// Replace any call func(number) where number matches a string
let clean = code;
clean = clean.replace(/([a-zA-Z0-9_$]+)\((0x[0-9a-fA-F]+|\b\d+\b)\)/g, (m, fn, arg) => {
    const num = arg.startsWith('0x') ? parseInt(arg, 16) : parseInt(arg, 10);
    if (stringMap[num] !== undefined && (fn.startsWith('_o1h') || fn.startsWith('y') || fn.startsWith('U') || fn.startsWith('u') || fn === 'T' || fn === '$')) {
        if (fn === '$') return `$(${JSON.stringify(stringMap[num])})`;
        if (fn === 'T') return `T(${JSON.stringify(stringMap[num])})`;
        return JSON.stringify(stringMap[num]);
    }
    return m;
});

// Replace member bracket strings with clean properties
clean = clean.replace(/\['([a-zA-Z_$][a-zA-Z0-9_$]*)'\]/g, '.$1');

// Replace hex numbers
clean = clean.replace(/\b0x([0-9a-fA-F]+)\b/g, (m, hex) => {
    return parseInt(hex, 16).toString();
});

// Remove boilerplate IIFE headers
clean = clean.slice(clean.indexOf("import{createAudio}"));
clean = clean.replace(/function _o1h4h6td_r\(\)[\s\S]*$/g, '');
clean = clean.replace(/const\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+;/g, '');

fs.writeFileSync('scratch/volta_pass2.js', clean);
console.log('Pass 2 completed! Saved to scratch/volta_pass2.js');
