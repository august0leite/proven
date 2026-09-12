"use client";

import type { Locale } from "@/app/i18n/client";

type LanguageSwitcherProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export function LanguageSwitcher({ locale, setLocale }: LanguageSwitcherProps) {
  return (
    <div className="inline-flex rounded-full border border-[#111111]/15 bg-white p-1">
      {(["en", "pt"] as const).map((code) => {
        const isActive = locale === code;

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              isActive ? "bg-[#111111] text-white" : "text-[#111111]/65 hover:text-[#111111]"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
