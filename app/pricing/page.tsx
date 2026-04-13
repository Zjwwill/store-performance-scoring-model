import { Container } from "@/components/container";
import { PricingCards } from "@/components/pricing-cards";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/lib/data";
import { getLocale } from "@/lib/locale";

export default async function PricingPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const pricingRows =
    locale === "zh"
      ? [
          ["名片", "$32", "$68", "$118"],
          ["贴纸", "$24", "$61", "$102"],
          ["宣传单", "$46", "$84", "$140"],
          ["海报", "$18", "$42", "$79"],
          ["菜单", "$38", "$74", "$122"],
          ["包装", "$128", dictionary.pricing.custom, dictionary.pricing.custom]
        ]
      : [
          ["Business Cards", "$32", "$68", "$118"],
          ["Stickers", "$24", "$61", "$102"],
          ["Flyers", "$46", "$84", "$140"],
          ["Posters", "$18", "$42", "$79"],
          ["Menus", "$38", "$74", "$122"],
          ["Packaging", "$128", dictionary.pricing.custom, dictionary.pricing.custom]
        ];

  return (
    <main className="py-16">
      <Container className="space-y-14">
        <SectionHeading eyebrow={dictionary.pricing.eyebrow} title={dictionary.pricing.title} description={dictionary.pricing.description} />
        <PricingCards locale={locale} />
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <h2 className="font-display text-2xl font-semibold text-ink">{dictionary.pricing.guideTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{dictionary.pricing.guideDescription}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white">
                <tr className="border-b border-slate-200 text-slate-500">
                  {dictionary.pricing.tableHeaders.map((heading) => (
                    <th key={heading} className="px-6 py-4 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row) => (
                  <tr key={row[0]} className="border-b border-slate-100 last:border-b-0">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${cell}`} className={`px-6 py-4 ${index === 0 ? "font-semibold text-ink" : "text-slate-600"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
    </main>
  );
}
