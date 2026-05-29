'use client'
import { useState, useEffect } from 'react'
import BootScreen from '@/components/os/BootScreen'
import DesktopOS from '@/components/os/DesktopOS'
import MobileOS from '@/components/os/MobileOS'

export default function Home() {
  const [phase, setPhase] = useState<'boot' | 'os'>('boot')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (phase === 'boot') {
    return <BootScreen onComplete={() => setPhase('os')} />
  }

  return isMobile ? <MobileOS /> : <DesktopOS />
}
