import Link from "next/link";
import { Container } from "@/components/container";
import { Locale, getDictionary } from "@/lib/data";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  const footerLinks = [
    {
      title: dictionary.footer.groups.products,
      items:
        locale === "zh"
          ? [
              { label: "名片", href: "/products/business-cards" },
              { label: "定制贴纸", href: "/products/stickers" },
              { label: "宣传单", href: "/products/flyers" },
              { label: "海报", href: "/products/posters" }
            ]
          : [
              { label: "Business Cards", href: "/products/business-cards" },
              { label: "Stickers", href: "/products/stickers" },
              { label: "Flyers", href: "/products/flyers" },
              { label: "Posters", href: "/products/posters" }
            ]
    },
    {
      title: dictionary.footer.groups.company,
      items:
        locale === "zh"
          ? [
              { label: "关于我们", href: "/about" },
              { label: "价格", href: "/pricing" },
              { label: "联系", href: "/contact" },
              { label: "下单", href: "/order" }
            ]
          : [
              { label: "About Us", href: "/about" },
              { label: "Pricing", href: "/pricing" },
              { label: "Contact", href: "/contact" },
              { label: "Order", href: "/order" }
            ]
    },
    {
      title: dictionary.footer.groups.support,
      items:
        locale === "zh"
          ? [
              { label: "文件帮助", href: "/order" },
              { label: "配送", href: "/pricing" },
              { label: "补单", href: "/order" },
              { label: "保障", href: "/about" }
            ]
          : [
              { label: "Artwork Help", href: "/order" },
              { label: "Shipping", href: "/pricing" },
              { label: "Reorders", href: "/order" },
              { label: "Guarantee", href: "/about" }
            ]
    }
  ];

  return (
    <footer className="border-t border-slate-200/10 bg-[#020817] text-slate-300">
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-white">{dictionary.footer.headline}</h2>
          <p className="max-w-md text-sm leading-7 text-slate-400">{dictionary.footer.description}</p>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">{dictionary.footer.note}</div>
        </div>
        {footerLinks.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 font-medium text-white">{group.title}</h3>
            <div className="space-y-3 text-sm">
              {group.items.map((item) => (
                <Link key={item.label} href={item.href} className="block transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </footer>
  );
}
