'use client'

const rows = [
  { words: ['CREATIVE', 'DESIGN', 'MOTION', 'STUDIO'], direction: -1 },
  { words: ['PORTFOLIO', 'VISUAL', 'CRAFT', 'DIGITAL'], direction: 1 },
  { words: ['EXPERIENCE', 'INTERFACE', 'AESTHETIC', 'BUILD'], direction: -1 },
  { words: ['FRONTEND', 'ANIMATION', 'CODE', 'IDENTITY'], direction: 1 },
]

export default function MarqueeText() {
  return (
    <section
      style={{
        background: '#000',
        padding: '80px 0',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {rows.map((row, rowIndex) => {
        const repeated = Array(6).fill(row.words).flat()

        return (
          <div
            key={rowIndex}
            style={{
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                animation: row.direction === -1
                  ? 'marquee-left 30s linear infinite'
                  : 'marquee-right 30s linear infinite',
              }}
            >
              {repeated.map((word, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: 'clamp(64px, 10vw, 110px)',
                      lineHeight: 0.95,
                      letterSpacing: '0.02em',
                      paddingLeft: '0.3em',
                      paddingRight: '0.3em',
                      color: i % 2 === 0 ? 'white' : 'transparent',
                      WebkitTextStroke: i % 2 === 0 ? undefined : '1px rgba(255,255,255,0.4)',
                    }}
                  >
                    {word}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.3)',
                      flexShrink: 0,
                      marginLeft: '0.2em',
                      marginRight: '0.2em',
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
