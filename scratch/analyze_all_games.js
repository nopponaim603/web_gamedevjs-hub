const fs = require('fs');
const path = require('path');

const publicGamesDir = path.join(__dirname, '..', 'public', 'games');
const docGamesDir = path.join(__dirname, '..', 'docs', 'gdd', 'games');
const pageJsPath = path.join(__dirname, '..', 'src', 'app', 'page.js');
const indexMdPath = path.join(__dirname, '..', 'docs', 'index.md');

// 1. List all public game folders
const pubFolders = fs.readdirSync(publicGamesDir).filter(f => fs.statSync(path.join(publicGamesDir, f)).isDirectory());

// 2. Read existing GDD game folders
const docFolders = fs.existsSync(docGamesDir) 
  ? fs.readdirSync(docGamesDir).filter(f => fs.statSync(path.join(docGamesDir, f)).isDirectory())
  : [];

// 3. Read initialGames from page.js
const pageJs = fs.readFileSync(pageJsPath, 'utf8');
const gameEntries = [];
const gameBlockRegex = /\{[\s\r\n]*id:\s*["']([^"']+)["'],[\s\S]*?title:\s*["']([^"']+)["'],[\s\S]*?category:\s*["']([^"']+)["'],[\s\S]*?url:\s*["']([^"']+)["']/g;
let m;
while ((m = gameBlockRegex.exec(pageJs)) !== null) {
  gameEntries.push({
    id: m[1],
    title: m[2],
    category: m[3],
    url: m[4]
  });
}

console.log('Public game folders total:', pubFolders.length);
console.log('Registered in page.js total:', gameEntries.length);
console.log('Existing doc folders total:', docFolders.length);

console.log('\n--- Registered in page.js ---');
gameEntries.forEach((g, i) => {
  console.log(`${i+1}. [${g.id}] "${g.title}" -> ${g.url} (${g.category})`);
});

// Check if any public games are not in page.js
const registeredUrls = new Set(gameEntries.map(g => g.url));
const unregistered = pubFolders.filter(f => !registeredUrls.has(`/games/${f}/index.html`));
console.log('\nUnregistered public folders:', unregistered);
