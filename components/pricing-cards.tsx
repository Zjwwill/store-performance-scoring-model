import Link from "next/link";
import clsx from "clsx";
import { Locale, getDictionary, getPricingTiers } from "@/lib/data";

export function PricingCards({ locale }: { locale: Locale }) {
  const pricingTiers = getPricingTiers(locale);
  const dictionary = getDictionary(locale);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {pricingTiers.map((tier) => (
        <div
          key={tier.name}
          className={clsx(
            "rounded-[2rem] border p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-premium",
            tier.featured ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-ink"
          )}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold">{tier.name}</h3>
            {tier.featured ? <span className="rounded-full bg-coral px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">{dictionary.common.mostPopular}</span> : null}
          </div>
          <div className="mt-6 font-display text-5xl font-semibold">{tier.price}</div>
          <p className={clsx("mt-4 text-sm leading-7", tier.featured ? "text-slate-300" : "text-slate-600")}>{tier.description}</p>
          <div className="mt-6 space-y-3">
            {tier.features.map((feature) => (
              <div key={feature} className={clsx("rounded-2xl px-4 py-3 text-sm", tier.featured ? "bg-white/10 text-slate-100" : "bg-slate-50 text-slate-700")}>
                {feature}
              </div>
            ))}
          </div>
          <Link
            href="/order"
            className={clsx(
              "mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
              tier.featured ? "bg-white text-ink hover:bg-coral hover:text-white" : "bg-ink text-white hover:bg-coral"
            )}
          >
            {dictionary.common.getStarted}
          </Link>
        </div>
      ))}
    </div>
  );
}
