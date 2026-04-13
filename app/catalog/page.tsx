import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary, getProducts } from "@/lib/data";
import { getLocale } from "@/lib/locale";

export default async function CatalogPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const products = getProducts(locale);

  return (
    <main className="py-16">
      <Container className="space-y-10">
        <SectionHeading eyebrow={dictionary.catalog.eyebrow} title={dictionary.catalog.title} description={dictionary.catalog.description} />
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
      </Container>
    </main>
  );
}
