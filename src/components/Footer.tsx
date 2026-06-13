import { Link } from 'react-router-dom'
import Logo from './Logo'
import { site } from '../siteConfig'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {site.description}
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg text-gold">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/services" className="hover:text-gold">Tables &amp; Menu</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/booking" className="hover:text-gold">Book a Table</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-gold">Visit Us</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>{site.address}</li>
            <li>{site.hours}</li>
            <li>
              <a href={site.phoneHref} className="hover:text-gold">{site.phoneDisplay}</a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
                @masters_kw
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 text-center text-xs uppercase tracking-[0.3em] text-muted">
        &copy; {new Date().getFullYear()} Masters Luxury Lounge — All Rights Reserved
      </div>
    </footer>
  )
}
