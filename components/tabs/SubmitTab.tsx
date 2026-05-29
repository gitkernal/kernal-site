'use client'
import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'

export default function SubmitTab() {
  const { address } = useWallet()
  const [method, setMethod] = useState<'github' | 'manual'>('github')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionId, setSubmissionId] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, ...form, submitter_wallet: address || null })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Submission failed')
      } else {
        setSubmissionId(data.id)
        const existing = JSON.parse(localStorage.getItem('kernal_submissions') || '[]')
        existing.push({ id: data.id, status: 'pending', method, timestamp: new Date().toISOString() })
        localStorage.setItem('kernal_submissions', JSON.stringify(existing))
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submissionId) {
    return (
      <div className="px-5 pb-24 pt-2">
        <div
          className="border p-6 text-center"
          style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}
        >
          <div className="text-[32px] mb-3" style={{ color: 'var(--greenM)' }}>✓</div>
          <div className="font-serif text-[24px] mb-2 italic" style={{ color: 'var(--bg)' }}>Submitted.</div>
          <div className="font-mono text-[12px] mb-4" style={{ color: 'var(--amber)' }}>{submissionId}</div>
          <div className="font-sans text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Your skill has been submitted for review.<br />
            Review typically takes 5–10 business days.<br />
            Accepted skills earn 50% of all execution fees permanently.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pb-24 pt-2">
      {/* Method Toggle */}
      <div className="flex gap-2 mb-4">
        {(['github', 'manual'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className="flex-1 py-2 font-sans text-[10px] font-semibold tracking-widest uppercase border transition-colors"
            style={{
              background: method === m ? 'var(--dark)' : 'transparent',
              color: method === m ? 'var(--bg)' : 'var(--mid)',
              borderColor: method === m ? 'var(--dark)' : 'var(--bg3)'
            }}
          >
            {m === 'github' ? 'GitHub URL' : 'Manual Entry'}
          </button>
        ))}
      </div>

      {method === 'github' ? (
        <div className="space-y-4">
          <div>
            <label className="fl">GitHub Repository URL *</label>
            <input
              className="fi w-full"
              type="url"
              placeholder="https://github.com/user/repo"
              onChange={e => update('github_url', e.target.value)}
            />
          </div>
          <div className="font-sans text-[11px] leading-relaxed" style={{ color: 'var(--light)' }}>
            Your repo must contain a <span className="font-mono" style={{ color: 'var(--amber)' }}>SKILL.md</span> file
            in a <span className="font-mono" style={{ color: 'var(--amber)' }}>/skills/</span> directory.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fl">Skill Name *</label>
              <input className="fi w-full" placeholder="my-skill-name" onChange={e => update('skill_name', e.target.value)} />
            </div>
            <div>
              <label className="fl">Version</label>
              <input className="fi w-full" placeholder="1.0.0" onChange={e => update('skill_version', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fl">Tier</label>
              <select className="fi w-full" onChange={e => update('tier', e.target.value)}>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="fl">Category</label>
              <select className="fi w-full" onChange={e => update('category', e.target.value)}>
                {['monitoring', 'trading', 'defi', 'research', 'protection', 'governance', 'automation'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="fl">Description * (max 150 chars)</label>
            <textarea className="fi w-full" rows={2} maxLength={150} onChange={e => update('description', e.target.value)} />
          </div>
          <div>
            <label className="fl">Author Name *</label>
            <input className="fi w-full" onChange={e => update('author_name', e.target.value)} />
          </div>
          <div>
            <label className="fl">Author Wallet (for fee revenue)</label>
            <input
              className="fi w-full font-mono"
              placeholder="0x..."
              onChange={e => update('author_wallet', e.target.value)}
            />
          </div>
          <div>
            <label className="fl">GitHub URL</label>
            <input className="fi w-full" type="url" placeholder="https://github.com/..." onChange={e => update('github_url', e.target.value)} />
          </div>
          <div>
            <label className="fl">SKILL.md Content</label>
            <textarea
              className="fi w-full font-mono text-[10px]"
              rows={8}
              placeholder={'---\nname: my-skill\nversion: 1.0.0\n---\n\nYour skill instructions...'}
              onChange={e => update('skill_content', e.target.value)}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 font-mono text-[11px]" style={{ color: '#B83420' }}>✗ {error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full mt-4 py-3.5 font-sans text-[11px] font-semibold tracking-widest uppercase disabled:opacity-50"
        style={{ background: 'var(--dark)', color: 'var(--bg)' }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit for Review →'}
      </button>

      {/* Info Panel */}
      <div className="mt-4 border p-4" style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}>
        <div className="space-y-2">
          {[
            ['Listing fee', '5,000,000 $KRN at TGE'],
            ['Review time', '5–10 business days'],
            ['Revenue share', '50% of all execution fees'],
            ['Payment', 'Automatic, on-chain to author_wallet']
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-sans text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{k}</span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--amber)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
