import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ElevenLabs Agent',
  description: 'Voice-powered AI agent interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
