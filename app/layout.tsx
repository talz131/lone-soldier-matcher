/* GLOBAL LAYOUT - DO NOT ADD MAX-WIDTH TO INDIVIDUAL PAGES */
// DO NOT CHANGE MAX-WIDTH - this controls the entire app layout
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Lone Soldier Host Family Matcher',
  description: 'Connecting lone soldiers with loving host families across Israel',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Single source of truth for app width + background.
            Inline style is immune to Tailwind purging — this will never break. */}
        <div style={{
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          minHeight: '100vh',
          backgroundColor: '#F9F6F0',
        }}>
          {children}
        </div>
      </body>
    </html>
  )
}
