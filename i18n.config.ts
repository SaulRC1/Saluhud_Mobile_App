import { en, en_sign_up_screen_error_messages, es, es_sign_up_screen_error_messages, en_login_screen_translations, es_login_screen_translations, en_recipes_screen_translations, es_recipes_screen_translations } from "@resources/translations/translations";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: en,
        sign_up_screen_error_messages: en_sign_up_screen_error_messages,
        login_screen_translations: en_login_screen_translations,
        recipes_screen_translations: en_recipes_screen_translations
    },
    es: {
        translation: es,
        sign_up_screen_error_messages: es_sign_up_screen_error_messages,
        login_screen_translations: es_login_screen_translations,
        recipes_screen_translations: es_recipes_screen_translations
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