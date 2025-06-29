
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'),
  title: {
    default: 'MediTrack - Your Intelligent Health Companion',
    template: '%s | MediTrack',
  },
  description: 'Get AI-powered symptom analysis, track your health journey, and schedule appointments seamlessly with MediTrack.',
  keywords: ['health AI', 'symptom checker', 'medical assistant', 'AI diagnosis', 'health tracking', 'appointment scheduling'],
  openGraph: {
    title: 'MediTrack - Your Intelligent Health Companion',
    description: 'AI-powered symptom analysis, health tracking, and appointment scheduling.',
    url: '/',
    siteName: 'MediTrack',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=MediTrack', 
        width: 1200,
        height: 630,
        alt: 'MediTrack',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediTrack - Your Intelligent Health Companion',
    description: 'AI-powered symptom analysis, health tracking, and appointment scheduling.',
    images: ['https://placehold.co/1200x630.png?text=MediTrack'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`antialiased font-sans`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
