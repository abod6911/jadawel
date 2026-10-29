const fs = require('fs');
const vm = require('vm');

let src = fs.readFileSync('src/data/jeddah-places.ts', 'utf8')
  .replace(/^import\s+.*?;/gm, '')
  .replace(/export\s+const\s+JEDDAH_PLACES:\s*Place\[\]\s*=/, 'const JEDDAH_PLACES =');
const s = {};
vm.createContext(s);
vm.runInContext(src + '; places = JEDDAH_PLACES;', s);

const places = s.places;

console.log(`Total Venues in Dataset: ${places.length}`);

let totalBranches = 0;
places.forEach(p => {
  if (p.branches) totalBranches += p.branches.length;
});
console.log(`Total Branches in Dataset: ${totalBranches}`);

const issues = [];
const verifiedPlaces = [];

places.forEach((p, idx) => {
  const { lat, lng } = p.coordinates;
  const isJeddahBounds = lat >= 21.35 && lat <= 21.85 && lng >= 39.05 && lng <= 39.30;
  
  // Check Google Maps URL format
  const expectedGmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const isGmapsMatching = p.googleMapsUrl === expectedGmapsUrl;

  // Check District consistency
  let districtNotice = null;

  // Known specific check rules
  if (p.id === 'plc-20' && p.district === 'Al-Andalus') {
    districtNotice = 'Primary coordinates (21.6163, 39.1025) are in Al-Shati / Hira St behind Hilton, but district was declared as Al-Andalus.';
  } else if (p.id === 'trend-05' && p.district === 'Al-Rawdah') {
    districtNotice = 'Coordinates (21.6406, 39.1409) are in Al-Mohammadiyyah/Al-Naeem on Amna Bint Wahb St (~9km north of Al-Rawdah).';
  } else if (p.id === 'trend-03' && (lat > 21.56 || lng > 21.56)) {
    // Check if KUURU is at Leylaty
    if (lat !== 21.5515 || lng !== 39.1338) {
      districtNotice = `KUURU coordinates (${lat}, ${lng}) should be exact Leylaty Complex pin (21.5515, 39.1338).`;
    }
  } else if (p.id === 'plc-26') {
    if (lat !== 21.5540 || lng !== 39.1560) {
      districtNotice = `Manko coordinates (${lat}, ${lng}) should be exact Jeddah Walk pin (21.5540, 39.1560).`;
    }
  } else if (p.id === 'plc-11' && p.districtNameAr.includes('الأمير سلطان')) {
    districtNotice = 'San Carlo Cicchetti is in Basateen Mall on Tahlia St (Prince Mohammed Bin Abdulaziz), text says Prince Sultan.';
  }

  // Branch checks
  const branchIssues = [];
  if (p.branches) {
    p.branches.forEach(b => {
      const bExpected = `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`;
      if (b.googleMapsUrl !== bExpected) {
        branchIssues.push(`Branch ${b.id} maps URL mismatch: ${b.googleMapsUrl} vs ${bExpected}`);
      }
      const bInJeddah = b.lat >= 21.35 && b.lat <= 21.85 && b.lng >= 39.05 && b.lng <= 39.30;
      if (!bInJeddah) {
        branchIssues.push(`Branch ${b.id} coordinates (${b.lat}, ${b.lng}) outside Jeddah!`);
      }
    });
  }

  if (!isJeddahBounds || !isGmapsMatching || districtNotice || branchIssues.length > 0) {
    issues.push({
      id: p.id,
      nameAr: p.nameAr,
      lat,
      lng,
      district: p.district,
      districtNotice,
      isGmapsMatching,
      branchIssues
    });
  } else {
    verifiedPlaces.push({
      id: p.id,
      nameAr: p.nameAr,
      district: p.district,
      lat,
      lng
    });
  }
});

console.log('\n============================================================');
console.log(`VERIFICATION SUMMARY:`);
console.log(`Fully Verified & Accurate: ${verifiedPlaces.length} / ${places.length}`);
console.log(`Items with Notices / Requiring Alignment: ${issues.length}`);
console.log(JSON.stringify(issues, null, 2));
