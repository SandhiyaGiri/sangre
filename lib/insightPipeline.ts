import { HealthReport, LabValue, TestCategory, Test } from './reportSchema';

export interface FlaggedLabValue extends LabValue {
  isOutOfRange: boolean;
  severity: 'normal' | 'warning' | 'critical';
}

export interface ReportInsights {
  report_id: string;
  patient_name: string;
  test_date: string;
  flagged_values: FlaggedLabValue[];
  headline_insights: string[];
  risk_tags: string[];
  summary_text: string;
}

export const COMMON_LAB_REFERENCES: Record<string, { min: number; max: number; unit: string }> = {
  'hemoglobin': { min: 12.0, max: 17.5, unit: 'g/dL' },
  'hematocrit': { min: 36, max: 46, unit: '%' },
  'wbc': { min: 4.5, max: 11.0, unit: 'K/uL' },
  'rbc': { min: 4.5, max: 5.9, unit: 'M/uL' },
  'platelets': { min: 150, max: 400, unit: 'K/uL' },
  'glucose': { min: 70, max: 100, unit: 'mg/dL' },
  'glucose_fasting': { min: 70, max: 100, unit: 'mg/dL' },
  'creatinine': { min: 0.7, max: 1.3, unit: 'mg/dL' },
  'bun': { min: 7, max: 20, unit: 'mg/dL' },
  'sodium': { min: 136, max: 145, unit: 'mEq/L' },
  'potassium': { min: 3.5, max: 5.0, unit: 'mEq/L' },
  'calcium': { min: 8.5, max: 10.2, unit: 'mg/dL' },
  'phosphorus': { min: 2.5, max: 4.5, unit: 'mg/dL' },
  'magnesium': { min: 1.7, max: 2.2, unit: 'mg/dL' },
  'albumin': { min: 3.5, max: 5.0, unit: 'g/dL' },
  'total_protein': { min: 6.0, max: 8.3, unit: 'g/dL' },
  'ast': { min: 10, max: 40, unit: 'U/L' },
  'alt': { min: 7, max: 56, unit: 'U/L' },
  'alkaline_phosphatase': { min: 44, max: 147, unit: 'U/L' },
  'total_bilirubin': { min: 0.1, max: 1.2, unit: 'mg/dL' },
  'ldl': { min: 0, max: 100, unit: 'mg/dL' },
  'hdl': { min: 40, max: 300, unit: 'mg/dL' },
  'triglycerides': { min: 0, max: 150, unit: 'mg/dL' },
  'total_cholesterol': { min: 0, max: 200, unit: 'mg/dL' },
  'tsh': { min: 0.4, max: 4.0, unit: 'mIU/L' },
};

function normalizeLabName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function flagLabValue(value: LabValue): FlaggedLabValue {
  const normalized = normalizeLabName(value.name);
  const reference = COMMON_LAB_REFERENCES[normalized];

  let isOutOfRange = false;
  let severity: 'normal' | 'warning' | 'critical' = 'normal';

  // Only process numeric values
  const numValue = typeof value.value === 'number' ? value.value : null;

  if (numValue !== null && reference) {
    if (numValue < reference.min) {
      isOutOfRange = true;
      severity = numValue < reference.min * 0.8 ? 'critical' : 'warning';
    } else if (numValue > reference.max) {
      isOutOfRange = true;
      severity = numValue > reference.max * 1.2 ? 'critical' : 'warning';
    }
  } else if (numValue !== null && value.referenceMin !== undefined && value.referenceMax !== undefined) {
    if (numValue < value.referenceMin || numValue > value.referenceMax) {
      isOutOfRange = true;
      severity = 'warning';
    }
  }

  return {
    ...value,
    isOutOfRange,
    severity,
  };
}

