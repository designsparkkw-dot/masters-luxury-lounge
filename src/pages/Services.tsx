import { Link } from 'react-router-dom'

const tables = [
  {
    name: 'American Pool',
    price: 'KD 3 / hour',
    desc: 'Standard 8-ball & 9-ball tables, perfect for casual games and groups.',
  },
  {
    name: 'Snooker',
    price: 'KD 4 / hour',
    desc: 'Full-size tournament snooker tables for the purists.',
  },
  {
    name: 'VIP Table',
    price: 'KD 6 / hour',
    desc: 'Private corner setup with premium seating and dedicated service.',
  },
]

const menu = [
  {
    category: 'Hot Drinks',
    items: [
      { name: 'Arabic Coffee', price: 'KD 1.0' },
      { name: 'Espresso', price: 'KD 1.0' },
      { name: 'Cappuccino', price: 'KD 1.5' },
      { name: 'Spanish Latte', price: 'KD 1.75' },
    ],
  },
  {
    category: 'Cold Drinks',
    items: [
      { name: 'Iced Latte', price: 'KD 1.75' },
      { name: 'Fresh Lemon Mint', price: 'KD 1.5' },
      { name: 'Mango Smoothie', price: 'KD 1.75' },
      { name: 'Soft Drinks', price: 'KD 0.75' },
    ],
  },
  {
    category: 'Shisha',
    items: [
      { name: 'Classic Mix', price: 'KD 3.0' },
      { name: 'Double Apple', price: 'KD 3.0' },
      { name: 'Premium Blend', price: 'KD 3.5' },
    ],
  },
  {
    category: 'Bites',
    items: [
      { name: 'Loaded Fries', price: 'KD 2.0' },
      { name: 'Club Sandwich', price: 'KD 2.5' },
      { name: 'Chicken Wings', price: 'KD 2.75' },
      { name: 'Mixed Nuts & Dates', price: 'KD 1.5' },
    ],
  },
]

export default function Services() {
  return (
    <div>
      <section className="border-b border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <span className="text-xs uppercase tracking-[0.4em] text-gold">Tables &amp; Menu</span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Game On, <span className="text-gradient-gold">Stay Awhile</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80">
            Choose your table, settle in, and order from a menu built for long
            sessions — drinks, shisha, and bites served right to your table.
          </p>
        </div>
      </section>

      {/* Tables */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">Table Rates</h2>
        <p className="mt-2 text-muted">All rates are per table, per hour. Group and late-night packages available.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tables.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/5 bg-surface p-6"
            >
              <h3 className="text-2xl font-semibold text-cream">{t.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t.desc}</p>
              <p className="mt-6 font-display text-3xl text-gold">{t.price}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted">
          * Prices shown are estimates — please confirm current rates and packages by phone.
        </p>
      </section>

      {/* Menu */}
      <section className="border-y border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-semibold sm:text-4xl">From the Menu</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {menu.map((section) => (
              <div key={section.category}>
                <h3 className="font-display text-2xl text-gold">{section.category}</h3>
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-baseline justify-between border-b border-dashed border-white/10 pb-2 text-sm"
                    >
                      <span className="text-cream/90">{item.name}</span>
                      <span className="ml-4 shrink-0 text-muted">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">
            * Menu items and prices are illustrative — replace with your current offerings.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Pick your table and <span className="text-gradient-gold">lock it in</span>
        </h2>
        <Link
          to="/booking"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ink transition-transform hover:scale-105"
        >
          Book a Table
        </Link>
      </section>
    </div>
  )
}
