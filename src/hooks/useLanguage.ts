import { useItineraryStore } from '@/store/useItineraryStore';
import { TRANSLATIONS } from '@/utils/translations';

export function useLanguage() {
  const language = useItineraryStore((state) => state.language);
  const setLanguage = useItineraryStore((state) => state.setLanguage);
  const toggleLanguage = useItineraryStore((state) => state.toggleLanguage);

  const t = (key: keyof typeof TRANSLATIONS['ar']) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS['ar'];
    return dict[key] || TRANSLATIONS['ar'][key] || key;
  };

  const isRTL = language === 'ar';

  return {
    language,
    isRTL,
    setLanguage,
    toggleLanguage,
    t,
  };
}
