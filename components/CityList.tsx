'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react'

const cities = [
  { id: '01', name: 'Amthor',           image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { id: '02', name: 'Astrotalk',        image: '/clients/astrotalk.png' },
  { id: '03', name: 'boAt',             image: '/clients/boat.png' },
  { id: '04', name: 'BeatO',            image: '/clients/beato.jpg' },
  { id: '05', name: 'Responsive',       image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80' },
  { id: '06', name: 'SVERVE',           image: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=600&q=80' },
  { id: '07', name: 'Super Kicks',      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80' },
  { id: '08', name: 'True Colors',      image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&q=80' },
  { id: '09', name: 'Threads & Blocks', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80' },
  { id: '10', name: 'Rangat Jaipur',    image: '/clients/rangat.png' },
]

export default function CityList() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const springXRaw = useMotionValue(0)
  const springYRaw = useMotionValue(0)
  const springX = useSpring(springXRaw, { stiffness: 120, damping: 18 })
  const springY = useSpring(springYRaw, { stiffness: 120, damping: 18 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useEffect(() => {
    springXRaw.set(mousePos.x - 150)
    springYRaw.set(mousePos.y - 200)
  }, [mousePos, springXRaw, springYRaw])

  return (
    <section
      style={{
        background: '#000',
        minHeight: '100vh',
        padding: '80px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {cities.map((city) => (
        <div
          key={city.id}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            padding: '20px 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            cursor: 'none',
          }}
          onMouseEnter={() => setHoveredCity(city.name)}
          onMouseLeave={() => setHoveredCity(null)}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.25)',
              width: 40,
              flexShrink: 0,
            }}
          >
            {city.id}
          </span>
          <motion.div
            animate={{
              x: hoveredCity === city.name ? 12 : 0,
              color: hoveredCity === city.name ? '#ffffff' : 'rgba(255,255,255,0.5)',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(52px, 8vw, 88px)',
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            {city.name}
          </motion.div>
        </div>
      ))}

      <AnimatePresence>
        {hoveredCity && (
          <motion.div
            key={hoveredCity}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              x: springX,
              y: springY,
              width: 300,
              height: 400,
              borderRadius: 8,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 50,
            }}
          >
            <img
              src={cities.find((c) => c.name === hoveredCity)?.image}
              alt={hoveredCity}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
