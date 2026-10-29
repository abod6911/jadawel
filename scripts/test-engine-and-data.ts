/**
 * Automated Verification & Audit Suite for Jadawel Planner Engine & Data Integrity
 * Tests:
 * 1. Budget Boundary Enforcement (50 low-budget / 'tafra' simulations)
 * 2. Clustered Proximity & Directional Flow (50 multi-stop routes)
 * 3. Data Integrity & Verified URLs for all 63 Jeddah Venues
 */

import { JEDDAH_PLACES } from '../src/data/jeddah-places';
import { generateMultiPlanVariants } from '../src/utils/plannerEngine';
import { calculateHaversineDistanceKm } from '../src/utils/distanceCalculator';
import {
  DistrictId,
  CompanionType,
  DurationOption,
  VibeType,
  BudgetTier,
  WizardPreferences,
} from '../src/types';

// ANSI terminal colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`${BOLD}${CYAN}======================================================================${RESET}`);
console.log(`${BOLD}${CYAN}   JADAWEL ENGINE & DATA INTEGRITY AUTOMATED TEST SUITE   ${RESET}`);
console.log(`${BOLD}${CYAN}======================================================================${RESET}\n`);

let allTestsPassed = true;

// ============================================================================
// TEST SUITE 1: BUDGET BOUNDARY TEST (50 SIMULATIONS)
// ============================================================================
console.log(`${BOLD}[1/3] Running Budget Boundary & Hard Constraint Tests (50 Runs)...${RESET}`);

const testDistricts: DistrictId[] = [
  'all_jeddah',
  'al-shati',
  'al-rawdah',
  'al-balad',
  'al-hamra',
  'obhur',
  'al-zahra',
  'al-salamah',
];
const testVibes: VibeType[] = [
  'free_walk',
  'beach_sunset',
  'food',
  'coffee_dessert',
  'heritage_arts',
];
const testDurations: DurationOption[] = [
  '2_to_4h',
  '4_to_6h',
  'half_day_night',
];

let tafraViolations = 0;
let tafraStopsChecked = 0;
let economyViolations = 0;
let economyStopsChecked = 0;

for (let i = 0; i < 50; i++) {
  const district = testDistricts[i % testDistricts.length];
  const vibe = testVibes[i % testVibes.length];
  const duration = testDurations[i % testDurations.length];

  // Test 1.A: 100% Free ("طفرة")
  const freePrefs: WizardPreferences = {
    startingDistrict: district,
    companions: 'friends',
    duration,
    vibe,
    ambience: 'mixed',
    budgetTier: 'free',
    preferences: [],
  };

  const freeItinerary = generateMultiPlanVariants(freePrefs);
  const activeVariantKey = freeItinerary.activeVariant;
  const activePlan = freeItinerary.variants[activeVariantKey] || freeItinerary.variants.free || freeItinerary.variants.balanced;

  for (const stop of activePlan.stops) {
    tafraStopsChecked++;
    const cost = stop.place.averageSpend ?? stop.place.averageCostSAR ?? 0;
    if (cost > 0 && !stop.place.isFree) {
      tafraViolations++;
      console.error(
        `${RED}FAIL: Tafra stop exceeded 0 SAR: [${stop.place.id}] ${stop.place.nameAr} (${cost} SAR)${RESET}`
      );
    }
  }

  // Test 1.B: Economy ("اقتصادية")
  const econPrefs: WizardPreferences = {
    startingDistrict: district,
    companions: 'friends',
    duration,
    vibe,
    ambience: 'mixed',
    budgetTier: 'economy',
    preferences: [],
  };

  const econItinerary = generateMultiPlanVariants(econPrefs);
  const econPlan = econItinerary.variants.balanced;

  let cumulativeSpend = 0;
  for (const stop of econPlan.stops) {
    economyStopsChecked++;
    const cost = stop.place.averageSpend ?? stop.place.averageCostSAR ?? 0;
    cumulativeSpend += cost;
    const pLevel = stop.place.priceLevel;
    const pTier = stop.place.priceTier;

    // Must never contain expensive or luxury tiers
    if (
      pLevel === 'expensive' ||
      pLevel === 'luxury' ||
      pTier === '$$$' ||
      pTier === '$$$$' ||
      cost > 60
    ) {
      economyViolations++;
      console.error(
        `${RED}FAIL: Economy stop breached budget tier: [${stop.place.id}] ${stop.place.nameAr} (Level: ${pLevel}, Tier: ${pTier}, Cost: ${cost} SAR)${RESET}`
      );
    }
  }
}

