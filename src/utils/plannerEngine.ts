import {
  Itinerary,
  ItineraryStop,
  Place,
  WizardPreferences,
  FinancialBreakdown,
  PlanVariant,
} from '@/types';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import {
  calculateHaversineDistanceKm,
  estimateDrivingMinutes,
  estimateUberCostSAR,
} from './distanceCalculator';

/**
 * Heuristic Itinerary Algorithm (The Planning Engine)
 * Computes deterministic score S(v, u) = w1 * MoodFit + w2 * BudgetFit + w3 * GeoProximity + w4 * Rating - Penalty
 */
function computeVenueScore(
  venue: Place,
  targetRole: 'sunset_activity' | 'coffee_snack' | 'dinner_experience',
  prefs: WizardPreferences,
  prevCoords: { lat: number; lng: number },
  variantType: 'fastest' | 'balanced' | 'luxury',
  usedPlaceIds: Set<string>,
  lastCategory?: string
): number {
  if (usedPlaceIds.has(venue.id)) return -9999;

  // Penalty for consecutive identical category (Anti-repetition guardrail)
  let penalty = 0;
  if (lastCategory && venue.category === lastCategory) {
    penalty += 45;
  }

  // 1. Mood & Role Fit (w1 = 35)
  let moodScore = 0;
  if (targetRole === 'sunset_activity') {
    if (venue.category === 'waterfront' || venue.category === 'beach' || venue.tags.includes('seaview') || venue.tags.includes('sunset')) {
      moodScore += 35;
    } else if (venue.category === 'cultural' || venue.category === 'heritage' || venue.category === 'arts_entertainment') {
      moodScore += 25;
    } else {
      moodScore += 10;
    }
  } else if (targetRole === 'coffee_snack') {
    if (venue.category === 'cafe' || venue.tags.includes('specialty_coffee') || venue.tags.includes('bakery')) {
      moodScore += 35;
    } else if (venue.category === 'cultural' || venue.category === 'waterfront') {
      moodScore += 18;
    }
  } else {
    // dinner_experience
    if (venue.category === 'restaurant' || venue.category === 'culinary') {
      moodScore += 35;
    } else if (venue.category === 'entertainment' || venue.category === 'arts_entertainment') {
      moodScore += 22;
    }
  }

  // Vibe preference affinity
  if (prefs.vibe && venue.vibe && venue.vibe.includes(prefs.vibe as any)) {
    moodScore += 15;
  }

  // 2. Budget Fit (w2 = 25)
  let budgetScore = 0;
  if (variantType === 'luxury' || prefs.budgetTier === 'luxury') {
    if (venue.priceTier === '$$$$' || venue.averageCostSAR >= 180) budgetScore += 25;
    else if (venue.priceTier === '$$$') budgetScore += 18;
  } else if (prefs.budgetTier === 'economy') {
    if (venue.priceTier === 'free' || venue.averageCostSAR <= 50) budgetScore += 25;
    else if (venue.priceTier === '$' || venue.averageCostSAR <= 90) budgetScore += 15;
    else penalty += 20;
  } else {
    // Moderate / Premium
    if (venue.averageCostSAR > 0 && venue.averageCostSAR <= 180) budgetScore += 25;
    else budgetScore += 15;
  }

  // 3. Geographic Proximity & Linear Path (w3 = 30)
  const distKm = calculateHaversineDistanceKm(prevCoords.lat, prevCoords.lng, venue.coordinates.lat, venue.coordinates.lng);
  let geoScore = Math.max(0, 30 - distKm * 2.2);

  // Severe penalty for zigzagging across distant extremes (e.g. Al-Balad to Obhur > 25km in single leap)
  if (distKm > 22) {
    penalty += (distKm - 22) * 4;
  }

  // 4. Rating & Popularity (w4 = 10)
  const ratingScore = (venue.rating / 5) * 10;

  return moodScore + budgetScore + geoScore + ratingScore - penalty;
}

