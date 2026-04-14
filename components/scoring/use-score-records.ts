"use client";

import { useEffect, useState } from "react";
import { buildScoreRecord, normalizeScoreInput } from "@/lib/scoring/calculations";
import { mockScoreRecords } from "@/lib/scoring/mock-data";
import {
  createScore,
  deleteScore,
  getAllScoreHistory,
  getAllScores,
  getScoreByMonthAndStore,
  sortScoreRecords,
  updateScore
} from "@/lib/scoring/supabase-storage";
import type { ScoreHistoryRecord, ScoreInput, ScoreRecord } from "@/lib/scoring/types";

const OPERATOR_STORAGE_KEY = "operator_name";

function getOperatorName(): string {
  if (typeof window === "undefined") {
    return "Anonymous";
  }

  return window.localStorage.getItem(OPERATOR_STORAGE_KEY)?.trim() || "Anonymous";
}

export function useScoreRecords() {
  const [records, setRecords] = useState<ScoreRecord[]>([]);
  const [historyEntries, setHistoryEntries] = useState<ScoreHistoryRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function refreshAll() {
    const [scoreRecords, scoreHistory] = await Promise.all([getAllScores(), getAllScoreHistory()]);
    setRecords(scoreRecords);
    setHistoryEntries(scoreHistory);
  }

  useEffect(() => {
    async function loadRemoteData() {
      try {
        await refreshAll();
      } catch (error) {
        setErrorMessage((error as Error).message);
      } finally {
        setHydrated(true);
      }
    }

    void loadRemoteData();
  }, []);

  async function runWithErrorHandling<T>(action: () => Promise<T>): Promise<T> {
    setErrorMessage("");

    try {
      return await action();
    } catch (error) {
      setErrorMessage((error as Error).message);
      throw error;
    }
  }

  async function createRecord(input: ScoreInput): Promise<ScoreRecord> {
    return runWithErrorHandling(async () => {
      const normalized = normalizeScoreInput(input);
      const existingRecord = await getScoreByMonthAndStore(normalized.month, normalized.store);

      if (existingRecord) {
        throw new Error(`Record already exists for ${normalized.store} in ${normalized.month}.`);
      }

      const record = await createScore(buildScoreRecord(normalized), getOperatorName());
      await refreshAll();
      return record;
    });
  }

  async function updateRecord(input: ScoreInput, recordId: string): Promise<ScoreRecord> {
    return runWithErrorHandling(async () => {
      const normalized = normalizeScoreInput(input);
      const existingRecord = records.find((record) => record.id === recordId);

      if (!existingRecord) {
        throw new Error("The record you are trying to edit no longer exists.");
      }

      const record = await updateScore(
        buildScoreRecord(normalized, { id: existingRecord.id, createdAt: existingRecord.createdAt }),
        getOperatorName()
      );

      await refreshAll();
      return record;
    });
  }

  async function removeRecord(recordId: string) {
    await runWithErrorHandling(async () => {
      await deleteScore(recordId, getOperatorName());
      await refreshAll();
    });
  }

  async function replaceAllRecords(nextRecords: ScoreRecord[]) {
    await runWithErrorHandling(async () => {
      for (const record of records) {
        await deleteScore(record.id, getOperatorName());
      }

      for (const record of nextRecords) {
        await createScore(record, getOperatorName());
      }

      await refreshAll();
    });
  }

  async function mergeImportedRecords(importedRecords: ScoreRecord[]) {
    await runWithErrorHandling(async () => {
      for (const record of importedRecords) {
        const existingRecord = await getScoreByMonthAndStore(record.month, record.store);

        if (existingRecord) {
          await updateScore(
            buildScoreRecord(record, { id: existingRecord.id, createdAt: existingRecord.createdAt }),
            getOperatorName()
          );
        } else {
          await createScore(record, getOperatorName());
        }
      }

      await refreshAll();
    });
  }

  async function loadMockRecords() {
    await runWithErrorHandling(async () => {
      for (const record of mockScoreRecords) {
        const existingRecord = await getScoreByMonthAndStore(record.month, record.store);

        if (existingRecord) {
          await updateScore(
            buildScoreRecord(record, { id: existingRecord.id, createdAt: existingRecord.createdAt }),
            getOperatorName()
          );
        } else {
          await createScore(record, getOperatorName());
        }
      }

      await refreshAll();
    });
  }

  async function clearAllRecords() {
    await runWithErrorHandling(async () => {
      for (const record of records) {
        await deleteScore(record.id, getOperatorName());
      }

      await refreshAll();
    });
  }

  return {
    records: sortScoreRecords(records),
    historyEntries,
    hydrated,
    errorMessage,
    createRecord,
    updateRecord,
    removeRecord,
    replaceAllRecords,
    mergeImportedRecords,
    loadMockRecords,
    clearAllRecords,
    refreshAll
  };
}
