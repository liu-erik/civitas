export const LANGUAGE_STORAGE_KEY = "civitas-language"

export const SUPPORTED_LANGUAGE_CODES = ["en", "es", "zh"] as const

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number]

export function readStoredLanguage(): SupportedLanguageCode {
  try {
    const v = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (
      v &&
      (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(v)
    ) {
      return v as SupportedLanguageCode
    }
  } catch {
    /* private mode / no localStorage */
  }
  return "en"
}
