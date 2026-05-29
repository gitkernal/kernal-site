'use client'
import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
}

export default function CopyButton({ text, label = '⎘ Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      className="font-sans text-[9px] tracking-widest uppercase transition-colors"
      style={{ color: copied ? 'var(--greenM)' : 'var(--ghost)' }}
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}
