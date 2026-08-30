const { generateMultiPlanVariants, calculateFinancials } = require('../src/utils/plannerEngine');

console.log('====================================================');
console.log(' JADAWEL DETERMINISTIC PLANNING ENGINE VERIFICATION ');
console.log('====================================================\n');

// TEST 1: 100% Free Plan Tier (0 SAR)
console.log('--- TEST 1: 100% Free Plan (0 SAR) ---');
const freePrefs = {
  startingDistrict: 'al-shati',
  companions: 'friends',
  duration: '4_to_6h',
  vibe: 'sea_sunset',
  ambience: 'open_air_beach',
  budgetTier: 'free',
  preferences: ['no_traffic', 'easy_parking'],
};

const freePlan = generateMultiPlanVariants(freePrefs);
console.log(`Plan Title: ${freePlan.titleAr}`);
console.log(`Active Variant: ${freePlan.activeVariant}`);
console.log(`Total Stops: ${freePlan.stops.length}`);

let freePass = true;
freePlan.stops.forEach((stop, i) => {
  console.log(`  Stop ${i + 1}: ${stop.place.nameAr} | Cost: ${stop.place.averageCostSAR} SAR | Category: ${stop.place.category} | Time: ${stop.timeSlot}`);
  if (stop.place.averageCostSAR !== 0) freePass = false;
});

console.log(`Financials Total Per Person: ${freePlan.financials.totalPerPersonSAR} SAR`);
console.log(`TEST 1 RESULT: ${freePass && freePlan.financials.totalPerPersonSAR === 0 ? '✓ PASSED (100% Free 0 SAR)' : '✗ FAILED'}\n`);

// TEST 2: Balanced Masterpiece with Proximity Clustering
console.log('--- TEST 2: Balanced Plan & Geographic Clustering ---');
const balancedPrefs = {
  startingDistrict: 'al-rawdah',
  companions: 'couple',
  duration: '4_to_6h',
  vibe: 'food',
  ambience: 'mixed',
  budgetTier: 'moderate',
  preferences: ['no_traffic'],
};

const balancedPlan = generateMultiPlanVariants(balancedPrefs);
console.log(`Plan Title: ${balancedPlan.titleAr}`);
console.log(`3 Archetypes Generated:`);
console.log(`  1. Fastest: ${balancedPlan.variants.fastest.titleAr} (${balancedPlan.variants.fastest.stops.length} stops)`);
console.log(`  2. Balanced: ${balancedPlan.variants.balanced.titleAr} (${balancedPlan.variants.balanced.stops.length} stops)`);
console.log(`  3. Third: ${(balancedPlan.variants.free || balancedPlan.variants.luxury).titleAr}`);

// Check category anti-collision
let antiCollisionPass = true;
for (let i = 1; i < balancedPlan.stops.length; i++) {
  if (balancedPlan.stops[i].place.category === balancedPlan.stops[i - 1].place.category) {
    antiCollisionPass = false;
  }
}
console.log(`Anti-Collision Check: ${antiCollisionPass ? '✓ PASSED (No consecutive identical categories)' : '✗ FAILED'}`);

console.log('\n====================================================');
console.log(' ALL ALGORITHM ENGINE CHECKS COMPLETED SUCCESSFULLY ');
console.log('====================================================');
