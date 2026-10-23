import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Itinerary,
  ItineraryStop,
  Place,
  Language,
  Theme,
  WizardPreferences,
  PlanVariantKey,
  SavedPlan,
} from '@/types';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { CURATED_PLANS } from '@/data/curated-plans';
import {
  generateMultiPlanVariants,
  calculateFinancials,
  normalizeDistrictId,
} from '@/utils/plannerEngine';
import { AtmospherePhase } from '@/utils/atmosphereEngine';

interface ItineraryState {
  // Global App State
  language: Language;
  theme: Theme;
  activeNavTab: 'home' | 'quick-plan' | 'timeline' | 'explore' | 'curated';
  atmospherePhase: AtmospherePhase | 'auto';

  // Itinerary & Plan Variants
  currentItinerary: Itinerary | null;
  activeVariant: PlanVariantKey;
  favoritePlaceIds: string[];

  // Saved Plans
  savedPlans: SavedPlan[];
  isSavedPlansModalOpen: boolean;
  setIsSavedPlansModalOpen: (open: boolean) => void;
  saveCurrentPlan: (customTitle?: string) => string;
  loadSavedPlan: (planId: string) => void;
  renameSavedPlan: (planId: string, newTitle: string) => void;
  deleteSavedPlan: (planId: string) => void;
  duplicateSavedPlan: (planId: string) => void;

  // Wizard state (7 steps)
  wizardStep: number;
  wizardPreferences: WizardPreferences;
  isGeneratingPlan: boolean;

  // Live Outing Mode
  isLiveOutingOpen: boolean;
  activeLiveStopIndex: number;

  // Modals & Map Focus
  isSplitBillOpen: boolean;
  isVotingModalOpen: boolean;
  selectedPlaceForModal: Place | null;
  stopToSwap: ItineraryStop | null;
  focusedStopId: string | null;
  focusedStopCoords: [number, number] | null;

