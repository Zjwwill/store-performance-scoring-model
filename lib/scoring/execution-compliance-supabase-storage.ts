import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  EXECUTION_COMPLIANCE_SECTION_TYPE,
  buildExecutionComplianceRecord,
  sortExecutionComplianceRecords
} from "@/lib/scoring/execution-compliance";
import type { ExecutionComplianceData, ExecutionComplianceInput, ExecutionComplianceRecord } from "@/lib/scoring/execution-compliance";

interface ExecutionComplianceRow {
  id: string;
  store_id: string;
  check_date: string;
  month: string;
  section_type: string;
  data: Partial<ExecutionComplianceData> | null;
  created_at: string;
  updated_at: string;
}

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase environment variables are missing. Please fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
}

function mapRowToExecutionComplianceRecord(row: ExecutionComplianceRow): ExecutionComplianceRecord {
  const record = buildExecutionComplianceRecord(
    {
      storeId: row.store_id,
      checkDate: row.check_date,
      month: row.month,
      data: row.data ?? undefined
    },
    {
      id: row.id,
      createdAt: row.created_at
    }
  );

  return {
    ...record,
    updatedAt: row.updated_at
  };
}

function mapExecutionComplianceRecordToRow(record: ExecutionComplianceRecord) {
  return {
    id: record.id,
    store_id: record.storeId,
    check_date: record.checkDate,
    month: record.month,
    section_type: record.sectionType,
    data: record.data,
    created_at: record.createdAt,
    updated_at: record.updatedAt
  };
}

async function insertExecutionComplianceHistory(history: {
  actionType: string;
  oldData: Partial<ExecutionComplianceRecord> | null;
  newData: Partial<ExecutionComplianceRecord> | null;
  changedBy: string;
}) {
  const { error } = await getSupabaseClient().from("score_history").insert({
    score_id: null,
    action_type: history.actionType,
    old_data: history.oldData,
    new_data: history.newData,
    changed_by: history.changedBy
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getExecutionComplianceByDate(storeId: string, checkDate: string): Promise<ExecutionComplianceRecord | null> {
  ensureSupabaseConfigured();

  const { data, error } = await getSupabaseClient()
    .from("execution_compliance_records")
    .select("*")
    .eq("store_id", storeId)
    .eq("check_date", checkDate)
    .eq("section_type", EXECUTION_COMPLIANCE_SECTION_TYPE)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToExecutionComplianceRecord(data as ExecutionComplianceRow) : null;
}

export async function getExecutionComplianceByMonth(storeId: string, month: string): Promise<ExecutionComplianceRecord[]> {
  ensureSupabaseConfigured();

  const { data, error } = await getSupabaseClient()
    .from("execution_compliance_records")
    .select("*")
    .eq("store_id", storeId)
    .eq("month", month)
    .eq("section_type", EXECUTION_COMPLIANCE_SECTION_TYPE)
    .order("check_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return sortExecutionComplianceRecords((data as ExecutionComplianceRow[]).map(mapRowToExecutionComplianceRecord)).reverse();
}

export async function upsertExecutionComplianceRecord(input: ExecutionComplianceInput, changedBy: string): Promise<ExecutionComplianceRecord> {
  ensureSupabaseConfigured();

  const existingRecord = await getExecutionComplianceByDate(input.storeId, input.checkDate);
  const record = buildExecutionComplianceRecord(input, existingRecord ? { id: existingRecord.id, createdAt: existingRecord.createdAt } : undefined);
  const { data, error } = await getSupabaseClient()
    .from("execution_compliance_records")
    .upsert(mapExecutionComplianceRecordToRow(record), {
      onConflict: "store_id,check_date,section_type"
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const savedRecord = mapRowToExecutionComplianceRecord(data as ExecutionComplianceRow);

  await insertExecutionComplianceHistory({
    actionType: existingRecord ? "execution_compliance_update" : "execution_compliance_create",
    oldData: existingRecord,
    newData: savedRecord,
    changedBy
  });

  return savedRecord;
}

