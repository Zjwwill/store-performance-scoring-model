export const EXECUTION_COMPLIANCE_SECTION_TYPE = "execution_compliance" as const;

export type ExecutionComplianceSectionType = typeof EXECUTION_COMPLIANCE_SECTION_TYPE;

export interface ChecklistMissingData {
  dailyTaskMissing: number;
  weeklyTaskMissing: number;
  monthlyTaskMissing: number;
  missingItems: string;
  relatedDates: string;
  note: string;
}

export interface SlingPhotoViolationData {
  violationCount: number;
  violationDates: string;
  missingDetails: string;
  note: string;
}

export interface ClockInViolationData {
  violationCount: number;
  uncorrectedCount: number;
  employees: string;
  dates: string;
  violationTypes: string;
  isCorrected: string;
  note: string;
}

export interface OnboardingSignatureData {
  isCompleted: string;
  unsignedEmployees: string;
  onboardingDates: string;
  missingDates: string;
  note: string;
}

export interface LicenseBackupData {
  isBackedUpToGoogleDrive: string;
  missingLicenseNames: string;
  store: string;
  expirationOrCheckDate: string;
  note: string;
}

export interface SystemEmployeeMatchingData {
  unmatchedEmployeeCount: number;
  unmatchedFields: string;
  involvedSystems: string;
  note: string;
}

export interface ExecutionComplianceData {
  checklistMissing: ChecklistMissingData;
  slingPhotoViolation: SlingPhotoViolationData;
  clockInViolation: ClockInViolationData;
  onboardingSignature: OnboardingSignatureData;
  licenseBackup: LicenseBackupData;
  systemEmployeeMatching: SystemEmployeeMatchingData;
}

export interface ExecutionComplianceInput {
  storeId: string;
  checkDate: string;
  month: string;
  data: ExecutionComplianceData;
}

export interface ExecutionComplianceRecord extends ExecutionComplianceInput {
  id: string;
  sectionType: ExecutionComplianceSectionType;
  createdAt: string;
  updatedAt: string;
}

type ExecutionComplianceInputDraft = Omit<Partial<ExecutionComplianceInput>, "data"> & {
  data?: Partial<ExecutionComplianceData>;
};

export interface ExecutionComplianceDetailRow {
  storeId: string;
  checkDate: string;
  month: string;
  item: string;
  subItem: string;
  count: number;
  relatedEmployees: string;
  relatedLicenses: string;
  relatedSystems: string;
  issueContent: string;
  note: string;
}

export interface ExecutionComplianceMonthlySummary {
  storeId: string;
  month: string;
  recordDateCount: number;
  totalChecklistMissing: number;
  totalSlingPhotoViolation: number;
  totalClockInViolation: number;
  totalUncorrectedClockInViolation: number;
  totalUnmatchedEmployeeCount: number;
  incompleteOnboardingCount: number;
  missingLicenseBackupCount: number;
  detailRows: ExecutionComplianceDetailRow[];
}

export const DEFAULT_EXECUTION_COMPLIANCE_DATA: ExecutionComplianceData = {
  checklistMissing: {
    dailyTaskMissing: 0,
    weeklyTaskMissing: 0,
    monthlyTaskMissing: 0,
    missingItems: "",
    relatedDates: "",
    note: ""
  },
  slingPhotoViolation: {
    violationCount: 0,
    violationDates: "",
    missingDetails: "",
    note: ""
  },
  clockInViolation: {
    violationCount: 0,
    uncorrectedCount: 0,
    employees: "",
    dates: "",
    violationTypes: "",
    isCorrected: "",
    note: ""
  },
  onboardingSignature: {
    isCompleted: "",
    unsignedEmployees: "",
    onboardingDates: "",
    missingDates: "",
    note: ""
  },
  licenseBackup: {
    isBackedUpToGoogleDrive: "",
    missingLicenseNames: "",
    store: "",
    expirationOrCheckDate: "",
    note: ""
  },
  systemEmployeeMatching: {
    unmatchedEmployeeCount: 0,
    unmatchedFields: "",
    involvedSystems: "",
    note: ""
  }
};

