import { Locale } from "@/lib/data";

export function FeatureStrip({ locale }: { locale: Locale }) {
  const features =
    locale === "zh"
      ? [
          { title: "交付速度快", description: "紧急活动与补单支持当天生产。" },
          { title: "高级材质", description: "支持丝绸卡、柔感膜、再生纸、PVC、硬卡等。" },
          { title: "在线下单简单", description: "报价、上传、确认、补单都在一个后台完成。" },
          { title: "批量优惠", description: "品牌增长和大型活动都能自动享受数量折扣。" }
        ]
      : [
          { title: "Fast turnaround", description: "Same-day production for your most urgent campaigns and reorders." },
          { title: "Premium materials", description: "Silk, soft touch, recycled stocks, vinyl, rigid boards, and more." },
          { title: "Easy online ordering", description: "Quote, upload, approve, and reorder from one simple dashboard." },
          { title: "Bulk discounts", description: "Automatic quantity pricing for growing brands and large events." }
        ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature) => (
        <div key={feature.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
          <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {locale === "zh" ? "优势" : "Why us"}
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">{feature.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
