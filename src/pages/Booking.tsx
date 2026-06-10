import { useState, type FormEvent } from 'react'
import { submitBooking } from '../lib/api'
import { site } from '../siteConfig'

const TABLE_TYPES = ['American Pool', 'Snooker', 'VIP Table']

const initialState = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  tableType: TABLE_TYPES[0],
  notes: '',
}

type Status = { type: 'idle' | 'success' | 'error'; message?: string }

export default function Booking() {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState<Status>({ type: 'idle' })
  const [submitting, setSubmitting] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  function update<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: 'idle' })

    try {
      const res = await submitBooking({
        ...form,
        guests: Number(form.guests),
      })
      setStatus({ type: 'success', message: res.message })
      setForm(initialState)
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <section className="border-b border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <span className="text-xs uppercase tracking-[0.4em] text-gold">Reservations</span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Book Your <span className="text-gradient-gold">Table</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80">
            Reserve in advance and walk straight to your table. We'll confirm by
            phone or WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/5 bg-surface p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm uppercase tracking-[0.2em] text-muted">
                Full Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm uppercase tracking-[0.2em] text-muted">
                Phone / WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none"
                placeholder="+965 ..."
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm uppercase tracking-[0.2em] text-muted">
                Date
              </label>
              <input
                id="date"
                type="date"
                required
                min={today}
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm uppercase tracking-[0.2em] text-muted">
                Time
              </label>
              <input
                id="time"
                type="time"
                required
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-cream focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="guests" className="block text-sm uppercase tracking-[0.2em] text-muted">
                Guests
              </label>
              <input
                id="guests"
                type="number"
                min={1}
                max={20}
                required
                value={form.guests}
                onChange={(e) => update('guests', Number(e.target.value) as never)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="tableType" className="block text-sm uppercase tracking-[0.2em] text-muted">
                Table Type
              </label>
              <select
                id="tableType"
                value={form.tableType}
                onChange={(e) => update('tableType', e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-cream focus:border-gold focus:outline-none"
              >
                {TABLE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm uppercase tracking-[0.2em] text-muted">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              placeholder="Any special requests..."
            />
          </div>

          {status.type === 'success' && (
            <div className="rounded-lg border border-gold/30 bg-bronze-dark/30 px-4 py-3 text-sm text-cream">
              {status.message}
            </div>
          )}
          {status.type === 'error' && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Confirm Reservation'}
          </button>

          <p className="text-center text-xs text-muted">
            Prefer to talk? Call or WhatsApp us at{' '}
            <a href={site.phoneHref} className="text-gold hover:underline">
              {site.phoneDisplay}
            </a>
          </p>
        </form>
      </section>
    </div>
  )
}
