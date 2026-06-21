'use client'
import { useState, useRef } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { SKILLS_DATA } from '@/lib/skills-data'
import Label from '@/components/ui/Label'

interface RunTabProps {
  initialSkillId?: string
}

export default function RunTab({ initialSkillId = '' }: RunTabProps) {
  const { address, tier } = useWallet()
  const [selectedSkillId, setSelectedSkillId] = useState(initialSkillId)
  const [config, setConfig] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const outputRef = useRef<HTMLDivElement>(null)

  const selectedSkill = SKILLS_DATA.find(s => s.id === selectedSkillId)
  const isPremiumLocked = selectedSkill?.tier === 'premium' && tier === 'None'

  function addLog(line: string) {
    setLogs(prev => [...prev, line])
  }

  async function executeSkill() {
    if (!selectedSkill) { setError('Select a skill first'); return }

    const requiredFields = selectedSkill.config_schema.filter(f => f.required)
    const missing = requiredFields.filter(f => !config[f.k])
    if (missing.length) { setError(`Required: ${missing.map(f => f.label).join(', ')}`); return }

    setIsLoading(true)
    setOutput('')
    setError('')
    setLogs([])

    addLog(`▸ Executing ${selectedSkillId}...`)
    addLog(`✓ Config validated (${Object.keys(config).length} params)`)
    addLog(`✓ Calling claude-sonnet-4-6...`)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: selectedSkillId, config, wallet_address: address || null })
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'PREMIUM_GATE') {
          setError(data.message)
        } else {
          setError(data.error || 'Execution failed')
        }
        addLog(`✗ Error: ${data.error}`)
      } else {
        setOutput(data.output)
        addLog(`✓ Execution complete (${data.duration_ms}ms)`)
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network error'
      setError(msg)
      addLog(`✗ Network error: ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-5 pb-24 pt-2">
      {/* Skill Selector */}
      <div className="mb-4">
        <Label className="mb-1">Select Skill</Label>
        <select
          className="fi w-full"
          value={selectedSkillId}
          onChange={e => { setSelectedSkillId(e.target.value); setConfig({}); setOutput(''); setError('') }}
        >
          <option value="">— Choose a skill —</option>
          <optgroup label="Free">
            {SKILLS_DATA.filter(s => s.tier === 'free').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
          <optgroup label="Premium — 10M $KRN Required">
            {SKILLS_DATA.filter(s => s.tier === 'premium').map(s => (
              <option key={s.id} value={s.id}>⬡ {s.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Premium Gate */}
      {isPremiumLocked && (
        <div
          className="border p-4 mb-4"
          style={{ background: 'var(--dark)', borderColor: 'rgba(184,116,32,0.3)' }}
        >
          <div
            className="font-mono text-[10px] tracking-widest mb-2"
            style={{ color: 'var(--amber)' }}
          >
            PREMIUM REQUIRED
          </div>
          <div className="font-sans text-[13px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            This skill requires 10,000,000 $KRN on Base.
          </div>
          <a
            href={`https://app.uniswap.org/swap?outputCurrency=${process.env.NEXT_PUBLIC_KRN_CONTRACT || '0x4B618aE486E721199F382dc1758A1DDBa284A0ab'}&chain=base`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 text-center font-sans text-[11px] font-semibold tracking-widest uppercase"
            style={{ background: 'var(--amber)', color: 'var(--dark)' }}
          >
            Buy $KRN on Uniswap →
          </a>
        </div>
      )}

      {/* Config Fields */}
      {selectedSkill && !isPremiumLocked && (
        <div className="mb-4 space-y-3">
          <Label>Configure</Label>
          {selectedSkill.config_schema.map(field => (
            <div key={field.k}>
              <label className="fl">{field.label}{field.required ? ' *' : ''}</label>
              {field.type === 'select' ? (
                <select
                  className="fi w-full"
                  value={config[field.k] ?? String(field.default ?? '')}
                  onChange={e => setConfig(prev => ({ ...prev, [field.k]: e.target.value }))}
                >
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={field.default as boolean}
                    onChange={e => setConfig(prev => ({ ...prev, [field.k]: String(e.target.checked) }))}
                  />
                  <span className="font-sans text-[12px]" style={{ color: 'var(--mid)' }}>Enabled</span>
                </label>
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  className="fi w-full"
                  placeholder={field.placeholder || ''}
                  defaultValue={field.default !== undefined ? String(field.default) : ''}
                  onChange={e => setConfig(prev => ({ ...prev, [field.k]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Execute Button */}
      {selectedSkill && !isPremiumLocked && (
        <button
          onClick={executeSkill}
          disabled={isLoading}
          className="w-full py-3.5 font-sans text-[11px] font-semibold tracking-widest uppercase mb-4 disabled:opacity-50"
          style={{ background: 'var(--amber)', color: 'var(--dark)' }}
        >
          {isLoading ? '▸ Running...' : '▶ Execute Skill'}
        </button>
      )}

      {/* Error */}
      {error && (
        <div
          className="border p-3 mb-4 font-mono text-[11px]"
          style={{ background: 'var(--dark)', borderColor: 'rgba(184,52,32,0.4)', color: '#B83420' }}
        >
          ✗ {error}
        </div>
      )}

      {/* Terminal Output */}
      {(logs.length > 0 || output) && (
        <div className="border p-4" style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}>
          <div
            className="flex items-center justify-between mb-3 pb-3"
            style={{ borderBottom: '1px solid var(--darkB)' }}
          >
            <span className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--amber)' }}>
              KERNAL EXECUTION LOG
            </span>
            {output && (
              <button
                onClick={() => navigator.clipboard?.writeText(output)}
                className="font-sans text-[9px] tracking-widest uppercase"
                style={{ color: 'var(--ghost)' }}
              >
                ⎘ Copy
              </button>
            )}
          </div>
          <div className="font-mono text-[11px] leading-loose mb-3">
            {logs.map((log, i) => (
              <div
                key={i}
                style={{
                  color: log.startsWith('✗') ? '#B83420'
                    : log.startsWith('✓') ? 'var(--greenM)'
                    : 'var(--mid)'
                }}
              >
                {log}
              </div>
            ))}
            {isLoading && (
              <div className="animate-pulse" style={{ color: 'var(--amber)' }}>█</div>
            )}
          </div>
          {output && (
            <div
              ref={outputRef}
              className="font-mono text-[12px] leading-relaxed pt-3 whitespace-pre-wrap"
              style={{ borderTop: '1px solid var(--darkB)', color: 'var(--ghost)' }}
            >
              {output}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
