import { Itinerary, WizardPreferences } from '@/types';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { calculateFinancials } from '@/utils/plannerEngine';
import { validateSharedPlanParams } from '@/lib/validation';
import {
  calculateHaversineDistanceKm,
  estimateDrivingMinutes,
  estimateUberCostSAR,
} from '@/utils/distanceCalculator';

/**
 * Builds a universal shareable URL encoding the plan and preferences into query parameters
 */
export function buildPlanShareUrl(itinerary: Itinerary, preferences?: WizardPreferences): string {
  if (typeof window === 'undefined') return 'https://abod6911.github.io/jadawel/';

  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();

  params.set('share', '1');
  if (preferences?.startingDistrict) params.set('d', preferences.startingDistrict);
  if (preferences?.companions) params.set('c', preferences.companions);
  if (preferences?.budgetTier) params.set('b', preferences.budgetTier);
  if (preferences?.duration) params.set('t', preferences.duration);
  if (preferences?.vibe) params.set('v', preferences.vibe);

  // Stop slugs or IDs
  const stopSlugs = itinerary.stops.map((s) => s.place.slug || s.place.id);
  params.set('stops', stopSlugs.join(','));

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Reconstructs a full Itinerary object from shared URL query parameters
 */
export function reconstructPlanFromUrl(
  params: URLSearchParams
): { itinerary: Itinerary; preferences: WizardPreferences } | null {
  // Validate and sanitize URL query parameters with Zod
  const validated = validateSharedPlanParams(params);
  if (!validated) return null;

  const stopsParam = validated.stops;
  if (!stopsParam) return null;

  const slugs = stopsParam.split(',').map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) return null;

  const matchedPlaces = slugs.map((slug) => {
    return (
      JEDDAH_PLACES.find((p) => p.slug === slug || p.id === slug) ||
      JEDDAH_PLACES.find((p) => p.slug.includes(slug) || slug.includes(p.slug))
    );
  }).filter((p): p is typeof JEDDAH_PLACES[0] => Boolean(p));

  if (matchedPlaces.length === 0) return null;

  const timeSlots = [
    { start: '16:45', end: '18:15', slotAr: '4:45 م - 6:15 م', slotEn: '04:45 PM - 06:15 PM' },
    { start: '18:30', end: '19:45', slotAr: '6:30 م - 7:45 م', slotEn: '06:30 PM - 07:45 PM' },
    { start: '20:00', end: '22:30', slotAr: '8:00 م - 10:30 م', slotEn: '08:00 PM - 10:30 PM' },
    { start: '22:45', end: '00:15', slotAr: '10:45 م - 12:15 ص', slotEn: '10:45 PM - 12:15 AM' },
  ];

  const stops = matchedPlaces.map((place, idx) => {
    const slot = timeSlots[idx % timeSlots.length];
    let transit = undefined;

    if (idx > 0) {
      const prevPlace = matchedPlaces[idx - 1];
      const distKm = calculateHaversineDistanceKm(
        prevPlace.coordinates.lat,
        prevPlace.coordinates.lng,
        place.coordinates.lat,
        place.coordinates.lng
      );
      const drivingMins = estimateDrivingMinutes(distKm);
      const uberSAR = estimateUberCostSAR(distKm, drivingMins);

      transit = {
        distanceKm: Math.round(distKm * 10) / 10,
        drivingMinutes: drivingMins,
        durationMinutes: drivingMins,
        transitMode: 'car' as const,
        estimatedUberSAR: uberSAR,
        trafficLevel: drivingMins > 15 ? ('moderate' as const) : ('low' as const),
        routeDescriptionAr: `المسار الموصى به (~${drivingMins} دقيقة)`,
        routeDescriptionEn: `Recommended route (~${drivingMins} mins)`,
      };
    }

    return {
      id: `shared-stop-${idx}-${place.id}`,
      order: idx + 1,
      startTime: slot.start,
      endTime: slot.end,
      timeSlot: slot.slotAr,
      place,
      transitFromPrevious: transit,
      notesAr: `محطة مميزة موصى بها ضمن خطتك المشتركة`,
      notesEn: `Curated stop in your shared itinerary`,
      weatherConditionAr: '🌅 أجواء ساحلية رائعة ومناسبة للزيارة.',
      weatherConditionEn: '🌅 Refreshing coastal breeze.',
    };
  });

  const preferences: WizardPreferences = {
    startingDistrict: (params.get('d') as any) || 'all_jeddah',
    companions: (params.get('c') as any) || 'friends',
    budgetTier: (params.get('b') as any) || 'moderate',
    duration: (params.get('t') as any) || '4_to_6h',
    vibe: (params.get('v') as any) || 'food',
    ambience: 'open_air_beach',
    preferences: ['no_traffic'],
  };

  const financials = calculateFinancials(stops, 2);

  const totalTransitMins = stops.reduce((acc, s) => acc + (s.transitFromPrevious?.drivingMinutes || 0), 0);
  const totalDistKm = stops.reduce((acc, s) => acc + (s.transitFromPrevious?.distanceKm || 0), 0);

  const baseVariant = {
    id: 'balanced' as const,
    titleAr: `خطة جدة المشتركة (${matchedPlaces.length} محطات)`,
    titleEn: `Shared Jeddah Outing (${matchedPlaces.length} Stops)`,
    taglineAr: `مسار سياحي متكامل وموثق بين محطات جدة`,
    taglineEn: `Verified outing itinerary in Jeddah`,
    badgeAr: `خطة مشتركة 🔗`,
    badgeEn: `Shared Plan 🔗`,
    icon: 'Scale',
    stops,
    financials,
    totalTransitMinutes: totalTransitMins || 20,
    totalDistanceKm: totalDistKm || 5.0,
  };

  const itinerary: Itinerary = {
    id: `shared-plan-${Date.now()}`,
    titleAr: `خطة جدة المشتركة (${matchedPlaces.length} محطات)`,
    titleEn: `Shared Jeddah Outing (${matchedPlaces.length} Stops)`,
    descriptionAr: `مسار سياحي متكامل وموثق بين محطات جدة`,
    descriptionEn: `Verified outing itinerary in Jeddah`,
    summaryAr: `مسار سياحي متكامل وموثق بين محطات جدة`,
    summaryEn: `Verified outing itinerary in Jeddah`,
    createdAt: new Date().toISOString(),
    daysCount: 1,
    activeVariant: 'balanced',
    variants: {
      fastest: { ...baseVariant, id: 'fastest', titleAr: 'المسار السريع', titleEn: 'Fast Route', badgeAr: 'سريعة', badgeEn: 'Fast', icon: 'Zap' },
      balanced: baseVariant,
      luxury: { ...baseVariant, id: 'luxury', titleAr: 'المسار الفاخر VIP', titleEn: 'VIP Signature', badgeAr: 'VIP', badgeEn: 'VIP', icon: 'Crown' },
    },
    stops,
    financials,
    preferences,
  };

  return { itinerary, preferences };
}

/**
 * Native Web Share API caller with seamless Clipboard fallback
 */
export async function sharePlanViaWebShareOrCopy(options: {
  title: string;
  text: string;
  url: string;
  onSuccess?: () => void;
}): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      options.onSuccess?.();
      return 'shared';
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return 'failed';
      }
      // Fall through to clipboard copy
    }
  }

  // Clipboard fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(options.url);
      options.onSuccess?.();
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
