import { Link } from 'react-router-dom'
import { site } from '../siteConfig'

export default function Contact() {
  return (
    <div>
      <section className="border-b border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <span className="text-xs uppercase tracking-[0.4em] text-gold">Contact</span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Find <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80">
            Inside Al Salam Mall, Salmiya — open 24 hours, every day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-gold">Address</h2>
              <p className="mt-2 text-cream/90">{site.address}</p>
              <p className="text-sm text-muted">Plus code: {site.plusCode}</p>
              <a
                href={site.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-gold hover:underline"
              >
                Get Directions →
              </a>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold">Hours</h2>
              <p className="mt-2 text-cream/90">{site.hours}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold">Phone &amp; WhatsApp</h2>
              <a href={site.phoneHref} className="mt-2 block text-cream/90 hover:text-gold">
                {site.phoneDisplay}
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-gold hover:underline"
              >
                Message us on WhatsApp →
              </a>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold">Follow Us</h2>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-cream/90 hover:text-gold"
              >
                @masters_kw on Instagram
              </a>
            </div>

            <Link
              to="/booking"
              className="inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ink transition-transform hover:scale-105"
            >
              Reserve a Table
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/5">
            <iframe
              title="Masters Luxury Lounge location"
              src={site.mapsEmbed}
              className="h-full min-h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
