import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../siteConfig'
import BilliardsHero from '../components/BilliardsHero'

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
            Luxury Billiards Lounge
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

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-white/5 bg-surface p-6 transition-colors hover:border-gold/30"
            >
              <div className="text-gold">{h.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-cream">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-y border-white/5 bg-bronze-dark/20">
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
            className="shrink-0 rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ink transition-transform hover:scale-105"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  )
}
