import { create } from 'zustand';
import {
  Itinerary,
  ItineraryStop,
  Place,
  Language,
  Theme,
  WizardPreferences,
  PlanVariant,
  PlanVariantKey,
} from '@/types';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { CURATED_PLANS } from '@/data/curated-plans';
import {
  generateMultiPlanVariants,
  calculateFinancials,
} from '@/utils/plannerEngine';
import {
  calculateHaversineDistanceKm,
  estimateDrivingMinutes,
  estimateUberCostSAR,
} from '@/utils/distanceCalculator';

interface ItineraryState {
  // App state
  language: Language;
  theme: Theme;
  activeNavTab: 'home' | 'quick-plan' | 'timeline' | 'explore' | 'curated';

  // Itinerary & Variants
  currentItinerary: Itinerary | null;
  activeVariant: PlanVariantKey;
  savedItineraries: [];
  favoritePlaceIds: string[];

  // Wizard state (7 steps)
  wizardStep: number;
  wizardPreferences: WizardPreferences;
  isGeneratingPlan: boolean;

  // Live Outing Mode
  isLiveOutingOpen: boolean;
  activeLiveStopIndex: number;

  // Modals
  isSplitBillOpen: boolean;
  isVotingModalOpen: boolean;
  selectedPlaceForModal: Place | null;
  stopToSwap: ItineraryStop | null;

  // Actions
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setActiveNavTab: (tab: 'home' | 'quick-plan' | 'timeline' | 'explore' | 'curated') => void;

  setWizardStep: (step: number) => void;
  updateWizardPreferences: (partial: Partial<WizardPreferences>) => void;
  generatePlanFromPreferences: () => void;
  setActiveVariant: (variant: PlanVariantKey) => void;

  // Live Outing Controls
  openLiveOuting: () => void;
  closeLiveOuting: () => void;
  markStopStatus: (stopId: string, status: 'arrived' | 'skipped' | 'completed') => void;
  nextLiveStop: () => void;
  prevLiveStop: () => void;

  // Modals
  setIsSplitBillOpen: (open: boolean) => void;
  setIsVotingModalOpen: (open: boolean) => void;
  setSelectedPlaceForModal: (place: Place | null) => void;

  // Stop Actions
  openSwapModal: (stop: ItineraryStop) => void;
  closeSwapModal: () => void;
  executeSwapStop: (oldStopId: string, newPlace: Place) => void;
  moveStopUp: (stopId: string) => void;
  moveStopDown: (stopId: string) => void;
  removeStop: (stopId: string) => void;
  addPlaceToItinerary: (place: Place) => void;

  loadCuratedPlan: (curatedId: string) => void;
  toggleFavoritePlace: (placeId: string) => void;
}

