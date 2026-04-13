import { Container } from "@/components/container";
import { getDictionary } from "@/lib/data";
import { getLocale } from "@/lib/locale";

export default async function AboutPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <main className="py-16">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2.5rem] bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-8 text-white shadow-premium sm:p-10">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{dictionary.about.eyebrow}</div>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight">{dictionary.about.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">{dictionary.about.description}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {dictionary.about.principles.map((principle) => (
              <div key={principle} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                {principle}
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{dictionary.about.serveEyebrow}</div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{dictionary.about.serveTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{dictionary.about.serveDescription}</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{dictionary.about.differentEyebrow}</div>
            <div className="mt-4 space-y-4">
              {dictionary.about.differentiators.map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
