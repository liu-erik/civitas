import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"

import {
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguageCode,
} from "@/i18n/storage"

export function useLanguage() {
  const { i18n } = useTranslation()

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, i18n.language)
    } catch {
      /* private mode / no localStorage */
    }
    const short = i18n.language?.split("-")[0] ?? "en"
    document.documentElement.lang = short
  }, [i18n.language])

  const setLanguage = useCallback(
    (code: SupportedLanguageCode) => {
      void i18n.changeLanguage(code)
    },
    [i18n],
  )

  const raw = i18n.language?.split("-")[0] ?? "en"
  const code = raw as SupportedLanguageCode

  return { code, language: i18n.language, setLanguage }
}
