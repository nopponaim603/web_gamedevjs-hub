const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { execSync } = require('child_process');

function extractBalancedBraces(str, startIndex) {
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

function fullyDeobfuscate(filePath) {
  // First get original source from git if available
  let content;
  try {
    const gitPath = path.relative('.', filePath).replace(/\\/g, '/');
    content = execSync(`git show HEAD:${gitPath}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch (e) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  // Find array function name
  const rotMatch = content.match(/\(function\([a-zA-Z0-9_,\s]+\)\s*\{[\s\S]*?\}\s*\(\s*(_o[a-zA-Z0-9]+_[a-zA-Z0-9]+)\s*,\s*(0x[0-9a-fA-F]+|-?[0-9]+)\s*\)\s*\);?/);
  if (!rotMatch) {
    console.log('No rotator in', filePath);
    return false;
  }

  const rotatorCode = rotMatch[0];
  const arrFnName = rotMatch[1];
  const arrIdx = content.indexOf('function ' + arrFnName);
  if (arrIdx === -1) return false;
  const arrFnCode = extractBalancedBraces(content, arrIdx);

  const basePrefix = arrFnName.split('_')[1];
  const fnMatches = [...content.matchAll(new RegExp('function\\s+(_o' + basePrefix + '_[a-zA-Z0-9]+)\\s*\\(', 'g'))];
  let decoderFnName = null;
  let decoderFnCode = null;

  for (const m of fnMatches) {
    if (m[1] !== arrFnName) {
      const idx = content.indexOf('function ' + m[1]);
      const code = extractBalancedBraces(content, idx);
      if (code) {
        decoderFnName = m[1];
        decoderFnCode = code;
        break;
      }
    }
  }

  if (!decoderFnName || !decoderFnCode || !arrFnCode) {
    console.log('Missing decoder or array in', filePath);
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
  vm.runInContext(arrFnCode + '\n' + decoderFnCode + '\n' + rotatorCode + ';', sandbox);
  const decoderFn = sandbox[decoderFnName];

  // Find all aliases transitively
  const aliases = new Set([decoderFnName]);
  let added = true;
  while (added) {
    added = false;
    const allAliases = Array.from(aliases);
    for (const a of allAliases) {
      const regex = new RegExp('(?:const|let|var|\\b)\\s*([a-zA-Z0-9_$]+)\\s*=\\s*' + a + '\\b', 'g');
      let m;
      while ((m = regex.exec(content)) !== null) {
        if (!aliases.has(m[1])) {
          aliases.add(m[1]);
          added = true;
        }
      }
    }
  }

  console.log(`[${path.basename(filePath)}] All transitive aliases (${aliases.size}):`, Array.from(aliases));

  let replaced = content;

  // Replace all decoder calls for all aliases
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

  // Remove setup code
  replaced = replaced.replace(rotatorCode, '');
  replaced = replaced.replace(decoderFnCode, '');
  replaced = replaced.replace(arrFnCode, '');

  // Remove all alias assignments
  for (const alias of aliases) {
    // const ALIAS = DECODER, or const ALIAS = DECODER;
    for (const parent of aliases) {
      replaced = replaced.replace(new RegExp('(?:const|let|var)\\s+' + alias + '\\s*=\\s*' + parent + '\\s*[,;]', 'g'), '');
      replaced = replaced.replace(new RegExp('\\b' + alias + '\\s*=\\s*' + parent + '\\s*[,;]', 'g'), '');
    }
  }

  // Remove self-defending closures and wrapper code
  replaced = replaced.replace(/(?:const|let|var)\s+_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\s*=\s*\(function\(\)\s*\{[\s\S]*?\}\(\)\)(?:,\s*_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\s*=\s*[^;]+)?;/g, '');
  replaced = replaced.replace(/(?:const|let|var)\s+_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\s*=\s*\(function\(\)\s*\{[\s\S]*?\}\(\)\);?/g, '');
  replaced = replaced.replace(/_o[a-zA-Z0-9]+_[a-zA-Z0-9]+\(\);?/g, '');

  // Clean leading debris
  const leadMatch = replaced.match(/\b(?:import\s+|export\s+|const\s+[a-zA-Z0-9_$]+\s*=|let\s+[a-zA-Z0-9_$]+\s*=|var\s+[a-zA-Z0-9_$]+\s*=|function\s+[a-zA-Z0-9_$]+\s*\(|class\s+[a-zA-Z0-9_$]+|'use strict'|"use strict")/);
  if (leadMatch && leadMatch.index > 0) {
    replaced = replaced.slice(leadMatch.index);
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

  // Fix typo `?..` -> `?.`
  replaced = replaced.replace(/\?\.\./g, '?.');

  fs.writeFileSync(filePath, replaced.trim(), 'utf8');
  return true;
}

// Target all inkwash files
const inkwashDir = path.resolve('public/games/inkwash/js');
for (const file of fs.readdirSync(inkwashDir)) {
  if (file.endsWith('.js') && file !== 'balance.js' && file !== 'audio.js' && file !== 'save.js') {
    const full = path.join(inkwashDir, file);
    fullyDeobfuscate(full);
  }
}

// Format using prettier
try {
  execSync('npx prettier --write "public/games/inkwash/js/*.js"', { stdio: 'inherit' });
  console.log('Formatted inkwash files with Prettier!');
} catch (e) {
  console.error('Prettier error:', e.message);
}
