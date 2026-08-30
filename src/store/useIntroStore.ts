import { create } from 'zustand';

export type IntroPhase = 'preloader' | 'locked' | 'expanding' | 'hero_entering' | 'interactive' | 'done';

interface IntroState {
  phase: IntroPhase;
  hasSeenIntro: boolean;
  setPhase: (phase: IntroPhase) => void;
  markIntroSeen: () => void;
}

export const useIntroStore = create<IntroState>((set) => ({
  phase: 'interactive',
  hasSeenIntro: typeof window !== 'undefined' ? Boolean(sessionStorage.getItem('jadawel_intro_seen')) : false,
  setPhase: (phase) => set({ phase }),
  markIntroSeen: () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('jadawel_intro_seen', 'true');
      }
    } catch (e) {
      // Ignore sessionStorage exceptions
    }
    set({ hasSeenIntro: true, phase: 'interactive' });
  },
}));