const defaultPreferences: WizardPreferences = {
  startingDistrict: 'all_jeddah',
  companions: 'friends',
  duration: '4_to_6h',
  vibe: 'food',
  ambience: 'open_air_beach',
  budgetTier: 'moderate',
  preferences: ['no_traffic', 'easy_parking'],
};

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  language: 'ar',
  theme: 'dark',
  activeNavTab: 'home',

  currentItinerary: null,
  activeVariant: 'balanced',
  savedItineraries: [],
  favoritePlaceIds: ['historic-al-balad', 'jeddah-yacht-club', 'twina-seafood-lounge'],

  wizardStep: 0,
  wizardPreferences: defaultPreferences,
  isGeneratingPlan: false,

  isLiveOutingOpen: false,
  activeLiveStopIndex: 0,

  isSplitBillOpen: false,
  isVotingModalOpen: false,
  selectedPlaceForModal: null,
  stopToSwap: null,

  setLanguage: (language) => {
    set({ language });
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  },

  toggleLanguage: () => {
    const next = get().language === 'ar' ? 'en' : 'ar';
    get().setLanguage(next);
  },

  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setActiveNavTab: (activeNavTab) => set({ activeNavTab }),
  setWizardStep: (wizardStep) => set({ wizardStep }),

  updateWizardPreferences: (partial) => {
    set((state) => ({
      wizardPreferences: { ...state.wizardPreferences, ...partial },
    }));
  },

  generatePlanFromPreferences: () => {
    set({ isGeneratingPlan: true });
    setTimeout(() => {
      const plan = generateMultiPlanVariants(get().wizardPreferences);
      set({
        currentItinerary: plan,
        activeVariant: plan.activeVariant,
        isGeneratingPlan: false,
        activeNavTab: 'timeline',
      });
    }, 600);
  },

  setActiveVariant: (variantKey) => {
    const current = get().currentItinerary;
    if (!current) return;
    const variantObj = current.variants[variantKey] || current.variants.balanced;
    if (!variantObj) return;
    set({
      activeVariant: variantKey,
      currentItinerary: {
        ...current,
        activeVariant: variantKey,
        stops: variantObj.stops,
        financials: variantObj.financials,
      },
    });
  },

  // Live Outing Mode
  openLiveOuting: () => set({ isLiveOutingOpen: true, activeLiveStopIndex: 0 }),
  closeLiveOuting: () => set({ isLiveOutingOpen: false }),

  markStopStatus: (stopId, status) => {
    const current = get().currentItinerary;
    if (!current) return;
    const updatedStops = current.stops.map((s) => (s.id === stopId ? { ...s, status } : s));
    set({
      currentItinerary: {
        ...current,
        stops: updatedStops,
      },
    });
  },

  nextLiveStop: () => {
    const current = get().currentItinerary;
    if (!current) return;
    set((state) => ({
      activeLiveStopIndex: Math.min(current.stops.length - 1, state.activeLiveStopIndex + 1),
    }));
  },

  prevLiveStop: () => {
    set((state) => ({
      activeLiveStopIndex: Math.max(0, state.activeLiveStopIndex - 1),
    }));
  },

  setIsSplitBillOpen: (isSplitBillOpen) => set({ isSplitBillOpen }),
  setIsVotingModalOpen: (isVotingModalOpen) => set({ isVotingModalOpen }),
  setSelectedPlaceForModal: (selectedPlaceForModal) => set({ selectedPlaceForModal }),

  openSwapModal: (stopToSwap) => set({ stopToSwap }),
  closeSwapModal: () => set({ stopToSwap: null }),

  executeSwapStop: (oldStopId, newPlace) => {
    const current = get().currentItinerary;
    if (!current) return;
    const newStops = current.stops.map((s) => (s.id === oldStopId ? { ...s, place: newPlace } : s));
    const financials = calculateFinancials(newStops, current.financials.groupSize);
    set({
      currentItinerary: {
        ...current,
        stops: newStops,
        financials,
      },
      stopToSwap: null,
    });
  },

  moveStopUp: (stopId) => {
    const it = get().currentItinerary;
    if (!it) return;
    const idx = it.stops.findIndex((s) => s.id === stopId);
    if (idx > 0) {
      const arr = [...it.stops];
      const [moved] = arr.splice(idx, 1);
      arr.splice(idx - 1, 0, moved);
      const recalculated = arr.map((s, i) => ({ ...s, order: i + 1 }));
      set({ currentItinerary: { ...it, stops: recalculated } });
    }
  },

  moveStopDown: (stopId) => {
    const it = get().currentItinerary;
    if (!it) return;
    const idx = it.stops.findIndex((s) => s.id === stopId);
    if (idx >= 0 && idx < it.stops.length - 1) {
      const arr = [...it.stops];
      const [moved] = arr.splice(idx, 1);
      arr.splice(idx + 1, 0, moved);
      const recalculated = arr.map((s, i) => ({ ...s, order: i + 1 }));
      set({ currentItinerary: { ...it, stops: recalculated } });
    }
  },

  removeStop: (stopId) => {
    const it = get().currentItinerary;
    if (!it) return;
    const remaining = it.stops.filter((s) => s.id !== stopId).map((s, i) => ({ ...s, order: i + 1 }));
    set({
      currentItinerary: {
        ...it,
        stops: remaining,
        financials: calculateFinancials(remaining, it.financials.groupSize),
      },
    });
  },

  addPlaceToItinerary: (place) => {
    const it = get().currentItinerary;
    if (!it) {
      const plan = generateMultiPlanVariants({
        ...defaultPreferences,
        startingDistrict: place.district as any,
      });
      set({ currentItinerary: plan, activeNavTab: 'timeline' });
      return;
    }
    const newStop: ItineraryStop = {
      id: `custom-${Date.now()}-${place.id}`,
      order: it.stops.length + 1,
      dayNumber: 1,
      timeSlot: '09:00 PM - 10:30 PM',
      startTime: '21:00',
      endTime: '22:30',
      place,
      isCustom: true,
    };
    const newStops = [...it.stops, newStop];
    set({
      currentItinerary: {
        ...it,
        stops: newStops,
        financials: calculateFinancials(newStops, it.financials.groupSize),
      },
    });
  },

  loadCuratedPlan: (curatedId) => {
    const curated = CURATED_PLANS.find((c) => c.id === curatedId);
    if (!curated) return;
    const places = curated.placesIds
      .map((id) => JEDDAH_PLACES.find((p) => p.id === id))
      .filter((p): p is Place => !!p);

    const stops: ItineraryStop[] = places.map((place, idx) => ({
      id: `curated-${curated.id}-${idx}`,
      order: idx + 1,
      dayNumber: 1,
      timeSlot: `${(5 + idx * 2).toString().padStart(2, '0')}:00 PM - ${(6 + idx * 2).toString().padStart(2, '0')}:30 PM`,
      startTime: `${17 + idx * 2}:00`,
      endTime: `${18 + idx * 2}:30`,
      place,
    }));

    const financials = calculateFinancials(stops, 2);

    const plan: Itinerary = {
      id: `plan-curated-${curated.id}`,
      titleAr: curated.titleAr,
      titleEn: curated.titleEn,
      descriptionAr: curated.descriptionAr,
      descriptionEn: curated.descriptionEn,
      createdAt: new Date().toISOString(),
      preferences: defaultPreferences,
      daysCount: curated.durationDays,
      activeVariant: 'balanced',
      variants: {
        fastest: {
          id: 'fastest',
          titleAr: '⚡ الأقرب والأسرع',
          titleEn: '⚡ Shortest Transit',
          taglineAr: 'خطة جاهزة سريعة',
          taglineEn: 'Fast curated plan',
          badgeAr: 'سريعة',
          badgeEn: 'Fast',
          icon: 'Zap',
          stops,
          financials,
          totalTransitMinutes: 25,
          totalDistanceKm: 7.5,
        },
        balanced: {
          id: 'balanced',
          titleAr: curated.titleAr,
          titleEn: curated.titleEn,
          taglineAr: curated.taglineAr,
          taglineEn: curated.taglineEn,
          badgeAr: curated.badgeAr,
          badgeEn: curated.badgeEn,
          icon: 'Scale',
          stops,
          financials,
          totalTransitMinutes: 30,
          totalDistanceKm: 9.2,
        },
        luxury: {
          id: 'luxury',
          titleAr: '💎 النسخة الفخمة',
          titleEn: '💎 Luxury Edition',
          taglineAr: 'ترقية فاخرة لنفس المسار',
          taglineEn: 'Luxury upgrade for this route',
          badgeAr: 'فخامة VIP',
          badgeEn: 'VIP Luxury',
          icon: 'Crown',
          stops,
          financials,
          totalTransitMinutes: 35,
          totalDistanceKm: 12.0,
        },
      },
      stops,
      financials,
      summaryAr: curated.taglineAr,
      summaryEn: curated.taglineEn,
    };

    set({ currentItinerary: plan, activeNavTab: 'timeline' });
  },

  toggleFavoritePlace: (placeId) => {
    set((state) => ({
      favoritePlaceIds: state.favoritePlaceIds.includes(placeId)
        ? state.favoritePlaceIds.filter((id) => id !== placeId)
        : [...state.favoritePlaceIds, placeId],
    }));
  },
}));
