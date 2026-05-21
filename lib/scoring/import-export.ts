import * as XLSX from "xlsx";
import { IMPORT_TEMPLATE_COLUMNS, IMPORT_TEMPLATE_SAMPLE_ROW } from "@/lib/scoring/config";
import { buildScoreRecord } from "@/lib/scoring/calculations";
import { buildExecutionComplianceDetailRows } from "@/lib/scoring/execution-compliance";
import type { ExecutionComplianceRecord } from "@/lib/scoring/execution-compliance";
import type { ScoreInput, ScoreRecord } from "@/lib/scoring/types";

const BOOLEAN_FIELDS = new Set<keyof ScoreInput>([
  "midInventoryLate",
  "endInventoryLate",
  "severePriceIssue",
  "opusAssigned"
]);

const NUMERIC_FIELDS = new Set<keyof ScoreInput>([
  "missingInvoiceCount",
  "invoiceErrorCount",
  "weeklyReportLateCount",
  "weeklyReportFormatErrorCount",
  "cashMissingDays",
  "depositLateCount",
  "cashMismatchCount",
  "employeeMealMissingCount",
  "wasteLogIssueCount",
  "employeeInfoErrorCount",
  "slingLateCount",
  "opusLateCount"
]);

const IMPORT_FIELD_MAP: Record<string, keyof ScoreInput> = {
  month: "month",
  store: "store",
  missinginvoicecount: "missingInvoiceCount",
  invoiceerrorcount: "invoiceErrorCount",
  midinventorylate: "midInventoryLate",
  endinventorylate: "endInventoryLate",
  weeklyreportlate: "weeklyReportLateCount",
  weeklyreportformaterror: "weeklyReportFormatErrorCount",
  severepriceissue: "severePriceIssue",
  cashmissingdays: "cashMissingDays",
  depositlatecount: "depositLateCount",
  cashmismatchcount: "cashMismatchCount",
  employeemealmissing: "employeeMealMissingCount",
  wastelogissue: "wasteLogIssueCount",
  employeeinfoerrorcount: "employeeInfoErrorCount",
  slinglatecount: "slingLateCount",
  opusassigned: "opusAssigned",
  opuslatecount: "opusLateCount",
  remark: "remark"
};

export interface ParsedImportResult {
  records: ScoreRecord[];
  warnings: string[];
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseBooleanValue(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return ["y", "yes", "true", "1", "checked"].includes(normalized);
}

function parseNumericValue(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function formatMonthValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");

  return `${year}-${month}`;
}

function parseMonthValue(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatMonthValue(value);
  }

  const raw = String(value ?? "").trim();

  if (!raw) {
    return "";
  }

  const directMatch = raw.match(/^(\d{4})[-/](\d{1,2})$/);

  if (directMatch) {
    return `${directMatch[1]}-${directMatch[2].padStart(2, "0")}`;
  }

  const parsedDate = new Date(raw);

  if (!Number.isNaN(parsedDate.getTime())) {
    return formatMonthValue(parsedDate);
  }

  return raw;
}

function mapImportRow(row: Record<string, unknown>): Partial<ScoreInput> {
  const mapped: Partial<ScoreInput> = {};

  for (const [header, value] of Object.entries(row)) {
    const field = IMPORT_FIELD_MAP[normalizeHeader(header)];

    if (!field) {
      continue;
    }

    if (field === "month") {
      mapped.month = parseMonthValue(value);
      continue;
    }

    if (field === "store" || field === "remark") {
      mapped[field] = String(value ?? "").trim();
      continue;
    }

    if (BOOLEAN_FIELDS.has(field)) {
      mapped[field] = parseBooleanValue(value) as never;
      continue;
    }

    if (NUMERIC_FIELDS.has(field)) {
      mapped[field] = parseNumericValue(value) as never;
    }
  }

  return mapped;
}

