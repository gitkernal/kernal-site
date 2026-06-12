'use client'
import { useEffect, useState } from 'react'

const TICKER_ITEMS = [
  'KERNAL OS v2.0.0',
  '$KRN on Base',
  '12 skills live',
  'Powered by claude-sonnet-4-6',
  '0x974B...046ba3',
  'Premium: 10M $KRN',
  'Priority: 100M $KRN',
  'Submit your skill',
  'Earn 50% of execution fees',
  'gitkernal.app',
]

export default function Ticker() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev - 1) % (TICKER_ITEMS.join(' — ').length * 8))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const text = Array(3).fill(TICKER_ITEMS.join(' — ')).join(' — ')

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-7 overflow-hidden flex items-center z-50 border-t"
      style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}
    >
      <div
        className="font-mono text-[9px] tracking-widest whitespace-nowrap"
        style={{
          color: 'var(--amber)',
          transform: `translateX(${offset}px)`,
          transition: 'none'
        }}
      >
        {text}
      </div>
    </div>
  )
}
