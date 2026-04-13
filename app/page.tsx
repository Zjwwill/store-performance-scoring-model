import { Suspense } from "react";
import { EntryPageClient } from "@/components/scoring/entry-page-client";

export default function EntryPage() {
  return (
    <Suspense fallback={<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">正在加载录入页...</div>}>
      <EntryPageClient />
    </Suspense>
  );
}