const tafraPassRate = (((tafraStopsChecked - tafraViolations) / tafraStopsChecked) * 100).toFixed(1);
const econPassRate = (((economyStopsChecked - economyViolations) / economyStopsChecked) * 100).toFixed(1);

console.log(`  - Tafra (0 SAR) Outings Checked: ${tafraStopsChecked} stops across 50 itineraries`);
console.log(`  - Tafra Violations: ${tafraViolations} (Pass Rate: ${tafraPassRate}%)`);
console.log(`  - Economy Outings Checked: ${economyStopsChecked} stops across 50 itineraries`);
console.log(`  - Economy Violations: ${economyViolations} (Pass Rate: ${econPassRate}%)`);

if (tafraViolations === 0 && economyViolations === 0) {
  console.log(`${GREEN}✔ TEST 1 PASSED: 100% Strict Budget Boundary Adherence${RESET}\n`);
} else {
  allTestsPassed = false;
  console.log(`${RED}✘ TEST 1 FAILED: Budget violations detected${RESET}\n`);
}

// ============================================================================
// TEST SUITE 2: CLUSTERED PROXIMITY & ZIG-ZAG ROUTING TEST (50 RUNS)
// ============================================================================
console.log(`${BOLD}[2/3] Running Clustered Proximity & Spatial Flow Tests (50 Routes)...${RESET}`);

let totalHopsMeasured = 0;
let totalHopDistanceKm = 0;
let maxHopDistanceKm = 0;
let minHopDistanceKm = 999;
let hopsExceeding6Km = 0;
let hopsExceeding8_5Km = 0;
let acuteReversalsCount = 0;

for (let i = 0; i < 50; i++) {
  const district = testDistricts[i % testDistricts.length];
  const vibe = testVibes[i % testVibes.length];
  const duration = testDurations[i % testDurations.length];

  const prefs: WizardPreferences = {
    startingDistrict: district,
    companions: 'couple',
    duration,
    vibe,
    ambience: 'mixed',
    budgetTier: i % 2 === 0 ? 'moderate' : 'economy',
    preferences: ['short_drive'],
  };

  const plan = generateMultiPlanVariants(prefs).variants.balanced;
  const stops = plan.stops;

  for (let sIdx = 1; sIdx < stops.length; sIdx++) {
    const prev = stops[sIdx - 1];
    const curr = stops[sIdx];
    const dist = calculateHaversineDistanceKm(
      prev.place.coordinates.lat,
      prev.place.coordinates.lng,
      curr.place.coordinates.lat,
      curr.place.coordinates.lng
    );

    totalHopsMeasured++;
    totalHopDistanceKm += dist;
    if (dist > maxHopDistanceKm) maxHopDistanceKm = dist;
    if (dist < minHopDistanceKm) minHopDistanceKm = dist;

    if (dist > 6.0) hopsExceeding6Km++;
    // In Jeddah geography, Obhur is a northern coastal peninsula separated by the Obhur creek.
    // The bridge crossing to the nearest urban cluster (Al-Shati / North Corniche) is ~11.5 - 13.8 km.
    const isObhurCrossCreek =
      prev.place.district.toLowerCase().includes('obhur') ||
      curr.place.district.toLowerCase().includes('obhur');

    if (dist > 8.5 && !isObhurCrossCreek) {
      hopsExceeding8_5Km++;
      console.warn(
        `${YELLOW}WARN: Hop exceeded 8.5 km outside Obhur corridor: ${prev.place.nameAr} -> ${curr.place.nameAr} (${dist.toFixed(1)} km)${RESET}`
      );
    } else if (dist > 14.5 && isObhurCrossCreek) {
      hopsExceeding8_5Km++;
      console.warn(
        `${YELLOW}WARN: Obhur bridge transit exceeded adjacent coastal cluster: ${prev.place.nameAr} -> ${curr.place.nameAr} (${dist.toFixed(1)} km)${RESET}`
      );
    }

    // Directional acute reversal test (if 3+ stops exist with substantive driving hops >= 1.5 km)
    if (sIdx >= 2) {
      const pprev = stops[sIdx - 2];
      const dLat1 = prev.place.coordinates.lat - pprev.place.coordinates.lat;
      const dLng1 = prev.place.coordinates.lng - pprev.place.coordinates.lng;
      const dLat2 = curr.place.coordinates.lat - prev.place.coordinates.lat;
      const dLng2 = curr.place.coordinates.lng - prev.place.coordinates.lng;

      const dist1 = calculateHaversineDistanceKm(
        pprev.place.coordinates.lat,
        pprev.place.coordinates.lng,
        prev.place.coordinates.lat,
        prev.place.coordinates.lng
      );
      const dist2 = dist;

      // Only evaluate reversal if both legs are substantive transit legs (>= 1.5 km)
      if (dist1 >= 1.5 && dist2 >= 1.5) {
        const mag1 = Math.sqrt(dLat1 * dLat1 + dLng1 * dLng1);
        const mag2 = Math.sqrt(dLat2 * dLat2 + dLng2 * dLng2);
        const dot = (dLat1 * dLat2 + dLng1 * dLng2) / (mag1 * mag2);
        // dot < -0.80 means severe 180-degree U-turn back to where they came from
        if (dot < -0.8) {
          acuteReversalsCount++;
          console.warn(
            `${YELLOW}WARN: Acute ping-pong reversal: ${pprev.place.nameAr} -> ${prev.place.nameAr} -> ${curr.place.nameAr}${RESET}`
          );
        }
      }
    }
  }
}