function downloadText(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

function buildOverviewRows(records: ScoreRecord[]) {
  return records.map((record) => ({
    Month: record.month,
    Store: record.store,
    "Store Type": record.storeType,
    "Inventory Deduction": record.inventoryDeduction,
    "Cash Deduction": record.cashDeduction,
    "Waste Deduction": record.wasteDeduction,
    "Labor Deduction": record.laborDeduction,
    "Opus Deduction": record.opusDeduction,
    "Total Deduction": record.totalDeduction,
    "Final Score": record.finalScore,
    Remark: record.remark
  }));
}

function buildExecutionComplianceRows(records: ExecutionComplianceRecord[], includeEmpty = false) {
  return buildExecutionComplianceDetailRows(records, includeEmpty).map((row) => ({
    Store: row.storeId,
    "Check Date": row.checkDate,
    Month: row.month,
    "Inspection Item": row.item,
    "Sub-item / Field": row.subItem,
    Quantity: row.count,
    "Related Employees": row.relatedEmployees,
    "Related Licenses": row.relatedLicenses,
    "Related Systems": row.relatedSystems,
    "Issue Details": row.issueContent,
    Note: row.note
  }));
}

export async function parseImportFile(file: File): Promise<ParsedImportResult> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const firstSheet = workbook.Sheets[firstSheetName];

  if (!firstSheet) {
    throw new Error("The uploaded file does not contain a readable sheet.");
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
    defval: "",
    raw: false
  });

  const records: ScoreRecord[] = [];
  const warnings: string[] = [];

  rows.forEach((row, index) => {
    const hasContent = Object.values(row).some((value) => String(value ?? "").trim() !== "");

    if (!hasContent) {
      return;
    }

    try {
      records.push(buildScoreRecord(mapImportRow(row)));
    } catch (error) {
      warnings.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  });

  return { records, warnings };
}

export function downloadTemplate(format: "xlsx" | "csv"): void {
  const worksheet = XLSX.utils.json_to_sheet([IMPORT_TEMPLATE_SAMPLE_ROW], {
    header: [...IMPORT_TEMPLATE_COLUMNS]
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  if (format === "xlsx") {
    XLSX.writeFile(workbook, "store-scoring-import-template.xlsx");
    return;
  }

  downloadText(XLSX.utils.sheet_to_csv(worksheet), "store-scoring-import-template.csv", "text/csv;charset=utf-8;");
}

export function downloadOverviewExport(records: ScoreRecord[], format: "xlsx" | "csv"): void {
  const worksheet = XLSX.utils.json_to_sheet(buildOverviewRows(records));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");

  if (format === "xlsx") {
    XLSX.writeFile(workbook, "store-scoring-overview.xlsx");
    return;
  }

  downloadText(XLSX.utils.sheet_to_csv(worksheet), "store-scoring-overview.csv", "text/csv;charset=utf-8;");
}

export function downloadExecutionComplianceDailyExport(record: ExecutionComplianceRecord, format: "xlsx" | "csv"): void {
  const worksheet = XLSX.utils.json_to_sheet(buildExecutionComplianceRows([record], true));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Execution Compliance");

  if (format === "xlsx") {
    XLSX.writeFile(workbook, `execution-compliance-${record.storeId}-${record.checkDate}.xlsx`);
    return;
  }

  downloadText(
    XLSX.utils.sheet_to_csv(worksheet),
    `execution-compliance-${record.storeId}-${record.checkDate}.csv`,
    "text/csv;charset=utf-8;"
  );
}

export function downloadExecutionComplianceMonthlyExport(records: ExecutionComplianceRecord[], format: "xlsx" | "csv"): void {
  const firstRecord = records[0];
  const worksheet = XLSX.utils.json_to_sheet(buildExecutionComplianceRows(records));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Summary");
  const fileStem = `execution-compliance-${firstRecord?.storeId ?? "store"}-${firstRecord?.month ?? "month"}-summary`;

  if (format === "xlsx") {
    XLSX.writeFile(workbook, `${fileStem}.xlsx`);
    return;
  }

  downloadText(XLSX.utils.sheet_to_csv(worksheet), `${fileStem}.csv`, "text/csv;charset=utf-8;");
}
