import {
  Itinerary,
  ItineraryStop,
  Place,
  WizardPreferences,
  FinancialBreakdown,
  PlanVariant,
  PlanVariantKey,
  DistrictId,
  PlaceCategory,
  DurationOption,
  VibeType,
} from '@/types';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import {
  calculateHaversineDistanceKm,
  estimateDrivingMinutes,
  estimateUberCostSAR,
} from './distanceCalculator';

// ============================================================================
// 1. Geographic & District Mapping Utilities
// ============================================================================

export const NEIGHBORING_DISTRICTS: Record<DistrictId, DistrictId[]> = {
  'al-shati': ['al-zahra', 'al-rawdah', 'al-hamra', 'obhur'],
  'al-zahra': ['al-shati', 'al-rawdah', 'al-salamah'],
  'al-rawdah': ['al-zahra', 'al-salamah', 'al-andalus', 'al-shati'],
  'al-salamah': ['al-rawdah', 'al-zahra', 'al-shati'],
  'al-andalus': ['al-rawdah', 'al-hamra', 'al-balad'],
  'al-hamra': ['al-andalus', 'al-shati', 'al-balad'],
  'al-balad': ['al-hamra', 'al-andalus'],
  'obhur': ['al-shati', 'al-zahra'],
  'all_jeddah': [],
};

/**
 * Normalizes any string representation of a Jeddah district into a standard DistrictId
 */
export function normalizeDistrictId(raw?: string): DistrictId | 'all_jeddah' {
  if (!raw) return 'all_jeddah';
  const lower = raw.toLowerCase().trim();
  if (
    lower === 'all' ||
    lower === 'all_jeddah' ||
    lower === 'all-jeddah' ||
    lower === 'current_location'
  ) {
    return 'all_jeddah';
  }
  if (lower.includes('balad')) return 'al-balad';
  if (lower.includes('shati') || lower.includes('waterfront') || lower.includes('corniche'))
    return 'al-shati';
  if (lower.includes('rawdah') || lower.includes('rawdha')) return 'al-rawdah';
  if (lower.includes('zahra')) return 'al-zahra';
  if (lower.includes('obhur') || lower.includes('abhor')) return 'obhur';
  if (lower.includes('hamra')) return 'al-hamra';
  if (lower.includes('salamah') || lower.includes('naeem')) return 'al-salamah';
  if (lower.includes('andalus')) return 'al-andalus';
  return 'all_jeddah';
}

/**
 * Determines whether a place matches a given filter district with fuzzy alias mapping
 */
export function doesPlaceMatchDistrict(
  placeDistrict: string,
  filterDistrict: DistrictId | 'all' | 'all_jeddah'
): boolean {
  if (filterDistrict === 'all' || filterDistrict === 'all_jeddah') return true;
  const pNorm = normalizeDistrictId(placeDistrict);
  const fNorm = normalizeDistrictId(filterDistrict);
  return pNorm === fNorm;
}

/**
 * Robust category matching that unifies frontend filter IDs with dataset place categories
 */
export function doesPlaceMatchCategory(
  placeCategory: string,
  filterCategory: PlaceCategory | 'all'
): boolean {
  if (filterCategory === 'all') return true;
  if (placeCategory === filterCategory) return true;

  if (filterCategory === 'culinary') {
    return placeCategory === 'restaurant' || placeCategory === 'cafe' || placeCategory === 'culinary';
  }
  if (filterCategory === 'heritage') {
    return placeCategory === 'heritage' || placeCategory === 'cultural';
  }
  if (filterCategory === 'waterfront') {
    return placeCategory === 'waterfront' || placeCategory === 'beach';
  }
  if (filterCategory === 'beach_resorts' || filterCategory === 'beach') {
    return placeCategory === 'beach' || placeCategory === 'beach_resorts';
  }
  if (filterCategory === 'arts_entertainment') {
    return (
      placeCategory === 'arts_entertainment' ||
      placeCategory === 'cultural' ||
      placeCategory === 'activity' ||
      placeCategory === 'entertainment'
    );
  }
  if (filterCategory === 'nature_parks') {
    return (
      placeCategory === 'nature_parks' ||
      placeCategory === 'entertainment' ||
      placeCategory === 'activity'
    );
  }
  return false;
}

/**
 * Retrieves human-readable Arabic district label for headers
 */
export function getDistrictLabel(districtId: string): string {
  const norm = normalizeDistrictId(districtId);
  if (norm === 'all_jeddah') return 'عروس البحر الأحمر';
  const found = JEDDAH_DISTRICTS.find((d) => d.id === norm);
  return found ? found.nameAr : 'جدة';
}

// ============================================================================
// 2. Time Mathematics & Sequential Chaining Utilities
// ============================================================================

export function timeStringToMinutes(timeStr: string): number {
  const [hours, mins] = timeStr.split(':').map((v) => parseInt(v, 10));
  return (hours || 0) * 60 + (mins || 0);
}

export function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function formatTimeSlotLabel(
  startMinutes: number,
  endMinutes: number,
  lang: 'ar' | 'en' = 'ar'
): string {
  const format12h = (m: number, isArabic: boolean): string => {
    const norm = ((Math.floor(m) % 1440) + 1440) % 1440;
    let h = Math.floor(norm / 60);
    const min = norm % 60;
    const isPM = h >= 12;
    h = h % 12;
    if (h === 0) h = 12;
    const minStr = min > 0 ? `:${min.toString().padStart(2, '0')}` : ':00';

    if (isArabic) {
      const suffix = isPM ? 'م' : 'ص';
      return `${h}${minStr} ${suffix}`;
    } else {
      const suffix = isPM ? 'PM' : 'AM';
      return `${h.toString().padStart(2, '0')}${minStr} ${suffix}`;
    }
  };

  const sLabel = format12h(startMinutes, lang === 'ar');
  const eLabel = format12h(endMinutes, lang === 'ar');
  return `${sLabel} - ${eLabel}`;
}

