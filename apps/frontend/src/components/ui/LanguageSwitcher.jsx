import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages, ChevronDown, Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिंदी" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-700"
      >
        <Languages className="w-4 h-4 text-slate-500" />
        <span className="hidden sm:inline-block">{currentLang.label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
            >
              {lang.label}
              {i18n.language === lang.code && <Check className="w-4 h-4 text-indigo-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
