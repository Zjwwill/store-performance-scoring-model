"use client";

import Link from "next/link";
import { useState } from "react";
import { useScoreRecords } from "@/components/scoring/use-score-records";
import { STORE_TYPE_DISPLAY, STORE_TYPE_LABELS } from "@/lib/scoring/config";
import { downloadOverviewExport } from "@/lib/scoring/import-export";
import type { OverviewSortField, ScoreRecord, StoreType } from "@/lib/scoring/types";

function sortRecords(records: ScoreRecord[], sortField: OverviewSortField, sortDirection: "asc" | "desc") {
  return [...records].sort((left, right) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    const leftValue = left[sortField];
    const rightValue = right[sortField];

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return (leftValue - rightValue) * direction;
    }

    return String(leftValue).localeCompare(String(rightValue)) * direction;
  });
}

function OverviewSummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

export function OverviewPageClient() {
  const { records, hydrated, removeRecord, clearAllRecords, loadMockRecords } = useScoreRecords();
  const [sortField, setSortField] = useState<OverviewSortField>("month");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [monthFilter, setMonthFilter] = useState("");
  const [storeTypeFilter, setStoreTypeFilter] = useState<StoreType | "">("");
  const [storeSearch, setStoreSearch] = useState("");
  const [message, setMessage] = useState("");

  const filteredRecords = sortRecords(
    records.filter((record) => {
      const matchesMonth = monthFilter ? record.month === monthFilter : true;
      const matchesStoreType = storeTypeFilter ? record.storeType === storeTypeFilter : true;
      const matchesSearch = storeSearch ? record.store.toLowerCase().includes(storeSearch.toLowerCase()) : true;

      return matchesMonth && matchesStoreType && matchesSearch;
    }),
    sortField,
    sortDirection
  );

  const averageScore =
    filteredRecords.length > 0
      ? (filteredRecords.reduce((sum, record) => sum + record.finalScore, 0) / filteredRecords.length).toFixed(2)
      : "--";
  const lowestScoreRecord = filteredRecords.reduce<ScoreRecord | null>((lowest, record) => {
    if (!lowest || record.finalScore < lowest.finalScore) {
      return record;
    }

    return lowest;
  }, null);
  const distinctMonths = Array.from(new Set(records.map((record) => record.month))).sort((left, right) => right.localeCompare(left));

  function handleSort(field: OverviewSortField) {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection(field === "store" || field === "storeType" ? "asc" : "desc");
  }

  function handleDelete(record: ScoreRecord) {
    if (!window.confirm(`确认删除 ${record.month} 的 ${record.store} 评分记录吗？`)) {
      return;
    }

    removeRecord(record.id);
    setMessage(`已删除 ${record.month} - ${record.store} 的评分记录。`);
  }

  if (!hydrated) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">正在加载评分总览...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <OverviewSummaryCard label="当前记录数" value={`${filteredRecords.length}`} />
        <OverviewSummaryCard label="平均得分" value={`${averageScore}`} />
        <OverviewSummaryCard label="最低得分" value={lowestScoreRecord ? `${lowestScoreRecord.finalScore.toFixed(2)}` : "--"} />
        <OverviewSummaryCard label="最低分门店" value={lowestScoreRecord ? `${lowestScoreRecord.store} (${lowestScoreRecord.month})` : "--"} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">评分总览</h2>
            <p className="mt-1 text-sm text-slate-600">在一个页面完成排序、筛选、删除、导出，并可跳回录入页显式编辑。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadOverviewExport(filteredRecords, "xlsx")}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              导出 Excel
            </button>
            <button
              type="button"
              onClick={() => downloadOverviewExport(filteredRecords, "csv")}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              导出 CSV
            </button>
            <button
              type="button"
              onClick={loadMockRecords}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              加载示例数据
            </button>
            <button
              type="button"
              onClick={clearAllRecords}
              className="rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              清空全部
            </button>
          </div>
        </div>

        {message ? <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">{message}</div> : null}

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-800">按月份筛选</span>
            <select
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">全部月份</option>
              {distinctMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-800">按门店类型筛选</span>
            <select
              value={storeTypeFilter}
              onChange={(event) => setStoreTypeFilter(event.target.value as StoreType | "")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">全部门店类型</option>
              {STORE_TYPE_LABELS.map((storeType) => (
                <option key={storeType} value={storeType}>
                  {STORE_TYPE_DISPLAY[storeType]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-800">搜索门店</span>
            <input
              type="text"
              value={storeSearch}
              onChange={(event) => setStoreSearch(event.target.value)}
              placeholder="例如 Edison"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[
                  ["month", "月份"],
                  ["store", "门店"],
                  ["storeType", "门店类型"],
                  ["inventoryDeduction", "Inventory 扣分"],
                  ["cashDeduction", "现金扣分"],
                  ["wasteDeduction", "损耗扣分"],
                  ["laborDeduction", "人工扣分"],
                  ["opusDeduction", "Opus 扣分"],
                  ["totalDeduction", "总扣分"],
                  ["finalScore", "最终得分"]
                ].map(([field, label]) => (
                  <th key={field} className="px-4 py-3 font-medium">
                    <button type="button" onClick={() => handleSort(field as OverviewSortField)} className="whitespace-nowrap text-left">
                      {label}
                      {sortField === field ? (sortDirection === "asc" ? " ^" : " v") : ""}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">备注</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-3">{record.month}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{record.store}</td>
                  <td className="px-4 py-3 text-slate-600">{STORE_TYPE_DISPLAY[record.storeType]}</td>
                  <td className="px-4 py-3">{record.inventoryDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3">{record.cashDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3">{record.wasteDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3">{record.laborDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3">{record.opusDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3">{record.totalDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">{record.finalScore.toFixed(2)}</td>
                  <td className="max-w-[240px] px-4 py-3 text-slate-600">{record.remark || "--"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/?edit=${record.id}`}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        编辑
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(record)}
                        className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-slate-500">
                    当前筛选条件下没有记录。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
