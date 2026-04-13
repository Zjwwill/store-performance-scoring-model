"use client";

import { useEffect, useState } from "react";
import { calculateScoreBreakdown, normalizeScoreInput } from "@/lib/scoring/calculations";
import { DEFAULT_SCORE_INPUT, STORE_OPTIONS, STORE_TYPE_DISPLAY, getStoreType } from "@/lib/scoring/config";
import type { ScoreBreakdown, ScoreInput } from "@/lib/scoring/types";

interface StoreScoringFormProps {
  initialValue?: Partial<ScoreInput>;
  formKey?: string;
  title: string;
  description: string;
  submitLabel: string;
  mode?: "create" | "edit";
  editingSummary?: string;
  statusNotice?: string;
  onSubmit: (value: ScoreInput) => void;
  onCancel?: () => void;
  onMonthStoreChange?: (value: Pick<ScoreInput, "month" | "store">) => void;
  preserveMonthOnCreate?: boolean;
}

function getEmptyBreakdown(): ScoreBreakdown {
  return {
    inventoryDeduction: 0,
    cashDeduction: 0,
    wasteDeduction: 0,
    laborDeduction: 0,
    opusDeduction: 0,
    totalDeduction: 0,
    finalScore: 20
  };
}

function NumberField({
  label,
  value,
  onChange,
  disabled,
  helper
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type="number"
        min="0"
        step="0.25"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      />
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
  disabled,
  helper
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:cursor-not-allowed"
      />
      <span className="space-y-1">
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {helper ? <span className="block text-xs text-slate-500">{helper}</span> : null}
      </span>
    </label>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: number;
  tone?: "default" | "score";
}) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tone === "score" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={`mt-3 text-2xl font-semibold ${tone === "score" ? "text-emerald-700" : "text-slate-900"}`}>{value.toFixed(2)}</div>
    </div>
  );
}

