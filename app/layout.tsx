import type { Metadata } from "next";
import "./globals.css";
import { ToolNavigation } from "@/components/scoring/tool-navigation";

export const metadata: Metadata = {
  title: "门店数据管理评分工具",
  description: "总部内部每月使用的门店数据管理评分工具。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
          <ToolNavigation />
          <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
