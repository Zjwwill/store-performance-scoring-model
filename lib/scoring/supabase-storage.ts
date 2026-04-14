import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { ScoreHistoryRecord, ScoreRecord, StoreType } from "@/lib/scoring/types";

interface ScoreRow {
  id: string;
  month: string;
  store: string;
  store_type: string;
  missing_invoice_count: number;
  invoice_error_count: number;
  mid_inventory_late: boolean;
  end_inventory_late: boolean;
  weekly_report_late_count: number;
  weekly_report_format_error_count: number;
  severe_price_issue: boolean;
  cash_missing_days: number;
  deposit_late_count: number;
  cash_mismatch_count: number;
  employee_meal_missing_count: number;
  waste_log_issue_count: number;
  employee_info_error_count: number;
  sling_late_count: number;
  opus_assigned: boolean;
  opus_late_count: number;
  inventory_deduction: number | string;
  cash_deduction: number | string;
  waste_deduction: number | string;
  labor_deduction: number | string;
  opus_deduction: number | string;
  total_deduction: number | string;
  final_score: number | string;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

interface ScoreHistoryRow {
  id: string;
  score_id: string | null;
  action_type: string;
  old_data: Partial<ScoreRecord> | null;
  new_data: Partial<ScoreRecord> | null;
  changed_by: string | null;
  changed_at: string;
}

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase environment variables are missing. Please fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
}