export function getWeatherNoticeForTime(minutesFromMidnight: number): {
  type: 'golden_hour' | 'indoor_midday' | 'sea_breeze' | 'night_atmosphere';
  textAr: string;
  textEn: string;
} {
  const norm = ((minutesFromMidnight % 1440) + 1440) % 1440;

  if (norm >= 360 && norm < 690) {
    // 6:00 AM - 11:30 AM
    return {
      type: 'sea_breeze',
      textAr: '☀️ نسائم الصباح: توقيت هادئ ونشاط منتعش قبل حرارة الظهيرة.',
      textEn: '☀️ Morning Breeze: Serene atmosphere and fresh start before midday.',
    };
  } else if (norm >= 690 && norm < 990) {
    // 11:30 AM - 4:30 PM
    return {
      type: 'indoor_midday',
      textAr: '❄️ استراحة الظهيرة: أجواء مكيفة ومريحة لتناول القهوة وتجنب الشمس.',
      textEn: '❄️ Midday Chill: AC indoor comfort and premium coffee lounge.',
    };
  } else if (norm >= 990 && norm <= 1125) {
    // 4:30 PM - 6:45 PM (Golden Hour)
    return {
      type: 'golden_hour',
      textAr: '🌅 ساعة الغروب الذهبية: أفضل توقيت لنسيم البحر والتقاط الصور التذكارية.',
      textEn: '🌅 Golden Hour: Ideal coastal breeze and Red Sea sunset photography.',
    };
  } else {
    // 6:45 PM onwards
    return {
      type: 'night_atmosphere',
      textAr: '🌙 أجواء السهرة: نسمة ليلية عليلة وجلسات خارجية مضيئة ومفعمة بالحياة.',
      textEn: '🌙 Evening Vibe: Ambient night breeze and illuminated outdoor dining.',
    };
  }
}

// ============================================================================
// 3. Dynamic Stop Role & Sequence Definitions
// ============================================================================

export type StopSlotRole =
  | 'brunch_morning'
  | 'afternoon_culture'
  | 'sunset_activity'
  | 'coffee_snack'
  | 'dinner_experience'
  | 'late_night_chill';

export interface DynamicSlotTemplate {
  role: StopSlotRole;
  defaultDwellMinutes: number;
  labelAr: string;
  labelEn: string;
}

/**
 * Builds dynamically sequenced slots based on the user's chosen duration
 */
export function buildDynamicSlotSequence(
  duration: DurationOption = '4_to_6h',
  vibe?: VibeType
): { initialStartMinutes: number; slots: DynamicSlotTemplate[] } {
  // Morning bias if user specifically chose coffee/dessert with calm
  const isMorningPreferred = vibe === 'coffee_dessert' && Math.random() < 0.2;
  const initialStartMinutes = isMorningPreferred
    ? 570 // 9:30 AM
    : 1005; // 4:45 PM (Classic Jeddah Golden Hour start)

  switch (duration) {
    case 'under_2h':
      return {
        initialStartMinutes: 1020, // 5:00 PM
        slots: [
          {
            role: 'sunset_activity',
            defaultDwellMinutes: 50,
            labelAr: 'نشاط الغروب أو المشي',
            labelEn: 'Sunset Walk & Sight',
          },
          {
            role: 'coffee_snack',
            defaultDwellMinutes: 50,
            labelAr: 'قهوة مختصة وحلى',
            labelEn: 'Specialty Coffee & Sweet',
          },
        ],
      };

    case '2_to_4h':
      return {
        initialStartMinutes: 1005, // 4:45 PM
        slots: [
          {
            role: 'sunset_activity',
            defaultDwellMinutes: 70,
            labelAr: 'روقان وقت الغروب',
            labelEn: 'Sunset & Sea Breeze',
          },
          {
            role: 'coffee_snack',
            defaultDwellMinutes: 60,
            labelAr: 'استراحة القهوة المختصة',
            labelEn: 'Artisan Coffee Break',
          },
          {
            role: 'dinner_experience',
            defaultDwellMinutes: 80,
            labelAr: 'عشاء وتجربة استثنائية',
            labelEn: 'Signature Dinner',
          },
        ],
      };

    case '4_to_6h':
      return {
        initialStartMinutes: 990, // 4:30 PM
        slots: [
          {
            role: 'sunset_activity',
            defaultDwellMinutes: 75,
            labelAr: 'الممشى والإطلالة البحرية',
            labelEn: 'Promenade & Sunset Vista',
          },
          {
            role: 'coffee_snack',
            defaultDwellMinutes: 65,
            labelAr: 'قهوة الروقان الحجازي',
            labelEn: 'Specialty Coffee Lounge',
          },
          {
            role: 'dinner_experience',
            defaultDwellMinutes: 95,
            labelAr: 'عشاء فاخر وأجواء مسائية',
            labelEn: 'Fine Dining & Atmosphere',
          },
        ],
      };

    case 'half_day_night':
      return {
        initialStartMinutes: 960, // 4:00 PM
        slots: [
          {
            role: 'afternoon_culture',
            defaultDwellMinutes: 60,
            labelAr: 'جولة فنية أو ثقافية',
            labelEn: 'Cultural / Art Encounter',
          },
          {
            role: 'sunset_activity',
            defaultDwellMinutes: 75,
            labelAr: 'مطل الغروب ونسيم البحر',
            labelEn: 'Sunset Coastal View',
          },
          {
            role: 'dinner_experience',
            defaultDwellMinutes: 90,
            labelAr: 'تجربة عشاء مميزة',
            labelEn: 'Dinner Experience',
          },
          {
            role: 'late_night_chill',
            defaultDwellMinutes: 60,
            labelAr: 'جلسة شاي وسهرة هادئة',
            labelEn: 'Late Night Tea Lounge',
          },
        ],
      };

    case 'full_day':
    default:
      return {
        initialStartMinutes: 630, // 10:30 AM
        slots: [
          {
            role: 'brunch_morning',
            defaultDwellMinutes: 75,
            labelAr: 'فطور راقٍ أو برنش صباحي',
            labelEn: 'Morning Brunch & Brew',
          },
          {
            role: 'afternoon_culture',
            defaultDwellMinutes: 90,
            labelAr: 'اكتشاف تراثي أو ترفيهي مكيف',
            labelEn: 'Heritage / Entertainment Hub',
          },
          {
            role: 'sunset_activity',
            defaultDwellMinutes: 75,
            labelAr: 'كورنيش الغروب ونادي اليخوت',
            labelEn: 'Sunset Marina Walk',
          },
          {
            role: 'dinner_experience',
            defaultDwellMinutes: 95,
            labelAr: 'عشاء رئيسي فخم',
            labelEn: 'Evening Dining Experience',
          },
          {
            role: 'late_night_chill',
            defaultDwellMinutes: 60,
            labelAr: 'سهرة شاي ومطل ليلي',
            labelEn: 'Nightcap & Red Sea Breeze',
          },
        ],
      };
  }
}