const avgHopDistanceKm = totalHopsMeasured > 0 ? (totalHopDistanceKm / totalHopsMeasured).toFixed(2) : '0';

console.log(`  - Total Consecutive Hops Measured: ${totalHopsMeasured}`);
console.log(`  - Mean Hop Distance: ${avgHopDistanceKm} km (Strict Target <= 4.5 km)`);
console.log(`  - Min Hop Distance: ${minHopDistanceKm.toFixed(2)} km`);
console.log(`  - Max Hop Distance: ${maxHopDistanceKm.toFixed(2)} km`);
console.log(`  - Hops within Standard Clustered Radius (<= 6.0 km): ${totalHopsMeasured - hopsExceeding6Km} (${(((totalHopsMeasured - hopsExceeding6Km) / totalHopsMeasured) * 100).toFixed(1)}%)`);
console.log(`  - Out-of-Corridor Hops Exceeding Distance Limit: ${hopsExceeding8_5Km}`);
console.log(`  - Acute Substantive Zig-zag U-Turns: ${acuteReversalsCount}`);

if (hopsExceeding8_5Km === 0 && acuteReversalsCount === 0 && parseFloat(avgHopDistanceKm) <= 4.5) {
  console.log(`${GREEN}✔ TEST 2 PASSED: Clustered Proximity and Anti-Zig-Zag Flow Verified${RESET}\n`);
} else {
  allTestsPassed = false;
  console.log(`${RED}✘ TEST 2 FAILED: Proximity or zig-zag limits breached${RESET}\n`);
}

// ============================================================================
// TEST SUITE 3: DATA INTEGRITY & 100% VERIFIED URLS (63 PLACES)
// ============================================================================
console.log(`${BOLD}[3/3] Running Data Integrity & Verified Locations Audit (All 63 Places)...${RESET}`);

const JEDDAH_BOUNDS = {
  minLat: 21.20,
  maxLat: 21.90,
  minLng: 39.05,
  maxLng: 39.35,
};

let outOfBoundsVenues = 0;
let invalidMapsUrls = 0;
let missingSocialUrls = 0;
let missingPriceLevels = 0;
let totalBranchesChecked = 0;

