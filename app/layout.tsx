import type { Metadata } from 'next'
import { Montserrat, Lora } from 'next/font/google'
import './globals.css'
import WatercolorTexture from '@/components/effects/WatercolorTexture'
import Footer from '@/components/footer/Footer'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['500', '600', '700'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'MQ Studio - Moura Quayle | Feeling, Thinking, Doing',
  description: 'Academia, Leadership, and Design converge in Moura Quayle\'s digital studio. Explore academic publications, watercolor art, and reflections on governance and design.',
  keywords: [
    'Moura Quayle',
    'landscape architecture',
    'governance',
    'design thinking',
    'watercolor art',
    'academic publications',
    'urban planning',
    'community design',
  ],
  authors: [{ name: 'Moura Quayle' }],
  creator: 'Moura Quayle',
  publisher: 'MQ Studio',
  openGraph: {
    title: 'MQ Studio - Moura Quayle | Feeling, Thinking, Doing',
    description: 'Academia, Leadership, and Design converge in Moura Quayle\'s digital studio.',
    url: 'https://mouraquayle.ca',
    siteName: 'MQ Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MQ Studio - Moura Quayle',
    description: 'Academia, Leadership, and Design converge in Moura Quayle\'s digital studio.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external resources for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for potential future requests */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* RSS Feed for auto-discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Moura Quayle - Musings RSS Feed"
          href="/musings/feed.xml"
        />
      </head>
      <body className={`${montserrat.variable} ${lora.variable} font-lora antialiased flex flex-col min-h-screen`}>
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--moura-teal)] focus:text-white focus:rounded-md focus:font-montserrat focus:font-medium"
        >
          Skip to main content
        </a>
        <WatercolorTexture />
        <div id="main-content" className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}