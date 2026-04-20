import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Distilled Funding',
  description: 'The marketplace for operators who move money.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] btn-brutal-primary px-6 py-3 font-bold uppercase border-2 border-neo-black bg-neo-yellow text-neo-black shadow-brutal outline-none">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-grow outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
