const fs = require('fs');
const path = require('path');

const gamesDir = path.join(process.cwd(), 'public', 'games');
const games = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory() && f !== '_template');

function analyzeGame(gameName) {
  const gDir = path.join(gamesDir, gameName);
  const files = [];

  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      if (item === 'node_modules' || item === '.git' || item === 'assets') continue;
      const full = path.join(dir, item);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else {
        files.push(full);
      }
    }
  }
  walk(gDir);

  const htmlFiles = files.filter(f => f.endsWith('.html'));
  const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  let engine = 'Unknown';
  let phaserScaleMode = null;
  let phaserConfig = null;
  let canvasCss = [];
  let htmlCanvasTags = [];
  let resizeHandlers = [];
  let aspectRatios = [];
  let potentialDistortion = [];

  // 1. Read HTML
  let allHtmlContent = '';
  for (const hf of htmlFiles) {
    const content = fs.readFileSync(hf, 'utf8');
    allHtmlContent += content + '\n';
    if (content.includes('phaser')) engine = 'Phaser';
    if (content.includes('babylon')) engine = 'Babylon.js';
    if (content.includes('three.min.js') || content.includes('three.js')) engine = 'Three.js';

    const canvasMatches = content.match(/<canvas[^>]*>/gi);
    if (canvasMatches) {
      htmlCanvasTags.push(...canvasMatches);
    }
  }

  // 2. Read JS
  let allJsContent = '';
  for (const jf of jsFiles) {
    const content = fs.readFileSync(jf, 'utf8');
    allJsContent += content + '\n';

    if (content.includes('Phaser.')) {
      if (engine === 'Unknown') engine = 'Phaser';
      // Find scale mode
      const scaleModeMatch = content.match(/mode:\s*Phaser\.Scale\.([A-Z_]+)/i) || 
                             content.match(/Phaser\.Scale\.([A-Z_]+)/i) ||
                             content.match(/scaleMode:\s*Phaser\.Scale\.([A-Z_]+)/i);
      if (scaleModeMatch) {
        phaserScaleMode = scaleModeMatch[0];
      }
    }
    if (content.includes('BABYLON.')) engine = 'Babylon.js';
    if (content.includes('THREE.')) engine = 'Three.js';

    if (content.includes('resize') || content.includes('addEventListener(\'resize\'') || content.includes('addEventListener("resize"')) {
      resizeHandlers.push(path.basename(jf));
    }

    const arMatch = content.match(/aspectRatio|targetRatio/gi);
    if (arMatch) {
      aspectRatios.push(path.basename(jf));
    }
  }

  // 3. Read CSS
  let allCssContent = '';
  for (const cf of cssFiles) {
    const content = fs.readFileSync(cf, 'utf8');
    allCssContent += content + '\n';
  }

  // Also check inline <style> in HTML
  const inlineStyles = allHtmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  for (const is of inlineStyles) {
    allCssContent += is + '\n';
  }

  // Analyze CSS for canvas stretching
  // Check if canvas has width: 100% and height: 100%
  const canvasRuleMatch = allCssContent.match(/canvas\s*\{([^}]+)\}/gi);
  if (canvasRuleMatch) {
    canvasCss.push(...canvasRuleMatch);
  }

  // Detect Distortion Risks:
  // Case A: Phaser with EXACT_FIT
  if (phaserScaleMode && phaserScaleMode.includes('EXACT_FIT')) {
    potentialDistortion.push(`Phaser EXACT_FIT forces stretched canvas without preserving aspect ratio (${phaserScaleMode})`);
  }

  // Case B: Canvas tag has fixed width/height attributes (e.g. <canvas width="800" height="600">)
  // and CSS forces canvas { width: 100%; height: 100%; } or width: 100vw; height: 100vh;
  // WITHOUT object-fit: contain or aspect-ratio or letterboxing
  for (const ct of htmlCanvasTags) {
    const wMatch = ct.match(/width=["']?(\d+)["']?/i);
    const hMatch = ct.match(/height=["']?(\d+)["']?/i);
    if (wMatch && hMatch) {
      // Fixed internal resolution in HTML
      // Now check if CSS forces width 100% and height 100%
      const hasWidth100 = /width\s*:\s*100(%|vw)/i.test(allCssContent);
      const hasHeight100 = /height\s*:\s*100(%|vh)/i.test(allCssContent);
      const hasObjectFit = /object-fit\s*:\s*(contain|scale-down)/i.test(allCssContent);
      const hasAspectRatio = /aspect-ratio/i.test(allCssContent);

      // Also check if JS resizes canvas.width/height dynamically
      const hasCanvasResizeInJs = /canvas\.(width|height)\s*=\s*(window\.inner|container\.|parent\.)/i.test(allJsContent);

      if (hasWidth100 && hasHeight100 && !hasObjectFit && !hasAspectRatio && !hasCanvasResizeInJs) {
        potentialDistortion.push(`HTML Canvas has fixed internal buffer (${wMatch[1]}x${hMatch[1]}) but CSS has width/height 100% without object-fit or aspect-ratio`);
      }
    }
  }

  // Case C: 2D Canvas where CSS has canvas { width: 100%; height: 100%; }
  // but JS never updates canvas.width/height or does not maintain aspect ratio
  if (engine === 'Unknown' || engine === 'Canvas 2D') {
    if (allJsContent.includes('getContext(\'2d\')') || allJsContent.includes('getContext("2d")')) {
      engine = 'Canvas 2D';
      const hasWidth100 = /canvas[^}]*width\s*:\s*100(%|vw)/i.test(allCssContent) || /#canvas[^}]*width\s*:\s*100(%|vw)/i.test(allCssContent);
      const hasHeight100 = /canvas[^}]*height\s*:\s*100(%|vh)/i.test(allCssContent) || /#canvas[^}]*height\s*:\s*100(%|vh)/i.test(allCssContent);
      const hasCanvasResize = /canvas\.(width|height)\s*=/i.test(allJsContent);
      const hasObjectFit = /object-fit\s*:\s*(contain|scale-down)/i.test(allCssContent);
      const hasAspectRatio = /aspect-ratio/i.test(allCssContent);
      const hasTargetRatio = /targetRatio|aspectRatio|preserveAspect/i.test(allJsContent);

      if (hasWidth100 && hasHeight100 && !hasObjectFit && !hasAspectRatio && !hasTargetRatio) {
        if (!hasCanvasResize) {
          potentialDistortion.push(`Canvas 2D: CSS forces 100% width and 100% height, but JS does not resize internal buffer -> Canvas is stretched/squashed`);
        } else {
          // It resizes buffer, but does it stretch drawing coordinates?
          // If game draws at fixed coordinates (e.g. 400x600) but canvas.width = window.innerWidth, elements might not scale or might stretch
        }
      }
    }
  }

  // Case D: Pure DOM/HTML games
  if (engine === 'Unknown' && !allJsContent.includes('getContext')) {
    engine = 'DOM/CSS';
  }

  return {
    game: gameName,
    engine,
    phaserScaleMode,
    htmlCanvasTags,
    canvasCss,
    resizeHandlers: resizeHandlers.length,
    hasAspectRatio: aspectRatios.length > 0,
    potentialDistortion,
    cssSnippet: canvasCss.join(' | ')
  };
}

const results = games.map(analyzeGame);
const distorted = results.filter(r => r.potentialDistortion.length > 0);

console.log(`=== SCANNED ${results.length} GAMES ===`);
console.log(`Games with potential aspect ratio distortion / squash: ${distorted.length}`);
for (const d of distorted) {
  console.log(`\n[${d.game}] (${d.engine})`);
  for (const issue of d.potentialDistortion) {
    console.log(`  - ISSUE: ${issue}`);
  }
}
