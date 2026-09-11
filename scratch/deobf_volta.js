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

// Strip the obfuscation header (everything before import)
const importIdx = code.indexOf("import{createAudio}");
let clean = code.slice(importIdx);

// Replace all decoder calls: _o1h4h6td_UP(0x...) or aliases UF, Uf, Ub, Uc, etc.
clean = clean.replace(/_o1h4h6td_UP\((0x[0-9a-fA-F]+)\)/g, (m, hex) => {
    const val = decodeStr(parseInt(hex, 16));
    return JSON.stringify(val);
});

// Also replace alias calls inside functions where const XX = _o1h4h6td_UP was defined
clean = clean.replace(/const\s+[a-zA-Z0-9_]+\s*=\s*_o1h4h6td_UP;?/g, '');
clean = clean.replace(/const\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+;?/g, (m) => {
    return m;
});

// Now match any remaining decoder calls with pattern like `Ux(0x1af)`
clean = clean.replace(/\b[Uu][a-zA-Z0-9_]*\((0x[0-9a-fA-F]+)\)/g, (m, hex) => {
    const num = parseInt(hex, 16);
    if (num >= 0x13e && num <= 0x13e + arr.length - 1) {
        return JSON.stringify(decodeStr(num));
    }
    return m;
});

// Replace member bracket access with dot notation where clean
clean = clean.replace(/\['([a-zA-Z_$][a-zA-Z0-9_$]*)'\]/g, '.$1');

// Replace hex numbers
clean = clean.replace(/\b0x([0-9a-fA-F]+)\b/g, (m, hex) => {
    return parseInt(hex, 16).toString();
});

// Remove leftover obfuscator self-defending / string array functions at end
clean = clean.replace(/function _o1h4h6td_r\(\)\{[\s\S]*?\}/g, '');

fs.writeFileSync('scratch/volta_clean_preview.js', clean);
console.log('Saved clean preview of volta! Length:', clean.length);
