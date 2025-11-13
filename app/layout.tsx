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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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