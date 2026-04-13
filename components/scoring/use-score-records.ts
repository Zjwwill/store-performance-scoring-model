"use client";

import { useEffect, useState } from "react";
import { buildScoreRecord, normalizeScoreInput } from "@/lib/scoring/calculations";
import { mockScoreRecords } from "@/lib/scoring/mock-data";
import { deleteScoreRecord, loadScoreRecords, mergeScoreRecords, saveScoreRecords, sortScoreRecords, upsertScoreRecord } from "@/lib/scoring/storage";
import type { ScoreInput, ScoreRecord } from "@/lib/scoring/types";

export function useScoreRecords() {
  const [records, setRecords] = useState<ScoreRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecords(loadScoreRecords());
    setHydrated(true);
  }, []);

  function persist(nextRecords: ScoreRecord[]) {
    const sortedRecords = sortScoreRecords(nextRecords);
    setRecords(sortedRecords);
    saveScoreRecords(sortedRecords);
  }

  function createRecord(input: ScoreInput): ScoreRecord {
    const normalized = normalizeScoreInput(input);
    const existingRecord = records.find((record) => record.month === normalized.month && record.store === normalized.store);

    if (existingRecord) {
      throw new Error(`Record already exists for ${normalized.store} in ${normalized.month}.`);
    }

    const record = buildScoreRecord(normalized);

    persist(upsertScoreRecord(records, record));

    return record;
  }

  function updateRecord(input: ScoreInput, recordId: string): ScoreRecord {
    const normalized = normalizeScoreInput(input);
    const existingRecord = records.find((record) => record.id === recordId);

    if (!existingRecord) {
      throw new Error("The record you are trying to edit no longer exists.");
    }

    const record = buildScoreRecord(normalized, { id: existingRecord.id, createdAt: existingRecord.createdAt });

    persist(upsertScoreRecord(records, record));

    return record;
  }

  function removeRecord(recordId: string) {
    persist(deleteScoreRecord(records, recordId));
  }

  function replaceAllRecords(nextRecords: ScoreRecord[]) {
    persist(nextRecords);
  }

  function mergeImportedRecords(importedRecords: ScoreRecord[]) {
    persist(mergeScoreRecords(records, importedRecords));
  }

  function loadMockRecords() {
    persist(mockScoreRecords);
  }

  function clearAllRecords() {
    persist([]);
  }

  return {
    records,
    hydrated,
    createRecord,
    updateRecord,
    removeRecord,
    replaceAllRecords,
    mergeImportedRecords,
    loadMockRecords,
    clearAllRecords
  };
}
