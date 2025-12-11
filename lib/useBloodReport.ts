import { useState, useEffect } from 'react';

interface BloodReportData {
  report_id: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    patient_id: string;
  };
  metadata: {
    sample_collected: string;
    reported_on: string;
    referring_doctor: string;
    lab_id: string;
  };
  tests: Array<{
    category: string;
    subcategory: string | null;
    tests: Array<{
      test_name: string;
      result: { value: string | number; unit: string | null; raw_text: null };
      reference_range: { low: number | null; high: number | null; condition: string | null };
      flag: { status: string; flag_reason: string | null };
    }>;
  }>;
  summary: {
    abnormal_tests: Array<{
      test_name: string;
      category: string;
      result_value: number;
      flag: string;
    }>;
    critical_alert: boolean;
    doctor_notes: null | string;
    lab_comments: null | string;
  };
}

export function useBloodReport() {
  const [report, setReport] = useState<BloodReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/SampleBloodReport.json');
      if (!response.ok) {
        throw new Error(`Failed to load blood report: ${response.statusText}`);
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading blood report:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAgentPrompt = () => {
    return `You are a friendly, calm, and supportive voice assistant specializing in blood test result analysis.

Your Role:
- Explain blood test results in simple, everyday language
- Help users understand their test results in a reassuring manner
- Do NOT diagnose medical conditions
- Do NOT prescribe medication or treatment
- Always use cautious phrasing like "can sometimes be related to..."

When analyzing results:
1. Start with a brief overall summary
2. For each abnormal or noteworthy test, explain:
   - What the test measures
   - Whether the value is low, normal, or high
   - Common non-diagnostic reasons for deviation
   - Basic lifestyle considerations
   - When they may want to speak with a doctor

3. End with: "If you have concerns, you can always discuss these results with a healthcare professional."

Character Normalization:
- Speak decimal values naturally (e.g., "eleven point two" for 11.2)
- Speak ranges naturally (e.g., "thirteen to seventeen" for 13.0-17.0)
- Speak units naturally (e.g., "grams per deciliter" for g/dL)

Always:
- Be warm, empathetic, and supportive
- Keep responses clear and concise
- Prioritize the most important insights
- Only interpret information in the provided JSON data`;
  };

  const getSampleContext = () => {
    return report
      ? `Patient: ${report.patient.name}, Age: ${report.patient.age}, Gender: ${report.patient.gender}
Lab: ${report.metadata.lab_id}
Doctor: ${report.metadata.referring_doctor}
Report ID: ${report.report_id}
Abnormal Tests: ${report.summary.abnormal_tests.map((t) => `${t.test_name} (${t.flag})`).join(', ') || 'None'}`
      : '';
  };

  return {
    report,
    loading,
    error,
    loadReport,
    getAgentPrompt,
    getSampleContext,
  };
}
