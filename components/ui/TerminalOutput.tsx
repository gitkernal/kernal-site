interface TerminalOutputProps {
  output: string
  logs?: string[]
  isLoading?: boolean
  className?: string
}

export default function TerminalOutput({ output, logs = [], isLoading = false, className = '' }: TerminalOutputProps) {
  return (
    <div
      className={`border p-4 ${className}`}
      style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}
    >
      <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--darkB)' }}>
        <span className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--amber)' }}>
          KERNAL EXECUTION LOG
        </span>
        {output && (
          <button
            onClick={() => navigator.clipboard?.writeText(output)}
            className="font-sans text-[9px] tracking-widest uppercase transition-colors"
            style={{ color: 'var(--ghost)' }}
          >
            ⎘ Copy
          </button>
        )}
      </div>
      {logs.length > 0 && (
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
      )}
      {output && (
        <div
          className="font-mono text-[12px] leading-relaxed pt-3 whitespace-pre-wrap"
          style={{ borderTop: '1px solid var(--darkB)', color: 'var(--ghost)' }}
        >
          {output}
        </div>
      )}
    </div>
  )
}
