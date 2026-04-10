import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentName = searchParams.get('student');
    const quizId = searchParams.get('quizId');

    const where: Record<string, unknown> = {};
    if (studentName) {
      where.student = { name: studentName };
    }
    if (quizId) {
      where.quizId = quizId;
    }

    const submissions = await prisma.quizSubmission.findMany({
      where,
      include: {
        student: true,
        answers: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
