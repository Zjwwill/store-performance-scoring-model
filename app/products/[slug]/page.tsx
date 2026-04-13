import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PriceCalculator } from "@/components/price-calculator";
import { ProductCard } from "@/components/product-card";
import { getDictionary, getProductBySlug, getProducts } from "@/lib/data";
import { getLocale } from "@/lib/locale";

export function generateStaticParams() {
  return getProducts("en").map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const { slug } = await params;
  const products = getProducts(locale);
  const product = getProductBySlug(locale, slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter((entry) => entry.slug !== product.slug).slice(0, 3);

  return (
    <main className="py-16">
      <Container className="space-y-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
            <div className={`relative h-[440px] bg-gradient-to-br ${product.accent}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_25%)]" />
              <div className="absolute left-8 top-8 rounded-full bg-black/15 px-4 py-2 text-sm font-semibold text-white">{product.category}</div>
              <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border border-white/20 bg-white/12 p-6 text-white backdrop-blur">
                <h1 className="font-display text-5xl font-semibold tracking-tight">{product.name}</h1>
                <p className="mt-4 max-w-xl text-base leading-8 text-white/85">{product.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {product.stats.map((stat) => (
                    <span key={stat} className="rounded-full bg-black/15 px-4 py-2 text-sm">
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-6 p-8 md:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{dictionary.productPage.delivery}</div>
                <div className="mt-2 font-semibold text-ink">{product.turnaround}</div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{dictionary.productPage.designSupport}</div>
                <div className="mt-2 font-semibold text-ink">{dictionary.productPage.designSupportValue}</div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{dictionary.productPage.guarantee}</div>
                <div className="mt-2 font-semibold text-ink">{dictionary.productPage.guaranteeValue}</div>
              </div>
            </div>
          </div>
          <PriceCalculator product={product} locale={locale} />
        </section>
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{dictionary.productPage.examplesEyebrow}</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {dictionary.productPage.examples.map((example, index) => (
                <div key={example} className="rounded-[1.5rem] bg-slate-50 p-5">
                  <div className={`mb-4 h-28 rounded-[1.25rem] bg-gradient-to-br ${products[(index + 1) % products.length].accent}`} />
                  <div className="font-medium text-ink">{example}</div>
                  <div className="mt-2 text-sm text-slate-600">{dictionary.productPage.examplesDescription}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-ink p-8 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{dictionary.productPage.whyEyebrow}</div>
            <h2 className="mt-4 font-display text-4xl font-semibold">{dictionary.productPage.whyTitle}</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">{dictionary.productPage.whyDescription}</p>
            <div className="mt-8 space-y-4">
              {dictionary.productPage.whyList.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-slate-100">
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/order"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-coral hover:text-white"
            >
              {dictionary.common.uploadArtwork}
            </Link>
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">{dictionary.productPage.relatedEyebrow}</div>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{dictionary.productPage.relatedTitle}</h2>
            </div>
            <Link href="/catalog" className="text-sm font-semibold text-ink underline decoration-coral decoration-2 underline-offset-4">
              {dictionary.common.viewCatalog}
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {relatedProducts.map((entry) => (
              <ProductCard key={entry.slug} product={entry} compact locale={locale} />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
