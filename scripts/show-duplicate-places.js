const fs = require('fs');
let src = fs.readFileSync('src/data/jeddah-places.ts', 'utf8');

const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?nameAr:\s*['"]([^'"]+)['"][\s\S]*?imageUrl:\s*['"]([^'"]+)['"]/g;
const places = [];
let match;
while ((match = regex.exec(src)) !== null) {
  places.push({ id: match[1], nameAr: match[2], imageUrl: match[3] });
}

const map = {};
places.forEach(p => {
  if (!map[p.imageUrl]) map[p.imageUrl] = [];
  map[p.imageUrl].push(`${p.id}: ${p.nameAr}`);
});

for (const [img, plist] of Object.entries(map)) {
  if (plist.length > 1) {
    console.log(`\nImage: ${img}`);
    plist.forEach(p => console.log('  -', p));
  }
}
