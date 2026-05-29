import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KERNAL — AI Skill OS for Base Network',
  description: 'Deploy, execute, and compose AI skills on Base Network. Powered by $KRN.',
  metadataBase: new URL('https://gitkernal.xyz'),
  openGraph: {
    title: 'KERNAL — AI Skill OS for Base Network',
    description: 'Deploy, execute, and compose AI skills on Base Network.',
    url: 'https://gitkernal.xyz',
    siteName: 'KERNAL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KERNAL — AI Skill OS for Base Network',
    description: 'Deploy, execute, and compose AI skills on Base Network.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
