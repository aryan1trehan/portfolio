'use client'

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'transparent',
      }}
    >
      <div style={{ mixBlendMode: 'difference' }}>
        <span
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.2rem',
            letterSpacing: '0.1em',
            color: 'white',
          }}
        >
          ARYAN
        </span>
      </div>
      <div
        style={{
          mixBlendMode: 'difference',
          display: 'flex',
          gap: 32,
          alignItems: 'center',
        }}
      >
        {['WORK', 'ABOUT', 'CONTACT'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'white',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.5')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  )
}