export function generateMultiPlanVariants(preferences: WizardPreferences): Itinerary {
  const { startingDistrict } = preferences;

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

  // 1. Generate Variant A: Fastest & Closest (⚡ الأقرب والأسرع)
  const fastestStops = generateVariantStops('fastest', preferences, startCoords);
  const fastestFinancials = calculateFinancials(fastestStops, 2);
  const fastestTransitTotals = calculateTransitTotals(fastestStops);

  const fastestVariant: PlanVariant = {
    id: 'fastest',
    titleAr: '⚡ الأقرب والأسرع',
    titleEn: '⚡ Shortest Transit & Proximity',
    taglineAr: 'مسار متقارب جغرافياً يوفّر وقت المشاوير وزحام الطرق',
    taglineEn: 'Optimized to minimize driving time with tightly clustered venues',
    badgeAr: 'أقل وقت تنقل (~20 دقيقة)',
    badgeEn: 'Lowest Transit (~20 mins)',
    icon: 'Zap',
    stops: fastestStops,
    financials: fastestFinancials,
    totalTransitMinutes: fastestTransitTotals.minutes,
    totalDistanceKm: fastestTransitTotals.km,
  };

  // 2. Generate Variant B: Balanced (⚖️ الخطة الموزونة)
  const balancedStops = generateVariantStops('balanced', preferences, startCoords);
  const balancedFinancials = calculateFinancials(balancedStops, 2);
  const balancedTransitTotals = calculateTransitTotals(balancedStops);

  const balancedVariant: PlanVariant = {
    id: 'balanced',
    titleAr: '⚖️ الخطة الموزونة',
    titleEn: '⚖️ The Balanced Experience',
    taglineAr: 'المزيج المثالي بين القهوة، الترفيه، وأجواء غروب البحر',
    taglineEn: 'The ideal mix of specialty brews, cultural sights, and sunset vibes',
    badgeAr: 'الخيار الموصى به ⭐',
    badgeEn: 'Recommended Choice ⭐',
    icon: 'Scale',
    stops: balancedStops,
    financials: balancedFinancials,
    totalTransitMinutes: balancedTransitTotals.minutes,
    totalDistanceKm: balancedTransitTotals.km,
  };

  // 3. Generate Variant C: Luxury & Signature (💎 التجربة الفخمة)
  const luxuryStops = generateVariantStops('luxury', preferences, startCoords);
  const luxuryFinancials = calculateFinancials(luxuryStops, 2);
  const luxuryTransitTotals = calculateTransitTotals(luxuryStops);

  const luxuryVariant: PlanVariant = {
    id: 'luxury',
    titleAr: '💎 التجربة الفخمة',
    titleEn: '💎 Luxury & VIP Signature',
    taglineAr: 'أرقى مطاعم الواجهة البحرية، المارينا، والتجارب الحصرية',
    taglineEn: 'Signature marina dining, yacht views, and high-end atmospheres',
    badgeAr: 'تجربة VIP ✨',
    badgeEn: 'VIP Luxury ✨',
    icon: 'Crown',
    stops: luxuryStops,
    financials: luxuryFinancials,
    totalTransitMinutes: luxuryTransitTotals.minutes,
    totalDistanceKm: luxuryTransitTotals.km,
  };

  const activeVariant = balancedVariant;
  const districtName = getDistrictLabel(startingDistrict);

  return {
    id: `jadawel-plan-${Date.now()}`,
    titleAr: `طلعة جدة الذكية • ${districtName}`,
    titleEn: `Jeddah Smart Outing • ${districtName}`,
    descriptionAr: 'تم توليد 3 خطط متكاملة بدقة الدقيقة وحساب الميزانية بالريال السعودي وبدون مشاوير رايحة جاية.',
    descriptionEn: 'Generated 3 distinct plans with linear geographic routing & exact SAR budget calculations.',
    createdAt: new Date().toISOString(),
    preferences,
    daysCount: 1,
    activeVariant: 'balanced',
    variants: {
      fastest: fastestVariant,
      balanced: balancedVariant,
      luxury: luxuryVariant,
    },
    stops: activeVariant.stops,
    financials: activeVariant.financials,
    summaryAr: 'اختر الخطة المناسبة لك وشاركها مع الشلة بنقرة واحدة.',
    summaryEn: 'Pick your preferred plan variant and share with friends in one click.',
  };
}

