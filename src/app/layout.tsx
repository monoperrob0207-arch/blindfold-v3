import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blindfold v3 - Mission Control',
  description: 'Multi-Agent Orchestration System with Proactive Agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-onyx-950 text-white antialiased`}>
        <div className="grid-bg fixed inset-0 pointer-events-none" />
        <div className="relative z-10 flex h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
