const fs = require('fs');
let src = fs.readFileSync('src/data/jeddah-places.ts', 'utf8');
const urls = [...src.matchAll(/imageUrl:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const counts = {};
urls.forEach(u => counts[u] = (counts[u] || 0) + 1);
const dupes = Object.entries(counts).filter(([u, c]) => c > 1);

console.log('Total places:', urls.length);
console.log('Unique images:', Object.keys(counts).length);
console.log('Duplicate images count:', dupes.length);
dupes.forEach(([u, c]) => console.log(`Used ${c} times: ${u}`));
