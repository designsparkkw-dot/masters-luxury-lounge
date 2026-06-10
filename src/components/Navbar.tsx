import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Tables & Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/90 backdrop-blur supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm uppercase tracking-[0.2em] transition-colors ${
                  isActive ? 'text-gold' : 'text-cream/80 hover:text-gold'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/booking"
            className="rounded-full border border-gold bg-gold/10 px-5 py-2 text-sm uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Book a Table
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cream md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Menu</span>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/5 bg-surface px-4 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm uppercase tracking-[0.2em] ${
                  isActive ? 'bg-gold/10 text-gold' : 'text-cream/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/booking"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full border border-gold bg-gold/10 px-4 py-2 text-center text-sm uppercase tracking-[0.2em] text-gold"
          >
            Book a Table
          </NavLink>
        </nav>
      )}
    </header>
  )
}
