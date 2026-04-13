import { Locale, getOrderSteps } from "@/lib/data";

export function OrderSteps({ locale }: { locale: Locale }) {
  const orderSteps = getOrderSteps(locale);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {orderSteps.map((step, index) => (
        <div key={step.title} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink font-display text-xl font-semibold text-white">
            {index + 1}
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">{step.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
