"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  getLocaleTag,
  localeCookieName,
  localeLabels,
  translations,
  type Locale,
  type TranslationDictionary,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  localeTag: string;
  labels: typeof localeLabels;
  copy: TranslationDictionary;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  initialLocale: Locale;
  children: React.ReactNode;
}

export function LocaleProvider({
  initialLocale,
  children,
}: LocaleProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    window.localStorage.setItem(localeCookieName, locale);
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    setLocaleState(nextLocale);
    startTransition(() => {
      router.refresh();
    });
  };

  const value = {
    locale,
    localeTag: getLocaleTag(locale),
    labels: localeLabels,
    copy: translations[locale],
    setLocale,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
