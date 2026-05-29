'use client'
import { useState, useEffect, useCallback } from 'react'

interface WalletState {
  address: string | null
  krnBalance: string | null
  tier: 'None' | 'Premium' | 'Priority'
  isConnecting: boolean
  connect: (type: 'metamask' | 'coinbase') => Promise<void>
  disconnect: () => void
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null)
  const [krnBalance, setKrnBalance] = useState<string | null>(null)
  const [tier, setTier] = useState<'None' | 'Premium' | 'Priority'>('None')
  const [isConnecting, setIsConnecting] = useState(false)

  async function fetchBalanceData(addr: string) {
    try {
      const res = await fetch(`/api/wallet/${addr}`)
      const data = await res.json()
      if (data.balance !== undefined) {
        const n = parseFloat(data.balance)
        setKrnBalance(n.toLocaleString(undefined, { maximumFractionDigits: 0 }))
        setTier(data.tier as 'None' | 'Premium' | 'Priority')
      }
    } catch (e) {
      console.error('Balance fetch failed:', e)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('kernal_wallet')
    if (saved && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          const accs = accounts as string[]
          if (accs.length && accs[0].toLowerCase() === saved.toLowerCase()) {
            setAddress(accs[0])
            fetchBalanceData(accs[0])
          }
        })
        .catch(() => {})
    }
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return
    const handler = (accounts: unknown) => {
      const accs = accounts as string[]
      if (!accs.length) {
        setAddress(null)
        setKrnBalance(null)
        setTier('None')
        localStorage.removeItem('kernal_wallet')
      } else {
        setAddress(accs[0])
        localStorage.setItem('kernal_wallet', accs[0])
        fetchBalanceData(accs[0])
      }
    }
    window.ethereum.on('accountsChanged', handler)
    return () => window.ethereum?.removeListener('accountsChanged', handler)
  }, [])

  const connect = useCallback(async (_type: 'metamask' | 'coinbase') => {
    if (!window.ethereum) {
      alert('No wallet found. Install MetaMask or Coinbase Wallet.')
      return
    }
    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      if (!accounts.length) throw new Error('No accounts')

      // Switch to Base (chainId 0x2105 = 8453)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }]
        })
      } catch (switchErr: unknown) {
        if ((switchErr as { code?: number }).code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }]
          })
        }
      }

      const addr = accounts[0]
      setAddress(addr)
      localStorage.setItem('kernal_wallet', addr)
      await fetchBalanceData(addr)
    } catch (e) {
      console.error('Connect failed:', e)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setKrnBalance(null)
    setTier('None')
    localStorage.removeItem('kernal_wallet')
  }, [])

  return { address, krnBalance, tier, isConnecting, connect, disconnect }
}
