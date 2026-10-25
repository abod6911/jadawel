/**
 * Navigation & Deep-Linking Utility for Jeddah Field Outings
 * Generates universal deep links for Uber, Apple Maps, and Google Maps.
 */

/**
 * Generates a universal deep link to Uber with pre-filled destination
 * Works on mobile (opens Uber app if installed, or web if not) and desktop.
 */
export function generateUberDeepLink(
  lat: number,
  lng: number,
  venueName: string
): string {
  const cleanName = encodeURIComponent(venueName.trim());
  return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${cleanName}`;
}

/**
 * Detects whether the current client is running on an iOS device (iPhone/iPad)
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Generates a smart navigation deep link:
 * - On iOS: Apple Maps (maps.apple.com / maps://)
 * - On Android & Desktop: Google Maps Directions API
 */
export function generateMapsNavigationLink(
  lat: number,
  lng: number,
  venueName?: string
): string {
  const cleanName = venueName ? encodeURIComponent(venueName.trim()) : '';

  if (isIOSDevice()) {
    // Apple Maps Directions format
    return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d&q=${cleanName || `${lat},${lng}`}`;
  }

  // Google Maps Directions standard format
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${
    cleanName ? `&destination_place_id=${cleanName}` : ''
  }`;
}

/**
 * Direct launcher helper for Uber
 */
export function openUberRide(lat: number, lng: number, venueName: string): void {
  const link = generateUberDeepLink(lat, lng, venueName);
  if (typeof window !== 'undefined') {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Direct launcher helper for Turn-by-Turn Navigation
 */
export function openTurnByTurnNavigation(
  lat: number,
  lng: number,
  venueName?: string
): void {
  const link = generateMapsNavigationLink(lat, lng, venueName);
  if (typeof window !== 'undefined') {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
