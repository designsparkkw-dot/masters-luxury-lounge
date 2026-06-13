import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void }
    }
  }
}

const SCRIPT_SRC = 'https://www.instagram.com/embed.js'

let scriptPromise: Promise<void> | null = null

function loadInstagramScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      if (window.instgrm) resolve()
      return
    }
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve()
    document.body.appendChild(s)
  })
  return scriptPromise
}

type InstagramEmbedProps = {
  /** Permalink path like "/masters_kw/p/ABC123/" or a full instagram.com URL */
  permalink: string
}

export default function InstagramEmbed({ permalink }: InstagramEmbedProps) {
  const ref = useRef<HTMLQuoteElement>(null)
  const url = permalink.startsWith('http')
    ? permalink
    : `https://www.instagram.com${permalink.startsWith('/') ? '' : '/'}${permalink}`

  useEffect(() => {
    let cancelled = false
    loadInstagramScript().then(() => {
      if (!cancelled) window.instgrm?.Embeds.process()
    })
    return () => {
      cancelled = true
    }
  }, [url])

  return (
    <blockquote
      ref={ref}
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: '#0c0a07',
        border: 0,
        margin: 0,
        padding: 0,
        width: '100%',
        minWidth: 0,
      }}
    >
      {/* Fallback shown before Instagram's script hydrates the embed, or if it
          fails to load (e.g. blocked browser). Keeps the card from collapsing. */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-[420px] flex-col items-center justify-center gap-3 px-6 text-center text-cream/80 transition-colors hover:text-gold"
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
        <span className="text-sm uppercase tracking-[0.25em]">View on Instagram</span>
      </a>
    </blockquote>
  )
}
