"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { Locale, Product, getDictionary } from "@/lib/data";

type OrderPageClientProps = {
  locale: Locale;
  products: Product[];
};

export function OrderPageClient({ locale, products }: OrderPageClientProps) {
  const dictionary = getDictionary(locale);
  const previousOrders = dictionary.order.orders;

  const [product, setProduct] = useState(products[0]?.slug ?? "");
  const [quantity, setQuantity] = useState("500");
  const [notes, setNotes] = useState("");

  return (
    <main className="py-16">
      <Container className="grid gap-10 lg:grid-cols-[1fr_0.92fr]">
        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">{dictionary.order.eyebrow}</div>
          <h1 className="mt-4 font-display text-4xl font-semibold text-ink">{dictionary.order.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{dictionary.order.description}</p>
          <form className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-3 text-sm font-medium text-ink">
                {dictionary.order.product}
                <select
                  value={product}
                  onChange={(event) => setProduct(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none ring-0"
                >
                  {products.map((entry) => (
                    <option key={entry.slug} value={entry.slug}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-3 text-sm font-medium text-ink">
                {dictionary.order.quantity}
                <input
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                  placeholder="500"
                />
              </label>
            </div>
            <label className="grid gap-3 text-sm font-medium text-ink">
              {dictionary.order.artwork}
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                {dictionary.order.artworkDrop}
              </div>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                {dictionary.order.needDesign}
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                {dictionary.order.saveReorder}
              </label>
            </div>
            <label className="grid gap-3 text-sm font-medium text-ink">
              {dictionary.order.notes}
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={dictionary.order.notesPlaceholder}
              />
            </label>
            <button type="button" className="inline-flex rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-coral">
              {dictionary.order.submit}
            </button>
          </form>
        </section>
        <section className="space-y-6">
          <div className="rounded-[2rem] bg-ink p-7 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{dictionary.order.whyEyebrow}</div>
            <h2 className="mt-4 font-display text-3xl font-semibold">{dictionary.order.whyTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{dictionary.order.whyDescription}</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{dictionary.order.historyEyebrow}</div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{dictionary.order.historyTitle}</h2>
            <div className="mt-5 space-y-4">
              {previousOrders.map((order) => (
                <div key={order.name} className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-slate-50 p-4">
                  <div>
                    <div className="font-medium text-ink">{order.name}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {order.date} {" • "} {order.status}
                    </div>
                  </div>
                  <button type="button" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-ink hover:text-white">
                    {order.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