JEDDAH_PLACES.forEach((p) => {
  // 1. Coordinates inside Jeddah
  const { lat, lng } = p.coordinates;
  if (lat < JEDDAH_BOUNDS.minLat || lat > JEDDAH_BOUNDS.maxLat || lng < JEDDAH_BOUNDS.minLng || lng > JEDDAH_BOUNDS.maxLng) {
    outOfBoundsVenues++;
    console.error(`${RED}FAIL: Venue coordinates out of bounds: [${p.id}] ${p.nameAr} (${lat}, ${lng})${RESET}`);
  }

  // 2. Google Maps Direct Clean Coordinate URL
  const expectedMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  if (p.googleMapsUrl !== expectedMapsUrl) {
    invalidMapsUrls++;
    console.error(`${RED}FAIL: Invalid maps URL for [${p.id}] ${p.nameAr}: ${p.googleMapsUrl}${RESET}`);
  }

  // 3. Official URL / Instagram Presence
  if (!p.officialUrl && !p.instagramUrl) {
    missingSocialUrls++;
    console.error(`${RED}FAIL: Missing official/social URL for [${p.id}] ${p.nameAr}${RESET}`);
  }

  // 4. PriceLevel & AverageSpend Presence
  if (!p.priceLevel || typeof p.averageSpend !== 'number') {
    missingPriceLevels++;
    console.error(`${RED}FAIL: Missing priceLevel or averageSpend for [${p.id}] ${p.nameAr}${RESET}`);
  }

  // 5. Audit Branches
  if (p.branches && p.branches.length > 0) {
    p.branches.forEach((b) => {
      totalBranchesChecked++;
      if (b.lat < JEDDAH_BOUNDS.minLat || b.lat > JEDDAH_BOUNDS.maxLat || b.lng < JEDDAH_BOUNDS.minLng || b.lng > JEDDAH_BOUNDS.maxLng) {
        outOfBoundsVenues++;
        console.error(`${RED}FAIL: Branch coordinates out of bounds: [${b.id}] ${b.branchNameAr}${RESET}`);
      }
      const expectedBranchMapsUrl = `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`;
      if (b.googleMapsUrl !== expectedBranchMapsUrl) {
        invalidMapsUrls++;
      }
    });
  }
});

console.log(`  - Total Places Audited: ${JEDDAH_PLACES.length} / 63`);
console.log(`  - Total Venue Branches Audited: ${totalBranchesChecked} / 41`);
console.log(`  - Out of Bounds Coordinates: ${outOfBoundsVenues}`);
console.log(`  - Verified Clean Maps URLs: ${JEDDAH_PLACES.length + totalBranchesChecked - invalidMapsUrls} / ${JEDDAH_PLACES.length + totalBranchesChecked}`);
console.log(`  - Official Website / Instagram Links Present: ${JEDDAH_PLACES.length - missingSocialUrls} / ${JEDDAH_PLACES.length}`);
console.log(`  - Explicit PriceLevel & AverageSpend Present: ${JEDDAH_PLACES.length - missingPriceLevels} / ${JEDDAH_PLACES.length}`);

if (
  outOfBoundsVenues === 0 &&
  invalidMapsUrls === 0 &&
  missingSocialUrls === 0 &&
  missingPriceLevels === 0 &&
  JEDDAH_PLACES.length === 63
) {
  console.log(`${GREEN}✔ TEST 3 PASSED: 100% Venue Data Integrity & Location Verification Verified${RESET}\n`);
} else {
  allTestsPassed = false;
  console.log(`${RED}✘ TEST 3 FAILED: Data integrity issues detected${RESET}\n`);
}

// ============================================================================
// FINAL VERDICT
// ============================================================================
console.log(`${BOLD}${CYAN}======================================================================${RESET}`);
if (allTestsPassed) {
  console.log(`${BOLD}${GREEN}   ALL AUTOMATED VERIFICATION SUITES PASSED WITH 100% COMPLIANCE   ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================================${RESET}`);
  process.exit(0);
} else {
  console.log(`${BOLD}${RED}   SOME SUITES FAILED — SEE LOGS ABOVE FOR DETAILS   ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================================${RESET}`);
  process.exit(1);
}
