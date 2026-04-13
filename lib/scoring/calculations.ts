import { DEDUCTION_LIMITS, DEFAULT_SCORE_INPUT, MAX_SCORE, getStoreType } from "@/lib/scoring/config";
import type { ScoreBreakdown, ScoreInput, ScoreRecord, StoreType } from "@/lib/scoring/types";

function clampNonNegative(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function clampBoolean(value: unknown): boolean {
  return value === true;
}

function clampDeduction(value: number, maximum: number): number {
  return roundScore(Math.min(value, maximum));
}

function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}

function generateRecordId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `score-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeScoreInput(input?: Partial<ScoreInput>): ScoreInput {
  return {
    month: typeof input?.month === "string" ? input.month.trim() : DEFAULT_SCORE_INPUT.month,
    store: typeof input?.store === "string" ? input.store.trim() : DEFAULT_SCORE_INPUT.store,
    missingInvoiceCount: clampNonNegative(input?.missingInvoiceCount),
    invoiceErrorCount: clampNonNegative(input?.invoiceErrorCount),
    midInventoryLate: clampBoolean(input?.midInventoryLate),
    endInventoryLate: clampBoolean(input?.endInventoryLate),
    weeklyReportLateCount: clampNonNegative(input?.weeklyReportLateCount),
    weeklyReportFormatErrorCount: clampNonNegative(input?.weeklyReportFormatErrorCount),
    severePriceIssue: clampBoolean(input?.severePriceIssue),
    cashMissingDays: clampNonNegative(input?.cashMissingDays),
    depositLateCount: clampNonNegative(input?.depositLateCount),
    cashMismatchCount: clampNonNegative(input?.cashMismatchCount),
    employeeMealMissingCount: clampNonNegative(input?.employeeMealMissingCount),
    wasteLogIssueCount: clampNonNegative(input?.wasteLogIssueCount),
    employeeInfoErrorCount: clampNonNegative(input?.employeeInfoErrorCount),
    slingLateCount: clampNonNegative(input?.slingLateCount),
    opusAssigned: clampBoolean(input?.opusAssigned),
    opusLateCount: clampNonNegative(input?.opusLateCount),
    remark: typeof input?.remark === "string" ? input.remark.trim() : DEFAULT_SCORE_INPUT.remark
  };
}

export function calculateInvoiceDeduction(input: ScoreInput, storeType: StoreType): number {
  if (storeType !== "Self-Procurement Store") {
    return 0;
  }

  return clampDeduction(input.missingInvoiceCount * 1 + input.invoiceErrorCount * 0.25, DEDUCTION_LIMITS.invoice);
}

export function calculateInventoryExecutionDeduction(input: ScoreInput, storeType: StoreType): number {
  const unitDeduction = storeType === "Self-Procurement Store" ? 1.5 : 6;
  const maxDeduction =
    storeType === "Self-Procurement Store" ? DEDUCTION_LIMITS.inventoryExecutionSelf : DEDUCTION_LIMITS.inventoryExecutionBay;

  return clampDeduction((input.midInventoryLate ? unitDeduction : 0) + (input.endInventoryLate ? unitDeduction : 0), maxDeduction);
}

export function calculateWeeklyReportDeduction(input: ScoreInput, storeType: StoreType): number {
  if (storeType !== "Self-Procurement Store") {
    return 0;
  }

  if (input.severePriceIssue) {
    return DEDUCTION_LIMITS.weeklyReport;
  }

  return clampDeduction(input.weeklyReportLateCount * 2 + input.weeklyReportFormatErrorCount * 1, DEDUCTION_LIMITS.weeklyReport);
}

export function calculateInventoryDeduction(input: ScoreInput, storeType: StoreType): number {
  return clampDeduction(
    calculateInvoiceDeduction(input, storeType) +
      calculateInventoryExecutionDeduction(input, storeType) +
      calculateWeeklyReportDeduction(input, storeType),
    DEDUCTION_LIMITS.inventory
  );
}

export function calculateCashDeduction(input: ScoreInput): number {
  return clampDeduction((input.cashMissingDays + input.depositLateCount + input.cashMismatchCount) * 0.5, DEDUCTION_LIMITS.cash);
}

export function calculateWasteDeduction(input: ScoreInput): number {
  return clampDeduction(input.employeeMealMissingCount + input.wasteLogIssueCount, DEDUCTION_LIMITS.waste);
}

export function calculateLaborDeduction(input: ScoreInput): number {
  return clampDeduction(input.employeeInfoErrorCount * 0.5 + input.slingLateCount, DEDUCTION_LIMITS.labor);
}

export function calculateOpusDeduction(input: ScoreInput): number {
  if (!input.opusAssigned) {
    return 0;
  }

  return clampDeduction(input.opusLateCount * 0.5, DEDUCTION_LIMITS.opus);
}

export function calculateScoreBreakdown(input: ScoreInput, storeType: StoreType): ScoreBreakdown {
  const inventoryDeduction = calculateInventoryDeduction(input, storeType);
  const cashDeduction = calculateCashDeduction(input);
  const wasteDeduction = calculateWasteDeduction(input);
  const laborDeduction = calculateLaborDeduction(input);
  const opusDeduction = calculateOpusDeduction(input);
  const totalDeduction = roundScore(inventoryDeduction + cashDeduction + wasteDeduction + laborDeduction + opusDeduction);
  const finalScore = roundScore(Math.max(0, MAX_SCORE - totalDeduction));

  return {
    inventoryDeduction,
    cashDeduction,
    wasteDeduction,
    laborDeduction,
    opusDeduction,
    totalDeduction,
    finalScore
  };
}

export function buildScoreRecord(input?: Partial<ScoreInput>, existing?: Partial<Pick<ScoreRecord, "id" | "createdAt">>): ScoreRecord {
  const normalized = normalizeScoreInput(input);
  const storeType = getStoreType(normalized.store);

  if (!normalized.month) {
    throw new Error("Month is required.");
  }

  if (!normalized.store) {
    throw new Error("Store is required.");
  }

  if (!storeType) {
    throw new Error(`Unknown store: ${normalized.store}`);
  }

  const now = new Date().toISOString();

  return {
    id: existing?.id ?? generateRecordId(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    storeType,
    ...normalized,
    ...calculateScoreBreakdown(normalized, storeType)
  };
}
