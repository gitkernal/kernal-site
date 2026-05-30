'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {}
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('kernal_theme') as Theme | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initial = saved || preferred
    setThemeState(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  function toggleTheme() {
    setThemeState(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('kernal_theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : 'light', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