export function StoreScoringForm({
  initialValue,
  formKey,
  title,
  description,
  submitLabel,
  mode = "create",
  editingSummary,
  statusNotice,
  onSubmit,
  onCancel,
  onMonthStoreChange,
  preserveMonthOnCreate = false
}: StoreScoringFormProps) {
  const [formState, setFormState] = useState<ScoreInput>(normalizeScoreInput(initialValue));

  useEffect(() => {
    setFormState(normalizeScoreInput(initialValue));
  }, [formKey, initialValue]);

  useEffect(() => {
    onMonthStoreChange?.({
      month: formState.month,
      store: formState.store
    });
  }, [formState.month, formState.store, onMonthStoreChange]);

  const storeType = getStoreType(formState.store);
  const isSelfProcurementStore = storeType === "Self-Procurement Store";
  const scoreBreakdown = storeType ? calculateScoreBreakdown(formState, storeType) : getEmptyBreakdown();

  function updateField<K extends keyof ScoreInput>(field: K, value: ScoreInput[K]) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeScoreInput(formState);
    onSubmit(normalized);

    if (preserveMonthOnCreate) {
      setFormState({
        ...DEFAULT_SCORE_INPUT,
        month: normalized.month
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          {mode === "edit" && editingSummary ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              当前正在编辑：{editingSummary}
            </div>
          ) : null}
          {statusNotice ? (
            <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">{statusNotice}</div>
          ) : null}
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">月份</span>
              <input
                type="month"
                value={formState.month}
                onChange={(event) => updateField("month", event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">门店</span>
              <select
                value={formState.store}
                onChange={(event) => updateField("store", event.target.value)}
                required
                disabled={!formState.month}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">{formState.month ? "请选择门店" : "请先选择月份"}</option>
                {STORE_OPTIONS.map((store) => (
                  <option key={store.name} value={store.name}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">门店类型</span>
              <input
                type="text"
                value={storeType ? STORE_TYPE_DISPLAY[storeType] : ""}
                readOnly
                placeholder="自动识别"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 shadow-sm outline-none"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">Inventory 管理</h3>
            <p className="mt-1 text-sm text-slate-600">Invoice 和 Weekly Report 仅适用于自采门店；盘货逾期规则会根据门店类型自动切换。</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <NumberField
              label="未录入 Invoice 数量"
              value={formState.missingInvoiceCount}
              disabled={!isSelfProcurementStore}
              helper={!isSelfProcurementStore ? "湾区门店不适用，自动忽略。" : "每张扣 1 分，按 invoice 项规则封顶。"}
              onChange={(value) => updateField("missingInvoiceCount", value)}
            />
            <NumberField
              label="Invoice 审核错误数量"
              value={formState.invoiceErrorCount}
              disabled={!isSelfProcurementStore}
              helper={!isSelfProcurementStore ? "湾区门店不适用，自动忽略。" : "每张扣 0.25 分。"}
              onChange={(value) => updateField("invoiceErrorCount", value)}
            />
            <CheckboxField
              label="月中盘货逾期"
              checked={formState.midInventoryLate}
              helper="自采门店扣 1.5 分；湾区门店扣 6 分。"
              onChange={(value) => updateField("midInventoryLate", value)}
            />
            <CheckboxField
              label="月底盘货逾期"
              checked={formState.endInventoryLate}
              helper="自采门店扣 1.5 分；湾区门店扣 6 分。"
              onChange={(value) => updateField("endInventoryLate", value)}
            />
            <NumberField
              label="Weekly Report 逾期次数"
              value={formState.weeklyReportLateCount}
              disabled={!isSelfProcurementStore}
              helper={!isSelfProcurementStore ? "湾区门店不适用，自动忽略。" : "每次扣 2 分，本项最多扣 4 分。"}
              onChange={(value) => updateField("weeklyReportLateCount", value)}
            />
            <NumberField
              label="Weekly Report 格式错误次数"
              value={formState.weeklyReportFormatErrorCount}
              disabled={!isSelfProcurementStore}
              helper={!isSelfProcurementStore ? "湾区门店不适用，自动忽略。" : "每次扣 1 分，本项最多扣 4 分。"}
              onChange={(value) => updateField("weeklyReportFormatErrorCount", value)}
            />
          </div>
          <div className="mt-4">
            <CheckboxField
              label="严重价格异常"
              checked={formState.severePriceIssue}
              disabled={!isSelfProcurementStore}
              helper={!isSelfProcurementStore ? "湾区门店不适用，自动忽略。" : "若发生，则 Weekly Report 本项直接扣满 4 分。"}
              onChange={(value) => updateField("severePriceIssue", value)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">现金管理</h3>
            <p className="mt-1 text-sm text-slate-600">每项每次或每天扣 0.5 分，本模块最多扣 2 分。</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <NumberField label="漏记录现金天数" value={formState.cashMissingDays} onChange={(value) => updateField("cashMissingDays", value)} />
            <NumberField label="存款记录逾期次数" value={formState.depositLateCount} onChange={(value) => updateField("depositLateCount", value)} />
            <NumberField label="Cash 对账不匹配次数" value={formState.cashMismatchCount} onChange={(value) => updateField("cashMismatchCount", value)} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">损耗与人工管理</h3>
            <p className="mt-1 text-sm text-slate-600">损耗模块最多扣 3 分，人工模块最多扣 2 分。</p>
          </div>
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <NumberField
                label="员工餐未记录次数"
                value={formState.employeeMealMissingCount}
                onChange={(value) => updateField("employeeMealMissingCount", value)}
              />
              <NumberField label="Waste Log 问题次数" value={formState.wasteLogIssueCount} onChange={(value) => updateField("wasteLogIssueCount", value)} />
            </div>
            <div className="space-y-4">
              <NumberField
                label="员工信息错误人数"
                value={formState.employeeInfoErrorCount}
                helper="每人扣 0.5 分。"
                onChange={(value) => updateField("employeeInfoErrorCount", value)}
              />
              <NumberField label="Sling 排班逾期次数" value={formState.slingLateCount} onChange={(value) => updateField("slingLateCount", value)} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">Opus 与备注</h3>
            <p className="mt-1 text-sm text-slate-600">当月没有课程 assign 时，本项自动不扣分。</p>
          </div>
          <div className="mt-5 space-y-4">
            <CheckboxField
              label="当月是否有 Opus 课程 Assign"
              checked={formState.opusAssigned}
              helper="只有勾选后，才会计算 Opus 逾期次数。"
              onChange={(value) => updateField("opusAssigned", value)}
            />
            <NumberField
              label="Opus 逾期次数"
              value={formState.opusLateCount}
              disabled={!formState.opusAssigned}
              helper={!formState.opusAssigned ? "未 assign 课程时自动忽略。" : "每次扣 0.5 分，本项最多扣 1 分。"}
              onChange={(value) => updateField("opusLateCount", value)}
            />
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">备注</span>
              <textarea
                value={formState.remark}
                rows={4}
                onChange={(event) => updateField("remark", event.target.value)}
                placeholder="可填写内部备注"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </label>
          </div>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <SummaryCard label="Inventory 扣分" value={scoreBreakdown.inventoryDeduction} />
        <SummaryCard label="现金管理扣分" value={scoreBreakdown.cashDeduction} />
        <SummaryCard label="损耗扣分" value={scoreBreakdown.wasteDeduction} />
        <SummaryCard label="人工扣分" value={scoreBreakdown.laborDeduction} />
        <SummaryCard label="Opus 扣分" value={scoreBreakdown.opusDeduction} />
        <SummaryCard label="总扣分" value={scoreBreakdown.totalDeduction} />
        <SummaryCard label="最终得分" value={scoreBreakdown.finalScore} tone="score" />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-900">提交说明</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">表单会实时重算分数，并按“月份 + 门店”唯一保存，避免月度录入时出现重复数据。</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {submitLabel}
            </button>
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {mode === "edit" ? "取消编辑" : "清空表单"}
              </button>
            ) : null}
          </div>
        </div>
      </aside>
    </form>
  );
}
