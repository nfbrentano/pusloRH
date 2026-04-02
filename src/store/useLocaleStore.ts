import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from '../i18n/translations';
import type { Locale } from '../types';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'pt',
      setLocale: (locale) => set({ locale }),
      t: (key, replacements) => {
        const locale = get().locale;
        const keys = key.split('.');
        let translation: unknown = translations[locale];

        for (const k of keys) {
          if (
            translation &&
            typeof translation === 'object' &&
            k in (translation as Record<string, unknown>)
          ) {
            translation = (translation as Record<string, unknown>)[k];
          } else {
            // Fallback for missing key
            return key;
          }
        }

        if (typeof translation !== 'string') return key;

        let result = translation;
        if (replacements) {
          Object.entries(replacements).forEach(([k, v]) => {
            result = result.replace(`{${k}}`, String(v));
          });
        }

        return result;
      },
    }),
    {
      name: 'pulso-rh-locale',
    }
  )
);
