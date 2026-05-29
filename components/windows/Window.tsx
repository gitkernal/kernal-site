'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

interface WindowProps {
  title: string
  fileExt?: string
  children: React.ReactNode
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function Window({
  title,
  fileExt = '',
  children,
  onClose,
  onFocus,
  zIndex,
  initialX = 100,
  initialY = 60,
  initialWidth = 480,
  initialHeight = 560
}: WindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight })
  const [isMaximized, setIsMaximized] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    onFocus()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y
    }
  }, [onFocus, pos])

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      setPos({
        x: Math.max(0, dragRef.current.startPosX + dx),
        y: Math.max(0, dragRef.current.startPosY + dy)
      })
    }
    function onMouseUp() { dragRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const style = isMaximized
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 28px)', zIndex }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex }

  return (
    <div
      ref={windowRef}
      className="fixed flex flex-col border overflow-hidden shadow-2xl"
      style={{
        ...style,
        background: 'var(--bg)',
        borderColor: 'var(--bg3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 h-8 shrink-0 select-none border-b cursor-move"
        style={{ background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
        onMouseDown={handleMouseDown}
      >
        <div className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text)' }}>
          {title}{fileExt && <span style={{ color: 'var(--amber)' }}>{fileExt}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMaximized(m => !m)}
            className="w-4 h-4 flex items-center justify-center text-[9px] transition-colors"
            style={{ color: 'var(--mid)' }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? '⊡' : '□'}
          </button>
          <button
            onClick={onClose}
            className="w-4 h-4 flex items-center justify-center text-[9px] transition-colors hover:text-red-400"
            style={{ color: 'var(--mid)' }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>

      {/* Resize handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation()
            const startX = e.clientX
            const startY = e.clientY
            const startW = size.w
            const startH = size.h
            function onMove(ev: MouseEvent) {
              setSize({
                w: Math.max(320, startW + ev.clientX - startX),
                h: Math.max(200, startH + ev.clientY - startY)
              })
            }
            function onUp() {
              window.removeEventListener('mousemove', onMove)
              window.removeEventListener('mouseup', onUp)
            }
            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', onUp)
          }}
        />
      )}
    </div>
  )
}
