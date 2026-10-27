const fs = require('fs');
const path = require('path');
const vm = require('vm');

let src = fs.readFileSync(path.resolve('src/data/jeddah-places.ts'), 'utf8');
src = src.replace(/^import\s+.*?;/gm, '');
src = src.replace(/export\s+const\s+JEDDAH_PLACES:\s*Place\[\]\s*=/, 'const JEDDAH_PLACES =');
src = src.replace(/export\s+const\s+JEDDAH_PLACES_SEED.*$/s, '');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(src + '; places = JEDDAH_PLACES;', sandbox);

const places = sandbox.places;
console.log(`Loaded ${places.length} places.`);

const bounds = {
  minLat: 21.20,
  maxLat: 21.90,
  minLng: 39.05,
  maxLng: 39.35,
};

let outOfBoundsCount = 0;
let totalBranchesChecked = 0;

places.forEach((p) => {
  const { lat, lng } = p.coordinates;
  if (lat < bounds.minLat || lat > bounds.maxLat || lng < bounds.minLng || lng > bounds.maxLng) {
    console.error(`Place out of bounds: [${p.id}] ${p.nameAr} -> lat: ${lat}, lng: ${lng}`);
    outOfBoundsCount++;
  }

  if (p.branches && p.branches.length > 0) {
    p.branches.forEach((b) => {
      totalBranchesChecked++;
      if (b.lat < bounds.minLat || b.lat > bounds.maxLat || b.lng < bounds.minLng || b.lng > bounds.maxLng) {
        console.error(`Branch out of bounds: [${p.id}] branch [${b.id}] ${b.branchNameAr} -> lat: ${b.lat}, lng: ${b.lng}`);
        outOfBoundsCount++;
      }
    });
  }
});

console.log(`Boundary Audit Complete!`);
console.log(`Total Venues: ${places.length}`);
console.log(`Total Branches Checked: ${totalBranchesChecked}`);
console.log(`Out of Bounds Count: ${outOfBoundsCount}`);
