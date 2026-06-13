import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../siteConfig'
import BilliardsHero from '../components/BilliardsHero'
import Reveal from '../components/Reveal'
import logo from '../assets/logo.jpg'

const highlights = [
  {
    title: 'Pro-Grade Tables',
    desc: 'Tournament-standard pool & snooker tables, maintained to perfection for the perfect roll every time.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <circle cx="8" cy="12" r="1.6" fill="currentColor" />
        <circle cx="16" cy="9" r="1.6" fill="currentColor" />
        <circle cx="13" cy="15" r="1.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Open 24 Hours',
    desc: 'Day or night, Masters is open. Drop in anytime for a casual game or an all-night session.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Premium Lounge',
    desc: 'Sleek, modern interiors with comfortable seating, ambient lighting, and a refined late-night menu.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 20h16M6 20V10a6 6 0 0 1 12 0v10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20v-3a3 3 0 0 1 6 0v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Prime Location',
    desc: 'Located inside Al Salam Mall, Salmiya — easy access, convenient parking, central to everything.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
  },
]

const marqueeItems = [
  'Billiards',
  'Snooker',
  'VIP Tables',
  'Open 24 Hours',
  'Late-Night Menu',
  'Al Salam Mall',
]

const experiencePoints = [
  'Tournament-grade tables and equipment',
  'Signature gold & emerald interiors',
  'Lounge seating with a late-night menu',
  'Private VIP table for groups and events',
]

const tableTypes = [
  {
    name: 'American Pool',
    desc: 'Fast, social, and endlessly replayable — our 9-foot American tables are the heart of the lounge.',
  },
  {
    name: 'Snooker',
    desc: 'Full-size championship snooker tables with pristine cloth, for players who take precision seriously.',
  },
  {
    name: 'VIP Table',
    desc: 'A private setting with dedicated service — perfect for groups, celebrations, and serious matches.',
  },
]

const testimonials = [
  {
    quote:
      'The best tables in Kuwait, hands down. Perfect cloth, perfect lighting — you can tell they care about the game.',
    name: 'Abdullah',
  },
  {
    quote: 'Came in for one quick game at 2 AM and stayed until sunrise. The atmosphere is unmatched.',
    name: 'Fahad',
  },
  {
    quote: 'Reserved the VIP table for a birthday — the team had everything ready when we walked in. Flawless night.',
    name: 'Sara',
  },
]

