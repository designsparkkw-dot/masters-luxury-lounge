import { Link } from 'react-router-dom'

const values = [
  {
    title: 'Precision',
    desc: 'Every table is leveled, brushed, and maintained to professional tournament standards.',
  },
  {
    title: 'Atmosphere',
    desc: 'Moody lighting, rich textures, and a soundtrack built for focus and relaxation alike.',
  },
  {
    title: 'Hospitality',
    desc: 'Attentive staff, fast service, and a menu designed to keep your session going.',
  },
]

export default function About() {
  return (
    <div>
      <section className="border-b border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <span className="text-xs uppercase tracking-[0.4em] text-gold">Our Story</span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            About <span className="text-gradient-gold">Masters</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80">
            Masters Luxury Billiards Lounge was created for players who take their game
            seriously — and for anyone who just wants a great night out. Tucked inside
            Al Salam Mall in Salmiya, our lounge blends the precision of a professional
            billiards hall with the comfort and style of a premium lounge.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="aspect-[4/3] w-full rounded-2xl border border-white/5 bg-gradient-to-br from-bronze-dark/40 to-surface" />
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Where the game meets <span className="text-gradient-gold">luxury</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              From the felt on our tables to the lighting above them, every detail at
              Masters is chosen with the player in mind. Whether you're here for a
              quick game between meetings or a marathon session with friends, our
              space adapts to you — day or night, since we're open 24 hours.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Our team takes care of the details so you can focus on the game: clean
              equipment, fast table turnover, and a menu of drinks and bites crafted
              for long sessions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">
            What sets us <span className="text-gradient-gold">apart</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto h-1 w-12 rounded-full bg-gold" />
                <h3 className="mt-4 text-xl font-semibold text-cream">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Come experience it <span className="text-gradient-gold">yourself</span>
        </h2>
        <Link
          to="/booking"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ink transition-transform hover:scale-105"
        >
          Reserve a Table
        </Link>
      </section>
    </div>
  )
}
