const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { execSync } = require('child_process');

function extractFunction(str, startIndex) {
  let openBraces = 0;
  let inString = false;
  let stringChar = null;
  let escape = false;
  let start = -1;

  for (let i = startIndex; i < str.length; i++) {
    const char = str[i];
    if (escape) { escape = false; continue; }
    if (char === '\\') { escape = true; continue; }
    if (inString) {
      if (char === stringChar) { inString = false; stringChar = null; }
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }
    if (char === '{') {
      if (openBraces === 0) start = i;
      openBraces++;
    } else if (char === '}') {
      openBraces--;
      if (openBraces === 0 && start !== -1) {
        return str.slice(startIndex, i + 1);
      }
    }
  }
  return null;
}

function deobfuscateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if file is obfuscated with _oXXXX_
  const fnMatches = [...content.matchAll(/function\s+(_o[a-zA-Z0-9]+_[a-zA-Z0-9]+)\s*\(/g)];
  if (fnMatches.length === 0 && !content.includes('_o')) {
    // Not obfuscated with _o, but clean up bracket notation if any
    let cleaned = content.replace(/\[\s*["']([a-zA-Z_$][a-zA-Z0-9_$]*)["']\s*\]/g, '.$1');
    if (cleaned !== content) {
      fs.writeFileSync(filePath, cleaned, 'utf8');
      console.log('Cleaned bracket notation in non-obfuscated file:', filePath);
    }
    return true;
  }

  // Find rotator call
  // Look for `(_oXXXXX_n, 0xHEX)` or `(_oXXXXX_e, 0xHEX)` or `(_oXXXXX_D, 0xHEX)`
  const rotMatch = content.match(/\(\s*function[^{]*\{[\s\S]*?\}\s*\(\s*(_o[a-zA-Z0-9]+_[a-zA-Z0-9]+)\s*,\s*(0x[0-9a-fA-F]+|-?[0-9]+)\s*\)\s*\)/);
  if (!rotMatch) {
    // Try without outer parens
    const rotMatch2 = content.match(/function[^{]*\{[\s\S]*?\}\s*\(\s*(_o[a-zA-Z0-9]+_[a-zA-Z0-9]+)\s*,\s*(0x[0-9a-fA-F]+|-?[0-9]+)\s*\)/);
    if (!rotMatch2) {
      console.log('No rotator found in:', filePath);
      return false;
    }
  }

  const activeRotMatch = rotMatch || content.match(/function[^{]*\{[\s\S]*?\}\s*\(\s*(_o[a-zA-Z0-9]+_[a-zA-Z0-9]+)\s*,\s*(0x[0-9a-fA-F]+|-?[0-9]+)\s*\)/);
  const rotatorCode = activeRotMatch[0];
  const arrFnName = activeRotMatch[1];

  const arrIdx = content.indexOf('function ' + arrFnName);
  if (arrIdx === -1) {
    console.log('Array fn not found:', arrFnName);
    return false;
  }
  const arrFnCode = extractFunction(content, arrIdx);

  // Find decoder function
  let decoderFnName = null;
  let decoderFnCode = null;

  for (const match of fnMatches) {
    const fnName = match[1];
    if (fnName !== arrFnName) {
      const idx = content.indexOf('function ' + fnName);
      const code = extractFunction(content, idx);
      if (code && (code.includes('decodeURIComponent') || code.includes('charAt') || code.includes('String.fromCharCode') || code.includes('0x') || code.includes('='))) {
        decoderFnName = fnName;
        decoderFnCode = code;
        break;
      }
    }
  }

  if (!decoderFnName || !decoderFnCode) {
    for (const match of fnMatches) {
      if (match[1] !== arrFnName) {
        decoderFnName = match[1];
        decoderFnCode = extractFunction(content, content.indexOf('function ' + decoderFnName));
        break;
      }
    }
  }

  if (!decoderFnName || !decoderFnCode || !arrFnCode) {
    console.log('Could not extract array/decoder for', filePath);
    return false;
  }

  const sandbox = {
    window: {},
    document: {},
    console: { log: () => {} },
    atob: (str) => Buffer.from(str, 'base64').toString('binary'),
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    parseInt: parseInt,
    Math: Math,
    String: String,
    Array: Array,
    Object: Object
  };
  vm.createContext(sandbox);

  try {
    vm.runInContext(arrFnCode + '\n' + decoderFnCode + '\n' + rotatorCode + ';', sandbox);
  } catch (err) {
    console.error('VM setup error in', filePath, err.message);
    return false;
  }

  const decoderFn = sandbox[decoderFnName];
  if (typeof decoderFn !== 'function') {
    console.error('Decoder not a function in', filePath);
    return false;
  }

  // Find all decoder aliases:
  // 1. Top level aliases: const _oal1lz8_I = _oal1lz8_D;
  // 2. In-scope aliases: const qZ = _o1gtzdzu_D; const v = _o1skgptw_D;
  // ONLY match where the RHS is EXACTLY decoderFnName or another known alias!
  const aliases = new Set([decoderFnName]);
  
  // Find direct assignments like `const qZ = _o1gtzdzu_D` or `_o1skgptw_qq = _o1skgptw_D`
  const assignRegex = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(_o[a-zA-Z0-9]+_[a-zA-Z0-9]+)\b/g;
  let m;
  while ((m = assignRegex.exec(content)) !== null) {
    if (m[2] === decoderFnName) {
      aliases.add(m[1]);
    }
  }

  console.log(`[${path.basename(filePath)}] Decoded aliases:`, Array.from(aliases));

  let replaced = content;

  // Replace all decoder calls ALIAS(0xHEX) or ALIAS(0xHEX, "key")
  for (const alias of aliases) {
    const callRegex = new RegExp('\\b' + alias + '\\s*\\(\\s*(0x[0-9a-fA-F]+|-?[0-9]+)(?:\\s*,\\s*[\'"]([^\'"]+)[\'"])?\\s*\\)', 'g');
    replaced = replaced.replace(callRegex, (match, hexArg, secondArg) => {
      try {
        const num = parseInt(hexArg, hexArg.startsWith('0x') ? 16 : 10);
        const val = secondArg !== undefined ? decoderFn(num, secondArg) : decoderFn(num);
        if (typeof val === 'string') {
          return JSON.stringify(val);
        }
        return match;
      } catch (e) {
        return match;
      }
    });
  }

  // Remove ONLY the decoder setup blocks:
  replaced = replaced.replace(arrFnCode, '');
  replaced = replaced.replace(rotatorCode, '');
  replaced = replaced.replace(decoderFnCode, '');

  // Remove ONLY the exact alias declarations like `const qZ = _o1gtzdzu_D,` or `const qZ = _o1gtzdzu_D;`
  for (const alias of aliases) {
    // Match `const ALIAS = _o..._D,` or `const ALIAS = _o..._D;`
    replaced = replaced.replace(new RegExp('(?:const|let|var)\\s+' + alias + '\\s*=\\s*' + decoderFnName + '\\s*[,;]', 'g'), '');
    replaced = replaced.replace(new RegExp('\\b' + alias + '\\s*=\\s*' + decoderFnName + '\\s*[,;]', 'g'), '');
  }

  // Remove self-defending boilerplate
  replaced = replaced.replace(/(?:const|let|var)\s+_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\s*=\s*\(function\(\)\s*\{[\s\S]*?\}\(\)\)(?:,\s*_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\s*=\s*[^;]+)?;/g, '');
  replaced = replaced.replace(/(?:const|let|var)\s+_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\s*=\s*\(function\(\)\s*\{[\s\S]*?\}\(\)\);?/g, '');
  replaced = replaced.replace(/\(function\([a-zA-Z0-9_,\s]+\)\{e=q\(\);[\s\S]*?\}\(_o[a-zA-Z0-9]+_[a-zA-Z0-9]+,\s*0x[0-9a-fA-F]+\)\);?/g, '');
  replaced = replaced.replace(/return\s+_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\.toString\(\)\.search\([^\)]+\)\.toString\(\)\.constructor\([^\)]+\)\.search\([^\)]+\);\}\);\s*_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\(\);/g, '');
  replaced = replaced.replace(/_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\(\);?/g, '');

  // Strip leading remnant before imports/exports
  const topMatch = replaced.match(/\b(import\s+|export\s+|const\s+[a-zA-Z0-9_$]+\s*=|let\s+[a-zA-Z0-9_$]+\s*=|function\s+[a-zA-Z0-9_$]+\s*\(|class\s+[a-zA-Z0-9_$]+|'use strict'|"use strict")/);
  if (topMatch && topMatch.index > 0) {
    const lead = replaced.slice(0, topMatch.index);
    if (lead.includes('_o') || lead.includes('function(') || lead.includes('return') || lead.includes(';') || lead.includes('}')) {
      replaced = replaced.slice(topMatch.index);
    }
  }

  // Simplify bracket properties: obj["prop"] -> obj.prop
  replaced = replaced.replace(/\[\s*["']([a-zA-Z_$][a-zA-Z0-9_$]*)["']\s*\]/g, '.$1');

  // Convert safe hex numbers < 1000
  replaced = replaced.replace(/\b0x([0-9a-fA-F]+)\b/g, (match, hex) => {
    const val = parseInt(hex, 16);
    if (val < 1000 && !match.startsWith('0x00')) {
      return val.toString();
    }
    return match;
  });

  fs.writeFileSync(filePath, replaced.trim(), 'utf8');
  return true;
}

module.exports = { deobfuscateFile };
