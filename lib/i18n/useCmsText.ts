'use client'

import { useLanguage, type Language } from './LanguageContext'

/**
 * CMS stores English copy only. For NL/IT always use translations.ts.
 * For EN, prefer CMS value when set.
 */
export function cmsText(
  language: Language,
  cmsValue: string | undefined | null,
  translation: string,
): string {
  if (language === 'en' && cmsValue?.trim()) return cmsValue.trim()
  return translation
}

export function useCmsText() {
  const { language } = useLanguage()
  return (cmsValue: string | undefined | null, translation: string) =>
    cmsText(language, cmsValue, translation)
}
