'use client'

interface SoonOverlayProps {
  onClose?: () => void
  feature?: string
}

export default function SoonOverlay({ onClose, feature = 'This feature' }: SoonOverlayProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(14,23,20,0.92)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="border p-8 text-center max-w-xs mx-4"
        style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}
      >
        <div className="font-mono text-[9px] tracking-widest mb-3" style={{ color: 'var(--amber)' }}>
          COMING AT TGE
        </div>
        <div className="font-serif text-[24px] italic mb-3" style={{ color: 'var(--bg)' }}>
          {feature}
        </div>
        <div className="font-sans text-[12px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
          This feature launches with the KERNAL token generation event.
          Stake $KRN to gain early access.
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="font-sans text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--ghost)' }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  )
}
