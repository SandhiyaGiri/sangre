import { NextRequest, NextResponse } from 'next/server';
import { validateReport, generateReportId, HealthReport } from '@/lib/reportSchema';
import { generateInsights } from '@/lib/insightPipeline';

const reportStore: Map<string, { report: HealthReport; insights: any }> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateReport(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
        },
        { status: 400 }
      );
    }

    const reportId = generateReportId();
    const report: HealthReport = {
      ...body,
      report_id: reportId,
      created_at: new Date().toISOString(),
    };

    const insights = generateInsights(report);
    reportStore.set(reportId, { report, insights });

    return NextResponse.json(
      {
        success: true,
        report_id: reportId,
        patient_name: report.patient.name,
        test_date: report.test_date,
        insights: {
          headline_insights: insights.headline_insights,
          risk_tags: insights.risk_tags,
          flagged_count: insights.flagged_values.length,
        },
        warnings: validation.warnings,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const reportId = request.nextUrl.searchParams.get('report_id');

  if (!reportId) {
    return NextResponse.json(
      { success: false, error: 'report_id parameter required' },
      { status: 400 }
    );
  }

  const stored = reportStore.get(reportId);
  if (!stored) {
    return NextResponse.json(
      { success: false, error: 'Report not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    report: stored.report,
    insights: stored.insights,
  });
}
