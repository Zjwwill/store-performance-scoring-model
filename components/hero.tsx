import Link from "next/link";
import { Container } from "@/components/container";
import { Locale, getDictionary, getStats } from "@/lib/data";

export function Hero({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const stats = getStats(locale);
  const floatingCards = dictionary.hero.floatingCards;

  return (
    <section className="relative overflow-hidden bg-mesh-radial text-white">
      <Container className="relative grid min-h-[82vh] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="relative z-10 max-w-2xl animate-rise">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <span className="h-2 w-2 rounded-full bg-coral" />
            {dictionary.hero.badge}
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {dictionary.hero.titleTop}
            <span className="mt-2 block text-slate-300">{dictionary.hero.titleBottom}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">{dictionary.hero.description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-coral hover:text-white"
            >
              {dictionary.common.startPrinting}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              {dictionary.common.getQuote}
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="font-display text-2xl font-semibold">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[560px]">
          <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/5 shadow-premium backdrop-blur" />
          <div className="absolute left-10 top-10 h-[430px] w-[320px] animate-float rounded-[2rem] bg-gradient-to-br from-white to-slate-200 p-5 text-ink shadow-premium">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <span>{dictionary.hero.topSeller}</span>
              <span>24H</span>
            </div>
            <div className="mt-6 rounded-[1.6rem] bg-gradient-to-br from-cyan-400 via-blue-600 to-ink p-6 text-white">
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-100">{dictionary.hero.cardProduct}</div>
              <div className="mt-14 font-display text-3xl font-semibold">{dictionary.hero.cardHeadline}</div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{dictionary.hero.stock}</div>
                <div className="mt-2 font-semibold">{dictionary.hero.stockValue}</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{dictionary.hero.finish}</div>
                <div className="mt-2 font-semibold">{dictionary.hero.finishValue}</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-12 right-10 h-[360px] w-[250px] rounded-[2rem] bg-gradient-to-br from-coral via-amber-300 to-yellow-100 p-5 text-ink shadow-premium">
            <div className="rounded-[1.6rem] bg-white/80 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{dictionary.hero.quote}</div>
              <div className="mt-3 font-display text-4xl font-semibold">$84</div>
              <div className="mt-2 text-sm text-slate-600">{dictionary.hero.quoteDescription}</div>
            </div>
            <div className="relative mt-5 overflow-hidden rounded-[1.6rem] bg-ink p-5 text-white">
              <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 animate-shine" />
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{dictionary.hero.productionStatus}</div>
              <div className="mt-2 font-semibold">{dictionary.hero.productionValue}</div>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 w-3/4 rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
          {floatingCards.map((card) => (
            <div
              key={card.title}
              className={`absolute ${card.position} hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur md:block`}
            >
              <div className={`mb-2 h-1.5 w-14 rounded-full bg-gradient-to-r ${card.color}`} />
              <div className="font-medium">{card.title}</div>
              <div className="text-slate-300">{card.eta}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