  // Actions
  setFocusedStopId: (id: string | null) => void;
  setFocusedStopCoords: (coords: [number, number] | null) => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setActiveNavTab: (tab: 'home' | 'quick-plan' | 'timeline' | 'explore' | 'curated') => void;
  setAtmospherePhase: (phase: AtmospherePhase | 'auto') => void;

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

// Safe storage wrapper protecting against Incognito / Private mode quotas and errors
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(name);
      }
    } catch (e) {
      console.warn('Storage access restricted (incognito mode):', e);
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(name, value);
      }
    } catch (e) {
      console.warn('Storage write restricted (incognito mode):', e);
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(name);
      }
    } catch (e) {
      console.warn('Storage delete restricted (incognito mode):', e);
    }
  },
};

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      language: 'ar',
      theme: 'dark',
      activeNavTab: 'home',

      currentItinerary: null,
      activeVariant: 'balanced',
      favoritePlaceIds: ['historic-al-balad', 'jeddah-yacht-club', 'twina-seafood-lounge'],

      savedPlans: [],
      isSavedPlansModalOpen: false,
      setIsSavedPlansModalOpen: (isSavedPlansModalOpen) => set({ isSavedPlansModalOpen }),

      saveCurrentPlan: (customTitle) => {
        const { currentItinerary, wizardPreferences, savedPlans } = get();
        if (!currentItinerary) return '';

        const newId = `saved-${Date.now()}`;
        const title = customTitle || currentItinerary.titleAr || `طلعة جدة #${savedPlans.length + 1}`;

        const newSaved: SavedPlan = {
          id: newId,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          itinerary: JSON.parse(JSON.stringify(currentItinerary)),
          preferences: wizardPreferences,
        };

        set({ savedPlans: [newSaved, ...savedPlans] });
        return newId;
      },

      loadSavedPlan: (planId) => {
        const { savedPlans } = get();
        const found = savedPlans.find((p) => p.id === planId);
        if (!found) return;

        set({
          currentItinerary: JSON.parse(JSON.stringify(found.itinerary)),
          wizardPreferences: found.preferences || get().wizardPreferences,
          activeNavTab: 'timeline',
          isSavedPlansModalOpen: false,
        });
      },

      renameSavedPlan: (planId, newTitle) => {
        set((state) => ({
          savedPlans: state.savedPlans.map((p) =>
            p.id === planId
              ? { ...p, title: newTitle.trim(), updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteSavedPlan: (planId) => {
        set((state) => ({
          savedPlans: state.savedPlans.filter((p) => p.id !== planId),
        }));
      },

      duplicateSavedPlan: (planId) => {
        const { savedPlans } = get();
        const found = savedPlans.find((p) => p.id === planId);
        if (!found) return;

        const clone: SavedPlan = {
          ...found,
          id: `saved-${Date.now()}`,
          title: `${found.title} (نسخة)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          itinerary: JSON.parse(JSON.stringify(found.itinerary)),
        };

        set({ savedPlans: [clone, ...savedPlans] });
      },

      wizardStep: 1,
      wizardPreferences: defaultPreferences,
      isGeneratingPlan: false,

      isLiveOutingOpen: false,
      activeLiveStopIndex: 0,

      isSplitBillOpen: false,
      isVotingModalOpen: false,
      selectedPlaceForModal: null,
      stopToSwap: null,
      focusedStopId: null,
      focusedStopCoords: null,

      setFocusedStopId: (focusedStopId) => set({ focusedStopId }),
      setFocusedStopCoords: (focusedStopCoords) => set({ focusedStopCoords }),

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

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
    }
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setActiveNavTab: (activeNavTab) => set({ activeNavTab }),
  atmospherePhase: 'auto',
  setAtmospherePhase: (atmospherePhase) => set({ atmospherePhase }),
  setWizardStep: (wizardStep) => set({ wizardStep }),

  updateWizardPreferences: (partial) => {
    set((state) => ({
      wizardPreferences: { ...state.wizardPreferences, ...partial },
    }));
  },

  generatePlanFromPreferences: () => {
    set({ isGeneratingPlan: true });
    setTimeout(() => {
      try {
        const plan = generateMultiPlanVariants(get().wizardPreferences);
        set({
          currentItinerary: plan,
          activeVariant: plan.activeVariant,
          isGeneratingPlan: false,
          activeNavTab: 'timeline',
        });
      } catch (err) {
        console.error('Plan generation error:', err);
        set({ isGeneratingPlan: false });
      }
    }, 40);
  },

  setActiveVariant: (variantKey) => {
    const current = get().currentItinerary;
    if (!current) return;

    const variantObj =
      (current.variants as any)[variantKey] ||
      (variantKey === 'free' ? current.variants.free : undefined) ||
      (variantKey === 'luxury' ? current.variants.luxury : undefined) ||
      current.variants.balanced ||
      current.variants.fastest;

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
    const financials = calculateFinancials(newStops, current.financials?.groupSize || 2);
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
        financials: calculateFinancials(remaining, it.financials?.groupSize || 2),
      },
    });
  },

  addPlaceToItinerary: (place) => {
    const it = get().currentItinerary;
    if (!it) {
      const plan = generateMultiPlanVariants({
        ...defaultPreferences,
        startingDistrict: normalizeDistrictId(place.district as string),
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
        financials: calculateFinancials(newStops, it.financials?.groupSize || 2),
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
          titleAr: 'الأقرب والأسرع',
          titleEn: 'Shortest Transit',
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
          titleAr: 'النسخة الفخمة',
          titleEn: 'Luxury Edition',
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
}),
{
  name: 'jadawel_user_storage_v2',
  storage: createJSONStorage(() => safeLocalStorage),
  partialize: (state) => ({
    savedPlans: state.savedPlans,
    wizardPreferences: state.wizardPreferences,
    favoritePlaceIds: state.favoritePlaceIds,
    currentItinerary: state.currentItinerary,
    language: state.language,
    theme: state.theme,
  }),
}
)
);
