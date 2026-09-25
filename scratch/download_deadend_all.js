const fs = require('fs');
const path = require('path');

const BASE = 'https://dead-end.replit.app';
const TARGET_DIR = path.join(process.cwd(), 'public', 'games', 'dead-end');

const files = [
  'assets/index-DuL6qU6q.js',
  'assets/index-B-NhBloe.css',
  'assets/main-BKsdJ4EB.js',
  'assets/main-DjO_PKlm.css',
  'assets/index-BCBtl_Vj.js',
  'assets/RoomEnvironment-DHky3ePn.js',
  'assets/OutputPass-BAJepxDW.js',
  'assets/index-B0IfRqyQ.css',
  'assets/oakridge3d-COOIFlYC.js',
  'assets/oakridge-copy-C_03Y4J5.js',
  'assets/oakridge3d-sajp-CcR.css'
];

async function run() {
  for (const f of files) {
    const url = `${BASE}/${f}`;
    const dest = path.join(TARGET_DIR, f);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      console.log('Fetching', url);
      const res = await fetch(url);
      if (res.ok) {
        let content = await res.text();
        // If it is index-DuL6qU6q.js, patch P=function(t){return"/"+t} to P=function(t){return"./"+t}
        if (f.endsWith('index-DuL6qU6q.js')) {
          content = content.replace('P=function(t){return"/"+t}', 'P=function(t){return"./"+t}');
        }
        fs.writeFileSync(dest, content, 'utf-8');
        console.log('  Saved:', dest);
      } else {
        console.warn('  Failed:', res.status);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  // Also patch index.html to make script/link relative
  const indexPath = path.join(TARGET_DIR, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf-8');
  html = html.replace('src="/assets/index-DuL6qU6q.js"', 'src="./assets/index-DuL6qU6q.js"');
  html = html.replace('href="/assets/index-B-NhBloe.css"', 'href="./assets/index-B-NhBloe.css"');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log('Patched index.html');
}

run();
