/**
 * scratch/scrape_new_games.js
 * Scraper & Downloader preparation script for:
 * 1. DEAD END (G055) - https://dead-end.replit.app/
 * 2. Stick & Steel (G056) - https://stick-steel.genex.technology/
 * 3. Doodle District (G057) - https://doodleshooter.vercel.app/
 * 4. Chai Visual (G058) - https://dsa.chaicode.com/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        return download(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url}: HTTP ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      try { fs.unlinkSync(dest); } catch (_) {}
      reject(err);
    });
  });
}

const targets = [
  {
    id: 'dead-end',
    name: 'DEAD END (G055)',
    base: 'https://dead-end.replit.app',
    destDir: path.join(__dirname, '..', 'public', 'games', 'dead-end'),
    files: [
      { path: '/', dest: 'index.html' },
      { path: '/assets/index-BaFMLmj7.js', dest: 'assets/index-BaFMLmj7.js' },
      { path: '/assets/index-PdHKo0rM.css', dest: 'assets/index-PdHKo0rM.css' },
      { path: '/brand/dead-end-logo.svg', dest: 'brand/dead-end-logo.svg' },
      { path: '/favicon.svg', dest: 'favicon.svg' }
    ]
  },
  {
    id: 'stick-steel',
    name: 'Stick & Steel (G056)',
    base: 'https://stick-steel.genex.technology',
    destDir: path.join(__dirname, '..', 'public', 'games', 'stick-steel'),
    files: [
      { path: '/', dest: 'index.html' },
      { path: '/assets/index-YE5q2TCL.js', dest: 'assets/index-YE5q2TCL.js' },
      { path: '/assets/index-Cvg1kABe.css', dest: 'assets/index-Cvg1kABe.css' },
      { path: '/fonts/PatrickHand-Regular.ttf', dest: 'fonts/PatrickHand-Regular.ttf' },
      { path: '/favicon.svg', dest: 'favicon.svg' }
    ]
  },
  {
    id: 'doodle-district',
    name: 'Doodle District (G057)',
    base: 'https://doodleshooter.vercel.app',
    destDir: path.join(__dirname, '..', 'public', 'games', 'doodle-district'),
    files: [
      { path: '/', dest: 'index.html' },
      { path: '/style.A4A8BF44.css', dest: 'style.A4A8BF44.css' },
      { path: '/game.7LCERBLR.js', dest: 'game.7LCERBLR.js' }
    ]
  },
  {
    id: 'chai-visual',
    name: 'Chai Visual (G058)',
    base: 'https://dsa.chaicode.com',
    destDir: path.join(__dirname, '..', 'public', 'games', 'chai-visual'),
    files: [
      { path: '/', dest: 'index.html' },
      { path: '/chai-mascot-dark.png', dest: 'chai-mascot-dark.png' },
      { path: '/icon.png', dest: 'icon.png' }
    ]
  }
];

async function runScrapePlan() {
  console.log('=== Web Game Scraping Runner (G055–G058) ===\n');

  for (const t of targets) {
    console.log(`▶ Processing target: ${t.name} ...`);
    fs.mkdirSync(t.destDir, { recursive: true });

    for (const f of t.files) {
      const url = t.base + f.path;
      const targetPath = path.join(t.destDir, f.dest);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });

      try {
        await download(url, targetPath);
        console.log(`  ✓ Downloaded: ${f.dest}`);
      } catch (err) {
        console.warn(`  ⚠ Warning for ${url}: ${err.message}`);
      }
    }
    console.log(`✔ Finished initial extraction for ${t.name}\n`);
  }

  console.log('=== All 4 Games Scraped Successfully ===');
}

if (require.main === module) {
  runScrapePlan().catch(console.error);
}

module.exports = { runScrapePlan, targets };
