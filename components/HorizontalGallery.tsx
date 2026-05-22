'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'

const CARD_WIDTH = 400
const GAP = 24

const cards = [
  { id: '01', title: 'Search Presence',           color: '#0d1117', image: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '02', title: 'Keyword Research',          color: '#161b22', image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '03', title: 'Brand Audit',               color: '#1a1a2e', image: 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '04', title: 'Competitor Analysis',       color: '#16213e', image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '05', title: 'Webflow Structure',         color: '#0f3460', image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '06', title: 'On-Page SEO',               color: '#1a0a2e', image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '07', title: 'Off-Page SEO',              color: '#0a1628', image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '08', title: 'Organic Search Improvement',color: '#1c1c1c', image: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '09', title: 'Technical SEO',             color: '#111827', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '10', title: 'Content Positioning',       color: '#1f2937', image: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '11', title: 'Growth Tracking',           color: '#0a0a1a', image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800' },
]

const CARDS = cards.length

// ─── Desktop version (scroll-driven) ──────────────────────────────────────────
function GalleryDesktop() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const totalDistance = (CARDS - 1) * (CARD_WIDTH + GAP)
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance])

  return (
    <div ref={containerRef} style={{ height: `calc(100vh + ${totalDistance}px)`, position: 'relative', background: '#0a0a0a' }}>
      <div style={{ position: 'absolute', top: '5vh', left: '60px', zIndex: 10 }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
          Selected Works
        </p>
      </div>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <motion.div style={{ x, display: 'flex', gap: GAP, paddingLeft: 60, willChange: 'transform' }}>
          {cards.map((card) => (
            <GalleryCard key={card.id} card={card} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Mobile version (swipe-driven) ────────────────────────────────────────────
function GalleryMobile() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const touchStartX = useRef(0)

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(CARDS - 1, next))
    setDir(next > activeIdx ? 1 : -1)
    setActiveIdx(clamped)
  }, [activeIdx])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) < 40) return
    goTo(dx > 0 ? activeIdx + 1 : activeIdx - 1)
  }

  const card = cards[activeIdx]

  return (
    <div
      style={{ height: '100vh', background: '#0a0a0a', position: 'relative', overflow: 'hidden', touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
          Selected Works
        </p>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={card.id}
          custom={dir}
          initial={{ x: dir * 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir * -300, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px 40px' }}
        >
          <div style={{ width: '100%', maxWidth: 380, height: '70vw', maxHeight: 480, borderRadius: 12, overflow: 'hidden', position: 'relative', background: card.color }}>
            <img src={card.image} alt={card.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{card.id}</p>
              <p style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: 'white', letterSpacing: '0.02em' }}>{card.title}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 10 }}>
        {cards.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ width: i === activeIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.25)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

// ─── Card (shared) ─────────────────────────────────────────────────────────────
function GalleryCard({ card }: { card: typeof cards[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ flexShrink: 0, width: CARD_WIDTH, height: 500, borderRadius: 12, position: 'relative', overflow: 'hidden', background: card.color, cursor: 'none' }}
    >
      <img src={card.image} alt={card.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 28, zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{card.id}</p>
        <p style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: 'white', letterSpacing: '0.02em' }}>{card.title}</p>
      </div>
    </motion.div>
  )
}

// ─── Root (switches based on screen width) ────────────────────────────────────
export default function HorizontalGallery() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile ? <GalleryMobile /> : <GalleryDesktop />
}
