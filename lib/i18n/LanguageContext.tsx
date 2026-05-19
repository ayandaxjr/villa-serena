"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  translations,
  languageLabels,
  type Language,
  type Translations,
} from "./translations";

/* ----------------------------------------------------------
   Context
   ---------------------------------------------------------- */
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

/* ----------------------------------------------------------
   Provider — wraps the app, persists choice in localStorage
   ---------------------------------------------------------- */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Restore saved preference on mount, or detect from IP
  useEffect(() => {
    try {
      const saved = localStorage.getItem("villa-serena-lang") as Language | null;
      if (saved && translations[saved]) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
        return;
      }
    } catch {
      // SSR or localStorage blocked
    }

    // No saved preference — detect from IP
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        const country = (data?.country_code || "").toUpperCase();
        let detected: Language = "en";
        if (country === "NL" || country === "BE") detected = "nl";
        else if (country === "IT") detected = "it";
        setLanguageState(detected);
        document.documentElement.lang = detected;
      })
      .catch(() => {
        // fallback to English on any error
      });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("villa-serena-lang", lang);
    } catch {
      // localStorage blocked
    }
    document.documentElement.lang = lang;
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/* ----------------------------------------------------------
   Hooks
   ---------------------------------------------------------- */
/** Full context: language + setter + translations */
export function useLanguage() {
  return useContext(LanguageContext);
}

/** Shorthand — just translations object */
export function useT() {
  return useContext(LanguageContext).t;
}

/* Re-export for convenience */
export { translations, languageLabels, type Language, type Translations };
