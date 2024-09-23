import { en, es } from "@resources/translations/translations";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//empty for now
const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3"
});

export default i18n;