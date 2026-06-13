import ReelCard from './ReelCard'
import Reveal from './Reveal'

// Masters reels. Drop the video files in masters-lounge/public/reels/ named
// reel-1.mp4 ... reel-6.mp4 (optionally reel-1.jpg posters) and they autoplay.
// Until a file exists, the card falls back to the tap-to-play Instagram embed.
const reels = [
  { video: '/reels/reel-1.mp4', poster: '/reels/reel-1.jpg', permalink: '/masters_kw/reel/DZfZkDpqASd/' },
  { video: '/reels/reel-2.mp4', poster: '/reels/reel-2.jpg', permalink: '/masters_kw/reel/DZczy8ptcR9/' },
  { video: '/reels/reel-3.mp4', poster: '/reels/reel-3.jpg', permalink: '/masters_kw/reel/DZaRVWeAknK/' },
  { video: '/reels/reel-4.mp4', poster: '/reels/reel-4.jpg', permalink: '/masters_kw/reel/DZXppZEg20E/' },
  { video: '/reels/reel-5.mp4', poster: '/reels/reel-5.jpg', permalink: '/masters_kw/reel/DZSoFSmAyMc/' },
  { video: '/reels/reel-6.mp4', poster: '/reels/reel-6.jpg', permalink: '/masters_kw/reel/DZNXQ6dNt5O/' },
]

export default function ReelsShowcase() {
  return (
    <section className="relative w-full overflow-hidden rounded-t-[2.5rem] bg-ink shadow-[0_-25px_60px_-20px_rgba(0,0,0,0.75)] lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgba(138,106,48,0.16), transparent 55%)',
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-gold">Watch</span>
          <h2 className="mt-4 text-4xl font-semibold text-cream sm:text-5xl">
            Reels from <span className="text-gradient-gold">the Lounge</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/75">
            Trick shots, tournaments, and nights at Masters — straight from our
            Instagram, playing on a loop.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div
            className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {reels.map((reel) => (
              <div
                key={reel.permalink}
                className="w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/5 bg-ink shadow-[0_18px_50px_rgba(0,0,0,0.4)] sm:w-[300px]"
              >
                <ReelCard video={reel.video} poster={reel.poster} permalink={reel.permalink} />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/masters_kw/reels/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-gold/50 px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
            </svg>
            Watch More Reels
          </a>
        </div>
      </div>
    </section>
  )
}
