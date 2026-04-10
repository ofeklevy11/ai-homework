'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { quizData } from '@/lib/quiz-data';

const userNames: Record<string, string> = {
  mika: 'מיקה',
  rom: 'רום',
};

interface AnswerRecord {
  questionIndex: number;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export default function QuizPage({ params }: { params: Promise<{ user: string; quizId: string }> }) {
  const { user, quizId } = use(params);
  const displayName = userNames[user] || user;
  const quiz = quizData[quizId];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answersLog, setAnswersLog] = useState<AnswerRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="quiz-select">
        <h1>השאלון עדיין לא זמין</h1>
        <Link href={`/user/${user}`} className="back-btn">← חזרה</Link>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progress = quizFinished ? 100 : (currentQuestion / totalQuestions) * 100;

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongCount((c) => c + 1);
    }

    setAnswersLog((prev) => [
      ...prev,
      {
        questionIndex: currentQuestion,
        selectedAnswer: index,
        correctAnswer: question.correctIndex,
        isCorrect,
      },
    ]);
  };

  const handleNext = async () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setQuizFinished(true);
      const score = answersLog.filter(a => a.isCorrect).length;
      const percentage = Math.round((score / totalQuestions) * 100);

      setSubmitting(true);
      try {
        await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: user,
            quizId,
            score,
            totalQuestions,
            percentage,
            answers: answersLog,
          }),
        });
        setSubmitted(true);
      } catch (err) {
        console.error('Failed to submit:', err);
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const getOptionClass = (index: number): string => {
    if (!showFeedback) {
      return selectedAnswer === index ? 'option-btn selected' : 'option-btn';
    }
    let cls = 'option-btn disabled';
    if (index === question.correctIndex) cls += ' correct';
    else if (index === selectedAnswer) cls += ' wrong';
    return cls;
  };

  const scorePercent = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const getResultMessage = (): string => {
    if (scorePercent === 100) return 'מושלם! ידע מרשים!';
    if (scorePercent >= 80) return 'כל הכבוד! ביצועים מצוינים!';
    if (scorePercent >= 60) return 'לא רע! יש מקום לשיפור קל';
    return 'כדאי לחזור על החומר ולנסות שוב';
  };

  const whatsappMessage = encodeURIComponent(
    `שלום! אני ${displayName}, סיימתי את ${quiz.title}.\nציון: ${correctCount}/${totalQuestions} (${scorePercent}%)\nמצרף/ה את שיעורי הבית שלי:`
  );

  if (quizFinished) {
    return (
      <div className="quiz-container">
        <div className="results-container">
          <h2>סיימת את השאלון!</h2>
          <div className="results-score">{scorePercent}%</div>
          <p className="results-message">
            {correctCount} מתוך {totalQuestions} תשובות נכונות - {getResultMessage()}
          </p>
          {submitting && <p style={{ color: '#a78bfa' }}>שומר תוצאות...</p>}
          {submitted && <p style={{ color: '#34d399' }}>התוצאות נשמרו בהצלחה!</p>}
        </div>

        {quiz.homework.length > 0 && (
          <div className="homework-section">
            <h3>שיעורי בית AI</h3>
            {quiz.homework.map((hw, i) => (
              <div key={i} className="homework-item">
                <div className="hw-number">משימה {i + 1}: {hw.title}</div>
                <p>{hw.description}</p>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '25px' }}>
              <p style={{ color: '#a78bfa', marginBottom: '15px', fontWeight: 600 }}>
                בסיום המשימות, שלחו קישור לשיחה / צילום מסך בוואטסאפ
              </p>
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <span className="whatsapp-icon">💬</span>
                שליחת שיעורי בית בוואטסאפ
              </a>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link href={`/user/${user}`} className="back-btn">← חזרה לתפריט</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <Link href={`/user/${user}`} className="back-btn" style={{ marginBottom: '15px' }}>← חזרה</Link>
        <h1>{quiz.title}</h1>
        <p className="subtitle">שלום {displayName} | שאלה {currentQuestion + 1} מתוך {totalQuestions}</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="score-display">
        <div className="score-item">
          <span className="label">נכונות:</span>
          <span className="value correct">{correctCount}</span>
        </div>
        <div className="score-item">
          <span className="label">שגויות:</span>
          <span className="value wrong">{wrongCount}</span>
        </div>
      </div>

      <div className="question-card" key={currentQuestion}>
        <div className="question-number">שאלה {currentQuestion + 1}</div>
        <div className="question-text">{question.question}</div>
        <div className="options">
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={getOptionClass(i)}
              onClick={() => handleAnswer(i)}
            >
              {String.fromCharCode(1488 + i)}. {opt}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`feedback ${selectedAnswer === question.correctIndex ? 'correct' : 'wrong'}`}>
            {selectedAnswer === question.correctIndex ? '✓ תשובה נכונה! ' : '✗ תשובה שגויה. '}
            {question.explanation}
          </div>
        )}
      </div>

      {showFeedback && (
        <button className="next-btn" onClick={handleNext}>
          {currentQuestion + 1 >= totalQuestions ? 'סיום השאלון →' : 'שאלה הבאה →'}
        </button>
      )}
    </div>
  );
}
