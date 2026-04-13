import { OrderPageClient } from "@/components/order-page-client";
import { getProducts } from "@/lib/data";
import { getLocale } from "@/lib/locale";

export default async function OrderPage() {
  const locale = await getLocale();
  const products = getProducts(locale);

  return <OrderPageClient locale={locale} products={products} />;
}
