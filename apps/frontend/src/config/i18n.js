import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "../locales/en/common.json";
import mlCommon from "../locales/ml/common.json";
import taCommon from "../locales/ta/common.json";
import hiCommon from "../locales/hi/common.json";

const resources = {
  en: { common: enCommon },
  ml: { common: mlCommon },
  ta: { common: taCommon },
  hi: { common: hiCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: "common",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
