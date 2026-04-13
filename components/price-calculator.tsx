"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Locale, Product, getDictionary } from "@/lib/data";

type PriceCalculatorProps = {
  product: Product;
  locale: Locale;
};

const quantities = [100, 250, 500, 1000, 2500];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function PriceCalculator({ product, locale }: PriceCalculatorProps) {
  const dictionary = getDictionary(locale);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
  const [quantity, setQuantity] = useState(500);

  const summary = useMemo(() => {
    const materialMultiplier = 1 + product.materials.indexOf(selectedMaterial) * 0.12;
    const sizeMultiplier = 1 + product.sizes.indexOf(selectedSize) * 0.08;
    const quantityMultiplier = quantity / 100;
    const total = Math.round(product.basePrice * materialMultiplier * sizeMultiplier * quantityMultiplier);
    const unit = total / quantity;
    const rushEligible = quantity <= 1000;

    return {
      total,
      unit,
      rushEligible,
      eta: rushEligible ? dictionary.common.estimatedDeliverySoon : dictionary.common.estimatedDeliveryStandard
    };
  }, [dictionary.common.estimatedDeliverySoon, dictionary.common.estimatedDeliveryStandard, product, quantity, selectedMaterial, selectedSize]);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{dictionary.common.instantPriceCalculator}</div>
        <div className="mt-2 font-display text-4xl font-semibold text-ink">{formatCurrency(summary.total)}</div>
        <div className="mt-1 text-sm text-slate-500">{formatCurrency(summary.unit)} per unit</div>
      </div>
      <div className="space-y-6">
        <div>
          <div className="mb-3 text-sm font-medium text-ink">{dictionary.common.size}</div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-sm transition",
                  selectedSize === size ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-ink">{dictionary.common.material}</div>
          <div className="grid gap-3">
            {product.materials.map((material) => (
              <button
                key={material}
                type="button"
                onClick={() => setSelectedMaterial(material)}
                className={clsx(
                  "rounded-2xl border px-4 py-3 text-left text-sm transition",
                  selectedMaterial === material ? "border-ink bg-slate-50 text-ink" : "border-slate-200 text-slate-700 hover:border-slate-400"
                )}
              >
                {material}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-ink">{dictionary.common.quantity}</div>
          <div className="flex flex-wrap gap-3">
            {quantities.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setQuantity(value)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-sm transition",
                  quantity === value ? "border-coral bg-coral text-white" : "border-slate-200 text-slate-700 hover:border-slate-400"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
        <div className="text-sm font-medium text-ink">{summary.eta}</div>
        <div className="mt-2 text-sm leading-7 text-slate-600">
          {summary.rushEligible ? dictionary.common.rushAvailable : dictionary.common.chooseSmallerQuantity}
        </div>
      </div>
      <button className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-coral">
        {dictionary.common.addToCart}
      </button>
    </div>
  );
}
