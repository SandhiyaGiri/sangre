import { NextRequest, NextResponse } from 'next/server';

interface SummaryRequest {
  report_id: string;
  transcript: Array<{ role: 'user' | 'agent'; content: string; timestamp?: string }>;
  language?: string;
}

interface SessionSummary {
  report_id: string;
  generated_at: string;
  findings: string[];
  key_questions_answered: string[];
  recommendations: string[];
  follow_up_actions: string[];
}

const summaryStore: Map<string, SessionSummary> = new Map();

function extractKeyPoints(transcript: SummaryRequest['transcript']): {
  findings: string[];
  questions: string[];
} {
  const findings: string[] = [];
  const questions: string[] = [];

  transcript.forEach((msg) => {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase();
      if (content.includes('?') || content.includes('what') || content.includes('why')) {
        questions.push(msg.content);
      }
    } else if (msg.role === 'agent') {
      if (msg.content.length > 50) {
        const sentences = msg.content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
        findings.push(...sentences.slice(0, 2).map((s) => s.trim()));
      }
    }
  });

  return { findings, questions };
}

function generateRecommendations(findings: string[]): string[] {
  const recommendations: string[] = [];

  const findingsText = findings.join(' ').toLowerCase();

  if (
    findingsText.includes('high') ||
    findingsText.includes('elevated') ||
    findingsText.includes('above')
  ) {
    recommendations.push('Monitor the elevated values closely and schedule a follow-up with your doctor.');
  }

  if (
    findingsText.includes('low') ||
    findingsText.includes('below') ||
    findingsText.includes('deficient')
  ) {
    recommendations.push('Consider dietary adjustments or supplementation as recommended by your healthcare provider.');
  }

  if (findingsText.includes('normal') || findingsText.includes('within range')) {
    recommendations.push('Continue current health practices and maintain regular check-ups.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Consult with your healthcare provider for personalized recommendations.');
  }

  return recommendations;
}

function generateFollowUpActions(questions: string[]): string[] {
  const actions: string[] = [];

  if (questions.length > 0) {
    actions.push('Review the conversation transcript for detailed explanations of your health metrics.');
  }

  actions.push('Schedule a follow-up appointment with your healthcare provider to discuss results.');
  actions.push('Keep a record of this report for future reference and comparison.');
  actions.push('Share this summary with your healthcare provider if needed.');

  return actions;
}

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json();

    if (!body.report_id || !body.transcript) {
      return NextResponse.json(
        { success: false, error: 'report_id and transcript are required' },
        { status: 400 }
      );
    }

    const { findings, questions } = extractKeyPoints(body.transcript);
    const recommendations = generateRecommendations(findings);
    const followUpActions = generateFollowUpActions(questions);

    const summary: SessionSummary = {
      report_id: body.report_id,
      generated_at: new Date().toISOString(),
      findings: findings.slice(0, 5),
      key_questions_answered: questions.slice(0, 3),
      recommendations,
      follow_up_actions: followUpActions,
    };

    summaryStore.set(body.report_id, summary);

    return NextResponse.json(
      {
        success: true,
        summary,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate summary' },
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

  const summary = summaryStore.get(reportId);
  if (!summary) {
    return NextResponse.json(
      { success: false, error: 'Summary not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    summary,
  });
}
