export interface LabValue {
  name: string;
  value: number | string;
  unit?: string;
  referenceMin?: number;
  referenceMax?: number;
  flag?: 'normal' | 'low' | 'high' | 'critical';
}

export interface PatientInfo {
  name: string;
  age: number;
  gender: string; // M, F, Male, Female, Other
  email?: string;
  phone?: string;
  patient_id?: string;
}

export interface TestResult {
  value: number | string | null;
  unit?: string;
  raw_text?: string | null;
}

export interface ReferenceRange {
  low?: number | null;
  high?: number | null;
  condition?: string | null;
}

export interface TestFlag {
  status: 'normal' | 'low' | 'high' | 'critical';
  flag_reason?: string | null;
}

export interface Test {
  test_name: string;
  result: TestResult;
  reference_range?: ReferenceRange;
  flag?: TestFlag;
}

export interface TestCategory {
  category: string;
  subcategory?: string | null;
  tests: Test[];
}

export interface HealthReport {
  report_id?: string;
  patient: PatientInfo;
  test_date?: string;
  lab_name?: string;
  lab_values?: LabValue[];
  tests?: TestCategory[];
  metadata?: {
    sample_collected?: string;
    reported_on?: string;
    referring_doctor?: string;
    lab_id?: string;
  };
  summary?: {
    abnormal_tests?: Array<{ test_name: string; category: string; result_value: number | string; flag: string }>;
    critical_alert?: boolean;
    doctor_notes?: string | null;
    lab_comments?: string | null;
  };
  notes?: string;
  created_at?: string;
}

export interface ReportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateReport(data: unknown): ReportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Report must be a valid JSON object');
    return { valid: false, errors, warnings };
  }

  const report = data as Record<string, unknown>;

  // Validate patient info
  if (!report.patient || typeof report.patient !== 'object') {
    errors.push('Missing or invalid patient information');
  } else {
    const patient = report.patient as Record<string, unknown>;
    if (!patient.name || typeof patient.name !== 'string') {
      errors.push('Patient name is required');
    }
    if (patient.age === undefined || typeof patient.age !== 'number' || patient.age < 0) {
      errors.push('Patient age must be a valid positive number');
    }
    // Accept M, F, Male, Female, Other (case-insensitive)
    if (!patient.gender || typeof patient.gender !== 'string') {
      errors.push('Patient gender is required');
    } else {
      const genderNorm = (patient.gender as string).toLowerCase();
      if (!['m', 'f', 'male', 'female', 'other'].includes(genderNorm)) {
        errors.push('Patient gender must be M, F, Male, Female, or Other');
      }
    }
  }

  // Validate test date - can come from test_date, metadata.reported_on, or metadata.sample_collected
  const testDate =
    report.test_date ||
    (report.metadata && typeof report.metadata === 'object'
      ? (report.metadata as Record<string, unknown>).reported_on ||
        (report.metadata as Record<string, unknown>).sample_collected
      : null);

  if (!testDate) {
    warnings.push('Test date not found (optional for complex reports)');
  } else if (typeof testDate === 'string') {
    // Accept ISO date formats: YYYY-MM-DD or full ISO 8601
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    if (!dateRegex.test(testDate)) {
      errors.push('Test date must be in ISO format (YYYY-MM-DD or ISO 8601)');
    }
  }

  // Support both simple (lab_values) and complex (tests) formats
  const hasLabValues = Array.isArray(report.lab_values) && report.lab_values.length > 0;
  const hasTests = Array.isArray(report.tests) && report.tests.length > 0;

  if (!hasLabValues && !hasTests) {
    errors.push('Report must contain either lab_values array or tests array with test categories');
  }

  // Validate simple lab_values format if present
  if (hasLabValues) {
    const labValues = report.lab_values as unknown[];
    labValues.forEach((value: unknown, index: number) => {
      if (typeof value !== 'object' || !value) {
        errors.push(`Lab value at index ${index} is invalid`);
        return;
      }
      const lv = value as Record<string, unknown>;
      if (!lv.name || typeof lv.name !== 'string') {
        errors.push(`Lab value at index ${index} missing name`);
      }
      if (lv.value === undefined) {
        errors.push(`Lab value at index ${index} missing value`);
      }
      if (!lv.unit || typeof lv.unit !== 'string') {
        errors.push(`Lab value at index ${index} missing unit`);
      }
    });
  }

  // Validate complex tests format if present
  if (hasTests) {
    (report.tests as unknown[]).forEach((category, catIndex) => {
      if (typeof category !== 'object' || !category) {
        errors.push(`Test category at index ${catIndex} is invalid`);
        return;
      }
      const cat = category as Record<string, unknown>;
      if (!cat.category || typeof cat.category !== 'string') {
        errors.push(`Test category at index ${catIndex} missing category name`);
      }
      if (!Array.isArray(cat.tests)) {
        errors.push(`Test category at index ${catIndex} missing tests array`);
        return;
      }
      cat.tests.forEach((test, testIndex) => {
        if (typeof test !== 'object' || !test) {
          errors.push(`Test at category ${catIndex}, index ${testIndex} is invalid`);
          return;
        }
        const t = test as Record<string, unknown>;
        if (!t.test_name || typeof t.test_name !== 'string') {
          errors.push(`Test at category ${catIndex}, index ${testIndex} missing test_name`);
        }
        if (!t.result || typeof t.result !== 'object') {
          errors.push(`Test at category ${catIndex}, index ${testIndex} missing result object`);
        }
      });
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function generateReportId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
