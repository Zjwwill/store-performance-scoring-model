"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Locale, getDictionary, navLinks } from "@/lib/data";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const links = navLinks(locale);
  const dictionary = getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/10 bg-ink/80 backdrop-blur-xl">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-2 lg:flex">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive ? "bg-white text-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <Link
              href="/pricing"
              className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5 sm:inline-flex"
            >
              {dictionary.header.pricing}
            </Link>
            <Link
              href="/order"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-coral hover:text-white"
            >
              {dictionary.common.startPrinting}
            </Link>
          </div>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive ? "bg-white text-ink" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
