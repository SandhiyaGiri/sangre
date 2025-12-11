'use client';

import { Language, SUPPORTED_LANGUAGES } from '@/lib/translations';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {(Object.entries(SUPPORTED_LANGUAGES) as Array<[Language, string]>).map(
        ([code, name]) => (
          <button
            key={code}
            onClick={() => onLanguageChange(code)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              currentLanguage === code
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {name}
          </button>
        )
      )}
    </div>
  );
}
