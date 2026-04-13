import { Locale, getFaqs } from "@/lib/data";

export function FAQList({ locale }: { locale: Locale }) {
  const faqs = getFaqs(locale);

  return (
    <div className="grid gap-4">
      {faqs.map((faq) => (
        <div key={faq.question} className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
          <div className="font-semibold text-ink">{faq.question}</div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
