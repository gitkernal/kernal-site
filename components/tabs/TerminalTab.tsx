'use client'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import JSZip from 'jszip'
import { useWallet } from '@/hooks/useWallet'

// Lazy-load Sandpack so its (heavy) bundler only ships when the preview is opened.
const Sandpack = dynamic(
  () => import('@codesandbox/sandpack-react').then(m => m.Sandpack),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6B6655', background: '#0D0D0A'
      }}>
        Loading preview…
      </div>
    ),
  }
)

interface Message {
  role: 'user' | 'assistant'
  content: string
  files?: Record<string, string>
}

interface Project {
  framework: string
  files: Record<string, string>
  entryFile: string
}

export default function TerminalTab() {
  const { address, tier } = useWallet()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [activeFile, setActiveFile] = useState('')
  const [error, setError] = useState('')
  const [isNarrow, setIsNarrow] = useState(false)
  const [mobileView, setMobileView] = useState<'chat' | 'workspace'>('chat')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const isPremium = tier === 'Premium' || tier === 'Priority'

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function generate() {
    if (!input.trim() || isGenerating) return
    if (!address) { setError('Connect wallet first'); return }
    if (!isPremium) { setError('Requires 10M $KRN'); return }
    if (input.trim().length > 2000) { setError('Prompt too long (max 2000 chars)'); return }

    const userPrompt = input.trim()
    setInput('')
    setError('')
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }])
    setIsGenerating(true)
    if (isNarrow) setMobileView('chat')

    // Build conversation history for iterative edits
    const conversation = messages.map(m => ({
      role: m.role,
      content: m.role === 'assistant' && m.files
        ? `Previous project: ${JSON.stringify(m.files)}`
        : m.content
    }))

    try {
      const res = await fetch('/api/terminal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, wallet_address: address, conversation })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || data.error)
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.message || data.error}` }])
      } else {
        setProject({ framework: data.framework, files: data.files, entryFile: data.entryFile })
        setActiveFile(Object.keys(data.files)[0])
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.explanation,
          files: data.files
        }])
        if (isNarrow) setMobileView('workspace')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setIsGenerating(false)
    }
  }

  async function downloadZip() {
    if (!project) return
    const zip = new JSZip()
    Object.entries(project.files).forEach(([name, content]) => {
      zip.file(name, content)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kernal-app.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Build Sandpack files object (keys need leading slash)
  const sandpackFiles = project ? Object.fromEntries(
    Object.entries(project.files).map(([name, content]) => [
      name.startsWith('/') ? name : '/' + name,
      content
    ])
  ) : {}

  // ── Chat panel ──
  const chatPanel = (
    <div
      style={{
        width: isNarrow ? '100%' : '45%',
        display: isNarrow && mobileView !== 'chat' ? 'none' : 'flex',
        flex: isNarrow ? 1 : undefined,
        flexDirection: 'column',
        borderRight: isNarrow ? 'none' : '1px solid #1E1E18',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E1E18' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#B87420', letterSpacing: 2 }}>
          KERNAL AI CODING TERMINAL
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#4A4A40', marginTop: 4 }}>
          Powered by claude-sonnet-4-6 · Premium ($KRN)
        </div>
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', minHeight: 0 }}>
        {messages.length === 0 && (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#00FF88', lineHeight: 1.8 }}>
            <div>KERNAL AI Coding Terminal v1.0</div>
            <div style={{ color: '#4A4A40', marginTop: 8 }}>
              Describe an app and I&apos;ll build it — live preview + download.
            </div>
            <div style={{ color: '#4A4A40', marginTop: 12 }}>Examples:</div>
            <div style={{ color: '#6B6655', marginTop: 4 }}>› build a pomodoro timer with dark theme</div>
            <div style={{ color: '#6B6655' }}>› make a crypto price tracker dashboard</div>
            <div style={{ color: '#6B6655' }}>› create a markdown note-taking app</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
            {m.role === 'user' ? (
              <div>
                <span style={{ color: '#B87420' }}>kernal@registry:~$ </span>
                <span style={{ color: '#E8E3D8' }}>{m.content}</span>
              </div>
            ) : (
              <div style={{ color: '#00FF88', lineHeight: 1.7 }}>
                <span style={{ color: '#3D6B28' }}>✓ </span>{m.content}
                {m.files && (
                  <div style={{ color: '#4A4A40', marginTop: 6, fontSize: 11 }}>
                    Created {Object.keys(m.files).length} files: {Object.keys(m.files).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isGenerating && (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#B87420' }}>
            ▸ Generating<span className="blink">█</span>
          </div>
        )}
        {error && (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#B83420', marginTop: 8 }}>
            ✗ {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1E1E18' }}>
        {!address ? (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#B87420' }}>
            Connect wallet (10M $KRN) to unlock →
          </div>
        ) : !isPremium ? (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#B87420' }}>
            Requires 10,000,000 $KRN for AI coding access
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="Describe your app..."
              maxLength={2000}
              disabled={isGenerating}
              style={{
                flex: 1, background: '#141410', border: '1px solid #2E2D26',
                color: '#E8E3D8', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                padding: '10px 12px', outline: 'none'
              }}
            />
            <button
              onClick={generate}
              disabled={isGenerating}
              style={{
                background: '#B87420', color: '#0D0D0A', border: 'none',
                fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600,
                letterSpacing: 1.5, padding: '0 18px', cursor: isGenerating ? 'default' : 'pointer',
                textTransform: 'uppercase', opacity: isGenerating ? 0.6 : 1
              }}
            >
              {isGenerating ? '...' : 'Send'}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // ── Workspace panel ──
  const workspacePanel = (
    <div
      style={{
        width: isNarrow ? '100%' : '55%',
        display: isNarrow && mobileView !== 'workspace' ? 'none' : 'flex',
        flex: isNarrow ? 1 : undefined,
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {project ? (
        <>
          {/* Workspace toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px', borderBottom: '1px solid #1E1E18'
          }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => setView('preview')} style={tabStyle(view === 'preview')}>PREVIEW</button>
              <button onClick={() => setView('code')} style={tabStyle(view === 'code')}>CODE</button>
            </div>
            <button onClick={downloadZip} style={{
              background: 'transparent', border: '1px solid #B87420', color: '#B87420',
              fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
              padding: '6px 14px', cursor: 'pointer', textTransform: 'uppercase'
            }}>
              ↓ Download ZIP
            </button>
          </div>

          {/* Preview or Code */}
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            {view === 'preview' ? (
              <Sandpack
                key={Object.keys(sandpackFiles).join(',')}
                template={project.framework === 'react' ? 'react' : 'static'}
                files={sandpackFiles}
                options={{ showNavigator: false, showTabs: false, editorHeight: '100%', showConsole: false }}
                theme="dark"
              />
            ) : (
              <div style={{ display: 'flex', height: '100%' }}>
                {/* File list */}
                <div style={{ width: 180, borderRight: '1px solid #1E1E18', padding: 12, overflowY: 'auto' }}>
                  {Object.keys(project.files).map(name => (
                    <div key={name} onClick={() => setActiveFile(name)} style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11, padding: '6px 8px',
                      color: activeFile === name ? '#B87420' : '#6B6655', cursor: 'pointer',
                      background: activeFile === name ? '#141410' : 'transparent'
                    }}>
                      {name}
                    </div>
                  ))}
                </div>
                {/* Code content */}
                <pre style={{
                  flex: 1, overflow: 'auto', padding: 16, margin: 0,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#E8E3D8',
                  lineHeight: 1.6
                }}>
                  {project.files[activeFile]}
                </pre>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#3D3C35'
        }}>
          Your app preview will appear here
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', height: '100%', background: '#0D0D0A' }}>
      {/* Mobile view toggle */}
      {isNarrow && (
        <div style={{ display: 'flex', borderBottom: '1px solid #1E1E18', flexShrink: 0 }}>
          <button onClick={() => setMobileView('chat')} style={mobileTabStyle(mobileView === 'chat')}>CHAT</button>
          <button onClick={() => setMobileView('workspace')} style={mobileTabStyle(mobileView === 'workspace')}>WORKSPACE</button>
        </div>
      )}
      {chatPanel}
      {workspacePanel}
    </div>
  )
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
    color: active ? '#B87420' : '#6B6655', textTransform: 'uppercase',
    borderBottom: active ? '2px solid #B87420' : '2px solid transparent',
    paddingBottom: 4
  }
}

function mobileTabStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1, background: active ? '#141410' : 'transparent', border: 'none',
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 600,
    letterSpacing: 1.5, color: active ? '#B87420' : '#6B6655', textTransform: 'uppercase',
    padding: '10px 0', borderBottom: active ? '2px solid #B87420' : '2px solid transparent'
  }
}
