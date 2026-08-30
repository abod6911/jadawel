import { PlaceCategory } from '@/types';
import { getAssetUrl } from '@/utils/paths';

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
    return getAssetUrl(providedUrl);
  }

  let chosen = JEDDAW_IMAGE_ASSETS.waterfront;

  if (tags.includes('yacht') || tags.includes('marina')) {
    chosen = JEDDAW_IMAGE_ASSETS.yacht_marina;
  } else if (tags.includes('digital_art') || tags.includes('teamlab')) {
    chosen = JEDDAW_IMAGE_ASSETS.digital_art;
  } else if (tags.includes('specialty_coffee') || tags.includes('bakery')) {
    chosen = JEDDAW_IMAGE_ASSETS.specialty_coffee;
  } else if (tags.includes('seafood')) {
    chosen = JEDDAW_IMAGE_ASSETS.seafood;
  } else if (tags.includes('beach') || tags.includes('resort')) {
    chosen = JEDDAW_IMAGE_ASSETS.beach_sunset;
  } else if (tags.includes('gaming') || tags.includes('theme_park') || tags.includes('entertainment')) {
    chosen = JEDDAW_IMAGE_ASSETS.entertainment_gaming;
  } else {
    switch (category) {
      case 'heritage':
        chosen = JEDDAW_IMAGE_ASSETS.heritage;
        break;
      case 'waterfront':
        chosen = JEDDAW_IMAGE_ASSETS.waterfront;
        break;
      case 'culinary':
        chosen = tags.includes('fine_dining')
          ? JEDDAW_IMAGE_ASSETS.fine_dining
          : JEDDAW_IMAGE_ASSETS.specialty_coffee;
        break;
      case 'arts_entertainment':
        chosen = JEDDAW_IMAGE_ASSETS.digital_art;
        break;
      case 'beach_resorts':
        chosen = JEDDAW_IMAGE_ASSETS.beach_sunset;
        break;
      case 'nature_parks':
        chosen = JEDDAW_IMAGE_ASSETS.entertainment_gaming;
        break;
      default:
        chosen = JEDDAW_IMAGE_ASSETS.waterfront;
        break;
    }
  }

  return getAssetUrl(chosen);
}
