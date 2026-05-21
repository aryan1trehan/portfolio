'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import '../app/splash.css'

const WORD = 'Enhanccee'
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+=/?<>'
const SCRAMBLE_MS = 650
const TICK_MS = 35
const STAGGER_MS = 55
const HOLD_MS = 1800

function randChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)]
}

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [chars,   setChars]   = useState<string[]>(() => WORD.split('').map(() => randChar()))
  const [locked,  setLocked]  = useState<boolean[]>(() => Array(WORD.length).fill(false))
  const [settled, setSettled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lockedRef = useRef(locked)
  lockedRef.current = locked

  const totalMs = SCRAMBLE_MS + (WORD.length - 1) * STAGGER_MS + 200
  const cycleMs = totalMs + HOLD_MS

  // Main sequence: lock timers + settle + dismiss
  useEffect(() => {
    const lockTimers = WORD.split('').map((_, i) =>
      setTimeout(() => {
        setLocked(prev => { const n = prev.slice(); n[i] = true; return n })
        setChars(prev  => { const n = prev.slice(); n[i] = WORD[i]; return n })
      }, SCRAMBLE_MS + i * STAGGER_MS)
    )

    const settleTimer  = setTimeout(() => setSettled(true), totalMs)
    const dismissTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 650)
    }, cycleMs)

    return () => {
      lockTimers.forEach(clearTimeout)
      clearTimeout(settleTimer)
      clearTimeout(dismissTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scramble tick — restarts whenever locked changes so closure stays fresh
  useEffect(() => {
    if (settled) return
    const id = setInterval(() => {
      setChars(prev => prev.map((c, i) => lockedRef.current[i] ? WORD[i] : randChar()))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [locked, settled])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="splash-stage"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="splash-grain" />

          {/* Corner chrome */}
          <div className="splash-corner tl">Enhanccee™</div>
          <div className="splash-corner tr">seo · growth</div>
          <div className="splash-corner bl">© 2026</div>
          <div className="splash-corner br">
            <span className="splash-dot" />
            <span>Loading</span>
          </div>

          {/* Word */}
          <div className={`splash-word${settled ? ' is-settled' : ''}`}>
            {WORD.split('').map((_, i) => (
              <span key={i} className={`splash-slot${locked[i] ? ' is-locked' : ''}`}>
                <span key={chars[i] + (locked[i] ? 'L' : 'u')}>
                  {chars[i] ?? ' '}
                </span>
              </span>
            ))}
            <span className="splash-rule" />
          </div>

          {/* Caption */}
          <div className={`splash-caption${settled ? ' is-in' : ''}`}>
            Make it better. Make it Enhanccee.
          </div>

          {/* Progress bar */}
          <div className="splash-progress is-run" style={{ '--cycle': `${cycleMs}ms` } as React.CSSProperties}>
            <i />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
