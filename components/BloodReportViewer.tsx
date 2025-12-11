'use client';

import { useState } from 'react';

interface TestResult {
  test_name: string;
  result: { value: string | number; unit: string | null };
  reference_range: { low: number | null; high: number | null; condition: string | null };
  flag: { status: string; flag_reason: string | null };
}

interface TestCategory {
  category: string;
  subcategory: string | null;
  tests: TestResult[];
}

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  patient_id: string;
}

interface BloodReportData {
  report_id: string;
  patient: PatientInfo;
  metadata: {
    sample_collected: string;
    reported_on: string;
    referring_doctor: string;
    lab_id: string;
  };
  tests: TestCategory[];
  summary: {
    abnormal_tests: Array<{
      test_name: string;
      category: string;
      result_value: number;
      flag: string;
    }>;
    critical_alert: boolean;
    lab_comments: string | null;
  };
}

interface BloodReportViewerProps {
  report?: BloodReportData | null;
  isVisible?: boolean;
}

export default function BloodReportViewer({
  report,
  isVisible = true,
}: BloodReportViewerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  if (!report || !isVisible) return null;

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto bg-white rounded-lg border border-slate-200 p-4 my-4">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-gray-900">Blood Test Report</h3>
        <p className="text-sm text-gray-600">Report ID: {report.report_id}</p>

        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">Patient:</span>
            <p className="text-gray-900">{report.patient.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Age / Gender:</span>
            <p className="text-gray-900">
              {report.patient.age} / {report.patient.gender}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Lab:</span>
            <p className="text-gray-900">{report.metadata.lab_id}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Doctor:</span>
            <p className="text-gray-900">{report.metadata.referring_doctor}</p>
          </div>
        </div>
      </div>

      {/* Abnormal Tests Alert */}
      {report.summary.abnormal_tests.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-900">
            ⚠️ {report.summary.abnormal_tests.length} abnormal result(s)
          </p>
          <ul className="text-sm text-yellow-800 mt-2 space-y-1">
            {report.summary.abnormal_tests.map((test) => (
              <li key={test.test_name}>
                • {test.test_name}: <strong>{test.result_value}</strong> ({test.flag})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Test Categories */}
      <div className="space-y-3">
        {report.tests.map((category, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-medium text-gray-900 text-sm transition-colors"
            >
              <span>
                {category.category}
                {category.subcategory && (
                  <span className="text-gray-600 text-xs ml-2">
                    ({category.subcategory})
                  </span>
                )}
              </span>
              <span className="text-gray-600">
                {expandedCategories.has(category.category) ? '▼' : '▶'}
              </span>
            </button>

            {/* Category Tests */}
            {expandedCategories.has(category.category) && (
              <div className="divide-y divide-slate-200">
                {category.tests.map((test, testIdx) => (
                  <div
                    key={testIdx}
                    className={`p-3 text-sm border-l-4 ${getStatusColor(test.flag.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{test.test_name}</p>
                        <div className="mt-1 space-y-0.5">
                          <p>
                            <span className="text-gray-600">Result: </span>
                            <strong>
                              {test.result.value}
                              {test.result.unit && ` ${test.result.unit}`}
                            </strong>
                          </p>
                          {test.reference_range.condition ? (
                            <p className="text-gray-600">
                              Range: {test.reference_range.condition}
                            </p>
                          ) : (
                            test.reference_range.low !== null &&
                            test.reference_range.high !== null && (
                              <p className="text-gray-600">
                                Range: {test.reference_range.low} - {test.reference_range.high}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusBadgeColor(
                          test.flag.status
                        )}`}
                      >
                        {test.flag.status.toUpperCase()}
                      </span>
                    </div>
                    {test.flag.flag_reason && (
                      <p className="text-xs text-gray-600 mt-2 italic">
                        {test.flag.flag_reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lab Comments */}
      {report.summary.lab_comments && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <p className="font-medium">Lab Notes:</p>
          <p>{report.summary.lab_comments}</p>
        </div>
      )}
    </div>
  );
}
