import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface AnswerPayload {
  questionIndex: number;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface SubmitPayload {
  studentName: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: AnswerPayload[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitPayload = await request.json();
    const { studentName, quizId, score, totalQuestions, percentage, answers } = body;

    // Upsert student
    const student = await prisma.student.upsert({
      where: { name: studentName },
      update: {},
      create: { name: studentName },
    });

    // Create quiz submission with answers
    const submission = await prisma.quizSubmission.create({
      data: {
        studentId: student.id,
        quizId,
        score,
        totalQuestions,
        percentage,
        answers: {
          create: answers.map((a) => ({
            questionIndex: a.questionIndex,
            selectedAnswer: a.selectedAnswer,
            correctAnswer: a.correctAnswer,
            isCorrect: a.isCorrect,
          })),
        },
      },
      include: { answers: true },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
