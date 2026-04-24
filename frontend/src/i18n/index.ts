import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./en.json"
import es from "./es.json"
import zh from "./zh.json"
import { readStoredLanguage } from "./storage"

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    zh: { translation: zh },
  },
  lng: readStoredLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false,
  },
})

export default i18n
