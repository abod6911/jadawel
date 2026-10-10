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
} from '@/types';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import {
  calculateHaversineDistanceKm,
  estimateDrivingMinutes,
  estimateUberCostSAR,
} from './distanceCalculator';

/**
 * Normalizes any string representation of a Jeddah district into a standard DistrictId
 */
export function normalizeDistrictId(raw?: string): DistrictId | 'all_jeddah' {
  if (!raw) return 'all_jeddah';
  const lower = raw.toLowerCase().trim();
  if (lower === 'all' || lower === 'all_jeddah' || lower === 'all-jeddah' || lower === 'current_location') {
    return 'all_jeddah';
  }
  if (lower.includes('balad')) return 'al-balad';
  if (lower.includes('shati') || lower.includes('waterfront') || lower.includes('corniche')) return 'al-shati';
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

/**
 * Heuristic scoring engine for places based on user preferences and current route archetype
 */
function computeVenueScore(
  venue: Place,
  targetRole: 'sunset_activity' | 'coffee_snack' | 'dinner_experience',
  prefs: WizardPreferences,
  prevCoords: { lat: number; lng: number },
  archetype: 'fastest' | 'balanced' | 'luxury' | 'free',
  usedPlaceIds: Set<string>,
  lastCategory?: string
): number {
  if (usedPlaceIds.has(venue.id)) return -99999;

  // 1. Strict 100% Free Filter Constraint
  const isFreeRequired = archetype === 'free' || prefs.budgetTier === 'free';
  if (isFreeRequired) {
    if (venue.averageCostSAR > 0 || venue.isFree === false) {
      return -99999;
    }
  }

  let penalties = 0;

  // 2. Anti-collision: avoid repeating identical category back-to-back
  if (lastCategory && venue.category === lastCategory) {
    penalties += 40;
  }

  // 3. District Affinity Score
  const userDistrict = normalizeDistrictId(prefs.startingDistrict);
  const venueDistrict = normalizeDistrictId(venue.district as string);
  let districtScore = 0;
  if (userDistrict !== 'all_jeddah') {
    if (userDistrict === venueDistrict) {
      districtScore = 30;
    } else {
      penalties += 15;
    }
  }

  // 4. Role & Timing Fit Score
  let roleScore = 0;
  if (targetRole === 'sunset_activity') {
    if (
      venue.category === 'waterfront' ||
      venue.category === 'beach' ||
      venue.tags.includes('sunset') ||
      venue.tags.includes('sea_sunset') ||
      venue.tags.includes('free_walk')
    ) {
      roleScore = 35;
    } else if (
      venue.category === 'cultural' ||
      venue.category === 'heritage' ||
      venue.category === 'nature_parks'
    ) {
      roleScore = 25;
    } else {
      roleScore = 10;
    }
  } else if (targetRole === 'coffee_snack') {
    if (
      venue.category === 'cafe' ||
      venue.tags.includes('specialty_coffee') ||
      venue.tags.includes('bakery') ||
      venue.tags.includes('coffee_dessert')
    ) {
      roleScore = 35;
    } else if (venue.category === 'cultural' || venue.category === 'waterfront') {
      roleScore = 20;
    }
  } else {
    // Dinner & Evening
    if (venue.category === 'restaurant' || venue.category === 'culinary') {
      roleScore = 35;
    } else if (
      venue.category === 'entertainment' ||
      venue.category === 'arts_entertainment' ||
      venue.category === 'activity'
    ) {
      roleScore = 30;
    } else if (venue.category === 'heritage' || venue.category === 'waterfront') {
      roleScore = 22;
    }
  }

  // 5. User Vibe Fit
  let vibeScore = 0;
  if (prefs.vibe) {
    if (venue.vibe && venue.vibe.includes(prefs.vibe as any)) {
      vibeScore += 20;
    }
    if (prefs.vibe === 'food' && (venue.category === 'restaurant' || venue.category === 'culinary')) {
      vibeScore += 15;
    }
    if (prefs.vibe === 'coffee_dessert' && venue.category === 'cafe') {
      vibeScore += 15;
    }
    if (prefs.vibe === 'beach_sunset' && (venue.category === 'waterfront' || venue.category === 'beach')) {
      vibeScore += 15;
    }
    if (prefs.vibe === 'heritage_arts' && (venue.category === 'heritage' || venue.category === 'cultural')) {
      vibeScore += 15;
    }
    if (prefs.vibe === 'gaming_challenges' && (venue.category === 'entertainment' || venue.category === 'activity')) {
      vibeScore += 15;
    }
  }

  // 6. Budget Fit
  let budgetScore = 0;
  if (isFreeRequired) {
    budgetScore = 30;
  } else if (archetype === 'luxury' || prefs.budgetTier === 'luxury' || prefs.budgetTier === 'premium') {
    if (venue.priceTier === '$$$$' || venue.averageCostSAR >= 180) {
      budgetScore = 30;
    } else if (venue.priceTier === '$$$' || venue.averageCostSAR >= 90) {
      budgetScore = 20;
    } else {
      penalties += 15;
    }
  } else if (prefs.budgetTier === 'economy') {
    if (venue.averageCostSAR === 0 || venue.averageCostSAR <= 50) {
      budgetScore = 30;
    } else if (venue.averageCostSAR <= 90) {
      budgetScore = 18;
    } else {
      penalties += 25;
    }
  } else {
    // Moderate (~150 SAR)
    if (venue.averageCostSAR > 0 && venue.averageCostSAR <= 160) {
      budgetScore = 25;
    } else if (venue.averageCostSAR === 0) {
      budgetScore = 18;
    } else {
      budgetScore = 12;
    }
  }

  // 7. Geographic Distance & Route Flow
  const distKm = calculateHaversineDistanceKm(
    prevCoords.lat,
    prevCoords.lng,
    venue.coordinates.lat,
    venue.coordinates.lng
  );

  const distWeight = archetype === 'fastest' ? 6.0 : 2.5;
  const geoScore = Math.max(0, 30 - distKm * distWeight);

  if (distKm > 18) {
    penalties += (distKm - 18) * 8;
  }

  // 8. Rating
  const ratingScore = (venue.rating / 5) * 10;

  return (
    roleScore +
    districtScore +
    vibeScore +
    budgetScore +
    geoScore +
    ratingScore -
    penalties
  );
}

/**
 * Builds stops for an individual archetype variant
 */
function generateVariantStops(
  archetype: 'fastest' | 'balanced' | 'luxury' | 'free',
  prefs: WizardPreferences,
  startCoords: { lat: number; lng: number }
): ItineraryStop[] {
  const timeBlocks = [
    {
      start: '16:45',
      end: '18:15',
      slotAr: '4:45 م - 6:15 م',
      slotEn: '04:45 PM - 06:15 PM',
      role: 'sunset_activity' as const,
      weatherAr: '🌅 وقت الغروب: أفضل توقيت لنسيم البحر والتقاط الصور التذكارية.',
      weatherEn: '🌅 Golden Hour: Ideal coastal breeze and sunset photography.',
    },
    {
      start: '18:30',
      end: '19:45',
      slotAr: '6:30 م - 7:45 م',
      slotEn: '06:30 PM - 07:45 PM',
      role: 'coffee_snack' as const,
      weatherAr: '☕ استراحة الروقان: جلسة مريحة لتناول القهوة والمشروبات المنعشة.',
      weatherEn: '☕ Chill Break: Specialty brews and artisan treats.',
    },
    {
      start: '20:00',
      end: '22:30',
      slotAr: '8:00 م - 10:30 م',
      slotEn: '08:00 PM - 10:30 PM',
      role: 'dinner_experience' as const,
      weatherAr: '🌙 أجواء السهرة: نسمة ليلية عليلة وجلسات خارجية مضيئة.',
      weatherEn: '🌙 Evening Vibe: Ambient dining and Red Sea twilight breeze.',
    },
  ];

  const stops: ItineraryStop[] = [];
  const usedIds = new Set<string>();
  let prevCoords = startCoords;
  let lastCategory: string | undefined = undefined;

  for (let idx = 0; idx < timeBlocks.length; idx++) {
    const block = timeBlocks[idx];

    // Score all available venues
    const scoredVenues = JEDDAH_PLACES.map((venue) => ({
      venue,
      score: computeVenueScore(
        venue,
        block.role,
        prefs,
        prevCoords,
        archetype,
        usedIds,
        lastCategory
      ),
    })).sort((a, b) => b.score - a.score);

    let bestPlace = scoredVenues[0]?.venue;

    // Strict free fallback
    if (archetype === 'free' || prefs.budgetTier === 'free') {
      const freeCandidates = JEDDAH_PLACES.filter(
        (p) => p.averageCostSAR === 0 && !usedIds.has(p.id)
      );
      if (freeCandidates.length > 0) {
        bestPlace = freeCandidates[0];
      }
    }

    if (!bestPlace || usedIds.has(bestPlace.id)) {
      bestPlace =
        JEDDAH_PLACES.find((p) => !usedIds.has(p.id)) ||
        JEDDAH_PLACES[idx % JEDDAH_PLACES.length];
    }

    usedIds.add(bestPlace.id);
    lastCategory = bestPlace.category;

    const distKm = calculateHaversineDistanceKm(
      prevCoords.lat,
      prevCoords.lng,
      bestPlace.coordinates.lat,
      bestPlace.coordinates.lng
    );
    const drivingMins = estimateDrivingMinutes(distKm);
    const uberSAR = estimateUberCostSAR(distKm, drivingMins);

    const stop: ItineraryStop = {
      id: `stop-${archetype}-${idx}-${Date.now()}-${bestPlace.id}`,
      order: idx + 1,
      place: bestPlace,
      startTime: block.start,
      endTime: block.end,
      timeSlot: block.slotAr,
      weatherNotice: {
        type: idx === 0 ? 'golden_hour' : idx === 1 ? 'indoor_midday' : 'night_atmosphere',
        textAr: block.weatherAr,
        textEn: block.weatherEn,
      },
      transitFromPrevious:
        idx > 0
          ? {
              fromPlaceId: stops[idx - 1].place.id,
              toPlaceId: bestPlace.id,
              distanceKm: Math.round(distKm * 10) / 10,
              drivingMinutes: drivingMins,
              durationMinutes: drivingMins,
              transitMode: 'car',
              estimatedUberSAR: uberSAR,
              trafficLevel: drivingMins > 15 ? 'moderate' : 'low',
              routeDescriptionAr: `المسار المباشر الموصى به (~${drivingMins} دقيقة)`,
              routeDescriptionEn: `Direct recommended route (~${drivingMins} mins)`,
            }
          : undefined,
    };

    stops.push(stop);
    prevCoords = bestPlace.coordinates;
  }

  return stops;
}

/**
 * Calculates itemized financial breakdown for stops
 */
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
  const totalPerPersonSAR = Math.max(30, Math.round(totalSAR / groupSize));

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

/**
 * Calculates total transit minutes and kilometers
 */
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
    minutes: Math.max(12, minutes),
    km: Math.round(km * 10) / 10,
  };
}

