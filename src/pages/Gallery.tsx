const placeholders = Array.from({ length: 9 }, (_, i) => i + 1)

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
            A look at our tables, lounge seating, and atmosphere. Follow{' '}
            <a
              href="https://www.instagram.com/masters_kw"
              target="_blank"
              rel="noreferrer"
              className="text-gold hover:underline"
            >
              @masters_kw
            </a>{' '}
            on Instagram for the latest.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {placeholders.map((n) => (
            <div
              key={n}
              className="flex aspect-square items-center justify-center rounded-xl border border-white/5 bg-gradient-to-br from-surface to-bronze-dark/30 text-muted"
            >
              <span className="text-xs uppercase tracking-[0.3em]">Photo {n}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Placeholder images — replace with real photos from the lounge.
        </p>
      </section>
    </div>
  )
}
