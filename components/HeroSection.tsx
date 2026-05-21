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

  const blurValue = useTransform(scrollYProgress, [0, 1], [0, 24])
  const blurFilter = useTransform(blurValue, (v) => `blur(${v}px)`)
  const scaleValue = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const opacityValue = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const labelOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          filter: blurFilter,
          scale: scaleValue,
          opacity: opacityValue,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80"
          alt="hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: labelOpacity,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
          }}
        >
          PORTFOLIO
        </p>
      </motion.div>
    </section>
  )
}
