'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const blurValue  = useTransform(scrollYProgress, [0, 1], [0, 20])
  const blurFilter = useTransform(blurValue, (v) => `blur(${v}px)`)
  const scaleValue = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const bgOpacity  = useTransform(scrollYProgress, [0, 0.9], [1, 0])
  const textY      = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  return (
    <section
      ref={ref}
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      {/* Background image — pushed back with overlay */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          filter: blurFilter,
          scale: scaleValue,
          opacity: bgOpacity,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80"
          alt="hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Dark overlay to push bg back */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)',
        }} />
      </motion.div>

      {/* Hero text */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          y: textY, opacity: textOpacity,
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          letterSpacing: '0.38em',
          color: 'rgba(255,255,255,0.65)',
          textTransform: 'uppercase',
          margin: '0 0 18px',
        }}>
          Selected Works · 2024 – 2026
        </p>

        <h1 style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(100px, 18vw, 260px)',
          lineHeight: 0.88,
          letterSpacing: '0.04em',
          color: '#ffffff',
          textTransform: 'uppercase',
          margin: 0,
          textAlign: 'center',
          textShadow: '0 4px 60px rgba(0,0,0,0.5)',
        }}>
          PORT<br />FOLIO
        </h1>

        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          letterSpacing: '0.28em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          margin: '22px 0 0',
        }}>
          Scroll to explore ↓
        </p>
      </motion.div>
    </section>
  )
}
