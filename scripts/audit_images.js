const fs = require('fs');
let src = fs.readFileSync('src/data/jeddah-places.ts', 'utf8');
const urls = [...src.matchAll(/imageUrl:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total places:', urls.length);
const locals = urls.filter(u => u.startsWith('/'));
console.log('Local images:', locals.length);
const remotes = urls.filter(u => u.startsWith('http'));
console.log('Remote images:', remotes.length);

const missingLocals = [];
locals.forEach(l => {
  const p = 'public' + l;
  if (!fs.existsSync(p)) {
    missingLocals.push(l);
  }
});
console.log('Missing local images count:', missingLocals.length);
if (missingLocals.length > 0) {
  console.log('Sample missing:', missingLocals.slice(0, 10));
}
