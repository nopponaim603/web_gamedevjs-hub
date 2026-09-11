const fs = require('fs');
const vm = require('vm');

function deobfuscateScribble() {
    const file = 'public/games/scribble-jump/js/game.js';
    const code = fs.readFileSync(file, 'utf-8');

    // Extract decoder and array definitions
    const sandbox = {
        window: {},
        document: {},
        navigator: {}
    };
    vm.createContext(sandbox);

    // Get the array function and rotator and decoder
    const useStrictIdx = code.indexOf("'use strict';");
    const header = code.slice(0, useStrictIdx);

    // Also need to find the decoder alias, array function and decoder definition
    // The decoder definition in scribble-jump is _osm68b_v
    const decoderFuncMatch = code.match(/function\s+(_osm68b_v)\s*\([^)]*\)\s*\{[\s\S]*?return\s+v;\s*\}/);
    const arrayFuncMatch = code.match(/function\s+(_osm68b_n)\s*\([^)]*\)\s*\{[\s\S]*?return\s+qN;\s*\}/);

    const setupCode = header + '\n' + (arrayFuncMatch ? arrayFuncMatch[0] : '') + '\n' + (decoderFuncMatch ? decoderFuncMatch[0] : '');
    vm.runInContext(setupCode, sandbox);

    console.log('Testing decoder:');
    console.log('0x1f9 ->', sandbox._osm68b_Zq(0x1f9)); // 'game'
    console.log('0x1b9 ->', sandbox._osm68b_Zq(0x1b9)); // 'score'
    console.log('0x22c ->', sandbox._osm68b_Zq(0x22c)); // 'getContext'
    console.log('0x26a ->', sandbox._osm68b_Zq(0x26a)); // 'menu'
}

deobfuscateScribble();
