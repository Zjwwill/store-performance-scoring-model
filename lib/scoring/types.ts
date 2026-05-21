export type StoreType = "Self-Procurement Store" | "Bay Area Store";

export interface StoreOption {
  name: string;
  type: StoreType;
}

export interface ScoreInput {
  month: string;
  store: string;
  missingInvoiceCount: number;
  invoiceErrorCount: number;
  midInventoryLate: boolean;
  endInventoryLate: boolean;
  weeklyReportLateCount: number;
  weeklyReportFormatErrorCount: number;
  severePriceIssue: boolean;
  cashMissingDays: number;
  depositLateCount: number;
  cashMismatchCount: number;
  employeeMealMissingCount: number;
  wasteLogIssueCount: number;
  employeeInfoErrorCount: number;
  slingLateCount: number;
  opusAssigned: boolean;
  opusLateCount: number;
  remark: string;
}

export interface ScoreBreakdown {
  inventoryDeduction: number;
  cashDeduction: number;
  wasteDeduction: number;
  laborDeduction: number;
  opusDeduction: number;
  totalDeduction: number;
  finalScore: number;
}

export interface ScoreRecord extends ScoreInput, ScoreBreakdown {
  id: string;
  storeType: StoreType;
  createdAt: string;
  updatedAt: string;
}

export type ScoreHistoryData = Partial<ScoreRecord> & {
  storeId?: string;
  checkDate?: string;
  sectionType?: string;
};

export interface ScoreHistoryRecord {
  id: string;
  scoreId: string | null;
  actionType: string;
  oldData: ScoreHistoryData | null;
  newData: ScoreHistoryData | null;
  changedBy: string;
  changedAt: string;
}

export type OverviewSortField =
  | "month"
  | "store"
  | "storeType"
  | "inventoryDeduction"
  | "cashDeduction"
  | "wasteDeduction"
  | "laborDeduction"
  | "opusDeduction"
  | "totalDeduction"
  | "finalScore";
