const fs = require('fs');
let src = fs.readFileSync('src/data/jeddah-places.ts', 'utf8');
const urls = [...src.matchAll(/imageUrl:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const remotes = urls.filter(u => u.startsWith('http'));

console.log('Testing', remotes.length, 'remote URLs...');

async function testAll() {
  let failed = 0;
  for (let i = 0; i < remotes.length; i++) {
    const url = remotes[i];
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        console.log(`[FAIL ${res.status}]:`, url);
        failed++;
      }
    } catch (e) {
      console.log('[ERROR]:', url, e.message);
      failed++;
    }
  }
  console.log(`Finished: ${remotes.length - failed} OK, ${failed} failed.`);
}

testAll();
