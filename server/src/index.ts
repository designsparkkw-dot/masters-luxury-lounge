import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { db } from './db'

const app = express()
app.use(cors())
app.use(express.json())

const TABLE_TYPES = ['American Pool', 'Snooker', 'VIP Table'] as const

type BookingInput = {
  name: string
  phone: string
  date: string
  time: string
  guests: number
  tableType: string
  notes?: string
}

function validateBooking(body: Partial<BookingInput>): string | null {
  if (!body.name || !body.name.trim()) return 'Name is required.'
  if (!body.phone || !body.phone.trim()) return 'Phone number is required.'
  if (!body.date) return 'Date is required.'
  if (!body.time) return 'Time is required.'
  if (!body.guests || body.guests < 1) return 'Guests must be at least 1.'
  if (!body.tableType || !TABLE_TYPES.includes(body.tableType as (typeof TABLE_TYPES)[number])) {
    return 'A valid table type is required.'
  }
  const bookingDate = new Date(`${body.date}T${body.time}`)
  if (Number.isNaN(bookingDate.getTime())) return 'Invalid date or time.'
  return null
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/table-types', (_req, res) => {
  res.json({ tableTypes: TABLE_TYPES })
})

app.post('/api/bookings', (req, res) => {
  const body = req.body as Partial<BookingInput>
  const error = validateBooking(body)
  if (error) {
    return res.status(400).json({ success: false, message: error })
  }

  const stmt = db.prepare(`
    INSERT INTO bookings (name, phone, date, time, guests, table_type, notes)
    VALUES (@name, @phone, @date, @time, @guests, @tableType, @notes)
  `)

  const result = stmt.run({
    name: body.name!.trim(),
    phone: body.phone!.trim(),
    date: body.date!,
    time: body.time!,
    guests: body.guests!,
    tableType: body.tableType!,
    notes: body.notes?.trim() || null,
  })

  res.status(201).json({
    success: true,
    message: 'Booking received! We will confirm shortly.',
    id: result.lastInsertRowid,
  })
})

app.get('/api/bookings', (_req, res) => {
  const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()
  res.json({ bookings: rows })
})

// Serve the built frontend (masters-lounge/dist) when present, e.g. in production.
const clientDist = path.join(__dirname, '..', '..', 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(PORT, () => {
  console.log(`Masters API listening on http://localhost:${PORT}`)
})
