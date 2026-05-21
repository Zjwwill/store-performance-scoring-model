"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExecutionComplianceSection } from "@/components/scoring/execution-compliance-section";
import { StoreScoringForm } from "@/components/scoring/store-scoring-form";
import { useScoreRecords } from "@/components/scoring/use-score-records";
import { DEFAULT_SCORE_INPUT, STORE_TYPE_DISPLAY } from "@/lib/scoring/config";
import type { ScoreInput, ScoreRecord } from "@/lib/scoring/types";

function EntrySummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function buildFormSeed(record?: ScoreRecord | null, month = "", store = ""): Partial<ScoreInput> {
  if (record) {
    return record;
  }

  return {
    ...DEFAULT_SCORE_INPUT,
    month,
    store
  };
}

export function EntryPageClient() {
  const { records, hydrated, errorMessage, createRecord, updateRecord, loadMockRecords } = useScoreRecords();
  const [message, setMessage] = useState("");
  const [statusNotice, setStatusNotice] = useState("");
  const [editingRecord, setEditingRecord] = useState<ScoreRecord | null>(null);
  const [formSeed, setFormSeed] = useState<Partial<ScoreInput>>(DEFAULT_SCORE_INPUT);
  const [formKey, setFormKey] = useState("entry-form");
  const router = useRouter();
  const searchParams = useSearchParams();

  const latestMonth = records[0]?.month ?? "--";
  const latestMonthCount = records.filter((record) => record.month === latestMonth).length;
  const averageScore =
    records.length > 0 ? (records.reduce((sum, record) => sum + record.finalScore, 0) / records.length).toFixed(2) : "--";

  const editId = searchParams.get("edit");
  const recentRecords = useMemo(() => records.slice(0, 6), [records]);

  function loadExistingRecord(record: ScoreRecord, notice = "已加载历史记录，可直接修改。") {
    setEditingRecord(record);
    setFormSeed(buildFormSeed(record));
    setFormKey(`entry-form-${record.id}-${Date.now()}`);
    setStatusNotice(notice);
  }

  function resetToCreateMode(month = "", store = "") {
    setEditingRecord(null);
    setFormSeed(buildFormSeed(null, month, store));
    setFormKey(`entry-form-create-${Date.now()}`);
    setStatusNotice(month && store ? "未找到历史记录，请新建本月评分。" : "");
    setMessage("");
  }

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!editId) {
      return;
    }

    const matchedRecord = records.find((record) => record.id === editId);

    if (matchedRecord) {
      loadExistingRecord(matchedRecord);
      router.replace("/");
      return;
    }

    setStatusNotice("未找到指定记录，请重新选择月份和门店。");
  }, [editId, hydrated, records, router]);

  function handleMonthStoreChange(value: Pick<ScoreInput, "month" | "store">) {
    if (!value.month || !value.store) {
      if (!value.month && !value.store && editingRecord) {
        resetToCreateMode();
      }
      return;
    }

    const matchedRecord = records.find((record) => record.month === value.month && record.store === value.store);

    if (matchedRecord) {
      if (editingRecord?.id !== matchedRecord.id) {
        loadExistingRecord(matchedRecord);
      }
      return;
    }

    if (editingRecord) {
      resetToCreateMode(value.month, value.store);
    } else {
      setStatusNotice("");
    }
  }

  function handleCancelEdit() {
    router.replace("/");
    resetToCreateMode();
  }

  async function handleSave(value: ScoreInput) {
    try {
      if (editingRecord) {
        const record = await updateRecord(value, editingRecord.id);
        loadExistingRecord(record, "已更新当前记录，可继续修改。");
        setMessage(`已更新 ${record.month} - ${record.store}，最终得分 ${record.finalScore.toFixed(2)}。`);
        router.replace("/");
        return;
      }

      const record = await createRecord(value);
      setMessage(`已新建 ${record.month} - ${record.store}，最终得分 ${record.finalScore.toFixed(2)}。`);
      setStatusNotice("");
      setFormSeed(buildFormSeed(null, record.month, ""));
      setFormKey(`entry-form-create-${Date.now()}`);
    } catch (error) {
      const nextMessage = (error as Error).message.includes("already exists")
        ? "该月份和门店已有记录，系统已切换为编辑模式。"
        : (error as Error).message;

      setMessage(nextMessage);

      const matchedRecord = records.find((record) => record.month === value.month && record.store === value.store);

      if (matchedRecord) {
        loadExistingRecord(matchedRecord);
        router.replace(`/?edit=${matchedRecord.id}`);
      }
    }
  }

  if (!hydrated) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">正在加载评分工具...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <EntrySummaryCard label="已保存记录" value={`${records.length}`} />
        <EntrySummaryCard label="最近月份" value={latestMonth} />
        <EntrySummaryCard label="最近月份记录数" value={`${latestMonthCount}`} />
        <EntrySummaryCard label="平均得分" value={`${averageScore}`} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">快速月度录入</h2>
            <p className="mt-1 text-sm text-slate-600">请先选月份，再选门店。若该月份和门店已有记录，系统会自动回填原始小分项并进入编辑模式。</p>
          </div>
          <button
            type="button"
            onClick={() => void loadMockRecords()}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            加载示例数据
          </button>
        </div>
        {errorMessage ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div> : null}
        {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      </section>

      <StoreScoringForm
        key={formKey}
        formKey={formKey}
        initialValue={formSeed}
        mode={editingRecord ? "edit" : "create"}
        editingSummary={editingRecord ? `${editingRecord.store} - ${editingRecord.month}` : undefined}
        statusNotice={statusNotice}
        title={editingRecord ? "编辑门店评分" : "新建门店评分"}
        description="录入页会显式区分新建和编辑，不再对同一个月份和门店进行静默覆盖。"
        submitLabel={editingRecord ? "更新评分" : "保存评分"}
        onSubmit={handleSave}
        onCancel={handleCancelEdit}
        onMonthStoreChange={handleMonthStoreChange}
      />

      <ExecutionComplianceSection />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">最近记录</h2>
          <p className="mt-1 text-sm text-slate-600">可以直接点“编辑”回到录入页，自动加载原记录。</p>
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
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{record.month}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{record.store}</td>
                  <td className="px-4 py-3 text-slate-600">{STORE_TYPE_DISPLAY[record.storeType]}</td>
                  <td className="px-4 py-3">{record.totalDeduction.toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">{record.finalScore.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/?edit=${record.id}`}
                      className="inline-flex rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      编辑
                    </Link>
                  </td>
                </tr>
              ))}
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    暂无记录。可以先使用上方表单录入，或加载示例数据进行演示。
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
