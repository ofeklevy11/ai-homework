'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Submission {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  student: {
    name: string;
  };
}

const userNames: Record<string, string> = {
  mika: 'מיקה',
  rom: 'רום',
  ofek: 'אופק',
};

const quizNames: Record<string, string> = {
  lesson1: 'שיעור 1',
  lesson2: 'שיעור 2',
};

export default function LeaderboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quiz/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubmissions(data.submissions);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return '#34d399';
    if (pct >= 60) return '#fbbf24';
    return '#f87171';
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <Link href="/" className="back-btn" style={{ marginBottom: '15px' }}>← חזרה</Link>
        <h1>לוח תוצאות</h1>
        <p className="subtitle">כל התוצאות של השאלונים</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a78bfa' }}>טוען...</p>
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.2rem' }}>אין תוצאות עדיין</p>
          <p>ענו על שאלון כדי לראות תוצאות כאן</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {submissions.map((sub, i) => (
            <div
              key={sub.id}
              className="question-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 25px',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#a78bfa',
                    minWidth: '30px',
                  }}
                >
                  #{i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {userNames[sub.student.name] || sub.student.name}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {quizNames[sub.quizId] || sub.quizId} | {formatDate(sub.submittedAt)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: getScoreColor(sub.percentage),
                  }}
                >
                  {sub.percentage}%
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {sub.score}/{sub.totalQuestions}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
