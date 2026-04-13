"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navigationItems = [
  { href: "/", title: "评分录入", description: "快速完成每月录入" },
  { href: "/overview", title: "评分总览", description: "查看、编辑、导出" },
  { href: "/import", title: "数据导入", description: "上传 Excel 或 CSV" }
] as const;

export function ToolNavigation() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">HQ Internal Tool</p>
            <h1 className="text-2xl font-semibold text-slate-950">门店数据管理评分工具</h1>
            <p className="text-sm text-slate-600">总部每月用于评分的内部工具，重点优化录入效率、评分稳定性和导出操作。</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            总分 20 分，按模块封顶扣分
          </div>
        </div>
        <nav className="grid gap-3 md:grid-cols-3">
          {navigationItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-2xl border px-4 py-3 transition",
                  active
                    ? "border-sky-300 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-sm text-slate-600">{item.description}</div>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
