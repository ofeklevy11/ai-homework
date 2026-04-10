import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'שיעורי AI - מיקה ורום',
  description: 'מערכת שאלונים אינטראקטיבית לשיעורי בינה מלאכותית',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
