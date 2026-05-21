'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function Cursor() {
  const dotX = useMotionValue(-20)
  const dotY = useMotionValue(-20)

  const ringXRaw = useMotionValue(-40)
  const ringYRaw = useMotionValue(-40)

  const ringX = useSpring(ringXRaw, { stiffness: 120, damping: 18, mass: 0.8 })
  const ringY = useSpring(ringYRaw, { stiffness: 120, damping: 18, mass: 0.8 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX - 5)
      dotY.set(e.clientY - 5)
      ringXRaw.set(e.clientX - 19)
      ringYRaw.set(e.clientY - 19)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [dotX, dotY, ringXRaw, ringYRaw])

  return (
    <>
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          position: 'fixed',
          width: 10,
          height: 10,
          background: 'white',
          borderRadius: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
          top: 0,
          left: 0,
        }}
      />
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          position: 'fixed',
          width: 38,
          height: 38,
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: '50%',
          zIndex: 9998,
          pointerEvents: 'none',
          top: 0,
          left: 0,
        }}
      />
    </>
  )
}
