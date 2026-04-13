"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Locale, localeLabels } from "@/lib/data";
import { LOCALE_COOKIE } from "@/lib/locale-cookie";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = (nextLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1">
      {(["en", "zh"] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          disabled={isPending && item === locale}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm",
            item === locale ? "bg-white text-ink" : "text-slate-300 hover:text-white"
          )}
        >
          {localeLabels[item]}
        </button>
      ))}
    </div>
  );
}
