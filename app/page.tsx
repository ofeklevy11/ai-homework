'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="select-screen">
      <div>
        <h1>שיעורי בינה מלאכותית</h1>
        <p>בחרו את המשתמש שלכם כדי להתחיל</p>
      </div>
      <div className="users-grid">
        <Link href="/user/mika" className="user-card">
          <div className="user-avatar">👩‍💻</div>
          <h2>מיקה</h2>
        </Link>
        <Link href="/user/rom" className="user-card">
          <div className="user-avatar">👨‍💻</div>
          <h2>רום</h2>
        </Link>
        <Link href="/user/ofek" className="user-card">
          <div className="user-avatar">🧑‍💻</div>
          <h2>אופק</h2>
        </Link>
      </div>
    </div>
  );
}
