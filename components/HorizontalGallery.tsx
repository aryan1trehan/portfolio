'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const CARD_WIDTH = 400
const GAP = 24

const cards = [
  { id: '01', title: 'Search Presence', color: '#0d1117', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' },
  { id: '02', title: 'Keyword Research', color: '#161b22', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { id: '03', title: 'Brand Audit', color: '#1a1a2e', image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?w=800&q=80' },
  { id: '04', title: 'Competitor Analysis', color: '#16213e', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80' },
  { id: '05', title: 'Webflow Structure', color: '#0f3460', image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80' },
  { id: '06', title: 'On-Page SEO', color: '#1a0a2e', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80' },
  { id: '07', title: 'Off-Page SEO', color: '#0a1628', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' },
  { id: '08', title: 'Organic Search Improvement', color: '#1c1c1c', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { id: '09', title: 'Technical SEO', color: '#111827', image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?w=800&q=80' },
  { id: '10', title: 'Content Positioning', color: '#1f2937', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80' },
  { id: '11', title: 'Growth Tracking', color: '#0a0a1a', image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80' },
]

const CARDS = cards.length

export default function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const totalDistance = (CARDS - 1) * (CARD_WIDTH + GAP)
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance])

  return (
    <div
      ref={containerRef}
      style={{
        height: `calc(100vh + ${totalDistance}px)`,
        position: 'relative',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '5vh',
          left: '60px',
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
          }}
        >
          Selected Works
        </p>
      </div>

      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            x,
            display: 'flex',
            gap: GAP,
            paddingLeft: 60,
            willChange: 'transform',
          }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                flexShrink: 0,
                width: CARD_WIDTH,
                height: 500,
                borderRadius: 12,
                position: 'relative',
                overflow: 'hidden',
                background: card.color,
                cursor: 'none',
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 28,
                  zIndex: 1,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: 6,
                  }}
                >
                  {card.id}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '2rem',
                    color: 'white',
                    letterSpacing: '0.02em',
                  }}
                >
                  {card.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
