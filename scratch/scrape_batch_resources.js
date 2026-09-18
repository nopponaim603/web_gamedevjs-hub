/**
 * scratch/scrape_batch_resources.js
 * Scraper & Asset Ingestion preparation script for:
 * 1. AIGameShare Hub (Portal) - https://www.aigameshare.com/
 * 2. Warlock (G059) - https://warlock-zone.fly.dev/
 * 3. Louvre · Miniature World (G060) - https://3dscenes.qualityf2p.workers.dev/paris
 * 4. Original Transformer vs DeepSeek (G061) - https://transformer-architecture.petergostev.chatgpt.site/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} - Status: ${res.statusCode}`));
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
    }).on('error', (err) => {
      try { fs.unlinkSync(dest); } catch (_) {}
      reject(err);
    });
  });
}

const resources = [
  {
    id: 'aigameshare',
    name: 'AIGameShare Hub (Portal)',
    url: 'https://www.aigameshare.com/',
    type: 'portal',
    destDir: path.join(__dirname, '..', 'public', 'games', 'aigameshare-catalog')
  },
  {
    id: 'warlock-zone',
    name: 'Warlock: Lava Arena (G059)',
    url: 'https://warlock-zone.fly.dev/',
    type: 'game',
    destDir: path.join(__dirname, '..', 'public', 'games', 'warlock')
  },
  {
    id: 'louvre-miniature',
    name: 'Louvre · A world in miniature (G060)',
    url: 'https://3dscenes.qualityf2p.workers.dev/paris',
    type: '3d-experience',
    destDir: path.join(__dirname, '..', 'public', 'games', 'louvre-miniature')
  },
  {
    id: 'transformer-deepseek',
    name: 'Original Transformer vs DeepSeek (G061)',
    url: 'https://transformer-architecture.petergostev.chatgpt.site/',
    type: 'simulation',
    destDir: path.join(__dirname, '..', 'public', 'games', 'transformer-deepseek')
  }
];

async function inspectAndTestTargets() {
  console.log('=== Web Scraping Resources Inspection ===\n');
  for (const item of resources) {
    console.log(`Checking [${item.name}] at: ${item.url}`);
    try {
      await new Promise((res, rej) => {
        https.get(item.url, (response) => {
          console.log(`  -> Status: ${response.statusCode} | Content-Type: ${response.headers['content-type']}`);
          response.resume();
          res();
        }).on('error', (err) => {
          console.error(`  -> Connection failed: ${err.message}`);
          res();
        });
      });
    } catch (e) {
      console.error(`  -> Error: ${e.message}`);
    }
  }
  console.log('\nReady for batch asset scraping!');
}

if (require.main === module) {
  inspectAndTestTargets();
}

module.exports = {
  resources,
  downloadFile
};
