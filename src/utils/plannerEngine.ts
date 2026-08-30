import {
  Itinerary,
  ItineraryStop,
  Place,
  WizardPreferences,
  FinancialBreakdown,
  PlanVariant,
  PlanVariantKey,
} from '@/types';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import {
  calculateHaversineDistanceKm,
  estimateDrivingMinutes,
  estimateUberCostSAR,
} from './distanceCalculator';

/**
 * Heuristic Itinerary Scoring Function
 * Score(v) = w_vibe * M(v) + w_budget * B(v) + w_companion * C(v) - w_dist * Dist(v, prev) + Rating(v) - Penalties
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
      return -99999; // Strict exclusion of paid venues
    }
  }

  let penalties = 0;

  // 2. Category Anti-Collision Guardrail
  if (lastCategory && venue.category === lastCategory) {
    penalties += 50;
  }

  // 3. Vibe & Role Fit Score (w_vibe = 35)
  let vibeScore = 0;
  if (targetRole === 'sunset_activity') {
    if (
      venue.category === 'waterfront' ||
      venue.category === 'beach' ||
      venue.tags.includes('sunset') ||
      venue.tags.includes('sea_sunset') ||
      venue.tags.includes('free_walk')
    ) {
      vibeScore += 35;
    } else if (
      venue.category === 'cultural' ||
      venue.category === 'heritage' ||
      venue.category === 'nature_parks'
    ) {
      vibeScore += 26;
    } else {
      vibeScore += 10;
    }
  } else if (targetRole === 'coffee_snack') {
    if (
      venue.category === 'cafe' ||
      venue.tags.includes('specialty_coffee') ||
      venue.tags.includes('bakery') ||
      venue.tags.includes('coffee_dessert')
    ) {
      vibeScore += 35;
    } else if (venue.category === 'cultural' || venue.category === 'waterfront') {
      vibeScore += 20;
    }
  } else {
    // dinner_experience / night activity
    if (venue.category === 'restaurant' || venue.category === 'culinary') {
      vibeScore += 35;
    } else if (
      venue.category === 'entertainment' ||
      venue.category === 'arts_entertainment' ||
      venue.category === 'activity'
    ) {
      vibeScore += 30;
    } else if (venue.category === 'heritage' || venue.category === 'waterfront') {
      vibeScore += 22;
    }
  }

  // User Vibe Preference Affinity
  if (prefs.vibe) {
    if (venue.vibe && venue.vibe.includes(prefs.vibe as any)) {
      vibeScore += 15;
    }
    if (prefs.vibe === 'food' && (venue.category === 'restaurant' || venue.category === 'culinary')) {
      vibeScore += 10;
    }
    if (prefs.vibe === 'coffee_dessert' && venue.category === 'cafe') {
      vibeScore += 10;
    }
    if (prefs.vibe === 'beach_sunset' && (venue.category === 'waterfront' || venue.category === 'beach')) {
      vibeScore += 10;
    }
    if (prefs.vibe === 'heritage_arts' && (venue.category === 'heritage' || venue.category === 'cultural')) {
      vibeScore += 10;
    }
    if (prefs.vibe === 'gaming_challenges' && (venue.category === 'entertainment' || venue.category === 'activity')) {
      vibeScore += 10;
    }
  }

  // 4. Budget Fit Score (w_budget = 25)
  let budgetScore = 0;
  if (isFreeRequired) {
    budgetScore = 25;
  } else if (archetype === 'luxury' || prefs.budgetTier === 'luxury' || prefs.budgetTier === 'premium') {
    if (venue.priceTier === '$$$$' || venue.averageCostSAR >= 200) {
      budgetScore = 25;
    } else if (venue.priceTier === '$$$' || venue.averageCostSAR >= 100) {
      budgetScore = 18;
    } else {
      penalties += 10;
    }
  } else if (prefs.budgetTier === 'economy') {
    if (venue.averageCostSAR === 0 || venue.priceTier === 'free') {
      budgetScore = 25;
    } else if (venue.averageCostSAR <= 60) {
      budgetScore = 20;
    } else {
      penalties += 20;
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

  // 5. Companion Compatibility Score (w_companion = 20)
  let companionScore = 0;
  if (prefs.companions && venue.bestFor) {
    if (venue.bestFor.includes(prefs.companions as any)) {
      companionScore = 20;
    } else {
      companionScore = 8;
    }
  }

  // 6. Geographic Proximity & Linear Path (w_dist = 2.5 to 5.0)
  const distKm = calculateHaversineDistanceKm(
    prevCoords.lat,
    prevCoords.lng,
    venue.coordinates.lat,
    venue.coordinates.lng
  );

  const distWeight = archetype === 'fastest' ? 5.0 : 2.5;
  let geoScore = Math.max(0, 30 - distKm * distWeight);

  // Severe Backtracking / Extreme Leap Penalty (> 18km leap between North/South)
  if (distKm > 18) {
    penalties += (distKm - 18) * 8;
  }

  // 7. Rating & Popularity (w_rating = 10)
  const ratingScore = (venue.rating / 5) * 10;

  return vibeScore + budgetScore + companionScore + geoScore + ratingScore - penalties;
}

export function generateMultiPlanVariants(preferences: WizardPreferences): Itinerary {
  const { startingDistrict, budgetTier } = preferences;

  // Determine starting coordinate centroid
  let startLat = 21.6080; // Default Al-Shati / Jeddah Waterfront
  let startLng = 39.1105;

  if (startingDistrict && startingDistrict !== 'current_location' && startingDistrict !== 'all_jeddah') {
    const distObj = JEDDAH_DISTRICTS.find((d) => d.id === startingDistrict);
    if (distObj) {
      startLat = distObj.coordinates.lat;
      startLng = distObj.coordinates.lng;
    }
  } else if (preferences.userCoords) {
    startLat = preferences.userCoords.lat;
    startLng = preferences.userCoords.lng;
  }

  const startCoords = { lat: startLat, lng: startLng };

  // 1. Generate Archetype 1: Fastest & Closest (⚡ الأقرب والأسرع)
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

  // 2. Generate Archetype 2: Balanced Masterpiece (⚖️ الخطة الموزونة)
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

  // 3. Generate Archetype 3: Free Outing (0 SAR) OR VIP Luxury
  const isFreePlanMode = budgetTier === 'free' || budgetTier === 'economy' || budgetTier === 'moderate';
  const thirdVariantKey: PlanVariantKey = isFreePlanMode ? 'free' : 'luxury';

  const thirdStops = generateVariantStops(thirdVariantKey, preferences, startCoords);
  const thirdFinancials = calculateFinancials(thirdStops, 2);
  const thirdTransitTotals = calculateTransitTotals(thirdStops);

  const thirdVariant: PlanVariant = isFreePlanMode
    ? {
        id: 'free',
        titleAr: '🆓 خطة الروقان المجانية (0 ر.س)',
        titleEn: '🆓 100% Free Outing (0 SAR)',
        taglineAr: 'مسار كامل بدون أي رسوم دخول أو تكاليف إضافية (أزقة التراث، الممشى البحري، ومطل النافورة)',
        taglineEn: 'Zero-cost itinerary across open promenades, historic alleys, and fountain viewpoints',
        badgeAr: 'مجانية 100% (0 ر.س) 🆓',
        badgeEn: '100% Free (0 SAR) 🆓',
        icon: 'Sparkles',
        stops: thirdStops,
        financials: thirdFinancials,
        totalTransitMinutes: thirdTransitTotals.minutes,
        totalDistanceKm: thirdTransitTotals.km,
      }
    : {
        id: 'luxury',
        titleAr: '💎 التجربة الفخمة VIP',
        titleEn: '💎 VIP Luxury Signature',
        taglineAr: 'أرقى مطاعم الواجهة البحرية، نوادي اليخوت، والتجارب الحصرية',
        taglineEn: 'Signature marina dining, yacht club views, and high-end gastronomy',
        badgeAr: 'فخامة VIP ✨',
        badgeEn: 'VIP Luxury ✨',
        icon: 'Crown',
        stops: thirdStops,
        financials: thirdFinancials,
        totalTransitMinutes: thirdTransitTotals.minutes,
        totalDistanceKm: thirdTransitTotals.km,
      };

  const activeVariantKey: PlanVariantKey = budgetTier === 'free' ? 'free' : 'balanced';
  const activeVariantObj: PlanVariant =
    activeVariantKey === 'free' ? thirdVariant : balancedVariant;

  const districtName = getDistrictLabel(startingDistrict);

  return {
    id: `jadawel-plan-${Date.now()}`,
    titleAr: `طلعة جدة الذكية • ${districtName}`,
    titleEn: `Jeddah Smart Outing • ${districtName}`,
    descriptionAr: 'تم توليد 3 خطط متكاملة بدقة ومسار جغرافي متصل مع حساب الميزانية والتنقلات.',
    descriptionEn: 'Generated 3 distinct plans with linear geographic routing & exact SAR budget calculations.',
    createdAt: new Date().toISOString(),
    preferences,
    daysCount: 1,
    activeVariant: activeVariantKey,
    variants: {
      fastest: fastestVariant,
      balanced: balancedVariant,
      luxury: thirdVariantKey === 'luxury' ? thirdVariant : {
        ...balancedVariant,
        id: 'luxury',
        titleAr: '💎 النسخة الفخمة',
        titleEn: '💎 Luxury Edition',
        badgeAr: 'VIP',
        badgeEn: 'VIP',
        icon: 'Crown',
      },
      free: thirdVariantKey === 'free' ? thirdVariant : undefined,
    },
    stops: activeVariantObj.stops,
    financials: activeVariantObj.financials,
    summaryAr: 'اختر الخطة المناسبة لك وشاركها مع الشلة بنقرة واحدة.',
    summaryEn: 'Pick your preferred plan variant and share with friends in one click.',
  };
}

function generateVariantStops(
  archetype: 'fastest' | 'balanced' | 'luxury' | 'free',
  prefs: WizardPreferences,
  startCoords: { lat: number; lng: number }
): ItineraryStop[] {
  const timeBlocks = [
    {
      start: '16:45',
      end: '18:00',
      slotAr: '4:45 م - 6:00 م',
      slotEn: '04:45 PM - 06:00 PM',
      role: 'sunset_activity' as const,
      weatherAr: '🌅 وقت الغروب: أفضل توقيت لنسيم البحر والتقاط الصور التذكارية.',
      weatherEn: '🌅 Golden Hour: Perfect for coastal breeze and sunset photography.',
    },
    {
      start: '18:15',
      end: '19:30',
      slotAr: '6:15 م - 7:30 م',
      slotEn: '06:15 PM - 07:30 PM',
      role: 'coffee_snack' as const,
      weatherAr: '☕ استراحة الروقان: جلسة مريحة لتناول القهوة والمشروبات المنعشة.',
      weatherEn: '☕ Chill Break: Relaxing pitstop for specialty brews and treats.',
    },
    {
      start: '19:45',
      end: '22:00',
      slotAr: '7:45 م - 10:00 م',
      slotEn: '07:45 PM - 10:00 PM',
      role: 'dinner_experience' as const,
      weatherAr: '🌙 أجواء السهرة: نسمة ليلية عليلة وجلسات خارجية مضيئة.',
      weatherEn: '🌙 Night Atmosphere: Vibrant evening breeze and ambient dining.',
    },
  ];

  const stops: ItineraryStop[] = [];
  const usedIds = new Set<string>();
  let prevCoords = startCoords;
  let lastCategory: string | undefined = undefined;

  for (let idx = 0; idx < timeBlocks.length; idx++) {
    const block = timeBlocks[idx];

    // Score all available venues using heuristic scoring algorithm
    const scoredVenues = JEDDAH_PLACES.map((venue) => ({
      venue,
      score: computeVenueScore(venue, block.role, prefs, prevCoords, archetype, usedIds, lastCategory),
    })).sort((a, b) => b.score - a.score);

    // Filter candidate best place
    let bestPlace = scoredVenues[0]?.venue;

    // Fallback if strictly free
    if (archetype === 'free' || prefs.budgetTier === 'free') {
      const freeCandidates = JEDDAH_PLACES.filter((p) => p.averageCostSAR === 0 && !usedIds.has(p.id));
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
      id: `stop-${idx}-${Date.now()}-${bestPlace.id}`,
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

export function calculateFinancials(stops: ItineraryStop[], groupSize: number = 2): FinancialBreakdown {
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

export function calculateTransitTotals(stops: ItineraryStop[]): { minutes: number; km: number } {
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

function getDistrictLabel(districtId: string): string {
  if (districtId === 'all_jeddah') return 'عروس البحر الأحمر';
  if (districtId === 'current_location') return 'موقعي الحالي';
  const found = JEDDAH_DISTRICTS.find((d) => d.id === districtId);
  return found ? found.nameAr : 'جدة';
}
