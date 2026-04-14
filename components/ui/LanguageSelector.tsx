'use client';

import { useI18n, type Locale } from '@/lib/i18n';

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-zinc-800/50 p-0.5">
      {(['es', 'en'] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            locale === l
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t.language[l]}
        </button>
      ))}
    </div>
  );
}
