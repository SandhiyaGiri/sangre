/**
 * Client Tool: Get Report Context
 * Retrieves the patient's uploaded health report for use in agent conversation
 */

import { HealthReport } from '../reportSchema';

interface ReportContextRequest {
  report_id: string;
}

interface ReportContextResponse {
  success: boolean;
  report?: HealthReport;
  error?: string;
}

/**
 * Fetch report context from the backend
 * This tool is called by the ElevenLabs agent to access the patient's health report
 */
export async function getReportContext(
  request: ReportContextRequest
): Promise<ReportContextResponse> {
  try {
    const { report_id } = request;

    if (!report_id) {
      return {
        success: false,
        error: 'report_id is required',
      };
    }

    // Fetch report from backend API
    const response = await fetch(
      `/api/upload-report?report_id=${encodeURIComponent(report_id)}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch report: ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Unknown error occurred',
      };
    }

    return {
      success: true,
      report: data.report,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format report for agent context
 * Converts report data into a readable format for the agent
 */
export function formatReportForAgent(report: HealthReport): string {
  const lines = [
    `Patient: ${report.patient.name}`,
    `Age: ${report.patient.age}, Gender: ${report.patient.gender}`,
    `Test Date: ${report.test_date}`,
    `Lab Name: ${report.lab_name || 'Not specified'}`,
    '',
    'Lab Values:',
  ];

  report.lab_values.forEach((value) => {
    lines.push(
      `  - ${value.name}: ${value.value} ${value.unit}` +
        (value.referenceMin && value.referenceMax
          ? ` (Reference: ${value.referenceMin}-${value.referenceMax})`
          : '')
    );
  });

  if (report.notes) {
    lines.push('');
    lines.push('Notes:');
    lines.push(report.notes);
  }

  return lines.join('\n');
}
