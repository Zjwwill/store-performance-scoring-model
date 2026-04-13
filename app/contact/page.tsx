import { Container } from "@/components/container";
import { getDictionary } from "@/lib/data";
import { getLocale } from "@/lib/locale";

export default async function ContactPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <main className="py-16">
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2.5rem] bg-gradient-to-br from-cyan-500 via-sky-500 to-ink p-8 text-white shadow-premium sm:p-10">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">{dictionary.contact.eyebrow}</div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">{dictionary.contact.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/85">{dictionary.contact.description}</p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">hello@printforge.com</div>
            <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">(212) 555-0148</div>
            <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">Mon-Fri, 8:00 AM to 7:00 PM ET</div>
          </div>
        </section>
        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{dictionary.contact.formEyebrow}</div>
          <form className="mt-6 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" placeholder={dictionary.contact.fields[0]} />
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" placeholder={dictionary.contact.fields[1]} />
            </div>
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" placeholder={dictionary.contact.fields[2]} />
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" placeholder={dictionary.contact.fields[3]} />
            <textarea rows={6} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" placeholder={dictionary.contact.messagePlaceholder} />
            <button type="button" className="inline-flex w-fit rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-coral">
              {dictionary.contact.button}
            </button>
          </form>
        </section>
      </Container>
    </main>
  );
}