function CountUp({ to, suffix = '', duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${to}${suffix}`
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          el.textContent = `${Math.round(to * eased)}${suffix}`
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, suffix, duration])

  return <span ref={ref}>0{suffix}</span>
}

function Testimonials() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((v) => (v + 1) % testimonials.length), 5500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="relative min-h-44 sm:min-h-36">
        {testimonials.map((t, i) => (
          <figure
            key={t.name}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <blockquote className="text-xl leading-relaxed text-cream/90 italic sm:text-2xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm uppercase tracking-[0.3em] text-gold">— {t.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-3">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Show review ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? 'w-8 bg-gold' : 'w-2 bg-cream/25 hover:bg-cream/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [playing, setPlaying] = useState(false)

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate min-h-[640px] overflow-hidden sm:min-h-[760px]">
        <div
          className="absolute inset-0 -z-30"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(138,106,48,0.4), transparent 60%), radial-gradient(ellipse at bottom right, rgba(201,164,103,0.15), transparent 55%), #060503',
          }}
        />
        <div className="absolute inset-0 -z-20">
          <BilliardsHero onPlayingChange={setPlaying} />
        </div>
        <div
          className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700 ${
            playing ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at center, rgba(6,5,3,0.72) 0%, rgba(6,5,3,0.4) 55%, rgba(6,5,3,0.12) 80%, rgba(6,5,3,0) 100%)',
          }}
        />
        <div
          className={`pointer-events-none relative mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center transition-opacity duration-700 select-none sm:px-6 sm:py-32 ${
            playing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="rounded-full border border-gold/40 px-4 py-1 text-xs uppercase tracking-[0.4em] text-gold">
            Al Salam Mall &middot; Salmiya
          </span>
          <h1 className="mt-6 text-5xl font-semibold sm:text-7xl">
            <span className="text-gradient-gold">MASTERS</span>
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.5em] text-muted">
            Luxury Lounge
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            {site.description}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/booking"
              className={`rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ink transition-transform hover:scale-105 ${
                playing ? '' : 'pointer-events-auto'
              }`}
            >
              Reserve a Table
            </Link>
            <Link
              to="/services"
              className={`rounded-full border border-cream/20 px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-cream transition-colors hover:border-gold hover:text-gold ${
                playing ? '' : 'pointer-events-auto'
              }`}
            >
              View Tables &amp; Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Scrolling marquee */}
      <section className="overflow-hidden border-y border-white/5 bg-surface py-6" aria-hidden="true">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {marqueeItems.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="font-display text-outline-gold mx-8 text-3xl font-bold tracking-[0.2em] uppercase whitespace-nowrap sm:text-4xl"
                >
                  {item}
                  <span className="mx-8 inline-block h-2 w-2 rounded-full bg-gold/60 align-middle" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 120}>
              <div className="card-sheen h-full rounded-2xl border border-white/5 bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30">
                <div className="text-gold">{h.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-cream">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The Experience */}
      <section className="relative overflow-hidden border-y border-white/5 bg-surface">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(138,106,48,0.18), transparent 55%)',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <Reveal direction="left">
            <span className="text-xs uppercase tracking-[0.4em] text-gold">The Experience</span>
            <h2 className="mt-4 text-4xl font-semibold text-cream sm:text-5xl">
              More Than <span className="text-gradient-gold">a Game</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/75">
              Masters was built for people who love the table — and for the nights that
              stretch long after the city sleeps. Every detail, from the cloth to the
              lighting to the menu, is tuned for the perfect session.
            </p>
            <ul className="mt-8 space-y-4">
              {experiencePoints.map((point, i) => (
                <Reveal key={point} delay={150 + i * 120}>
                  <li className="flex items-center gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-cream/85">{point}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-10 inline-block rounded-full border border-gold/50 px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Our Story
            </Link>
          </Reveal>

          <Reveal direction="right" className="relative">
            <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center">
              <div
                className="animate-glow absolute inset-6 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(201,164,103,0.28) 0%, rgba(201,164,103,0.08) 45%, transparent 70%)',
                }}
              />
              <div className="animate-float relative">
                <img
                  src={logo}
                  alt="Masters logo"
                  className="h-56 w-56 rounded-2xl border border-gold/30 object-cover shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:h-72 sm:w-72"
                />
                <div className="card-sheen absolute inset-0 rounded-2xl" />
              </div>
              <div
                className="animate-float absolute top-6 right-4 h-14 w-14 rounded-full sm:right-10"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, #f7f3e3, #c9a467 60%, #6e5220)',
                  animationDelay: '-2s',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.5)',
                }}
              />
              <div
                className="animate-float absolute bottom-10 left-2 flex h-16 w-16 items-center justify-center rounded-full sm:left-8"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, #4a4a4a, #0c0a07 65%)',
                  animationDelay: '-4s',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.55)',
                }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream font-display text-sm font-bold text-ink">
                  8
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 text-center sm:grid-cols-3">
          {[
            { value: 24, suffix: '', label: 'Hours Open, Every Day' },
            { value: 7, suffix: '', label: 'Days a Week, All Year' },
            { value: 3, suffix: '', label: 'Table Styles to Choose From' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 150}>
              <div className="font-display text-6xl font-bold text-gradient-gold sm:text-7xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tables */}
      <section className="border-y border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <Reveal className="text-center">
            <span className="text-xs uppercase tracking-[0.4em] text-gold">Pick Your Table</span>
            <h2 className="mt-4 text-4xl font-semibold text-cream sm:text-5xl">
              Three Ways <span className="text-gradient-gold">to Play</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {tableTypes.map((t, i) => (
              <Reveal key={t.name} delay={i * 150}>
                <div className="card-sheen group flex h-full flex-col rounded-2xl border border-white/5 bg-ink p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gold/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                  <span className="font-display text-5xl font-bold text-gold/25 transition-colors duration-300 group-hover:text-gold/60">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-cream">{t.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t.desc}</p>
                  <Link
                    to="/booking"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:text-gold-light"
                  >
                    Reserve
                    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal className="text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-gold">What Players Say</span>
          <h2 className="mt-4 mb-14 text-4xl font-semibold text-cream sm:text-5xl">
            Loved by <span className="text-gradient-gold">Night Owls</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <Testimonials />
        </Reveal>
      </section>

      {/* CTA Banner */}
      <section className="border-y border-white/5 bg-bronze-dark/20">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-14 text-center sm:px-6 md:flex-row md:text-left">
            <div>
              <h2 className="text-3xl font-semibold text-cream sm:text-4xl">
                Ready to rack up?
              </h2>
              <p className="mt-2 text-muted">
                Reserve your table online and walk straight in — no waiting.
              </p>
            </div>
            <Link
              to="/booking"
              className="card-sheen shrink-0 rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ink transition-transform hover:scale-105"
            >
              Book Now
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
