import { PlaceCategory } from '@/types';

export const JEDDAW_IMAGE_ASSETS = {
  heritage: '/images/places/historic-al-balad.jpg',
  waterfront: '/images/places/north-corniche.jpg',
  specialty_coffee: '/images/places/medd-cafe.jpg',
  fine_dining: '/images/places/san-carlo.jpg',
  seafood: '/images/places/twina-seafood.jpg',
  beach_sunset: '/images/places/indigo-beach.jpg',
  entertainment_gaming: '/images/places/al-shallal.jpg',
  yacht_marina: '/images/places/jeddah-yacht-club.jpg',
  digital_art: '/images/places/teamlab-borderless.jpg',
  fountain: '/images/places/king-fahd-fountain.jpg',
  hayy_jameel: '/images/places/hayy-jameel.jpg',
  nassif_house: '/images/places/nassif-house.jpg',
  tayebat_museum: '/images/places/tayebat-museum.jpg',
};

/**
 * Returns a high-res image URL or appropriate fallback based on place category & tags.
 */
export function resolvePlaceImageUrl(
  category: PlaceCategory,
  tags: string[] = [],
  providedUrl?: string
): string {
  if (providedUrl && (providedUrl.startsWith('/') || providedUrl.startsWith('http'))) {
    return providedUrl;
  }

  if (tags.includes('yacht') || tags.includes('marina')) {
    return JEDDAW_IMAGE_ASSETS.yacht_marina;
  }
  if (tags.includes('digital_art') || tags.includes('teamlab')) {
    return JEDDAW_IMAGE_ASSETS.digital_art;
  }
  if (tags.includes('specialty_coffee') || tags.includes('bakery')) {
    return JEDDAW_IMAGE_ASSETS.specialty_coffee;
  }
  if (tags.includes('seafood')) {
    return JEDDAW_IMAGE_ASSETS.seafood;
  }
  if (tags.includes('beach') || tags.includes('resort')) {
    return JEDDAW_IMAGE_ASSETS.beach_sunset;
  }
  if (tags.includes('gaming') || tags.includes('theme_park') || tags.includes('entertainment')) {
    return JEDDAW_IMAGE_ASSETS.entertainment_gaming;
  }

  switch (category) {
    case 'heritage':
      return JEDDAW_IMAGE_ASSETS.heritage;
    case 'waterfront':
      return JEDDAW_IMAGE_ASSETS.waterfront;
    case 'culinary':
      return tags.includes('fine_dining')
        ? JEDDAW_IMAGE_ASSETS.fine_dining
        : JEDDAW_IMAGE_ASSETS.specialty_coffee;
    case 'arts_entertainment':
      return JEDDAW_IMAGE_ASSETS.digital_art;
    case 'beach_resorts':
      return JEDDAW_IMAGE_ASSETS.beach_sunset;
    case 'nature_parks':
      return JEDDAW_IMAGE_ASSETS.entertainment_gaming;
    default:
      return JEDDAW_IMAGE_ASSETS.waterfront;
  }
}
