import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      {/*
        body background = #E8E4DC — the darker band visible on wide desktops
        The inner div is the app column: max 430px, centred, always #F9F6F0.
        Using inline styles so no Tailwind purge can strip them.
      */}
      <body className={`${inter.className} antialiased`}>
        {/* .app-frame is defined in globals.css — 440px on mobile, 680px on desktop ≥768px */}
        <div className="app-frame">
          {children}
        </div>
      </body>
    </html>
  )
}
