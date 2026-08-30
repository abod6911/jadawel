export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';
export type TimeSlot = string;

export type JeddahDistrict = 
  | 'Al-Balad' | 'Al-Rawdah' | 'Al-Shati' | 'Obhur Al-Shamaliyah' 
  | 'Al-Hamra' | 'Al-Zahra' | 'Al-Salamah' | 'Al-Andalus' | 'Jeddah Waterfront';

export type DistrictId =
  | 'all_jeddah'
  | 'al-balad'
  | 'al-rawdah'
  | 'al-zahra'
  | 'al-shati'
  | 'obhur'
  | 'al-hamra'
  | 'al-salamah'
  | 'al-andalus';

export type PlaceCategory =
  | 'restaurant'
  | 'cafe'
  | 'activity'
  | 'cultural'
  | 'beach'
  | 'entertainment'
  | 'heritage'
  | 'waterfront'
  | 'culinary'
  | 'arts_entertainment'
  | 'nature_parks'
  | 'beach_resorts';

export type PriceTier = 'free' | '$' | '$$' | '$$$' | '$$$$';

export type BestTimeToVisit = 'morning' | 'midday_indoor' | 'sunset_golden_hour' | 'night' | 'anytime';

export type CompanionType = 'solo' | 'couple' | 'couples' | 'friends' | 'family' | 'kids' | 'business';

export type DurationOption =
  | 'under_2h'
  | '2_to_4h'
  | '4_to_6h'
  | 'half_day_night'
  | 'full_day';

export type VibeType =
  | 'chill'
  | 'food'
  | 'adventure'
  | 'romantic'
  | 'heritage'
  | 'entertainment'
  | 'sea_sunset'
  | 'surprise'
  | 'luxury'
  | 'coffee_dessert'
  | 'beach_sunset'
  | 'gaming_challenges'
  | 'calm_nature'
  | 'heritage_arts'
  | 'free_walk'
  | 'surprise_me';

export type AmbienceType =
  | 'ac_indoor'
  | 'open_air_beach'
  | 'mixed';

export type BudgetTier = 'free' | 'budget' | 'economy' | 'moderate' | 'premium' | 'luxury';

export interface Place {
  id: string;
  slug: string;
  name?: { ar: string; en: string };
  nameAr: string;
  nameEn: string;
  district: JeddahDistrict | DistrictId | string;
  districtNameAr: string;
  districtNameEn: string;
  category: PlaceCategory;
  descriptionAr: string;
  descriptionEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priceTier: PriceTier;
  averageCostSAR: number;
  isFree?: boolean;
  durationMinutes?: number;
  dwellTimeMinutes: number;
  bestTime: BestTimeToVisit;
  tags: string[];
  features: {
    isOpenNow?: boolean;
    freeEntry?: boolean;
    familyFriendly?: boolean;
    indoorAC?: boolean;
    seaView?: boolean;
    outdoorSeating?: boolean;
    requiresBooking?: boolean;
    heritageUnesco?: boolean;
  };
  rating: number;
  reviewCount?: number;
  reviewsCount: number;
  photos?: string[];
  imageUrl: string;
  galleryUrls?: string[];
  indoorOutdoor?: 'indoor' | 'outdoor' | 'hybrid';
  bestFor?: CompanionType[];
  vibe?: VibeType[];
  openingHours?: { open: string; close: string } | string;
  openingHoursAr: string;
  openingHoursEn: string;
  googleMapsUrl: string;
  insiderTipAr?: string;
  insiderTipEn?: string;
  aiReasoning?: { ar: string; en: string };
  isPartnerDeal?: boolean;
  dealDiscount?: string;
}

export interface District {
  id: DistrictId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  vibeAr: string;
  vibeEn: string;
  iconName: string;
}

export interface TransitLeg {
  fromPlaceId?: string;
  toPlaceId?: string;
  drivingMinutes: number;
  durationMinutes?: number;
  distanceKm: number;
  transitMode?: string;
  estimatedUberSAR: number;
  trafficLevel?: string;
  routeDescriptionAr?: string;
  routeDescriptionEn?: string;
}

export interface ItineraryStop {
  id: string;
  order: number;
  stopOrder?: number;
  dayNumber?: number;
  timeSlot: string;
  startTime: string;
  endTime: string;
  place: Place;
  status?: 'pending' | 'arrived' | 'skipped' | 'completed';
  transitFromPrevious?: TransitLeg;
  transitTimeToNextMinutes?: number;
  transitDistanceToNextKm?: number;
  estimatedCostSAR?: number;
  weatherNotice?: {
    type: 'golden_hour' | 'indoor_midday' | 'sea_breeze' | 'night_atmosphere';
    textAr: string;
    textEn: string;
  };
  isCustom?: boolean;
}

export interface GeneratedPlan {
  id: string;
  title: { ar: string; en: string };
  archetype: 'fast_closest' | 'balanced_optimal' | 'luxury_signature';
  totalDurationMinutes: number;
  totalCostSAR: number;
  totalDistanceKm: number;
  companion: CompanionType;
  stops: ItineraryStop[];
  createdAt: string;
}

export interface FinancialBreakdown {
  totalSAR?: number;
  totalGroupSAR?: number;
  totalPerPersonSAR: number;
  currency?: string;
  foodAndBeverageSAR?: number;
  activitiesAndTicketsSAR?: number;
  estimatedTransitSAR?: number;
  transitEstimatedSAR?: number;
  emergencyBufferSAR?: number;
  groupSize?: number;
  breakdownByStop?: {
    stopId: string;
    placeNameAr: string;
    placeNameEn: string;
    costSAR: number;
    isFree: boolean;
  }[];
}

export interface WizardPreferences {
  startingDistrict: DistrictId | 'current_location';
  companions: CompanionType;
  duration: DurationOption;
  vibe: VibeType;
  ambience: AmbienceType;
  budgetTier: BudgetTier;
  preferences: string[]; // 'no_traffic', 'easy_parking', 'short_drive', 'no_booking'
  userCoords?: {
    lat: number;
    lng: number;
  };
}

export type PlanVariantKey = 'fastest' | 'balanced' | 'luxury' | 'free';

export interface PlanVariant {
  id: PlanVariantKey;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  badgeAr: string;
  badgeEn: string;
  icon: string;
  stops: ItineraryStop[];
  financials: FinancialBreakdown;
  totalTransitMinutes: number;
  totalDistanceKm: number;
}

export interface Itinerary {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  createdAt: string;
  preferences: WizardPreferences;
  daysCount: number;
  activeVariant: PlanVariantKey;
  variants: {
    [key in PlanVariantKey]?: PlanVariant;
  } & {
    fastest: PlanVariant;
    balanced: PlanVariant;
    luxury: PlanVariant;
    free?: PlanVariant;
  };
  stops: ItineraryStop[];
  financials: FinancialBreakdown;
  summaryAr: string;
  summaryEn: string;
}

export interface CuratedPlan {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr: string;
  badgeEn: string;
  durationDays: number;
  durationHoursTextAr: string;
  durationHoursTextEn: string;
  estimatedCostSAR: number;
  vibe: string;
  heroImage: string;
  highlightsAr: string[];
  highlightsEn: string[];
  startingDistrict: string;
  placesIds: string[];
}
