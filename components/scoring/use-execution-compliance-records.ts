"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getExecutionComplianceByDate,
  getExecutionComplianceByMonth,
  upsertExecutionComplianceRecord
} from "@/lib/scoring/execution-compliance-supabase-storage";
import {
  getLocalExecutionComplianceByDate,
  getLocalExecutionComplianceByMonth,
  upsertLocalExecutionComplianceRecord
} from "@/lib/scoring/execution-compliance-storage";
import type { ExecutionComplianceInput, ExecutionComplianceRecord } from "@/lib/scoring/execution-compliance";

const OPERATOR_STORAGE_KEY = "operator_name";

function getOperatorName(): string {
  if (typeof window === "undefined") {
    return "Anonymous";
  }

  return window.localStorage.getItem(OPERATOR_STORAGE_KEY)?.trim() || "Anonymous";
}

export function useExecutionComplianceRecords() {
  const [hydrated, setHydrated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setHydrated(true);
  }, []);

  const runWithErrorHandling = useCallback(async function runWithErrorHandling<T>(action: () => Promise<T>): Promise<T> {
    setErrorMessage("");

    try {
      return await action();
    } catch (error) {
      setErrorMessage((error as Error).message);
      throw error;
    }
  }, []);

  const loadDailyRecord = useCallback(async function loadDailyRecord(storeId: string, checkDate: string): Promise<ExecutionComplianceRecord | null> {
    if (!storeId || !checkDate) {
      return null;
    }

    return runWithErrorHandling(async () => {
      if (isSupabaseConfigured) {
        return getExecutionComplianceByDate(storeId, checkDate);
      }

      return getLocalExecutionComplianceByDate(storeId, checkDate);
    });
  }, [runWithErrorHandling]);

  const loadMonthlyRecords = useCallback(async function loadMonthlyRecords(storeId: string, month: string): Promise<ExecutionComplianceRecord[]> {
    if (!storeId || !month) {
      return [];
    }

    return runWithErrorHandling(async () => {
      if (isSupabaseConfigured) {
        return getExecutionComplianceByMonth(storeId, month);
      }

      return getLocalExecutionComplianceByMonth(storeId, month);
    });
  }, [runWithErrorHandling]);

  const upsertDailyRecord = useCallback(async function upsertDailyRecord(input: ExecutionComplianceInput): Promise<ExecutionComplianceRecord> {
    return runWithErrorHandling(async () => {
      if (isSupabaseConfigured) {
        return upsertExecutionComplianceRecord(input, getOperatorName());
      }

      return upsertLocalExecutionComplianceRecord(input);
    });
  }, [runWithErrorHandling]);

  return {
    hydrated,
    errorMessage,
    loadDailyRecord,
    loadMonthlyRecords,
    upsertDailyRecord
  };
}