function toNumber(value: number | string | null | undefined): number {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapRowToScoreRecord(row: ScoreRow): ScoreRecord {
  return {
    id: row.id,
    month: row.month,
    store: row.store,
    storeType: row.store_type as StoreType,
    missingInvoiceCount: row.missing_invoice_count ?? 0,
    invoiceErrorCount: row.invoice_error_count ?? 0,
    midInventoryLate: row.mid_inventory_late ?? false,
    endInventoryLate: row.end_inventory_late ?? false,
    weeklyReportLateCount: row.weekly_report_late_count ?? 0,
    weeklyReportFormatErrorCount: row.weekly_report_format_error_count ?? 0,
    severePriceIssue: row.severe_price_issue ?? false,
    cashMissingDays: row.cash_missing_days ?? 0,
    depositLateCount: row.deposit_late_count ?? 0,
    cashMismatchCount: row.cash_mismatch_count ?? 0,
    employeeMealMissingCount: row.employee_meal_missing_count ?? 0,
    wasteLogIssueCount: row.waste_log_issue_count ?? 0,
    employeeInfoErrorCount: row.employee_info_error_count ?? 0,
    slingLateCount: row.sling_late_count ?? 0,
    opusAssigned: row.opus_assigned ?? false,
    opusLateCount: row.opus_late_count ?? 0,
    inventoryDeduction: toNumber(row.inventory_deduction),
    cashDeduction: toNumber(row.cash_deduction),
    wasteDeduction: toNumber(row.waste_deduction),
    laborDeduction: toNumber(row.labor_deduction),
    opusDeduction: toNumber(row.opus_deduction),
    totalDeduction: toNumber(row.total_deduction),
    finalScore: toNumber(row.final_score),
    remark: row.remark ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapScoreRecordToRow(record: ScoreRecord) {
  return {
    id: record.id,
    month: record.month,
    store: record.store,
    store_type: record.storeType,
    missing_invoice_count: record.missingInvoiceCount,
    invoice_error_count: record.invoiceErrorCount,
    mid_inventory_late: record.midInventoryLate,
    end_inventory_late: record.endInventoryLate,
    weekly_report_late_count: record.weeklyReportLateCount,
    weekly_report_format_error_count: record.weeklyReportFormatErrorCount,
    severe_price_issue: record.severePriceIssue,
    cash_missing_days: record.cashMissingDays,
    deposit_late_count: record.depositLateCount,
    cash_mismatch_count: record.cashMismatchCount,
    employee_meal_missing_count: record.employeeMealMissingCount,
    waste_log_issue_count: record.wasteLogIssueCount,
    employee_info_error_count: record.employeeInfoErrorCount,
    sling_late_count: record.slingLateCount,
    opus_assigned: record.opusAssigned,
    opus_late_count: record.opusLateCount,
    inventory_deduction: record.inventoryDeduction,
    cash_deduction: record.cashDeduction,
    waste_deduction: record.wasteDeduction,
    labor_deduction: record.laborDeduction,
    opus_deduction: record.opusDeduction,
    total_deduction: record.totalDeduction,
    final_score: record.finalScore,
    remark: record.remark,
    created_at: record.createdAt,
    updated_at: record.updatedAt
  };
}

async function insertHistoryEntry(history: {
  scoreId: string | null;
  actionType: string;
  oldData: Partial<ScoreRecord> | null;
  newData: Partial<ScoreRecord> | null;
  changedBy: string;
}) {
  const { error } = await getSupabaseClient().from("score_history").insert({
    score_id: history.scoreId,
    action_type: history.actionType,
    old_data: history.oldData,
    new_data: history.newData,
    changed_by: history.changedBy
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function sortScoreRecords(records: ScoreRecord[]): ScoreRecord[] {
  return [...records].sort((left, right) => {
    if (left.month !== right.month) {
      return right.month.localeCompare(left.month);
    }

    return left.store.localeCompare(right.store);
  });
}

export async function getAllScores(): Promise<ScoreRecord[]> {
  ensureSupabaseConfigured();

  const { data, error } = await getSupabaseClient().from("store_scores").select("*").order("month", { ascending: false }).order("store", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return sortScoreRecords((data as ScoreRow[]).map(mapRowToScoreRecord));
}

export async function getScoreById(scoreId: string): Promise<ScoreRecord | null> {
  ensureSupabaseConfigured();

  const { data, error } = await getSupabaseClient().from("store_scores").select("*").eq("id", scoreId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToScoreRecord(data as ScoreRow) : null;
}

export async function getScoreByMonthAndStore(month: string, store: string): Promise<ScoreRecord | null> {
  ensureSupabaseConfigured();

  const { data, error } = await getSupabaseClient().from("store_scores").select("*").eq("month", month).eq("store", store).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToScoreRecord(data as ScoreRow) : null;
}

export async function createScore(record: ScoreRecord, changedBy: string): Promise<ScoreRecord> {
  ensureSupabaseConfigured();

  const payload = mapScoreRecordToRow(record);
  const { data, error } = await getSupabaseClient().from("store_scores").insert(payload).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  const createdRecord = mapRowToScoreRecord(data as ScoreRow);

  await insertHistoryEntry({
    scoreId: createdRecord.id,
    actionType: "create",
    oldData: null,
    newData: createdRecord,
    changedBy
  });

  return createdRecord;
}

export async function updateScore(record: ScoreRecord, changedBy: string): Promise<ScoreRecord> {
  ensureSupabaseConfigured();

  const oldRecord = await getScoreById(record.id);

  if (!oldRecord) {
    throw new Error("The record you are trying to edit no longer exists.");
  }

  await insertHistoryEntry({
    scoreId: record.id,
    actionType: "update",
    oldData: oldRecord,
    newData: record,
    changedBy
  });

  const { data, error } = await getSupabaseClient()
    .from("store_scores")
    .update(mapScoreRecordToRow(record))
    .eq("id", record.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToScoreRecord(data as ScoreRow);
}

export async function deleteScore(scoreId: string, changedBy: string): Promise<void> {
  ensureSupabaseConfigured();

  const oldRecord = await getScoreById(scoreId);

  if (!oldRecord) {
    return;
  }

  await insertHistoryEntry({
    scoreId,
    actionType: "delete",
    oldData: oldRecord,
    newData: null,
    changedBy
  });

  const { error } = await getSupabaseClient().from("store_scores").delete().eq("id", scoreId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getAllScoreHistory(): Promise<ScoreHistoryRecord[]> {
  ensureSupabaseConfigured();

  const { data, error } = await getSupabaseClient().from("score_history").select("*").order("changed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ScoreHistoryRow[]).map((row) => ({
    id: row.id,
    scoreId: row.score_id,
    actionType: row.action_type,
    oldData: row.old_data,
    newData: row.new_data,
    changedBy: row.changed_by ?? "",
    changedAt: row.changed_at
  }));
}