/**
 * Master multi-plan generator producing 3 synchronized, distinct itinerary variants
 */
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

  // 1. Variant 1: Fastest & Closest
  const fastestStops = generateVariantStops('fastest', preferences, startCoords);
  const fastestFinancials = calculateFinancials(fastestStops, 2);
  const fastestTransitTotals = calculateTransitTotals(fastestStops);

  const fastestVariant: PlanVariant = {
    id: 'fastest',
    titleAr: '⚡ الأقرب والأسرع',
    titleEn: '⚡ Shortest Transit & Proximity',
    taglineAr: 'مسار متقارب جغرافياً يوفّر وقت المشاوير وزحام الطرق',
    taglineEn: 'Optimized to minimize driving time with tightly clustered venues',
    badgeAr: 'أقل وقت تنقل (~15 دقيقة)',
    badgeEn: 'Lowest Transit (~15 mins)',
    icon: 'Zap',
    stops: fastestStops,
    financials: fastestFinancials,
    totalTransitMinutes: fastestTransitTotals.minutes,
    totalDistanceKm: fastestTransitTotals.km,
  };

  // 2. Variant 2: Balanced Masterpiece
  const balancedStops = generateVariantStops('balanced', preferences, startCoords);
  const balancedFinancials = calculateFinancials(balancedStops, 2);
  const balancedTransitTotals = calculateTransitTotals(balancedStops);

  const balancedVariant: PlanVariant = {
    id: 'balanced',
    titleAr: '⚖️ الخطة الموزونة',
    titleEn: '⚖️ The Balanced Experience',
    taglineAr: 'المزيج المثالي بين المشي، القهوة، وأجواء العشاء والغروب',
    taglineEn: 'The ideal mix of scenic strolls, specialty coffee, and signature dining',
    badgeAr: 'الخيار الموصى به ⭐',
    badgeEn: 'Recommended Choice ⭐',
    icon: 'Scale',
    stops: balancedStops,
    financials: balancedFinancials,
    totalTransitMinutes: balancedTransitTotals.minutes,
    totalDistanceKm: balancedTransitTotals.km,
  };

  // 3. Variant 3: Free Outing (0 SAR) OR VIP Luxury
  const isFreePlanMode = budgetTier === 'free' || budgetTier === 'economy';
  const thirdVariantKey: PlanVariantKey = isFreePlanMode ? 'free' : 'luxury';

  const thirdStops = generateVariantStops(thirdVariantKey, preferences, startCoords);
  const thirdFinancials = calculateFinancials(thirdStops, 2);
  const thirdTransitTotals = calculateTransitTotals(thirdStops);

  const freeVariant: PlanVariant = {
    id: 'free',
    titleAr: '🆓 خطة الروقان المجانية (0 ر.س)',
    titleEn: '🆓 100% Free Outing (0 SAR)',
    taglineAr: 'مسار كامل بدون أي رسوم دخول أو تكاليف إضافية (أزقة التراث، الممشى البحري، ومطل النافورة)',
    taglineEn: 'Zero-cost itinerary across open promenades, historic alleys, and fountain viewpoints',
    badgeAr: 'مجانية 100% (0 ر.س) 🆓',
    badgeEn: '100% Free (0 SAR) 🆓',
    icon: 'Compass',
    stops: isFreePlanMode ? thirdStops : generateVariantStops('free', preferences, startCoords),
    financials: isFreePlanMode ? thirdFinancials : calculateFinancials(generateVariantStops('free', preferences, startCoords), 2),
    totalTransitMinutes: thirdTransitTotals.minutes,
    totalDistanceKm: thirdTransitTotals.km,
  };

  const luxuryVariant: PlanVariant = {
    id: 'luxury',
    titleAr: '💎 التجربة الفخمة VIP',
    titleEn: '💎 VIP Luxury Signature',
    taglineAr: 'أرقى مطاعم الواجهة البحرية، نوادي اليخوت، والتجارب الحصرية',
    taglineEn: 'Signature marina dining, yacht club views, and high-end gastronomy',
    badgeAr: 'فخامة VIP',
    badgeEn: 'VIP Luxury',
    icon: 'Crown',
    stops: !isFreePlanMode ? thirdStops : generateVariantStops('luxury', preferences, startCoords),
    financials: !isFreePlanMode ? thirdFinancials : calculateFinancials(generateVariantStops('luxury', preferences, startCoords), 2),
    totalTransitMinutes: thirdTransitTotals.minutes,
    totalDistanceKm: thirdTransitTotals.km,
  };

  const activeVariantKey: PlanVariantKey = budgetTier === 'free' ? 'free' : 'balanced';
  const activeVariantObj: PlanVariant =
    activeVariantKey === 'free' ? freeVariant : balancedVariant;

  const districtLabel = getDistrictLabel(startingDistrict);

  return {
    id: `jadawel-plan-${Date.now()}`,
    titleAr: `طلعة جدة الذكية • ${districtLabel}`,
    titleEn: `Jeddah Smart Outing • ${districtLabel}`,
    descriptionAr: 'تم توليد 3 خطط متكاملة بدقة ومسار جغرافي متصل مع حساب الميزانية والتنقلات.',
    descriptionEn: 'Generated 3 distinct plans with linear geographic routing & exact SAR budget calculations.',
    createdAt: new Date().toISOString(),
    preferences,
    daysCount: 1,
    activeVariant: activeVariantKey,
    variants: {
      fastest: fastestVariant,
      balanced: balancedVariant,
      luxury: luxuryVariant,
      free: isFreePlanMode ? freeVariant : undefined,
    },
    stops: activeVariantObj.stops,
    financials: activeVariantObj.financials,
    summaryAr: 'اختر الخطة المناسبة لك وشاركها مع الشلة بنقرة واحدة.',
    summaryEn: 'Pick your preferred plan variant and share with friends in one click.',
  };
}
