'use client'

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import '../app/seo-dossier.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface SecondaryMetric {
  label: string; from?: number; to: number; prefix?: string; suffix?: string
}
interface Client {
  id: string; name: string; industry: string; location: string; months: number
  headline: string; headlineLabel: string; pullquote: string; quoteSource: string
  secondary: SecondaryMetric[]; spark: number[]; tag: string
}

// ─── Data ────────────────────────────────────────────────────────────────────
const SEO_CLIENTS: Client[] = [
  { id:'01', name:'Amthor', industry:'Industrial equipment', location:'India', months:10, headline:'+94%', headlineLabel:'organic traffic', pullquote:'We never thought a tank manufacturer could dominate search. Now distributors find us.', quoteSource:'Head of Sales, Amthor', secondary:[{label:'keywords ranked',from:0,to:340},{label:'backlinks built',from:0,to:2800},{label:'SEO conversions',from:0,to:20,prefix:'+',suffix:'%'}], spark:[10,14,19,26,34,43,53,62,71,82,91,94], tag:'Industrial B2B' },
  { id:'02', name:'Astrotalk', industry:'Astrology platform', location:'India', months:9, headline:'+1,840', headlineLabel:'keywords in top 10', pullquote:'From a niche app to a search-first brand. Organic is now our biggest acquisition channel.', quoteSource:'Growth Lead, Astrotalk', secondary:[{label:'domain authority',from:28,to:58},{label:'AI citation appearances',from:0,to:38,suffix:'/mo'},{label:'organic sessions MoM growth',from:0,to:9,prefix:'+',suffix:'%'}], spark:[120,180,260,370,490,640,810,1100,1420,1840], tag:'Consumer · D2C' },
  { id:'03', name:'boAt', industry:'Audio & wearables', location:'New Delhi, India', months:12, headline:'+312%', headlineLabel:'non-brand organic traffic', pullquote:'Competing with global giants on search — and winning category terms.', quoteSource:'Digital Marketing, boAt', secondary:[{label:'blogs published',from:0,to:192},{label:'backlinks acquired',from:0,to:3200},{label:'top-3 category keywords',from:12,to:214}], spark:[40,55,72,96,122,155,190,228,270,310,340,380], tag:'E-commerce' },
  { id:'04', name:'BeatO', industry:'Digital health · diabetes', location:'India', months:11, headline:'+428%', headlineLabel:'qualified organic leads', pullquote:'Our blog became a patient acquisition engine. The doctors noticed.', quoteSource:'VP Growth, BeatO', secondary:[{label:'DA growth',from:24,to:54},{label:'AI search citations',from:0,to:52,suffix:'/mo'},{label:'conversion lift',from:0,to:20,prefix:'+',suffix:'%'}], spark:[18,28,42,60,82,108,138,172,210,252,298], tag:'Health · SaaS' },
  { id:'05', name:'Responsive', industry:'B2B SaaS · proposals', location:'Remote', months:8, headline:'+247%', headlineLabel:'demo-intent traffic', pullquote:'We went from invisible to top-3 on every high-intent SaaS keyword that matters.', quoteSource:'CMO, Responsive', secondary:[{label:'keywords ranked',from:0,to:310},{label:'DA lift',from:32,to:60},{label:'MoM organic growth',from:0,to:9,prefix:'+',suffix:'%'}], spark:[22,34,50,70,96,124,158,196,240], tag:'B2B SaaS' },
  { id:'06', name:'SVERVE', industry:'Influencer marketing', location:'India', months:7, headline:'+189%', headlineLabel:'organic sign-ups', pullquote:'Site navigation rework alone drove 40% more time-on-page. Then rankings followed.', quoteSource:'Founder, SVERVE', secondary:[{label:'backlinks built',from:0,to:1800},{label:'blogs published',from:0,to:126},{label:'AI citation mentions',from:0,to:24,suffix:'/mo'}], spark:[14,22,34,52,74,104,142,189], tag:'MarTech' },
  { id:'07', name:'Super Kicks', industry:'Sneakers & streetwear', location:'Mumbai, India', months:9, headline:'+540%', headlineLabel:'organic revenue', pullquote:'Our sneaker blogs rank above Nike India on half our target terms. Half.', quoteSource:'Head of E-com, Super Kicks', secondary:[{label:'keywords in top 10',from:18,to:412},{label:'backlinks acquired',from:0,to:2600},{label:'MoM revenue growth',from:0,to:10,prefix:'+',suffix:'%'}], spark:[30,46,68,98,138,184,238,302,368], tag:'Retail · E-com' },
  { id:'08', name:'True Colors', industry:'Interior design', location:'Jaipur, India', months:6, headline:'#1', headlineLabel:'for 22 local design terms', pullquote:'Every project inquiry now mentions "found you on Google." Every single one.', quoteSource:'Principal Designer, True Colors', secondary:[{label:'DA growth',from:12,to:45},{label:'local pack rankings',from:0,to:22},{label:'organic inquiry conversion',from:0,to:20,prefix:'+',suffix:'%'}], spark:[4,8,14,22,32,44,58,72], tag:'Local SEO' },
  { id:'09', name:'Threads & Blocks', industry:'Fashion · apparel', location:'India', months:8, headline:'+612%', headlineLabel:'organic product traffic', pullquote:'We restructured navigation, added blogs, and watched category pages take off.', quoteSource:'Co-founder, Threads & Blocks', secondary:[{label:'blogs published',from:0,to:148},{label:'backlinks built',from:0,to:2200},{label:'DA growth',from:14,to:49}], spark:[18,30,46,68,102,144,196,256,320], tag:'Fashion · D2C' },
  { id:'10', name:'Rangat Jaipur', industry:'Luxury ethnic wear', location:'Jaipur, India', months:7, headline:'+233%', headlineLabel:'organic sessions', pullquote:"Jaipur's most searched ethnic wear brand — that is what GA4 is telling us now.", quoteSource:'Founder, Rangat Jaipur', secondary:[{label:'AI search citations',from:0,to:19,suffix:'/mo'},{label:'keywords ranked',from:0,to:280},{label:'MoM organic growth',from:0,to:8,prefix:'+',suffix:'%'}], spark:[12,20,32,50,74,108,152,210], tag:'Luxury · Local' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

// ─── CountUp ─────────────────────────────────────────────────────────────────
function CountUp({ from = 0, to, prefix = '', suffix = '', duration = 1400, active, decimals }: {
  from?: number; to: number; prefix?: string; suffix?: string
  duration?: number; active: boolean; decimals?: number
}) {
  const [val, setVal] = useState(from)
  const startedAt = useRef<number | null>(null)
  const raf = useRef<number>(0)
  useEffect(() => {
    if (!active) { setVal(from); return }
    startedAt.current = null
    const tick = (t: number) => {
      if (startedAt.current === null) startedAt.current = t
      const p = Math.min(1, (t - startedAt.current) / duration)
      setVal(from + (to - from) * easeOutCubic(p))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [active, from, to, duration])
  const isDecimal = decimals !== undefined ? decimals : (Number.isInteger(to) && Number.isInteger(from) ? 0 : 1)
  const display = val.toLocaleString(undefined, { minimumFractionDigits: isDecimal, maximumFractionDigits: isDecimal })
  return <span>{prefix}{display}{suffix}</span>
}

// ─── Sparkline ───────────────────────────────────────────────────────────────
function Sparkline({ data, active, color, height = 80 }: {
  data: number[]; active: boolean; color: string; height?: number
}) {
  const w = 320, h = height, pad = 6
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    pad + (1 - (v - min) / range) * (h - pad * 2),
  ])
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ')
  const area = path + ` L ${pts[pts.length - 1][0]} ${h - pad} L ${pts[0][0]} ${h - pad} Z`
  const pathRef = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(0)
  useLayoutEffect(() => { if (pathRef.current) setLen(pathRef.current.getTotalLength()) }, [path])
  const gradId = `seo-fade-${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} style={{ opacity: active ? 1 : 0, transition: 'opacity 0.8s ease 0.6s' }} />
      <path ref={pathRef} d={path} fill="none" stroke={color} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={active ? 0 : len}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1)' }} />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3.2 : 1.4} fill={color}
          style={{ opacity: active ? 1 : 0, transition: `opacity 0.4s ease ${0.8 + i * 0.04}s` }} />
      ))}
      {[0.25, 0.5, 0.75].map((y) => (
        <line key={y} x1={pad} x2={w - pad} y1={pad + y * (h - pad * 2)} y2={pad + y * (h - pad * 2)}
          stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="2 3" />
      ))}
    </svg>
  )
}

// ─── Spread ───────────────────────────────────────────────────────────────────
function Spread({ client, index, isActive }: { client: Client; index: number; isActive: boolean }) {
  return (
    <article className="seo-spread" data-spread>
      <header className="seo-spread-head">
        <div className="seo-head-left">
          <span className="seo-folio">No. {client.id}</span>
          <span className="seo-rule" />
          <span>{client.location}</span>
        </div>
        <span className="seo-tag">{client.tag}</span>
      </header>

      <div className="seo-spread-body">
        {/* Left */}
        <div className="seo-col-left">
          <div className="seo-industry">{client.industry}</div>
          <h2 className="seo-client-name">{client.name}</h2>
          <div className="seo-months">
            <span className="seo-months-num">
              <CountUp from={0} to={client.months} active={isActive} duration={900} />
            </span>
            <span className="seo-months-lbl">months of work</span>
          </div>
          <blockquote className="seo-quote">
            <span className="seo-open">&ldquo;</span>{client.pullquote}<span className="seo-close">&rdquo;</span>
            <cite>— {client.quoteSource}</cite>
          </blockquote>
        </div>

        {/* Center */}
        <div className="seo-col-center">
          <div className="seo-hero-metric">
            <div className="seo-hero-eyebrow"><span className="seo-dot" /><span>verified result</span></div>
            <div className="seo-hero-num" style={{ transform: isActive ? 'translateY(0)' : 'translateY(20px)', opacity: isActive ? 1 : 0 }}>
              {client.headline}
            </div>
            <div className="seo-hero-label">{client.headlineLabel}</div>
            <div className="seo-hero-baseline">measured against pre-engagement 90-day baseline*</div>
          </div>
        </div>

        {/* Right */}
        <div className="seo-col-right">
          <div className="seo-spark-wrap">
            <div className="seo-spark-label">
              <span>monthly trajectory</span>
              <span>m0 → m{client.spark.length - 1}</span>
            </div>
            <Sparkline data={client.spark} active={isActive} color="#FF3B2F" height={86} />
          </div>
          <ul className="seo-metrics">
            {client.secondary.map((m, i) => (
              <li key={i} className="seo-metric">
                <div className="seo-metric-num">
                  <CountUp from={m.from ?? 0} to={m.to} prefix={m.prefix || ''} suffix={m.suffix || ''} active={isActive} duration={1200 + i * 200} />
                </div>
                <div className="seo-metric-label">{m.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="seo-spread-foot">
        <span>page {String(index + 1).padStart(2, '0')} / {SEO_CLIENTS.length}</span>
        <span className="seo-foot-sep">·</span>
        <span>field notes — vol. 01</span>
        <span className="seo-foot-sep">·</span>
        <span>all results audited</span>
      </footer>
    </article>
  )
}

// ─── Carousel — scroll-jacked (vertical scroll → horizontal RAF lerp) ─────────
function Carousel() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef  = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress,  setProgress]  = useState(0)
  const translateRef = useRef(0)
  const targetRef    = useRef(0)

  const total = SEO_CLIENTS.length
  const wrapHeight = `calc(${total} * 100vh)`
  const LERP = 0.18

  useEffect(() => {
    const wrap   = wrapRef.current
    const sticky = stickyRef.current
    const track  = trackRef.current
    if (!wrap || !sticky || !track) return

    let raf = 0

    const update = () => {
      const rect = wrap.getBoundingClientRect()
      const vh   = window.innerHeight
      const scrolled  = -rect.top
      const maxScroll = rect.height - vh
      const p = Math.max(0, Math.min(1, scrolled / maxScroll))
      setProgress(p)

      const trackW    = track.scrollWidth
      const viewportW = sticky.clientWidth
      const maxTx     = Math.max(0, trackW - viewportW)
      targetRef.current = p * maxTx

      const cards = track.querySelectorAll<HTMLElement>('[data-spread]')
      const center = translateRef.current + viewportW / 2
      let best = 0, bestDist = Infinity
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
        if (d < bestDist) { bestDist = d; best = i }
      })
      setActiveIdx(best)
    }

    const tick = () => {
      const diff = targetRef.current - translateRef.current
      if (Math.abs(diff) > 0.1) translateRef.current += diff * LERP
      else translateRef.current = targetRef.current
      if (track) track.style.transform = `translate3d(${-translateRef.current}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }

    update()
    tick()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const goTo = useCallback((i: number) => {
    const wrap   = wrapRef.current
    const sticky = stickyRef.current
    const track  = trackRef.current
    if (!wrap || !sticky || !track) return
    const clamped = Math.max(0, Math.min(total - 1, i))
    const cards = track.querySelectorAll<HTMLElement>('[data-spread]')
    const card  = cards[clamped]
    if (!card) return
    const trackW    = track.scrollWidth
    const viewportW = sticky.clientWidth
    const maxTx     = Math.max(1, trackW - viewportW)
    const desiredTx = Math.max(0, Math.min(maxTx, card.offsetLeft - (viewportW - card.offsetWidth) / 2))
    const p = desiredTx / maxTx
    const wrapTop   = wrap.getBoundingClientRect().top + window.scrollY
    const maxScroll = wrap.getBoundingClientRect().height - window.innerHeight
    window.scrollTo({ top: wrapTop + p * maxScroll, behavior: 'smooth' })
  }, [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(activeIdx + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(activeIdx - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx, goTo])

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: wrapHeight }}>
      <div ref={stickyRef} className="seo-sticky">
        <div ref={trackRef} className="seo-track">
          <div className="seo-rail-spacer" />
          {SEO_CLIENTS.map((c, i) => (
            <Spread key={c.id} client={c} index={i} isActive={i === activeIdx} />
          ))}
          <div className="seo-rail-spacer" />
        </div>

        {/* Nav strip */}
        <div className="seo-nav-strip">
          <button className="seo-nav-btn" onClick={() => goTo(activeIdx - 1)} aria-label="Previous">
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 L4 7 L9 12" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="seo-folio-strip">
            {SEO_CLIENTS.map((c, i) => (
              <button key={c.id} className={`seo-folio-dot${i === activeIdx ? ' is-active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to ${c.name}`}>
                <span className="seo-folio-num">{c.id}</span>
                <span className="seo-folio-name">{c.name}</span>
              </button>
            ))}
          </div>
          <button className="seo-nav-btn" onClick={() => goTo(activeIdx + 1)} aria-label="Next">
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2 L10 7 L5 12" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <div className="seo-progress-bar">
          <div className="seo-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>

        {/* Scroll hint */}
        <div className="seo-scroll-hint" style={{ opacity: progress < 0.04 ? 1 : 0 }}>
          <span>scroll</span>
          <svg width="36" height="10" viewBox="0 0 36 10"><path d="M2 5 L30 5 M24 1 L30 5 L24 9" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  )
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
function SeoMarquee() {
  const items = ['10 brands scaled','★ ★ ★ ★ ★','25,000+ backlinks built','3,000+ keywords ranked','DA growth 45 → 60','↘ AI citations rising','+20% SEO conversion lift','vol. 01','field notes','scroll to read on']
  return (
    <div className="seo-marquee">
      <div className="seo-marquee-track">
        {[0,1,2].map((rep) => (
          <div className="seo-marquee-group" key={rep} aria-hidden={rep > 0}>
            {items.map((it, i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:22 }}>
                <span className="seo-marquee-item">{it}</span>
                <span className="seo-marquee-sep">※</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Brick reveal ─────────────────────────────────────────────────────────────
function Brick({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} style={{ overflow: 'hidden' }} className={className}>
      <motion.div
        initial={{ y: '105%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 280, damping: 30, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ─── Masthead ─────────────────────────────────────────────────────────────────
function Masthead() {
  const stats = [
    { n: '10',     l: 'brands scaled' },
    { n: '25K+',   l: 'backlinks acquired' },
    { n: '3,000+', l: 'keywords ranked' },
    { n: '+20%',   l: 'avg. SEO conversion lift' },
  ]
  return (
    <header className="seo-masthead">
      <Brick delay={0}>
        <div className="seo-masthead-top">
          <span>Field Notes</span>
          <span style={{ textAlign:'center' }}>Vol. 01 · May 2026</span>
          <span style={{ textAlign:'right' }}>SEO Dossier / Selected Receipts</span>
        </div>
      </Brick>
      <div className="seo-masthead-title">
        <Brick delay={0.08}><span className="seo-kicker">A portfolio of measurable, audited outcomes —</span></Brick>
        <h2 className="seo-display">
          <Brick delay={0.16}><span className="seo-display-line">The</span></Brick>
          <Brick delay={0.26}><span className="seo-display-line seo-big">Receipts.</span></Brick>
        </h2>
        <Brick delay={0.36}>
          <div className="seo-dek">
            <span className="seo-dek-rule" />
            <p>Ten case files. Every number sourced from Search Console, GA4 and Ahrefs.<em> No vibes, no projections.</em> Scroll to read on. ↓</p>
          </div>
        </Brick>
      </div>
      <div className="seo-masthead-stats">
        {stats.map(({ n, l }, i) => (
          <Brick key={l} delay={0.46 + i * 0.1}>
            <div className="seo-stat">
              <div className="seo-stat-num">{n}</div>
              <div className="seo-stat-label">{l}</div>
            </div>
          </Brick>
        ))}
      </div>
    </header>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function SEODossier() {
  return (
    <section className="seo-page">
      <Masthead />
      <Carousel />
      <div className="seo-bottom-rail"><SeoMarquee /></div>
      <footer className="seo-page-foot">
        <span>© Field Notes — selected SEO work, 2024–2026.</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>Press ← → or scroll to read on.</span>
      </footer>
    </section>
  )
}
