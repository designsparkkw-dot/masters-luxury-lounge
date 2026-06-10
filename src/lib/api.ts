export type BookingPayload = {
  name: string
  phone: string
  date: string
  time: string
  guests: number
  tableType: string
  notes?: string
}

export type BookingResponse = {
  success: boolean
  message: string
  id?: number
}

export async function submitBooking(payload: BookingPayload): Promise<BookingResponse> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await res.json()) as BookingResponse
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }
  return data
}
