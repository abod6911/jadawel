const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const outDir = path.join(__dirname, '..', 'out');

console.log('--- 1. AUDITING PUBLIC/IMAGES DIRECTORY ---');
function listFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(listFiles(filePath));
    } else {
      results.push({
        relativePath: filePath.replace(publicDir, '').replace(/\\/g, '/'),
        sizeKB: (stat.size / 1024).toFixed(1)
      });
    }
  });
  return results;
}

const allPublicImages = listFiles(path.join(publicDir, 'images'));
console.log(`Found ${allPublicImages.length} images in public/images:`);
allPublicImages.forEach(img => console.log(`  ✓ ${img.relativePath} (${img.sizeKB} KB)`));

console.log('\n--- 2. AUDITING DATA REFERENCES ---');
const placesFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'jeddah-places.ts'), 'utf8');
const curatedFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'curated-plans.ts'), 'utf8');

const imageRegex = /\/images\/[a-zA-Z0-9_\-\/]+\.(jpg|png|webp|svg)/g;
const allReferenced = new Set([
  ...(placesFile.match(imageRegex) || []),
  ...(curatedFile.match(imageRegex) || [])
]);

console.log(`Checking ${allReferenced.size} unique data image references:`);
let missingCount = 0;
allReferenced.forEach(ref => {
  const localFile = path.join(publicDir, ref);
  if (fs.existsSync(localFile)) {
    console.log(`  ✓ OK: ${ref}`);
  } else {
    console.error(`  ✗ MISSING: ${ref}`);
    missingCount++;
  }
});

console.log(`\n--- SUMMARY: ${allPublicImages.length} Total Local Images, ${missingCount} Missing ---`);
