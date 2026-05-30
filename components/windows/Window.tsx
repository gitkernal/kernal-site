'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

const TOPBAR_H = 40
const SIDEBAR_W = 180
const TICKER_H = 28

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
  initialX = 260,
  initialY = 70,
  initialWidth = 680,
  initialHeight = 520
}: WindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight })
  const [isMaximized, setIsMaximized] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null)

  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
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
        x: Math.max(SIDEBAR_W, dragRef.current.startPosX + dx),
        y: Math.max(TOPBAR_H, dragRef.current.startPosY + dy)
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

  const maximizedStyle = {
    left: SIDEBAR_W,
    top: TOPBAR_H,
    width: `calc(100vw - ${SIDEBAR_W}px)`,
    height: `calc(100vh - ${TOPBAR_H}px - ${TICKER_H}px)`,
    zIndex
  }

  const normalStyle = {
    left: pos.x,
    top: pos.y,
    width: size.w,
    height: size.h,
    zIndex
  }

  const style = isMaximized ? maximizedStyle : normalStyle

  return (
    <div
      className="fixed flex flex-col overflow-hidden"
      style={{
        ...style,
        background: 'var(--bg)',
        border: '1px solid var(--bg3)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center h-9 px-3 shrink-0 select-none border-b cursor-move relative"
        style={{ background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
        onMouseDown={handleTitleMouseDown}
      >
        {/* Traffic light dots */}
        <div className="flex items-center gap-1.5 shrink-0 z-10">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full transition-opacity hover:opacity-75"
            style={{ background: '#ff5f57' }}
            title="Close"
          />
          <button
            className="w-3 h-3 rounded-full cursor-default"
            style={{ background: '#ffbd2e', opacity: 0.5 }}
            title="Minimize"
          />
          <button
            onClick={() => setIsMaximized(m => !m)}
            className="w-3 h-3 rounded-full transition-opacity hover:opacity-75"
            style={{ background: '#28c840' }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          />
        </div>

        {/* Centered title — absolutely positioned so it doesn't shift with dots */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: 'var(--text)' }}
          >
            {title}
            {fileExt && <span style={{ color: 'var(--amber)' }}>{fileExt}</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>

      {/* Resize handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end pr-1 pb-1"
          style={{ color: 'var(--bg3)' }}
          onMouseDown={(e) => {
            e.stopPropagation()
            const startX = e.clientX
            const startY = e.clientY
            const startW = size.w
            const startH = size.h
            function onMove(ev: MouseEvent) {
              setSize({
                w: Math.max(380, startW + ev.clientX - startX),
                h: Math.max(240, startH + ev.clientY - startY)
              })
            }
            function onUp() {
              window.removeEventListener('mousemove', onMove)
              window.removeEventListener('mouseup', onUp)
            }
            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', onUp)
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M8 0L8 8L0 8" stroke="var(--bg3)" strokeWidth="1.5"/>
          </svg>
        </div>
      )}
    </div>
  )
}