function generateHeadlineInsights(flaggedValues: FlaggedLabValue[]): string[] {
  const insights: string[] = [];
  const criticalValues = flaggedValues.filter(v => v.severity === 'critical');
  const warningValues = flaggedValues.filter(v => v.severity === 'warning');

  if (criticalValues.length > 0) {
    const names = criticalValues.map(v => v.name).join(', ');
    insights.push(`Critical findings detected: ${names}. Please consult your healthcare provider immediately.`);
  }

  if (warningValues.length > 0) {
    const names = warningValues.map(v => v.name).join(', ');
    insights.push(`Several values are outside normal range: ${names}. Discuss with your doctor.`);
  }

  if (flaggedValues.length === 0) {
    insights.push('All measured values are within normal ranges.');
  }

  return insights;
}

function generateRiskTags(flaggedValues: FlaggedLabValue[]): string[] {
  const tags: Set<string> = new Set();

  flaggedValues.forEach(value => {
    const normalized = normalizeLabName(value.name);

    if (['hemoglobin', 'hematocrit', 'rbc', 'wbc', 'platelets'].some(v => normalized.includes(v))) {
      tags.add('blood_health');
    }
    if (['glucose', 'glucose_fasting'].some(v => normalized.includes(v))) {
      tags.add('metabolic');
    }
    if (['creatinine', 'bun'].some(v => normalized.includes(v))) {
      tags.add('kidney_function');
    }
    if (['ast', 'alt', 'alkaline_phosphatase', 'total_bilirubin'].some(v => normalized.includes(v))) {
      tags.add('liver_function');
    }
    if (['ldl', 'hdl', 'triglycerides', 'total_cholesterol'].some(v => normalized.includes(v))) {
      tags.add('cardiovascular');
    }
    if (['sodium', 'potassium', 'calcium', 'magnesium'].some(v => normalized.includes(v))) {
      tags.add('electrolytes');
    }
    if (['tsh'].some(v => normalized.includes(v))) {
      tags.add('thyroid');
    }
  });

  return Array.from(tags);
}

function generateSummaryText(report: HealthReport, insights: string[]): string {
  const lines = [
    `Health Report Summary for ${report.patient.name}`,
    `Test Date: ${report.test_date}`,
    `Age: ${report.patient.age}, Gender: ${report.patient.gender}`,
    '',
    'Key Findings:',
    ...insights,
  ];

  if (report.notes) {
    lines.push('');
    lines.push('Additional Notes:');
    lines.push(report.notes);
  }

  return lines.join('\n');
}

export function generateInsights(report: HealthReport): ReportInsights {
  // Convert complex test format to simple lab_values if needed
  const labValues = report.lab_values || convertTestsToLabValues(report.tests || []);
  const flaggedValues = labValues.map(flagLabValue);
  const headlineInsights = generateHeadlineInsights(flaggedValues);
  const riskTags = generateRiskTags(flaggedValues);
  const summaryText = generateSummaryText(report, headlineInsights);

  // Extract test_date from various possible locations
  const testDate =
    report.test_date ||
    (report.metadata?.reported_on ? report.metadata.reported_on.split('T')[0] : '') ||
    (report.metadata?.sample_collected ? report.metadata.sample_collected.split('T')[0] : '') ||
    new Date().toISOString().split('T')[0];

  return {
    report_id: report.report_id || '',
    patient_name: report.patient.name,
    test_date: testDate,
    flagged_values: flaggedValues,
    headline_insights: headlineInsights,
    risk_tags: riskTags,
    summary_text: summaryText,
  };
}

/**
 * Convert complex test categories format to simple lab_values format
 */
function convertTestsToLabValues(testCategories: TestCategory[]): LabValue[] {
  const labValues: LabValue[] = [];

  testCategories.forEach((category) => {
    category.tests.forEach((test) => {
      const result = test.result;
      const value = result.value;

      // Only include numeric values for now
      if (typeof value === 'number') {
        labValues.push({
          name: test.test_name,
          value,
          unit: result.unit || '',
          referenceMin: test.reference_range?.low || undefined,
          referenceMax: test.reference_range?.high || undefined,
          flag: test.flag?.status || 'normal',
        });
      }
    });
  });

  return labValues;
}