function generateVariantStops(
  variantType: 'fastest' | 'balanced' | 'luxury',
  prefs: WizardPreferences,
  startCoords: { lat: number; lng: number }
): ItineraryStop[] {
  const timeBlocks = [
    { start: '17:00', end: '18:30', slotAr: '5:00 م - 6:30 م', slotEn: '5:00 PM - 6:30 PM', role: 'sunset_activity' as const },
    { start: '18:45', end: '20:00', slotAr: '6:45 م - 8:00 م', slotEn: '6:45 PM - 8:00 PM', role: 'coffee_snack' as const },
    { start: '20:30', end: '22:30', slotAr: '8:30 م - 10:30 م', slotEn: '8:30 PM - 10:30 PM', role: 'dinner_experience' as const },
  ];

  const stops: ItineraryStop[] = [];
  const usedIds = new Set<string>();
  let prevCoords = startCoords;
  let lastCategory: string | undefined = undefined;

  for (let idx = 0; idx < timeBlocks.length; idx++) {
    const block = timeBlocks[idx];

    // Score all available venues using heuristic scoring function
    const scoredVenues = JEDDAH_PLACES.map((venue) => ({
      venue,
      score: computeVenueScore(venue, block.role, prefs, prevCoords, variantType, usedIds, lastCategory),
    })).sort((a, b) => b.score - a.score);

    // Multi-pass fallback: pick highest scoring candidate
    let bestPlace = scoredVenues[0]?.venue;

    // Absolute fallback if exhausted
    if (!bestPlace || usedIds.has(bestPlace.id)) {
      bestPlace = JEDDAH_PLACES.find((p) => !usedIds.has(p.id)) || JEDDAH_PLACES[idx % JEDDAH_PLACES.length];
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

    let weatherNotice: ItineraryStop['weatherNotice'] = undefined;
    if (idx === 0) {
      weatherNotice = {
        type: 'golden_hour',
        textAr: '🌅 روقان الغروب: أفضل وقت لتأمل البحر الأحمر والتقاط الصور التذكارية.',
        textEn: '🌅 Golden Hour: Ideal time for Red Sea sunset views and photos.',
      };
    } else if (idx === 2) {
      weatherNotice = {
        type: 'night_atmosphere',
        textAr: '🌙 أجواء السهرة: نسيم عليل وطاولات خارجية مضيئة.',
        textEn: '🌙 Evening Vibe: Crisp ocean breeze and ambient lighting.',
      };
    }

    const stop: ItineraryStop = {
      id: `stop-${idx}-${Date.now()}`,
      order: idx + 1,
      place: bestPlace,
      startTime: block.start,
      endTime: block.end,
      timeSlot: block.slotAr,
      weatherNotice,
      transitFromPrevious: idx > 0 ? {
        fromPlaceId: stops[idx - 1].place.id,
        toPlaceId: bestPlace.id,
        distanceKm: Math.round(distKm * 10) / 10,
        drivingMinutes: drivingMins,
        durationMinutes: drivingMins,
        transitMode: 'car',
        estimatedUberSAR: uberSAR,
        trafficLevel: drivingMins > 20 ? 'moderate' : 'low',
        routeDescriptionAr: `المسار المباشر عبر شوارع جدة الرئيسية (~${drivingMins} دقيقة)`,
        routeDescriptionEn: `Direct route via main roads (~${drivingMins} mins)`,
      } : undefined,
    };

    stops.push(stop);
    prevCoords = bestPlace.coordinates;
  }

  return stops;
}

export function calculateFinancials(stops: ItineraryStop[], groupSize: number = 2): FinancialBreakdown {
  let placesCost = 0;
  let transitCost = 0;

  stops.forEach((s) => {
    placesCost += s.place.averageCostSAR;
    if (s.transitFromPrevious) {
      transitCost += s.transitFromPrevious.estimatedUberSAR;
    }
  });

  const buffer = Math.round((placesCost + transitCost) * 0.1);
  const totalSAR = placesCost + transitCost + buffer;
  const totalPerPersonSAR = Math.max(35, Math.round(totalSAR / groupSize));

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
    minutes: Math.max(18, minutes),
    km: Math.round(km * 10) / 10,
  };
}

function getDistrictLabel(districtId: string): string {
  if (districtId === 'all_jeddah') return 'عروس البحر الأحمر';
  if (districtId === 'current_location') return 'موقعي الحالي';
  const found = JEDDAH_DISTRICTS.find((d) => d.id === districtId);
  return found ? found.nameAr : 'جدة';
}
