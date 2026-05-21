"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useExecutionComplianceRecords } from "@/components/scoring/use-execution-compliance-records";
import { STORE_OPTIONS } from "@/lib/scoring/config";
import {
  DEFAULT_EXECUTION_COMPLIANCE_DATA,
  buildExecutionComplianceMonthlySummary,
  buildExecutionComplianceRecord,
  getMonthFromCheckDate,
  normalizeExecutionComplianceData
} from "@/lib/scoring/execution-compliance";
import {
  downloadExecutionComplianceDailyExport,
  downloadExecutionComplianceMonthlyExport
} from "@/lib/scoring/import-export";
import type {
  ExecutionComplianceData,
  ExecutionComplianceInput,
  ExecutionComplianceRecord
} from "@/lib/scoring/execution-compliance";

type ViewMode = "daily" | "monthly";

function getTodayValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentMonthValue(): string {
  return getTodayValue().slice(0, 7);
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date";
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProjectCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <h4 className="text-base font-semibold text-slate-950">{title}</h4>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-xl font-semibold text-slate-950">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

export function ExecutionComplianceSection() {
  const { hydrated, errorMessage, loadDailyRecord, loadMonthlyRecords, upsertDailyRecord } = useExecutionComplianceRecords();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [selectedStore, setSelectedStore] = useState(STORE_OPTIONS[0]?.name ?? "");
  const [checkDate, setCheckDate] = useState(getTodayValue);
  const [summaryMonth, setSummaryMonth] = useState(getCurrentMonthValue);
  const [formData, setFormData] = useState<ExecutionComplianceData>(DEFAULT_EXECUTION_COMPLIANCE_DATA);
  const [dailyRecord, setDailyRecord] = useState<ExecutionComplianceRecord | null>(null);
  const [monthlyRecords, setMonthlyRecords] = useState<ExecutionComplianceRecord[]>([]);
  const [message, setMessage] = useState("");
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  const checkMonth = getMonthFromCheckDate(checkDate);
  const monthlySummary = useMemo(() => buildExecutionComplianceMonthlySummary(monthlyRecords), [monthlyRecords]);

  useEffect(() => {
    if (!hydrated || !selectedStore || !checkDate) {
      setDailyRecord(null);
      setFormData(DEFAULT_EXECUTION_COMPLIANCE_DATA);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadingDaily(true);

      try {
        const record = await loadDailyRecord(selectedStore, checkDate);

        if (cancelled) {
          return;
        }

        setDailyRecord(record);
        setFormData(record ? normalizeExecutionComplianceData(record.data) : DEFAULT_EXECUTION_COMPLIANCE_DATA);
        setMessage(record ? `已加载 ${selectedStore} ${checkDate} 的记录。` : "");
      } catch {
        if (!cancelled) {
          setDailyRecord(null);
          setFormData(DEFAULT_EXECUTION_COMPLIANCE_DATA);
        }
      } finally {
        if (!cancelled) {
          setLoadingDaily(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [checkDate, hydrated, loadDailyRecord, selectedStore]);

  useEffect(() => {
    if (!hydrated || !selectedStore || !summaryMonth) {
      setMonthlyRecords([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadingMonthly(true);

      try {
        const records = await loadMonthlyRecords(selectedStore, summaryMonth);

        if (!cancelled) {
          setMonthlyRecords(records);
        }
      } catch {
        if (!cancelled) {
          setMonthlyRecords([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingMonthly(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [hydrated, loadMonthlyRecords, selectedStore, summaryMonth]);

  function updateData<Section extends keyof ExecutionComplianceData>(
    section: Section,
    field: keyof ExecutionComplianceData[Section],
    value: ExecutionComplianceData[Section][keyof ExecutionComplianceData[Section]]
  ) {
    setFormData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value
      }
    }));
  }

  function buildCurrentInput(): ExecutionComplianceInput {
    return {
      storeId: selectedStore,
      checkDate,
      month: checkMonth,
      data: formData
    };
  }

  function buildCurrentRecord(): ExecutionComplianceRecord {
    return buildExecutionComplianceRecord(buildCurrentInput(), dailyRecord ? { id: dailyRecord.id, createdAt: dailyRecord.createdAt } : undefined);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const savedRecord = await upsertDailyRecord(buildCurrentInput());
      setDailyRecord(savedRecord);
      setFormData(savedRecord.data);
      setMessage(`已保存 ${savedRecord.storeId} ${savedRecord.checkDate} 的执行与合规检查。`);

      if (savedRecord.month === summaryMonth && savedRecord.storeId === selectedStore) {
        setMonthlyRecords(await loadMonthlyRecords(selectedStore, summaryMonth));
      }
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  function handleDailyExport(format: "xlsx" | "csv") {
    downloadExecutionComplianceDailyExport(buildCurrentRecord(), format);
  }

  if (!hydrated) {
    return <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">正在加载执行与合规检查...</section>;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">执行与合规检查</h2>
          <p className="mt-1 text-sm text-slate-600">按具体检查日期保存记录，并可按月份汇总追溯。</p>
        </div>
        <div className="inline-flex w-full rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:w-auto">
          {[
            ["daily", "按天填写 / 查看"],
            ["monthly", "按月汇总查看"]
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode as ViewMode)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                viewMode === mode ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {errorMessage ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div> : null}
      {message ? <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">{message}</div> : null}

      {viewMode === "daily" ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">门店</span>
              <select
                value={selectedStore}
                onChange={(event) => setSelectedStore(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                {STORE_OPTIONS.map((store) => (
                  <option key={store.name} value={store.name}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
            <TextField label="检查日期" type="date" value={checkDate} onChange={setCheckDate} />
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">所属月份</span>
              <input
                type="text"
                value={checkMonth}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 shadow-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">记录状态</span>
              <input
                type="text"
                value={loadingDaily ? "读取中" : dailyRecord ? "已有记录" : "空表单"}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 shadow-sm outline-none"
              />
            </label>
          </div>

          <div className="grid gap-5">
            <ProjectCard title="Checklist 未执行">
              <NumberField
                label="每日任务缺失次数"
                value={formData.checklistMissing.dailyTaskMissing}
                onChange={(value) => updateData("checklistMissing", "dailyTaskMissing", value)}
              />
              <NumberField
                label="每周任务缺失次数"
                value={formData.checklistMissing.weeklyTaskMissing}
                onChange={(value) => updateData("checklistMissing", "weeklyTaskMissing", value)}
              />
              <NumberField
                label="每月任务缺失次数"
                value={formData.checklistMissing.monthlyTaskMissing}
                onChange={(value) => updateData("checklistMissing", "monthlyTaskMissing", value)}
              />
              <TextAreaField
                label="未执行事项"
                value={formData.checklistMissing.missingItems}
                onChange={(value) => updateData("checklistMissing", "missingItems", value)}
              />
              <TextAreaField
                label="对应日期"
                value={formData.checklistMissing.relatedDates}
                onChange={(value) => updateData("checklistMissing", "relatedDates", value)}
              />
              <TextAreaField label="备注" value={formData.checklistMissing.note} onChange={(value) => updateData("checklistMissing", "note", value)} />
            </ProjectCard>

            <ProjectCard title="Sling 拍照违规次数">
              <NumberField
                label="违规次数"
                value={formData.slingPhotoViolation.violationCount}
                onChange={(value) => updateData("slingPhotoViolation", "violationCount", value)}
              />
              <TextAreaField
                label="违规日期"
                value={formData.slingPhotoViolation.violationDates}
                onChange={(value) => updateData("slingPhotoViolation", "violationDates", value)}
              />
              <TextAreaField
                label="具体缺失内容"
                value={formData.slingPhotoViolation.missingDetails}
                onChange={(value) => updateData("slingPhotoViolation", "missingDetails", value)}
              />
              <TextAreaField label="备注" value={formData.slingPhotoViolation.note} onChange={(value) => updateData("slingPhotoViolation", "note", value)} />
            </ProjectCard>

            <ProjectCard title="打卡违规">
              <NumberField
                label="打卡违规次数"
                value={formData.clockInViolation.violationCount}
                onChange={(value) => updateData("clockInViolation", "violationCount", value)}
              />
              <NumberField
                label="打卡违规未修改次数"
                value={formData.clockInViolation.uncorrectedCount}
                onChange={(value) => updateData("clockInViolation", "uncorrectedCount", value)}
              />
              <TextAreaField
                label="违规员工"
                value={formData.clockInViolation.employees}
                onChange={(value) => updateData("clockInViolation", "employees", value)}
              />
              <TextAreaField label="日期" value={formData.clockInViolation.dates} onChange={(value) => updateData("clockInViolation", "dates", value)} />
              <TextAreaField
                label="违规类型"
                value={formData.clockInViolation.violationTypes}
                onChange={(value) => updateData("clockInViolation", "violationTypes", value)}
              />
              <SelectField
                label="是否已修改"
                value={formData.clockInViolation.isCorrected}
                onChange={(value) => updateData("clockInViolation", "isCorrected", value)}
                options={[
                  { label: "请选择", value: "" },
                  { label: "已修改", value: "corrected" },
                  { label: "未修改", value: "not_corrected" },
                  { label: "部分修改", value: "partial" }
                ]}
              />
              <div className="md:col-span-2">
                <TextAreaField label="备注" value={formData.clockInViolation.note} onChange={(value) => updateData("clockInViolation", "note", value)} />
              </div>
            </ProjectCard>

            <ProjectCard title="入职确认签署">
              <SelectField
                label="是否完成入职确认签署"
                value={formData.onboardingSignature.isCompleted}
                onChange={(value) => updateData("onboardingSignature", "isCompleted", value)}
                options={[
                  { label: "请选择", value: "" },
                  { label: "完成", value: "completed" },
                  { label: "未完成", value: "not_completed" }
                ]}
              />
              <TextAreaField
                label="未签署员工"
                value={formData.onboardingSignature.unsignedEmployees}
                onChange={(value) => updateData("onboardingSignature", "unsignedEmployees", value)}
              />
              <TextAreaField
                label="入职日期"
                value={formData.onboardingSignature.onboardingDates}
                onChange={(value) => updateData("onboardingSignature", "onboardingDates", value)}
              />
              <TextAreaField
                label="缺失日期"
                value={formData.onboardingSignature.missingDates}
                onChange={(value) => updateData("onboardingSignature", "missingDates", value)}
              />
              <div className="md:col-span-2">
                <TextAreaField
                  label="备注"
                  value={formData.onboardingSignature.note}
                  onChange={(value) => updateData("onboardingSignature", "note", value)}
                />
              </div>
            </ProjectCard>

            <ProjectCard title="执照备份">
              <SelectField
                label="是否已备份至 Google Drive"
                value={formData.licenseBackup.isBackedUpToGoogleDrive}
                onChange={(value) => updateData("licenseBackup", "isBackedUpToGoogleDrive", value)}
                options={[
                  { label: "请选择", value: "" },
                  { label: "已备份", value: "yes" },
                  { label: "未备份", value: "no" }
                ]}
              />
              <TextAreaField
                label="缺失执照名称"
                value={formData.licenseBackup.missingLicenseNames}
                onChange={(value) => updateData("licenseBackup", "missingLicenseNames", value)}
              />
              <TextField label="门店" value={formData.licenseBackup.store} onChange={(value) => updateData("licenseBackup", "store", value)} />
              <TextField
                label="到期日 / 检查日期"
                value={formData.licenseBackup.expirationOrCheckDate}
                onChange={(value) => updateData("licenseBackup", "expirationOrCheckDate", value)}
              />
              <div className="md:col-span-2">
                <TextAreaField label="备注" value={formData.licenseBackup.note} onChange={(value) => updateData("licenseBackup", "note", value)} />
              </div>
            </ProjectCard>

            <ProjectCard title="三大系统员工信息匹配">
              <NumberField
                label="未匹配人数"
                value={formData.systemEmployeeMatching.unmatchedEmployeeCount}
                onChange={(value) => updateData("systemEmployeeMatching", "unmatchedEmployeeCount", value)}
              />
              <TextAreaField
                label="未匹配字段"
                value={formData.systemEmployeeMatching.unmatchedFields}
                onChange={(value) => updateData("systemEmployeeMatching", "unmatchedFields", value)}
              />
              <TextAreaField
                label="涉及系统"
                value={formData.systemEmployeeMatching.involvedSystems}
                onChange={(value) => updateData("systemEmployeeMatching", "involvedSystems", value)}
              />
              <TextAreaField
                label="备注"
                value={formData.systemEmployeeMatching.note}
                onChange={(value) => updateData("systemEmployeeMatching", "note", value)}
              />
            </ProjectCard>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              {dailyRecord ? "更新当日记录" : "保存当日记录"}
            </button>
            <button
              type="button"
              onClick={() => handleDailyExport("xlsx")}
              disabled={!selectedStore || !checkDate}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              导出当日 Excel
            </button>
            <button
              type="button"
              onClick={() => handleDailyExport("csv")}
              disabled={!selectedStore || !checkDate}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              导出当日 CSV
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">门店</span>
              <select
                value={selectedStore}
                onChange={(event) => setSelectedStore(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                {STORE_OPTIONS.map((store) => (
                  <option key={store.name} value={store.name}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">月份</span>
              <input
                type="month"
                value={summaryMonth}
                onChange={(event) => setSummaryMonth(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">读取状态</span>
              <input
                type="text"
                value={loadingMonthly ? "读取中" : monthlyRecords.length > 0 ? `${monthlyRecords.length} 条日记录` : "暂无数据"}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 shadow-sm outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="当前门店" value={selectedStore || "--"} />
            <MetricCard label="当前月份" value={summaryMonth || "--"} />
            <MetricCard label="记录日期数量" value={`${monthlySummary.recordDateCount}`} />
            <MetricCard label="明细问题行" value={`${monthlySummary.detailRows.length}`} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Checklist 未执行" value={`${monthlySummary.totalChecklistMissing}`} helper="每日 + 每周 + 每月缺失次数" />
            <MetricCard label="Sling 拍照违规" value={`${monthlySummary.totalSlingPhotoViolation}`} />
            <MetricCard
              label="打卡违规"
              value={`${monthlySummary.totalClockInViolation}`}
              helper={`未修改 ${monthlySummary.totalUncorrectedClockInViolation}`}
            />
            <MetricCard label="入职未完成记录" value={`${monthlySummary.incompleteOnboardingCount}`} />
            <MetricCard label="执照未备份记录" value={`${monthlySummary.missingLicenseBackupCount}`} />
            <MetricCard label="员工信息未匹配人数" value={`${monthlySummary.totalUnmatchedEmployeeCount}`} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadExecutionComplianceMonthlyExport(monthlyRecords, "xlsx")}
              disabled={monthlyRecords.length === 0}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              导出月度 Excel
            </button>
            <button
              type="button"
              onClick={() => downloadExecutionComplianceMonthlyExport(monthlyRecords, "csv")}
              disabled={monthlyRecords.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              导出月度 CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">日期</th>
                  <th className="px-4 py-3 font-medium">检查项目</th>
                  <th className="px-4 py-3 font-medium">子项 / 字段</th>
                  <th className="px-4 py-3 font-medium">次数</th>
                  <th className="px-4 py-3 font-medium">涉及员工</th>
                  <th className="px-4 py-3 font-medium">涉及执照</th>
                  <th className="px-4 py-3 font-medium">涉及系统</th>
                  <th className="px-4 py-3 font-medium">具体问题内容</th>
                  <th className="px-4 py-3 font-medium">备注</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.detailRows.map((row, index) => (
                  <tr key={`${row.checkDate}-${row.item}-${index}`} className="border-t border-slate-200 align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{row.checkDate}</td>
                    <td className="px-4 py-3">{row.item}</td>
                    <td className="px-4 py-3 text-slate-600">{row.subItem || "--"}</td>
                    <td className="px-4 py-3">{row.count}</td>
                    <td className="px-4 py-3 text-slate-600">{row.relatedEmployees || "--"}</td>
                    <td className="px-4 py-3 text-slate-600">{row.relatedLicenses || "--"}</td>
                    <td className="px-4 py-3 text-slate-600">{row.relatedSystems || "--"}</td>
                    <td className="max-w-[320px] px-4 py-3 text-slate-600">{row.issueContent || "--"}</td>
                    <td className="max-w-[280px] px-4 py-3 text-slate-600">{row.note || "--"}</td>
                  </tr>
                ))}
                {monthlySummary.detailRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                      暂无数据。
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
