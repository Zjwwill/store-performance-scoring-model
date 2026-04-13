import type { ScoreInput, StoreOption, StoreType } from "@/lib/scoring/types";

export const MAX_SCORE = 20;

export const STORE_OPTIONS: StoreOption[] = [
  { name: "Edison", type: "Self-Procurement Store" },
  { name: "Columbia", type: "Self-Procurement Store" },
  { name: "Boston", type: "Self-Procurement Store" },
  { name: "Jersey City", type: "Self-Procurement Store" },
  { name: "Baruch", type: "Self-Procurement Store" },
  { name: "Las Vegas 1", type: "Self-Procurement Store" },
  { name: "Las Vegas 2", type: "Self-Procurement Store" },
  { name: "Milpitas", type: "Bay Area Store" },
  { name: "Union City", type: "Bay Area Store" },
  { name: "San Mateo", type: "Bay Area Store" },
  { name: "Pleasanton", type: "Bay Area Store" }
];

export const STORE_TYPE_LABELS: StoreType[] = ["Self-Procurement Store", "Bay Area Store"];

export const STORE_TYPE_DISPLAY: Record<StoreType, string> = {
  "Self-Procurement Store": "自采门店",
  "Bay Area Store": "湾区门店"
};

export const DEFAULT_SCORE_INPUT: ScoreInput = {
  month: "",
  store: "",
  missingInvoiceCount: 0,
  invoiceErrorCount: 0,
  midInventoryLate: false,
  endInventoryLate: false,
  weeklyReportLateCount: 0,
  weeklyReportFormatErrorCount: 0,
  severePriceIssue: false,
  cashMissingDays: 0,
  depositLateCount: 0,
  cashMismatchCount: 0,
  employeeMealMissingCount: 0,
  wasteLogIssueCount: 0,
  employeeInfoErrorCount: 0,
  slingLateCount: 0,
  opusAssigned: false,
  opusLateCount: 0,
  remark: ""
};

export const DEDUCTION_LIMITS = {
  inventory: 12,
  invoice: 5,
  inventoryExecutionSelf: 3,
  inventoryExecutionBay: 12,
  weeklyReport: 4,
  cash: 2,
  waste: 3,
  labor: 2,
  opus: 1
} as const;

export const IMPORT_TEMPLATE_COLUMNS = [
  "Month",
  "Store",
  "Missing Invoice Count",
  "Invoice Error Count",
  "Mid Inventory Late",
  "End Inventory Late",
  "Weekly Report Late",
  "Weekly Report Format Error",
  "Severe Price Issue",
  "Cash Missing Days",
  "Deposit Late Count",
  "Cash Mismatch Count",
  "Employee Meal Missing",
  "Waste Log Issue",
  "Employee Info Error Count",
  "Sling Late Count",
  "Opus Assigned",
  "Opus Late Count",
  "Remark"
] as const;

export const IMPORT_TEMPLATE_SAMPLE_ROW = {
  Month: "2026-03",
  Store: "Edison",
  "Missing Invoice Count": 1,
  "Invoice Error Count": 2,
  "Mid Inventory Late": "Yes",
  "End Inventory Late": "No",
  "Weekly Report Late": 1,
  "Weekly Report Format Error": 0,
  "Severe Price Issue": "No",
  "Cash Missing Days": 0,
  "Deposit Late Count": 1,
  "Cash Mismatch Count": 0,
  "Employee Meal Missing": 1,
  "Waste Log Issue": 0,
  "Employee Info Error Count": 1,
  "Sling Late Count": 0,
  "Opus Assigned": "Yes",
  "Opus Late Count": 1,
  Remark: "Sample import row"
};

export const STORE_TYPE_BY_NAME = new Map(STORE_OPTIONS.map((store) => [store.name, store.type]));

export function getStoreType(storeName: string): StoreType | null {
  return STORE_TYPE_BY_NAME.get(storeName) ?? null;
}
