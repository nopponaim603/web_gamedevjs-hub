const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const games = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory() && f !== '_template');

const results = [];

for (const gameId of games) {
  const gDir = path.join(gamesDir, gameId);
  const info = {
    id: gameId,
    type: 'Unknown',
    hasCanvas: false,
    canvasDetails: [],
    cssRules: [],
    jsResize: false,
    aspectPreserved: false,
    distortionRisk: 'NONE',
    reasons: []
  };

  // Collect files
  function getFiles(d) {
    let r = [];
    for (const f of fs.readdirSync(d)) {
      if (['node_modules', '.git', 'vendor', 'assets', 'lib', 'libs'].includes(f)) continue;
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) r = r.concat(getFiles(p));
      else r.push(p);
    }
    return r;
  }
  const allFiles = getFiles(gDir);

  const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
  const jsFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
  const cssFiles = allFiles.filter(f => f.endsWith('.css'));

  let htmlText = htmlFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let jsText = jsFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  let cssText = cssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const inlineStyles = htmlText.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  cssText += '\n' + inlineStyles.join('\n');

  // Check engine
  if (/phaser/i.test(htmlText) || /phaser/i.test(jsText)) {
    info.type = 'Phaser';
  } else if (/babylon/i.test(htmlText) || /babylon/i.test(jsText)) {
    info.type = 'Babylon.js';
  } else if (/three/i.test(htmlText) || /three/i.test(jsText)) {
    info.type = 'Three.js';
  } else if (/pixi/i.test(htmlText) || /pixi/i.test(jsText)) {
    info.type = 'Pixi.js';
  } else if (/<canvas/i.test(htmlText) || /getContext/i.test(jsText)) {
    info.type = 'Canvas 2D';
  } else {
    info.type = 'DOM/CSS';
  }

  // Check Canvas elements
  const canvasTags = htmlText.match(/<canvas[^>]*>/gi) || [];
  if (canvasTags.length > 0) {
    info.hasCanvas = true;
    info.canvasDetails = canvasTags;
  }

  // Check CSS for Canvas width/height
  const canvasCss = cssText.match(/(canvas|#game-canvas|#canvas|\.game-canvas)[^\{]*\{([^\}]+)\}/gi) || [];
  info.cssRules = canvasCss.map(s => s.trim().replace(/\s+/g, ' '));

  // Check if CSS has object-fit: contain or aspect-ratio
  const hasObjectFitContain = /object-fit\s*:\s*contain/i.test(cssText);
  const hasAspectRatioCss = /aspect-ratio/i.test(cssText);
  const hasMaxWidth = /max-width/i.test(cssText);

  // Check JS resize
  const hasResize = /addEventListener\(['"]resize['"]/i.test(jsText) || /window\.onresize/i.test(jsText) || /engine\.resize/i.test(jsText) || /app\.resize/i.test(jsText);
  info.jsResize = hasResize;

  // Analysis by engine type
  if (info.type === 'Phaser') {
    const scaleMode = jsText.match(/mode:\s*Phaser\.Scale\.([A-Z_]+)/i);
    const modeName = scaleMode ? scaleMode[1] : 'UNKNOWN';
    if (modeName === 'EXACT_FIT') {
      info.distortionRisk = 'HIGH';
      info.reasons.push('Phaser Scale mode is EXACT_FIT (stretches canvas distorting aspect ratio)');
    } else if (modeName === 'FIT') {
      info.aspectPreserved = true;
      // But verify if CSS overrides canvas width/height without object-fit
      const force100 = /canvas[^{]*\{[^}]*width\s*:\s*100%[^}]*height\s*:\s*100%/i.test(cssText);
      if (force100 && !hasObjectFitContain) {
        info.distortionRisk = 'MEDIUM';
        info.reasons.push('Phaser Scale FIT is used, but CSS has canvas { width: 100%; height: 100% } without object-fit: contain, which might override Phaser canvas aspect ratio in some browsers');
      }
    } else {
      info.reasons.push(`Phaser Scale mode is ${modeName}`);
    }
  } else if (info.type === 'Three.js' || info.type === 'Babylon.js') {
    // 3D engines: does resize update camera aspect?
    const hasCameraAspect = /camera\.aspect\s*=/i.test(jsText) || /updateProjectionMatrix/i.test(jsText) || info.type === 'Babylon.js';
    if (hasResize && hasCameraAspect) {
      info.aspectPreserved = true;
    } else if (!hasResize) {
      info.distortionRisk = 'LOW_TO_MEDIUM';
      info.reasons.push(`${info.type}: Missing window resize listener to update camera aspect ratio when window/iframe resizes`);
    }
  } else if (info.type === 'Canvas 2D') {
    // Check how canvas dimensions are handled
    // 1. Is there fixed width/height on <canvas>?
    for (const tag of canvasTags) {
      const wMatch = tag.match(/width=["']?(\d+)["']?/i);
      const hMatch = tag.match(/height=["']?(\d+)["']?/i);
      if (wMatch && hMatch) {
        const cw = parseInt(wMatch[1]);
        const ch = parseInt(hMatch[1]);
        // If canvas has fixed internal resolution e.g. 600x600, 420x746
        // check if CSS has width: 100% and height: 100%
        const isStretchedInCss = /(width\s*:\s*100%|width\s*:\s*100vw)/i.test(cssText) && /(height\s*:\s*100%|height\s*:\s*100vh)/i.test(cssText);
        if (isStretchedInCss) {
          // Does it have object-fit: contain, aspect-ratio, or does JS resize the buffer?
          const jsResizesBuffer = /canvas\.(width|height)\s*=\s*(Math|window|container|rect|w|h)/i.test(jsText);
          if (!hasObjectFitContain && !hasAspectRatioCss && !jsResizesBuffer) {
            info.distortionRisk = 'HIGH';
            info.reasons.push(`Canvas has fixed buffer ${cw}x${ch}, but CSS forces 100% width and height without object-fit: contain or aspect-ratio! Canvas will be squashed/stretched`);
          } else if (jsResizesBuffer) {
            info.aspectPreserved = true;
          } else if (hasObjectFitContain || hasAspectRatioCss) {
            info.aspectPreserved = true;
          }
        }
      }
    }

    // 2. If canvas has no width/height in tag, does JS manage width/height and aspect ratio?
    const dynamicCanvasRatio = /aspectRatio|targetRatio|ratio/i.test(jsText);
    if (dynamicCanvasRatio || hasObjectFitContain || hasAspectRatioCss) {
      info.aspectPreserved = true;
    }
  } else if (info.type === 'DOM/CSS') {
    // Check if container has fixed aspect ratio or max-width or flex-centering
    const hasContainerRatio = /aspect-ratio/i.test(cssText) || /max-width/i.test(cssText);
    if (hasContainerRatio) {
      info.aspectPreserved = true;
    }
  }

  results.push(info);
}

console.log('Total Analyzed:', results.length);
const highRisk = results.filter(r => r.distortionRisk === 'HIGH');
const medRisk = results.filter(r => r.distortionRisk === 'MEDIUM');
const lowRisk = results.filter(r => r.distortionRisk === 'LOW_TO_MEDIUM');

console.log('\n=== HIGH RISK (CONFIRMED DISTORTED / SQUASHED) ===');
console.log(highRisk.map(r => `[${r.id}] (${r.type}): ${r.reasons.join('; ')}`).join('\n') || 'None');

console.log('\n=== MEDIUM RISK ===');
console.log(medRisk.map(r => `[${r.id}] (${r.type}): ${r.reasons.join('; ')}`).join('\n') || 'None');

console.log('\n=== LOW TO MEDIUM RISK (e.g. 3D resize without camera aspect update) ===');
console.log(lowRisk.map(r => `[${r.id}] (${r.type}): ${r.reasons.join('; ')}`).join('\n') || 'None');
