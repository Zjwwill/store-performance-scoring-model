import Link from "next/link";
import clsx from "clsx";
import { Locale, Product, getDictionary } from "@/lib/data";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
  locale: Locale;
};

export function ProductCard({ product, compact, locale }: ProductCardProps) {
  const dictionary = getDictionary(locale);

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-premium">
      <div className={clsx("relative overflow-hidden border-b border-slate-100 p-6", compact ? "h-52" : "h-64")}>
        <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-95 transition duration-500 group-hover:scale-105", product.accent)} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_28%)]" />
        <div className="relative flex h-full flex-col justify-between rounded-[1.5rem] border border-white/30 bg-white/12 p-5 text-white backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-white/80">{product.category}</div>
              <h3 className="mt-2 font-display text-3xl font-semibold">{product.name}</h3>
            </div>
            <div className="rounded-full bg-black/15 px-3 py-1 text-xs font-semibold">{product.turnaround}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.stats.slice(0, 3).map((stat) => (
              <div key={stat} className="rounded-2xl bg-black/15 p-3 text-xs leading-5 text-white/90">
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm leading-7 text-slate-600">{product.shortDescription}</p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{dictionary.common.startingAt}</div>
            <div className="font-display text-3xl font-semibold text-ink">${product.basePrice}</div>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral"
          >
            {dictionary.common.orderNow}
          </Link>
        </div>
      </div>
    </div>
  );
}
