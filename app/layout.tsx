import type { Metadata, Viewport } from 'next';
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bolo Register',
  description: 'Voice-first field register for ASHA / Anganwadi workers',
  manifest: '/manifest.webmanifest',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#7d1d3f' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
