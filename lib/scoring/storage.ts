import { buildScoreRecord } from "@/lib/scoring/calculations";
import type { ScoreRecord } from "@/lib/scoring/types";

export const SCORE_STORAGE_KEY = "store-data-management-scoring-records-v1";

function getIdentityKey(record: Pick<ScoreRecord, "month" | "store">): string {
  return `${record.month}__${record.store}`;
}

export function sortScoreRecords(records: ScoreRecord[]): ScoreRecord[] {
  return [...records].sort((left, right) => {
    if (left.month !== right.month) {
      return right.month.localeCompare(left.month);
    }

    return left.store.localeCompare(right.store);
  });
}

export function loadScoreRecords(): ScoreRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(SCORE_STORAGE_KEY);

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

      const candidate = item as Partial<ScoreRecord>;

      try {
        return [
          buildScoreRecord(candidate, {
            id: typeof candidate.id === "string" ? candidate.id : undefined,
            createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : undefined
          })
        ];
      } catch {
        return [];
      }
    });

    return sortScoreRecords(records);
  } catch {
    return [];
  }
}

export function saveScoreRecords(records: ScoreRecord[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(sortScoreRecords(records)));
}

export function upsertScoreRecord(records: ScoreRecord[], incomingRecord: ScoreRecord): ScoreRecord[] {
  const identityKey = getIdentityKey(incomingRecord);
  const nextRecords = [...records];
  const existingIndex = nextRecords.findIndex(
    (record) => record.id === incomingRecord.id || getIdentityKey(record) === identityKey
  );

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = incomingRecord;
  } else {
    nextRecords.push(incomingRecord);
  }

  return sortScoreRecords(nextRecords);
}

export function mergeScoreRecords(existingRecords: ScoreRecord[], importedRecords: ScoreRecord[]): ScoreRecord[] {
  const mergedMap = new Map(existingRecords.map((record) => [getIdentityKey(record), record]));

  for (const record of importedRecords) {
    const existingRecord = mergedMap.get(getIdentityKey(record));
    mergedMap.set(
      getIdentityKey(record),
      existingRecord ? buildScoreRecord(record, { id: existingRecord.id, createdAt: existingRecord.createdAt }) : record
    );
  }

  return sortScoreRecords(Array.from(mergedMap.values()));
}

export function deleteScoreRecord(records: ScoreRecord[], recordId: string): ScoreRecord[] {
  return sortScoreRecords(records.filter((record) => record.id !== recordId));
}
