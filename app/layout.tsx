import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('kernal_theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',s||p);}catch(e){}})();`
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
