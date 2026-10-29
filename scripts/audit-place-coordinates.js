const fs = require('fs');
const vm = require('vm');

let src = fs.readFileSync('src/data/jeddah-places.ts', 'utf8')
  .replace(/^import\s+.*?;/gm, '')
  .replace(/export\s+const\s+JEDDAH_PLACES:\s*Place\[\]\s*=/, 'const JEDDAH_PLACES =');
const s = {};
vm.createContext(s);
vm.runInContext(src + '; places = JEDDAH_PLACES;', s);

function classifyDistrict(lat, lng) {
  if (lat >= 21.70) return 'Obhur Al-Shamaliyah';
  if (lat <= 21.50) return 'Al-Balad';
  if (lat >= 21.505 && lat <= 21.535 && lng <= 39.175) return 'Al-Hamra';
  if (lng <= 39.125) {
    if (lat >= 21.56) return 'Al-Shati';
    return 'Al-Hamra';
  }
  if (lat >= 21.535 && lat <= 21.560 && lng >= 39.135 && lng <= 39.170) return 'Al-Andalus';
  if (lat >= 21.550 && lat <= 21.578 && lng >= 39.135 && lng <= 39.175) return 'Al-Rawdah';
  if (lat >= 21.570 && lat <= 21.610 && lng >= 39.120 && lng <= 39.148) return 'Al-Zahra';
  if (lat >= 21.570 && lat <= 21.625 && lng >= 39.140 && lng <= 39.175) return 'Al-Salamah';
  return 'Other/Border';
}

console.log('ID | NameAr | Declared District | Coordinates | Branches');
console.log('------------------------------------------------------------');

const mismatches = [];

s.places.forEach((p, i) => {
  const est = classifyDistrict(p.coordinates.lat, p.coordinates.lng);
  const declared = p.district;
  const isMatch = (
    declared === est ||
    (declared === 'Jeddah Waterfront' && est === 'Al-Shati') ||
    (declared === 'Al-Shati' && est === 'Jeddah Waterfront')
  );

  console.log(`${i+1}. [${p.id}] ${p.nameAr} | Declared: ${declared} | Est: ${est} | (${p.coordinates.lat}, ${p.coordinates.lng})`);

  if (!isMatch) {
    mismatches.push({
      id: p.id,
      nameAr: p.nameAr,
      declared,
      estimated: est,
      coordinates: p.coordinates,
      districtNameAr: p.districtNameAr,
    });
  }

  if (p.branches && p.branches.length > 0) {
    p.branches.forEach((b) => {
      const bEst = classifyDistrict(b.lat, b.lng);
      console.log(`   -> Branch [${b.id}] ${b.branchNameAr} | Declared: ${b.districtAr} (${b.districtEn}) | Est: ${bEst} | (${b.lat}, ${b.lng})`);
    });
  }
});

console.log('\n============================================================');
console.log(`AUDIT SUMMARY: ${s.places.length} places audited.`);
console.log(`Potential District Mismatches or Border Points: ${mismatches.length}`);
console.log(JSON.stringify(mismatches, null, 2));
