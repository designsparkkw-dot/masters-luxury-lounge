import InstagramEmbed from '../components/InstagramEmbed'
import Reveal from '../components/Reveal'

// Curated Masters Instagram posts (newest venue-focused content first).
// To refresh: copy a post's permalink path from instagram.com/masters_kw.
const posts = [
  '/masters_kw/p/DZVIfC8AFsI/',
  '/masters_kw/reel/DZaRVWeAknK/',
  '/masters_kw/reel/DZXppZEg20E/',
  '/masters_kw/reel/DZSoFSmAyMc/',
  '/masters_kw/reel/DZNXQ6dNt5O/',
  '/masters_kw/reel/DZK8uoEtfrr/',
  '/masters_kw/reel/DZIN-N6g9a7/',
  '/masters_kw/reel/DZFzdIPAfYk/',
  '/masters_kw/p/DY7ceqrgN4q/',
]

export default function Gallery() {
  return (
    <div>
      <section className="border-b border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <span className="text-xs uppercase tracking-[0.4em] text-gold">Gallery</span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Inside <span className="text-gradient-gold">Masters</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80">
            Straight from our Instagram — the tables, the lounge, and the
            atmosphere. Follow{' '}
            <a
              href="https://www.instagram.com/masters_kw"
              target="_blank"
              rel="noreferrer"
              className="text-gold hover:underline"
            >
              @masters_kw
            </a>{' '}
            for the latest.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((permalink, i) => (
            <Reveal key={permalink} delay={(i % 3) * 120}>
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-ink shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
                <InstagramEmbed permalink={permalink} />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="https://www.instagram.com/masters_kw"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-gold/50 px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            View More on Instagram
          </a>
        </div>
      </section>
    </div>
  )
}