// ============================================================================
// 4. Numerically Stable Softmax Top-K Weighted Sampling
// ============================================================================

export interface ScoredCandidate {
  venue: Place;
  score: number;
}

/**
 * Numerically stable Top-K weighted probabilistic selector
 * Prevents NaN and exp overflow by subtracting maxScore: exp((score - maxScore) / T)
 */
export function sampleTopKWeighted(
  candidates: ScoredCandidate[],
  k: number = 4,
  temperature: number = 0.8
): ScoredCandidate | null {
  if (!candidates || candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  // Slice the top K highest scoring candidates
  const topK = candidates.slice(0, Math.min(k, candidates.length));
  const maxScore = Math.max(...topK.map((c) => c.score));

  // Safe exponential weights with temperature scaling
  const expWeights = topK.map((c) => {
    const scaled = (c.score - maxScore) / Math.max(0.05, temperature);
    return Math.exp(scaled);
  });

  const sumWeights = expWeights.reduce((acc, w) => acc + w, 0);
  if (sumWeights === 0 || isNaN(sumWeights)) {
    return topK[0]; // Graceful fallback
  }

  const rand = Math.random() * sumWeights;
  let cumulative = 0;
  for (let i = 0; i < topK.length; i++) {
    cumulative += expWeights[i];
    if (rand <= cumulative) {
      return topK[i];
    }
  }

  return topK[0];
}

// ============================================================================
// 5. Enhanced Heuristic Scoring Engine with Sequence & Vector Flow
// ============================================================================

export function computeEnhancedVenueScore(
  venue: Place,
  targetRole: StopSlotRole,
  prefs: WizardPreferences,
  prevCoords: { lat: number; lng: number },
  archetype: 'fastest' | 'balanced' | 'luxury' | 'free',
  usedPlaceIds: Set<string>,
  lastCategory?: string,
  stepIndex: number = 0,
  directionalVector?: { dLat: number; dLng: number } | null,
  previousDistricts?: string[]
): number {
  if (usedPlaceIds.has(venue.id)) return -99999;

  const isFreeRequired = archetype === 'free' || prefs.budgetTier === 'free';
  const isEconomy = prefs.budgetTier === 'economy' || prefs.budgetTier === 'budget';
  const isLuxury =
    archetype === 'luxury' || prefs.budgetTier === 'luxury' || prefs.budgetTier === 'premium';

  const venueSpend = venue.averageSpend ?? venue.averageCostSAR ?? 0;
  const venuePriceLevel =
    venue.priceLevel ??
    (venueSpend === 0
      ? 'free'
      : venueSpend <= 50
      ? 'budget'
      : venueSpend <= 150
      ? 'moderate'
      : venueSpend <= 250
      ? 'expensive'
      : 'luxury');

  // 1. Strict 100% Free Filter Constraint
  if (isFreeRequired) {
    if (venueSpend > 0 || venue.isFree === false || venuePriceLevel !== 'free') {
      return -99999;
    }
  }

  // 2. Strict Hard Constraint for Low Budget ('budget' / 'economy')
  if (isEconomy) {
    if (
      venuePriceLevel === 'expensive' ||
      venuePriceLevel === 'luxury' ||
      venue.priceTier === '$$$' ||
      venue.priceTier === '$$$$' ||
      venueSpend > 60
    ) {
      return -99999;
    }
  }

  let penalties = 0;

  // 3. Anti-collision: avoid repeating identical category consecutively
  if (lastCategory && venue.category === lastCategory) {
    penalties += 60; // Strong penalty against consecutive cafes or heavy restaurants
  }

  // 4. District Affinity Score & Proximity Anchor
  const userDistrict = normalizeDistrictId(prefs.startingDistrict);
  const venueDistrict = normalizeDistrictId(venue.district as string);
  let districtScore = 0;

  if (userDistrict !== 'all_jeddah') {
    if (userDistrict === venueDistrict) {
      districtScore = 40;
    } else {
      // Check if it's an immediate neighbor
      const neighbors = NEIGHBORING_DISTRICTS[userDistrict] || [];
      if (neighbors.includes(venueDistrict as DistrictId)) {
        districtScore = 22;
      } else {
        penalties += 25;
      }
    }
  }

  // 5. Role & Timing Fit Score
  let roleScore = 0;
  switch (targetRole) {
    case 'sunset_activity':
      if (
        venue.category === 'waterfront' ||
        venue.category === 'beach' ||
        venue.tags.includes('sunset') ||
        venue.tags.includes('sea_sunset') ||
        venue.tags.includes('free_walk')
      ) {
        roleScore = 40;
      } else if (
        venue.category === 'cultural' ||
        venue.category === 'heritage' ||
        venue.category === 'nature_parks'
      ) {
        roleScore = 30;
      } else {
        roleScore = 12;
      }
      break;

    case 'coffee_snack':
    case 'brunch_morning':
      if (
        venue.category === 'cafe' ||
        venue.tags.includes('specialty_coffee') ||
        venue.tags.includes('bakery') ||
        venue.tags.includes('coffee_dessert')
      ) {
        roleScore = 40;
      } else if (venue.category === 'cultural' || venue.category === 'waterfront') {
        roleScore = 22;
      } else {
        roleScore = 10;
      }
      break;

    case 'dinner_experience':
      if (venue.category === 'restaurant' || venue.category === 'culinary') {
        roleScore = 40;
      } else if (
        venue.category === 'entertainment' ||
        venue.category === 'arts_entertainment' ||
        venue.category === 'activity'
      ) {
        roleScore = 28;
      } else if (venue.category === 'heritage' || venue.category === 'waterfront') {
        roleScore = 22;
      }
      break;

    case 'afternoon_culture':
      if (
        venue.category === 'cultural' ||
        venue.category === 'heritage' ||
        venue.category === 'arts_entertainment'
      ) {
        roleScore = 40;
      } else if (venue.category === 'activity' || venue.category === 'cafe') {
        roleScore = 25;
      }
      break;

    case 'late_night_chill':
      if (
        venue.category === 'cafe' ||
        venue.tags.includes('late_night') ||
        venue.tags.includes('lounge') ||
        venue.tags.includes('tea') ||
        venue.category === 'waterfront'
      ) {
        roleScore = 40;
      } else {
        roleScore = 20;
      }
      break;
  }

  // 6. User Vibe Fit
  let vibeScore = 0;
  if (prefs.vibe) {
    if (venue.vibe && venue.vibe.includes(prefs.vibe)) {
      vibeScore += 25;
    }
    if (prefs.vibe === 'food' && (venue.category === 'restaurant' || venue.category === 'culinary')) {
      vibeScore += 18;
    }
    if (prefs.vibe === 'coffee_dessert' && venue.category === 'cafe') {
      vibeScore += 18;
    }
    if (
      prefs.vibe === 'beach_sunset' &&
      (venue.category === 'waterfront' || venue.category === 'beach')
    ) {
      vibeScore += 18;
    }
    if (
      prefs.vibe === 'heritage_arts' &&
      (venue.category === 'heritage' || venue.category === 'cultural')
    ) {
      vibeScore += 18;
    }
    if (
      prefs.vibe === 'gaming_challenges' &&
      (venue.category === 'entertainment' || venue.category === 'activity')
    ) {
      vibeScore += 18;
    }
  }

  // 7. Strict Budget Tier Scoring
  let budgetScore = 0;
  if (isFreeRequired) {
    budgetScore = 50;
  } else if (isLuxury) {
    if (venueSpend === 0 && venue.priceTier === 'free') {
      penalties += 70; // Strongly avoid plain free street spots when VIP luxury is chosen
    } else if (venue.priceTier === '$$$$' || venueSpend >= 180) {
      budgetScore = 55;
    } else if (venue.priceTier === '$$$' || venueSpend >= 90) {
      budgetScore = 35;
    } else {
      penalties += 35;
    }
  } else if (isEconomy) {
    if (venuePriceLevel === 'budget' || venueSpend <= 35) {
      budgetScore = 50;
    } else if (venueSpend <= 50) {
      budgetScore = 32;
    } else {
      budgetScore = 15;
    }
  } else {
    // Moderate
    if (venueSpend > 250) {
      penalties += 35;
    } else if (venueSpend >= 35 && venueSpend <= 160) {
      budgetScore = 35;
    } else {
      budgetScore = 18;
    }
  }

  // 8. Clustered Proximity Routing & Distance Constraints
  const distKm = calculateHaversineDistanceKm(
    prevCoords.lat,
    prevCoords.lng,
    venue.coordinates.lat,
    venue.coordinates.lng
  );

  // Prohibit consecutive hops > 6.0 km for clustered flow with quadratic penalty
  if (stepIndex > 0) {
    if (distKm > 6.0) {
      penalties += Math.pow(distKm - 6.0, 1.8) * 35;
    }
  }

  const distWeight = archetype === 'fastest' ? 7.5 : 4.5;
  const geoScore = Math.max(0, 45 - distKm * distWeight);

  // 9. Directional Vector & Anti-Zig-Zag Enforcement
  if (stepIndex > 1 && directionalVector) {
    const dLat = venue.coordinates.lat - prevCoords.lat;
    const dLng = venue.coordinates.lng - prevCoords.lng;
    const mag = Math.sqrt(dLat * dLat + dLng * dLng);
    const prevMag = Math.sqrt(
      directionalVector.dLat * directionalVector.dLat +
        directionalVector.dLng * directionalVector.dLng
    );

    if (mag > 0.001 && prevMag > 0.001) {
      const dot = (dLat * directionalVector.dLat + dLng * directionalVector.dLng) / (mag * prevMag);
      // dot < -0.3 indicates reversing direction backwards (zig-zag ping pong)
      if (dot < -0.3) {
        penalties += 120 + Math.abs(dot) * 60;
      } else if (dot > 0.3) {
        districtScore += 15; // Reward coherent directional flow
      }
    }
  }

  // Anti-District Ping-Pong (e.g. Al-Shati -> Al-Balad -> Al-Shati)
  if (previousDistricts && previousDistricts.length >= 2) {
    const vNormDistrict = normalizeDistrictId(venue.district as string);
    const lastD = previousDistricts[previousDistricts.length - 1];
    const prevD = previousDistricts[previousDistricts.length - 2];
    if (vNormDistrict !== lastD && vNormDistrict === prevD) {
      penalties += 100; // Strictly forbid ping-ponging back to the previous district
    }
  }

  // 10. Quality Rating Score
  const ratingScore = (venue.rating / 5) * 12;

  // 11. Deterministic micro-jitter to prevent static ties
  const jitter = Math.sin(venue.nameAr.length * 17 + stepIndex * 31) * 2;

  return (
    roleScore +
    districtScore +
    vibeScore +
    budgetScore +
    geoScore +
    ratingScore +
    jitter -
    penalties
  );
}

// ============================================================================
// 6. Dynamic Sequential Route Builder (Stopping Cross-Collision)
// ============================================================================

export function generateVariantStops(
  archetype: 'fastest' | 'balanced' | 'luxury' | 'free',
  prefs: WizardPreferences,
  startCoords: { lat: number; lng: number },
  globalUsedIds: Set<string>
): ItineraryStop[] {
  const { initialStartMinutes, slots } = buildDynamicSlotSequence(prefs.duration, prefs.vibe);

  const stops: ItineraryStop[] = [];
  const localPlanUsedIds = new Set<string>();

  let prevCoords = startCoords;
  let lastCategory: string | undefined = undefined;
  let currentStartMinutes = initialStartMinutes;
  let directionalVector: { dLat: number; dLng: number } | null = null;
  const visitedDistricts: string[] = [];

  const isFreePlan = archetype === 'free' || prefs.budgetTier === 'free';
  const isEconPlan = prefs.budgetTier === 'economy' || prefs.budgetTier === 'budget';
  const isLuxPlan =
    archetype === 'luxury' || prefs.budgetTier === 'luxury' || prefs.budgetTier === 'premium';

  // 1. Hard Cumulative Budget Ceiling (per person)
  // For 'free' / tafra: 0 SAR
  // For 'budget' / 'economy': max 60 SAR per person overall, hard cap
  const maxBudgetPerPerson = isFreePlan ? 0 : isEconPlan ? 60 : isLuxPlan ? 9999 : 180;
  let remainingBudgetPerPerson = maxBudgetPerPerson;

  const normUserDistrict = normalizeDistrictId(prefs.startingDistrict);

  for (let idx = 0; idx < slots.length; idx++) {
    const slotDef = slots[idx];

    // Combine global isolation pool with current itinerary's visited places
    const combinedExcludedIds = new Set<string>();
    globalUsedIds.forEach((id) => combinedExcludedIds.add(id));
    localPlanUsedIds.forEach((id) => combinedExcludedIds.add(id));

    // Score all available venues
    const candidateList: ScoredCandidate[] = [];
    for (let pIdx = 0; pIdx < JEDDAH_PLACES.length; pIdx++) {
      const venue = JEDDAH_PLACES[pIdx];
      const score = computeEnhancedVenueScore(
        venue,
        slotDef.role,
        prefs,
        prevCoords,
        archetype,
        combinedExcludedIds,
        lastCategory,
        idx,
        directionalVector,
        visitedDistricts
      );
      if (score > -500) {
        candidateList.push({ venue, score });
      }
    }

    // Sort descending by score
    candidateList.sort((a, b) => b.score - a.score);

    // STEP A: Anchor Point for Stop 0 (Anchor to selected starting district if specified)
    let eligibleCandidates = candidateList;
    if (idx === 0 && normUserDistrict !== 'all_jeddah') {
      const districtMatches = candidateList.filter((c) =>
        doesPlaceMatchDistrict(c.venue.district as string, normUserDistrict)
      );
      if (districtMatches.length > 0) {
        eligibleCandidates = districtMatches;
      }
    }

    // STEP B: Strict Budget Filter & Cumulative Budget Enforcement
    if (isFreePlan) {
      eligibleCandidates = eligibleCandidates.filter((c) => {
        const cost = c.venue.averageSpend ?? c.venue.averageCostSAR ?? 0;
        return cost === 0 || c.venue.isFree || c.venue.priceLevel === 'free';
      });
    } else if (isEconPlan) {
      // Hard Budget Constraint Filter:
      // - Disqualify 'expensive' and 'luxury' tiers completely
      // - Disqualify any candidate where spend > maxBudgetPerPerson
      // - Cumulative check: candidate spend must NOT exceed remainingBudgetPerPerson
      eligibleCandidates = eligibleCandidates.filter((c) => {
        const cost = c.venue.averageSpend ?? c.venue.averageCostSAR ?? 0;
        const pLevel =
          c.venue.priceLevel ??
          (cost === 0 ? 'free' : cost <= 50 ? 'budget' : 'moderate');

        if (
          pLevel === 'expensive' ||
          pLevel === 'luxury' ||
          c.venue.priceTier === '$$$' ||
          c.venue.priceTier === '$$$$'
        ) {
          return false;
        }

        if (cost > maxBudgetPerPerson) return false;
        if (cost > remainingBudgetPerPerson && cost > 0) return false;
        return pLevel === 'budget' || pLevel === 'free' || cost === 0;
      });

      // If remaining budget is exhausted or no candidate meets remaining budget, fall back to 100% free venues
      if (eligibleCandidates.length === 0) {
        eligibleCandidates = candidateList.filter((c) => {
          const cost = c.venue.averageSpend ?? c.venue.averageCostSAR ?? 0;
          return cost === 0 || c.venue.isFree || c.venue.priceLevel === 'free';
        });
      }
    } else if (isLuxPlan) {
      eligibleCandidates = eligibleCandidates.filter(
        (c) =>
          (c.venue.averageSpend ?? c.venue.averageCostSAR) >= 80 ||
          c.venue.priceTier === '$$$$' ||
          c.venue.priceTier === '$$$' ||
          c.venue.priceLevel === 'luxury' ||
          c.venue.priceLevel === 'expensive'
      );
    }

    // STEP C: Geographic Clustered Proximity Filter (Max 6.0 km from previous stop)
    if (idx > 0) {
      const within6Km = eligibleCandidates.filter((c) => {
        const d = calculateHaversineDistanceKm(
          prevCoords.lat,
          prevCoords.lng,
          c.venue.coordinates.lat,
          c.venue.coordinates.lng
        );
        return d <= 6.0;
      });

      if (within6Km.length > 0) {
        eligibleCandidates = within6Km;
      } else {
        // If no candidate exists within 6 km, strictly pick from the closest available cluster
        const withDists = eligibleCandidates.map((c) => ({
          candidate: c,
          dist: calculateHaversineDistanceKm(
            prevCoords.lat,
            prevCoords.lng,
            c.venue.coordinates.lat,
            c.venue.coordinates.lng
          ),
        }));
        withDists.sort((a, b) => a.dist - b.dist);
        if (withDists.length > 0) {
          const minDist = withDists[0].dist;
          eligibleCandidates = withDists
            .filter((item) => item.dist <= minDist + 2.5)
            .map((item) => item.candidate);
        }
      }
    }

    // Select with Top-K Weighted Probabilistic Sampling
    let selectedItem = sampleTopKWeighted(
      eligibleCandidates,
      Math.min(3, Math.max(1, eligibleCandidates.length)),
      0.7
    );

    // GRACEFUL RELAXATION (if needed):
    if (!selectedItem) {
      const relaxedCandidates = JEDDAH_PLACES.filter(
        (p) => !localPlanUsedIds.has(p.id)
      )
        .map((venue) => ({
          venue,
          score: computeEnhancedVenueScore(
            venue,
            slotDef.role,
            prefs,
            prevCoords,
            archetype,
            localPlanUsedIds, // Exclude only places in this specific plan
            lastCategory,
            idx,
            directionalVector,
            visitedDistricts
          ),
        }))
        .filter((c) => c.score > -1000)
        .sort((a, b) => b.score - a.score);

      let relaxedEligible = relaxedCandidates;
      if (isFreePlan) {
        relaxedEligible = relaxedCandidates.filter(
          (c) =>
            (c.venue.averageSpend ?? c.venue.averageCostSAR) === 0 ||
            c.venue.isFree ||
            c.venue.priceLevel === 'free'
        );
      } else if (isEconPlan) {
        relaxedEligible = relaxedCandidates.filter((c) => {
          const cost = c.venue.averageSpend ?? c.venue.averageCostSAR ?? 0;
          const pLevel =
            c.venue.priceLevel ??
            (cost === 0 ? 'free' : cost <= 50 ? 'budget' : 'moderate');
          return (
            pLevel !== 'expensive' &&
            pLevel !== 'luxury' &&
            c.venue.priceTier !== '$$$' &&
            c.venue.priceTier !== '$$$$' &&
            (cost <= remainingBudgetPerPerson || cost === 0)
          );
        });
        if (relaxedEligible.length === 0) {
          relaxedEligible = relaxedCandidates.filter(
            (c) =>
              (c.venue.averageSpend ?? c.venue.averageCostSAR) === 0 ||
              c.venue.isFree ||
              c.venue.priceLevel === 'free'
          );
        }
      } else if (isLuxPlan) {
        relaxedEligible = relaxedCandidates.filter(
          (c) => (c.venue.averageSpend ?? c.venue.averageCostSAR) >= 80
        );
      }

      if (idx > 0) {
        const relaxedProx = relaxedEligible.filter((c) => {
          return (
            calculateHaversineDistanceKm(
              prevCoords.lat,
              prevCoords.lng,
              c.venue.coordinates.lat,
              c.venue.coordinates.lng
            ) <= 6.0
          );
        });
        if (relaxedProx.length > 0) {
          relaxedEligible = relaxedProx;
        } else {
          const withDists = relaxedEligible.map((c) => ({
            candidate: c,
            dist: calculateHaversineDistanceKm(
              prevCoords.lat,
              prevCoords.lng,
              c.venue.coordinates.lat,
              c.venue.coordinates.lng
            ),
          }));
          withDists.sort((a, b) => a.dist - b.dist);
          if (withDists.length > 0) {
            const minDist = withDists[0].dist;
            relaxedEligible = withDists
              .filter((item) => item.dist <= minDist + 2.5)
              .map((item) => item.candidate);
          }
        }
      }

      selectedItem = sampleTopKWeighted(relaxedEligible, 3, 0.75) || relaxedEligible[0];
    }

    // Absolute fallback: Any unused place that strictly respects budget constraints & proximity
    let bestPlace: Place;
    if (selectedItem) {
      bestPlace = selectedItem.venue;
    } else {
      const budgetFallback = JEDDAH_PLACES.filter((p) => {
        if (localPlanUsedIds.has(p.id)) return false;
        const cost = p.averageSpend ?? p.averageCostSAR ?? 0;
        if (isFreePlan) return cost === 0 || p.isFree;
        if (isEconPlan) {
          return (
            p.priceLevel === 'budget' ||
            p.priceLevel === 'free' ||
            cost === 0 ||
            p.isFree
          );
        }
        return true;
      });

      budgetFallback.sort((a, b) => {
        const dA = calculateHaversineDistanceKm(
          prevCoords.lat,
          prevCoords.lng,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const dB = calculateHaversineDistanceKm(
          prevCoords.lat,
          prevCoords.lng,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return dA - dB;
      });

      bestPlace =
        budgetFallback[0] ||
        JEDDAH_PLACES.find((p) => (p.averageSpend ?? p.averageCostSAR) === 0) ||
        JEDDAH_PLACES[0];
    }

    // Mark as used in both local plan and global pool
    localPlanUsedIds.add(bestPlace.id);
    globalUsedIds.add(bestPlace.id);
    lastCategory = bestPlace.category;

    // Deduct from remaining cumulative budget
    const selectedCost = bestPlace.averageSpend ?? bestPlace.averageCostSAR ?? 0;
    remainingBudgetPerPerson = Math.max(0, remainingBudgetPerPerson - selectedCost);

    // Update directional vector & district history
    if (stops.length > 0) {
      directionalVector = {
        dLat: bestPlace.coordinates.lat - prevCoords.lat,
        dLng: bestPlace.coordinates.lng - prevCoords.lng,
      };
    }
    visitedDistricts.push(normalizeDistrictId(bestPlace.district as string));

    // Calculate transit leg from previous stop
    const distKm = calculateHaversineDistanceKm(
      prevCoords.lat,
      prevCoords.lng,
      bestPlace.coordinates.lat,
      bestPlace.coordinates.lng
    );
    const drivingMins = estimateDrivingMinutes(distKm);
    const uberSAR = estimateUberCostSAR(distKm, drivingMins);

    // DYNAMIC SEQUENTIAL CHAINING:
    // If not first stop, start time = previous end time + driving time + 5 mins buffer
    if (idx > 0) {
      currentStartMinutes += drivingMins + 5;
    }

    const dwellTime = bestPlace.dwellTimeMinutes || slotDef.defaultDwellMinutes || 60;
    const currentEndMinutes = currentStartMinutes + dwellTime;

    const slotAr = formatTimeSlotLabel(currentStartMinutes, currentEndMinutes, 'ar');
    const slotEn = formatTimeSlotLabel(currentStartMinutes, currentEndMinutes, 'en');
    const startTimeStr = minutesToTimeString(currentStartMinutes);
    const endTimeStr = minutesToTimeString(currentEndMinutes);
    const weatherNotice = getWeatherNoticeForTime(currentStartMinutes);

    const stop: ItineraryStop = {
      id: `stop-${archetype}-${idx}-${Date.now()}-${bestPlace.id}`,
      order: idx + 1,
      place: bestPlace,
      startTime: startTimeStr,
      endTime: endTimeStr,
      timeSlot: slotAr,
      weatherNotice: {
        type: weatherNotice.type,
        textAr: weatherNotice.textAr,
        textEn: weatherNotice.textEn,
      },
      transitFromPrevious:
        idx > 0
          ? {
              fromPlaceId: stops[idx - 1].place.id,
              toPlaceId: bestPlace.id,
              distanceKm: Math.round(distKm * 10) / 10,
              drivingMinutes: isFreePlan ? Math.max(5, Math.round(distKm * 12)) : drivingMins,
              durationMinutes: isFreePlan ? Math.max(5, Math.round(distKm * 12)) : drivingMins,
              transitMode: isFreePlan ? 'walking' : 'car',
              estimatedUberSAR: isFreePlan ? 0 : uberSAR,
              trafficLevel: isFreePlan ? 'low' : drivingMins > 16 ? 'moderate' : 'low',
              routeDescriptionAr: isFreePlan
                ? `كعابي (المشي) بين المحطات (~${Math.max(5, Math.round(distKm * 12))} دقيقة)`
                : `المسار المباشر الموصى به (~${drivingMins} دقيقة)`,
              routeDescriptionEn: isFreePlan
                ? `Walking trail between stops (~${Math.max(5, Math.round(distKm * 12))} mins)`
                : `Direct recommended route (~${drivingMins} mins)`,
            }
          : undefined,
    };

    stops.push(stop);
    prevCoords = bestPlace.coordinates;
    currentStartMinutes = currentEndMinutes;
  }

  return stops;
}

// ============================================================================
// 7. Financial & Transit Aggregation Utilities
// ============================================================================

export function calculateFinancials(
  stops: ItineraryStop[],
  groupSize: number = 2
): FinancialBreakdown {
  let placesCost = 0;
  let transitCost = 0;

  const isAllFree = stops.every((s) => s.place.averageCostSAR === 0);

  stops.forEach((s) => {
    placesCost += s.place.averageCostSAR;
    if (s.transitFromPrevious) {
      transitCost += s.transitFromPrevious.estimatedUberSAR;
    }
  });

  if (isAllFree) {
    return {
      totalSAR: 0,
      totalPerPersonSAR: 0,
      currency: 'SAR',
      foodAndBeverageSAR: 0,
      activitiesAndTicketsSAR: 0,
      estimatedTransitSAR: transitCost,
      transitEstimatedSAR: transitCost,
      emergencyBufferSAR: 0,
      groupSize,
      breakdownByStop: stops.map((s) => ({
        stopId: s.id,
        placeNameAr: s.place.nameAr,
        placeNameEn: s.place.nameEn,
        costSAR: 0,
        isFree: true,
      })),
    };
  }

  const buffer = Math.round((placesCost + transitCost) * 0.1);
  const totalSAR = placesCost + transitCost + buffer;
  const totalPerPersonSAR = Math.round(totalSAR / Math.max(1, groupSize));

  return {
    totalSAR,
    totalPerPersonSAR,
    currency: 'SAR',
    foodAndBeverageSAR: Math.round(placesCost * 0.7),
    activitiesAndTicketsSAR: Math.round(placesCost * 0.3),
    estimatedTransitSAR: transitCost,
    transitEstimatedSAR: transitCost,
    emergencyBufferSAR: buffer,
    groupSize,
    breakdownByStop: stops.map((s) => ({
      stopId: s.id,
      placeNameAr: s.place.nameAr,
      placeNameEn: s.place.nameEn,
      costSAR: s.place.averageCostSAR,
      isFree: s.place.averageCostSAR === 0,
    })),
  };
}

export function calculateTransitTotals(
  stops: ItineraryStop[]
): { minutes: number; km: number } {
  let minutes = 0;
  let km = 0;

  stops.forEach((s) => {
    if (s.transitFromPrevious) {
      minutes += s.transitFromPrevious.durationMinutes || s.transitFromPrevious.drivingMinutes || 0;
      km += s.transitFromPrevious.distanceKm || 0;
    }
  });

  return {
    minutes: Math.max(10, minutes),
    km: Math.round(km * 10) / 10,
  };
}

// ============================================================================
// 8. Master Multi-Plan Generator (Coordinated Cross-Variant Isolation)
// ============================================================================

export function generateMultiPlanVariants(preferences: WizardPreferences): Itinerary {
  const { startingDistrict, budgetTier } = preferences;

  // Starting coordinate centroid
  let startLat = 21.608;
  let startLng = 39.1105;

  const normDistrict = normalizeDistrictId(startingDistrict);
  if (normDistrict !== 'all_jeddah') {
    const distObj = JEDDAH_DISTRICTS.find((d) => d.id === normDistrict);
    if (distObj) {
      startLat = distObj.coordinates.lat;
      startLng = distObj.coordinates.lng;
    }
  } else if (preferences.userCoords) {
    startLat = preferences.userCoords.lat;
    startLng = preferences.userCoords.lng;
  }

  const startCoords = { lat: startLat, lng: startLng };

  // Global pool tracking to guarantee 100% distinct places across all 3 variants
  const globalUsedPlaceIds = new Set<string>();

  // 1. Generate Variant 1: Balanced Masterpiece (First pick for optimal cohesion)
  const balancedStops = generateVariantStops('balanced', preferences, startCoords, globalUsedPlaceIds);
  const balancedFinancials = calculateFinancials(balancedStops, 2);
  const balancedTransitTotals = calculateTransitTotals(balancedStops);

  const balancedVariant: PlanVariant = {
    id: 'balanced',
    titleAr: 'الخطة الموزونة',
    titleEn: 'The Balanced Experience',
    taglineAr: 'المزيج المثالي بين المشي، القهوة المختصة، وأجواء العشاء والغروب',
    taglineEn: 'The ideal mix of scenic strolls, specialty coffee, and signature dining',
    badgeAr: 'الخيار الموصى به',
    badgeEn: 'Recommended Choice',
    icon: 'Scale',
    stops: balancedStops,
    financials: balancedFinancials,
    totalTransitMinutes: balancedTransitTotals.minutes,
    totalDistanceKm: balancedTransitTotals.km,
  };

  // 2. Generate Variant 2: Fastest & Closest (Second pick from remaining places)
  const fastestStops = generateVariantStops('fastest', preferences, startCoords, globalUsedPlaceIds);
  const fastestFinancials = calculateFinancials(fastestStops, 2);
  const fastestTransitTotals = calculateTransitTotals(fastestStops);

  const fastestVariant: PlanVariant = {
    id: 'fastest',
    titleAr: 'الأقرب والأسرع',
    titleEn: 'Shortest Transit & Proximity',
    taglineAr: 'مسار متقارب جغرافياً يوفّر وقت المشاوير وزحام الطرق',
    taglineEn: 'Optimized to minimize driving time with tightly clustered venues',
    badgeAr: `أقل وقت تنقل (~${fastestTransitTotals.minutes} دقيقة)`,
    badgeEn: `Lowest Transit (~${fastestTransitTotals.minutes} mins)`,
    icon: 'Zap',
    stops: fastestStops,
    financials: fastestFinancials,
    totalTransitMinutes: fastestTransitTotals.minutes,
    totalDistanceKm: fastestTransitTotals.km,
  };

  // 3. Generate Variant 3: Free Outing (0 SAR) OR VIP Luxury (Third pick from remaining places)
  const isFreePlanMode = budgetTier === 'free' || budgetTier === 'economy';
  const thirdVariantKey: PlanVariantKey = isFreePlanMode ? 'free' : 'luxury';

  const thirdStops = generateVariantStops(thirdVariantKey, preferences, startCoords, globalUsedPlaceIds);
  const thirdFinancials = calculateFinancials(thirdStops, 2);
  const thirdTransitTotals = calculateTransitTotals(thirdStops);

  let freeVariant: PlanVariant | undefined = undefined;
  let luxuryVariant: PlanVariant;

  if (isFreePlanMode) {
    freeVariant = {
      id: 'free',
      titleAr: 'خطة الوضع طفرة',
      titleEn: 'Tafra Zero-Cost Outing',
      taglineAr: 'مسار كعابي (المشي) ومعالم مجانية 100% بدون أي تكاليف مواصلات أو دخول',
      taglineEn: 'Zero-cost walking itinerary across open promenades, historic alleys, and fountain viewpoints',
      badgeAr: 'الوضع طفرة 💸',
      badgeEn: '100% Free (0 SAR)',
      icon: 'Footprints',
      stops: thirdStops,
      financials: thirdFinancials,
      totalTransitMinutes: thirdTransitTotals.minutes,
      totalDistanceKm: thirdTransitTotals.km,
    };

    const luxStops = generateVariantStops('luxury', preferences, startCoords, globalUsedPlaceIds);
    const luxFinancials = calculateFinancials(luxStops, 2);
    const luxTransitTotals = calculateTransitTotals(luxStops);

    luxuryVariant = {
      id: 'luxury',
      titleAr: 'التجربة الفخمة VIP',
      titleEn: 'VIP Luxury Signature',
      taglineAr: 'أرقى مطاعم الواجهة البحرية، نوادي اليخوت، والتجارب الحصرية',
      taglineEn: 'Signature marina dining, yacht club views, and high-end gastronomy',
      badgeAr: 'فخامة VIP',
      badgeEn: 'VIP Luxury',
      icon: 'Crown',
      stops: luxStops,
      financials: luxFinancials,
      totalTransitMinutes: luxTransitTotals.minutes,
      totalDistanceKm: luxTransitTotals.km,
    };
  } else {
    luxuryVariant = {
      id: 'luxury',
      titleAr: 'التجربة الفخمة VIP',
      titleEn: 'VIP Luxury Signature',
      taglineAr: 'أرقى مطاعم الواجهة البحرية، نوادي اليخوت، والتجارب الحصرية',
      taglineEn: 'Signature marina dining, yacht club views, and high-end gastronomy',
      badgeAr: 'فخامة VIP',
      badgeEn: 'VIP Luxury',
      icon: 'Crown',
      stops: thirdStops,
      financials: thirdFinancials,
      totalTransitMinutes: thirdTransitTotals.minutes,
      totalDistanceKm: thirdTransitTotals.km,
    };
  }

  const activeVariantKey: PlanVariantKey = budgetTier === 'free' ? 'free' : 'balanced';
  const activeVariantObj: PlanVariant =
    activeVariantKey === 'free' && freeVariant ? freeVariant : balancedVariant;

  const districtLabel = getDistrictLabel(startingDistrict);

  return {
    id: `jadawel-plan-${Date.now()}`,
    titleAr: `طلعة جدة الذكية • ${districtLabel}`,
    titleEn: `Jeddah Smart Outing • ${districtLabel}`,
    descriptionAr:
      'تم توليد 3 خطط متكاملة بدقة ومسار جغرافي متصل مع عزل تام للأماكن وحساب الميزانية والتنقلات.',
    descriptionEn:
      'Generated 3 distinct plans with linear geographic routing, zero overlap & exact SAR budget calculations.',
    createdAt: new Date().toISOString(),
    preferences,
    daysCount: 1,
    activeVariant: activeVariantKey,
    variants: {
      fastest: fastestVariant,
      balanced: balancedVariant,
      luxury: luxuryVariant,
      free: freeVariant,
    },
    stops: activeVariantObj.stops,
    financials: activeVariantObj.financials,
    summaryAr: 'اختر الخطة المناسبة لك وشاركها مع الشلة بنقرة واحدة.',
    summaryEn: 'Pick your preferred plan variant and share with friends in one click.',
  };
}
