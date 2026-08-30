/**
 * Calculates geographic distance (in kilometers) between two coordinates using the Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;

  // Road factor in Jeddah (urban grid and coastal curves ~ 1.30x straight line)
  return Math.round(straightDistance * 1.30 * 10) / 10;
}

/**
 * Calculates estimated driving transit time (in minutes) considering average urban traffic speeds in Jeddah.
 */
export function estimateDrivingMinutes(distanceKm: number): number {
  if (distanceKm <= 0.5) return 3; // walking or immediate neighbor
  if (distanceKm <= 3) return Math.round(distanceKm * 3.2) + 3; // short city hop: ~3-12 mins
  if (distanceKm <= 10) return Math.round(distanceKm * 2.0) + 4; // mid city: ~15-24 mins
  // Long stretch (e.g. Al-Balad to Obhur ~28km):
  return Math.round(distanceKm * 1.5) + 5; // highway + traffic: ~35-48 mins
}

/**
 * Estimates Uber / Careem ride-sharing cost in Saudi Riyals (SAR) for a given distance in Jeddah.
 * Formula: 15 SAR base + 1.8 SAR / km.
 */
export function estimateUberCostSAR(distanceKm: number, durationMinutes: number = 10): number {
  const baseFare = 15.0;
  const perKmRate = 1.8;
  const estimated = baseFare + distanceKm * perKmRate;
  return Math.max(15, Math.round(estimated));
}
