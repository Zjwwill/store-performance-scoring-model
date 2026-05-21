import {
  EXECUTION_COMPLIANCE_SECTION_TYPE,
  buildExecutionComplianceRecord,
  getExecutionComplianceIdentityKey,
  sortExecutionComplianceRecords
} from "@/lib/scoring/execution-compliance";
import type { ExecutionComplianceInput, ExecutionComplianceRecord } from "@/lib/scoring/execution-compliance";

export const EXECUTION_COMPLIANCE_STORAGE_KEY = "store-execution-compliance-records-v1";

export function loadExecutionComplianceRecords(): ExecutionComplianceRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(EXECUTION_COMPLIANCE_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    const records = parsed.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const candidate = item as Partial<ExecutionComplianceRecord>;

      try {
        const record = buildExecutionComplianceRecord(candidate, {
          id: typeof candidate.id === "string" ? candidate.id : undefined,
          createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : undefined
        });

        return [
          {
            ...record,
            updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : record.updatedAt
          }
        ];
      } catch {
        return [];
      }
    });

    return sortExecutionComplianceRecords(records);
  } catch {
    return [];
  }
}

export function saveExecutionComplianceRecords(records: ExecutionComplianceRecord[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(EXECUTION_COMPLIANCE_STORAGE_KEY, JSON.stringify(sortExecutionComplianceRecords(records)));
}

export function getLocalExecutionComplianceByDate(storeId: string, checkDate: string): ExecutionComplianceRecord | null {
  return (
    loadExecutionComplianceRecords().find(
      (record) => record.storeId === storeId && record.checkDate === checkDate && record.sectionType === EXECUTION_COMPLIANCE_SECTION_TYPE
    ) ?? null
  );
}

export function getLocalExecutionComplianceByMonth(storeId: string, month: string): ExecutionComplianceRecord[] {
  return sortExecutionComplianceRecords(
    loadExecutionComplianceRecords().filter(
      (record) => record.storeId === storeId && record.month === month && record.sectionType === EXECUTION_COMPLIANCE_SECTION_TYPE
    )
  ).reverse();
}

export function upsertLocalExecutionComplianceRecord(input: ExecutionComplianceInput): ExecutionComplianceRecord {
  const existingRecords = loadExecutionComplianceRecords();
  const incomingRecord = buildExecutionComplianceRecord(input);
  const identityKey = getExecutionComplianceIdentityKey(incomingRecord);
  const existingIndex = existingRecords.findIndex(
    (record) => record.id === incomingRecord.id || getExecutionComplianceIdentityKey(record) === identityKey
  );
  const nextRecords = [...existingRecords];

  if (existingIndex >= 0) {
    const existingRecord = nextRecords[existingIndex];
    nextRecords[existingIndex] = buildExecutionComplianceRecord(input, {
      id: existingRecord.id,
      createdAt: existingRecord.createdAt
    });
  } else {
    nextRecords.push(incomingRecord);
  }

  saveExecutionComplianceRecords(nextRecords);

  return existingIndex >= 0 ? nextRecords[existingIndex] : incomingRecord;
}

