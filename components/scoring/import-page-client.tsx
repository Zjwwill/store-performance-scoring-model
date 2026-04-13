"use client";

import { useState } from "react";
import { useScoreRecords } from "@/components/scoring/use-score-records";
import { downloadTemplate, parseImportFile } from "@/lib/scoring/import-export";
import type { ScoreRecord } from "@/lib/scoring/types";

function ImportStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

export function ImportPageClient() {
  const { records, hydrated, mergeImportedRecords, replaceAllRecords } = useScoreRecords();
  const [previewRecords, setPreviewRecords] = useState<ScoreRecord[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsParsing(true);
    setMessage("");

    try {
      const result = await parseImportFile(file);
      setPreviewRecords(result.records);
      setWarnings(result.warnings);
      setFileName(file.name);
      setMessage(`已从 ${file.name} 解析出 ${result.records.length} 条记录。`);
    } catch (error) {
      setPreviewRecords([]);
      setWarnings([(error as Error).message]);
      setFileName(file.name);
      setMessage(`无法解析文件 ${file.name}。`);
    } finally {
      setIsParsing(false);
    }
  }

  function handleAppendImport() {
    mergeImportedRecords(previewRecords);
    setMessage(`已导入 ${previewRecords.length} 条记录到评分总览。`);
  }

  function handleReplaceImport() {
    if (!window.confirm("确认用当前预览数据替换全部本地记录吗？")) {
      return;
    }

    replaceAllRecords(previewRecords);
    setMessage(`已用 ${previewRecords.length} 条导入记录替换本地数据。`);
  }

  if (!hydrated) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">正在加载导入页面...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <ImportStatCard label="当前记录数" value={`${records.length}`} />
        <ImportStatCard label="预览记录数" value={`${previewRecords.length}`} />
        <ImportStatCard label="警告数量" value={`${warnings.length}`} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">导入评分数据</h2>
            <p className="mt-1 text-sm text-slate-600">支持上传 CSV、XLSX、XLS 文件。导入时会自动重新计算分数，因此源文件只需要提供原始录入字段。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadTemplate("xlsx")}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              下载 Excel 模板
            </button>
            <button
              type="button"
              onClick={() => downloadTemplate("csv")}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              下载 CSV 模板
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-800">上传文件</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="mt-3 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>
            <div className="mt-4 text-sm text-slate-600">
              必要字段请参考模板：至少需要 Month、Store，以及模板中列出的各项次数或勾选字段。
            </div>
            {message ? <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">{message}</div> : null}
            {isParsing ? <div className="mt-4 text-sm text-slate-500">正在解析文件并重新计算分数...</div> : null}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">导入操作</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">追加导入会保留现有数据，并更新相同“月份 + 门店”的记录；替换导入会清空本地数据，仅保留本次上传内容。</p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                disabled={previewRecords.length === 0}
                onClick={handleAppendImport}
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                追加到现有数据
              </button>
              <button
                type="button"
                disabled={previewRecords.length === 0}
                onClick={handleReplaceImport}
                className="rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
              >
                替换全部本地数据
              </button>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                当前文件：<span className="font-medium text-slate-900">{fileName || "尚未选择文件"}</span>
              </div>
            </div>
          </div>
        </div>

        {warnings.length > 0 ? (
          <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="text-sm font-semibold text-amber-900">导入警告</h3>
            <ul className="mt-3 space-y-2 text-sm text-amber-800">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">导入预览</h2>
          <p className="mt-1 text-sm text-slate-600">下方预览数据已经完成自动计算，可先确认结果再导入。</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">月份</th>
                <th className="px-4 py-3 font-medium">门店</th>
                <th className="px-4 py-3 font-medium">门店类型</th>
                <th className="px-4 py-3 font-medium">总扣分</th>
                <th className="px-4 py-3 font-medium">最终得分</th>
                <th className="px-4 py-3 font-medium">备注</th>
              </tr>
            </thead>
            <tbody>
              {previewRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{record.month}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{record.store}</td>
                  <td className="px-4 py-3 text-slate-600">{record.storeType === "Self-Procurement Store" ? "自采门店" : "湾区门店"}</td>
                  <td className="px-4 py-3">{record.totalDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">{record.finalScore.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{record.remark || "--"}</td>
                </tr>
              ))}
              {previewRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    暂无预览数据。请先上传 CSV 或 Excel 文件，再确认导入结果。
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
