import Link from "next/link";
import { Container } from "@/components/container";
import { getDictionary } from "@/lib/data";
import { getLocale } from "@/lib/locale";

export default async function NotFound() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <main className="py-24">
      <Container className="rounded-[2.5rem] bg-ink p-10 text-center text-white">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{dictionary.notFound.eyebrow}</div>
        <h1 className="mt-4 font-display text-5xl font-semibold">{dictionary.notFound.title}</h1>
        <p className="mt-4 text-slate-300">{dictionary.notFound.description}</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink">
          {dictionary.notFound.button}
        </Link>
      </Container>
    </main>
  );
}
