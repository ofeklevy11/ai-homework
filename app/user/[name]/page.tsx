'use client';

import Link from 'next/link';
import { use } from 'react';

const userNames: Record<string, string> = {
  mika: 'מיקה',
  rom: 'רום',
  ofek: 'אופק',
};

export default function UserPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const displayName = userNames[name] || name;

  return (
    <div className="quiz-select">
      <Link href="/" className="back-btn">← חזרה לבחירת משתמש</Link>
      <h1>שלום {displayName}! בחר/י שאלון</h1>
      <div className="quiz-cards">
        <Link href={`/quiz/${name}/lesson1`} className="quiz-card">
          <div className="icon">📚</div>
          <h3>שיעור 1</h3>
          <p>מבוא לבינה מלאכותית - הזיות, מיתוסים ואימות מידע</p>
        </Link>
        <Link href={`/quiz/${name}/lesson2`} className="quiz-card">
          <div className="icon">🚀</div>
          <h3>שיעור 2</h3>
          <p>בקרוב...</p>
        </Link>
      </div>
    </div>
  );
}
