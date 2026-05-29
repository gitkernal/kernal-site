'use client'
import { useState, useEffect } from 'react'

export function useKrnBalance(address: string | null) {
  const [balance, setBalance] = useState<string | null>(null)
  const [tier, setTier] = useState<'None' | 'Premium' | 'Priority'>('None')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) {
      setBalance(null)
      setTier('None')
      return
    }
    setLoading(true)
    fetch(`/api/wallet/${address}`)
      .then(r => r.json())
      .then(d => {
        if (d.balance !== undefined) {
          const n = parseFloat(d.balance)
          setBalance(n.toLocaleString(undefined, { maximumFractionDigits: 0 }))
          setTier(d.tier as 'None' | 'Premium' | 'Priority')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [address])

  return { balance, tier, loading }
}