function generateRecordId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `execution-compliance-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clampNonNegative(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeChoice(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function normalizeChecklistMissing(input?: Partial<ChecklistMissingData>): ChecklistMissingData {
  return {
    dailyTaskMissing: clampNonNegative(input?.dailyTaskMissing),
    weeklyTaskMissing: clampNonNegative(input?.weeklyTaskMissing),
    monthlyTaskMissing: clampNonNegative(input?.monthlyTaskMissing),
    missingItems: normalizeText(input?.missingItems),
    relatedDates: normalizeText(input?.relatedDates),
    note: normalizeText(input?.note)
  };
}

function normalizeSlingPhotoViolation(input?: Partial<SlingPhotoViolationData>): SlingPhotoViolationData {
  return {
    violationCount: clampNonNegative(input?.violationCount),
    violationDates: normalizeText(input?.violationDates),
    missingDetails: normalizeText(input?.missingDetails),
    note: normalizeText(input?.note)
  };
}

function normalizeClockInViolation(input?: Partial<ClockInViolationData>): ClockInViolationData {
  return {
    violationCount: clampNonNegative(input?.violationCount),
    uncorrectedCount: clampNonNegative(input?.uncorrectedCount),
    employees: normalizeText(input?.employees),
    dates: normalizeText(input?.dates),
    violationTypes: normalizeText(input?.violationTypes),
    isCorrected: normalizeChoice(input?.isCorrected),
    note: normalizeText(input?.note)
  };
}

function normalizeOnboardingSignature(input?: Partial<OnboardingSignatureData>): OnboardingSignatureData {
  return {
    isCompleted: normalizeChoice(input?.isCompleted),
    unsignedEmployees: normalizeText(input?.unsignedEmployees),
    onboardingDates: normalizeText(input?.onboardingDates),
    missingDates: normalizeText(input?.missingDates),
    note: normalizeText(input?.note)
  };
}

function normalizeLicenseBackup(input?: Partial<LicenseBackupData>): LicenseBackupData {
  return {
    isBackedUpToGoogleDrive: normalizeChoice(input?.isBackedUpToGoogleDrive),
    missingLicenseNames: normalizeText(input?.missingLicenseNames),
    store: normalizeText(input?.store),
    expirationOrCheckDate: normalizeText(input?.expirationOrCheckDate),
    note: normalizeText(input?.note)
  };
}

function normalizeSystemEmployeeMatching(input?: Partial<SystemEmployeeMatchingData>): SystemEmployeeMatchingData {
  return {
    unmatchedEmployeeCount: clampNonNegative(input?.unmatchedEmployeeCount),
    unmatchedFields: normalizeText(input?.unmatchedFields),
    involvedSystems: normalizeText(input?.involvedSystems),
    note: normalizeText(input?.note)
  };
}

export function getMonthFromCheckDate(checkDate: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(checkDate) ? checkDate.slice(0, 7) : "";
}

export function normalizeExecutionComplianceData(input?: Partial<ExecutionComplianceData>): ExecutionComplianceData {
  return {
    checklistMissing: normalizeChecklistMissing(input?.checklistMissing),
    slingPhotoViolation: normalizeSlingPhotoViolation(input?.slingPhotoViolation),
    clockInViolation: normalizeClockInViolation(input?.clockInViolation),
    onboardingSignature: normalizeOnboardingSignature(input?.onboardingSignature),
    licenseBackup: normalizeLicenseBackup(input?.licenseBackup),
    systemEmployeeMatching: normalizeSystemEmployeeMatching(input?.systemEmployeeMatching)
  };
}

export function normalizeExecutionComplianceInput(input?: ExecutionComplianceInputDraft): ExecutionComplianceInput {
  const checkDate = normalizeText(input?.checkDate);
  const month = normalizeText(input?.month) || getMonthFromCheckDate(checkDate);

  return {
    storeId: normalizeText(input?.storeId),
    checkDate,
    month,
    data: normalizeExecutionComplianceData(input?.data)
  };
}

export function buildExecutionComplianceRecord(
  input?: ExecutionComplianceInputDraft,
  existing?: Partial<Pick<ExecutionComplianceRecord, "id" | "createdAt">>
): ExecutionComplianceRecord {
  const normalized = normalizeExecutionComplianceInput(input);

  if (!normalized.storeId) {
    throw new Error("Store is required.");
  }

  if (!normalized.checkDate) {
    throw new Error("Check date is required.");
  }

  if (!normalized.month) {
    throw new Error("Month is required.");
  }

  const now = new Date().toISOString();

  return {
    id: existing?.id ?? generateRecordId(),
    sectionType: EXECUTION_COMPLIANCE_SECTION_TYPE,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...normalized
  };
}

export function getExecutionComplianceIdentityKey(record: Pick<ExecutionComplianceRecord, "storeId" | "checkDate" | "sectionType">): string {
  return `${record.storeId}__${record.checkDate}__${record.sectionType}`;
}

export function sortExecutionComplianceRecords(records: ExecutionComplianceRecord[]): ExecutionComplianceRecord[] {
  return [...records].sort((left, right) => {
    if (left.month !== right.month) {
      return right.month.localeCompare(left.month);
    }

    if (left.checkDate !== right.checkDate) {
      return right.checkDate.localeCompare(left.checkDate);
    }

    return left.storeId.localeCompare(right.storeId);
  });
}

function isNegativeStatus(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return ["no", "not_completed", "not completed", "未完成", "否", "未签署", "未备份"].includes(normalized);
}

function shouldIncludeTextRow(...values: string[]): boolean {
  return values.some(hasText);
}

export function buildExecutionComplianceDetailRows(records: ExecutionComplianceRecord[], includeEmpty = false): ExecutionComplianceDetailRow[] {
  const rows: ExecutionComplianceDetailRow[] = [];

  for (const record of [...records].sort((left, right) => left.checkDate.localeCompare(right.checkDate))) {
    const checklist = record.data.checklistMissing;
    const checklistCount = checklist.dailyTaskMissing + checklist.weeklyTaskMissing + checklist.monthlyTaskMissing;

    if (includeEmpty || checklistCount > 0 || shouldIncludeTextRow(checklist.missingItems, checklist.relatedDates, checklist.note)) {
      rows.push({
        storeId: record.storeId,
        checkDate: record.checkDate,
        month: record.month,
        item: "Checklist 未执行",
        subItem: `每日 ${checklist.dailyTaskMissing} / 每周 ${checklist.weeklyTaskMissing} / 每月 ${checklist.monthlyTaskMissing}`,
        count: checklistCount,
        relatedEmployees: "",
        relatedLicenses: "",
        relatedSystems: "",
        issueContent: [checklist.missingItems, checklist.relatedDates ? `涉及日期：${checklist.relatedDates}` : ""].filter(Boolean).join("；"),
        note: checklist.note
      });
    }

    const sling = record.data.slingPhotoViolation;
    if (includeEmpty || sling.violationCount > 0 || shouldIncludeTextRow(sling.violationDates, sling.missingDetails, sling.note)) {
      rows.push({
        storeId: record.storeId,
        checkDate: record.checkDate,
        month: record.month,
        item: "Sling 拍照违规",
        subItem: "拍照违规次数",
        count: sling.violationCount,
        relatedEmployees: "",
        relatedLicenses: "",
        relatedSystems: "",
        issueContent: [sling.missingDetails, sling.violationDates ? `违规日期：${sling.violationDates}` : ""].filter(Boolean).join("；"),
        note: sling.note
      });
    }

    const clockIn = record.data.clockInViolation;
    if (
      includeEmpty ||
      clockIn.violationCount > 0 ||
      clockIn.uncorrectedCount > 0 ||
      shouldIncludeTextRow(clockIn.employees, clockIn.dates, clockIn.violationTypes, clockIn.isCorrected, clockIn.note)
    ) {
      rows.push({
        storeId: record.storeId,
        checkDate: record.checkDate,
        month: record.month,
        item: "打卡违规",
        subItem: `违规 ${clockIn.violationCount} / 未修改 ${clockIn.uncorrectedCount}`,
        count: clockIn.violationCount,
        relatedEmployees: clockIn.employees,
        relatedLicenses: "",
        relatedSystems: "",
        issueContent: [clockIn.violationTypes, clockIn.dates ? `日期：${clockIn.dates}` : "", clockIn.isCorrected ? `修改状态：${clockIn.isCorrected}` : ""]
          .filter(Boolean)
          .join("；"),
        note: clockIn.note
      });
    }

    const onboarding = record.data.onboardingSignature;
    if (
      includeEmpty ||
      isNegativeStatus(onboarding.isCompleted) ||
      shouldIncludeTextRow(onboarding.unsignedEmployees, onboarding.onboardingDates, onboarding.missingDates, onboarding.note)
    ) {
      rows.push({
        storeId: record.storeId,
        checkDate: record.checkDate,
        month: record.month,
        item: "入职确认签署",
        subItem: onboarding.isCompleted || "未选择",
        count: 0,
        relatedEmployees: onboarding.unsignedEmployees,
        relatedLicenses: "",
        relatedSystems: "",
        issueContent: [onboarding.onboardingDates ? `入职日期：${onboarding.onboardingDates}` : "", onboarding.missingDates ? `缺失日期：${onboarding.missingDates}` : ""]
          .filter(Boolean)
          .join("；"),
        note: onboarding.note
      });
    }

    const license = record.data.licenseBackup;
    if (
      includeEmpty ||
      isNegativeStatus(license.isBackedUpToGoogleDrive) ||
      shouldIncludeTextRow(license.missingLicenseNames, license.store, license.expirationOrCheckDate, license.note)
    ) {
      rows.push({
        storeId: record.storeId,
        checkDate: record.checkDate,
        month: record.month,
        item: "执照备份",
        subItem: license.isBackedUpToGoogleDrive || "未选择",
        count: 0,
        relatedEmployees: "",
        relatedLicenses: license.missingLicenseNames,
        relatedSystems: "",
        issueContent: [license.store ? `门店：${license.store}` : "", license.expirationOrCheckDate ? `到期日 / 检查日期：${license.expirationOrCheckDate}` : ""]
          .filter(Boolean)
          .join("；"),
        note: license.note
      });
    }

    const matching = record.data.systemEmployeeMatching;
    if (includeEmpty || matching.unmatchedEmployeeCount > 0 || shouldIncludeTextRow(matching.unmatchedFields, matching.involvedSystems, matching.note)) {
      rows.push({
        storeId: record.storeId,
        checkDate: record.checkDate,
        month: record.month,
        item: "三大系统员工信息匹配",
        subItem: "未匹配人数",
        count: matching.unmatchedEmployeeCount,
        relatedEmployees: "",
        relatedLicenses: "",
        relatedSystems: matching.involvedSystems,
        issueContent: matching.unmatchedFields,
        note: matching.note
      });
    }
  }

  return rows;
}

export function buildExecutionComplianceMonthlySummary(records: ExecutionComplianceRecord[]): ExecutionComplianceMonthlySummary {
  const sortedRecords = [...records].sort((left, right) => left.checkDate.localeCompare(right.checkDate));
  const firstRecord = sortedRecords[0];
  const detailRows = buildExecutionComplianceDetailRows(sortedRecords);

  return {
    storeId: firstRecord?.storeId ?? "",
    month: firstRecord?.month ?? "",
    recordDateCount: new Set(sortedRecords.map((record) => record.checkDate)).size,
    totalChecklistMissing: sortedRecords.reduce(
      (sum, record) =>
        sum +
        record.data.checklistMissing.dailyTaskMissing +
        record.data.checklistMissing.weeklyTaskMissing +
        record.data.checklistMissing.monthlyTaskMissing,
      0
    ),
    totalSlingPhotoViolation: sortedRecords.reduce((sum, record) => sum + record.data.slingPhotoViolation.violationCount, 0),
    totalClockInViolation: sortedRecords.reduce((sum, record) => sum + record.data.clockInViolation.violationCount, 0),
    totalUncorrectedClockInViolation: sortedRecords.reduce((sum, record) => sum + record.data.clockInViolation.uncorrectedCount, 0),
    totalUnmatchedEmployeeCount: sortedRecords.reduce((sum, record) => sum + record.data.systemEmployeeMatching.unmatchedEmployeeCount, 0),
    incompleteOnboardingCount: sortedRecords.filter((record) => isNegativeStatus(record.data.onboardingSignature.isCompleted)).length,
    missingLicenseBackupCount: sortedRecords.filter((record) => isNegativeStatus(record.data.licenseBackup.isBackedUpToGoogleDrive)).length,
    detailRows
  };
}
