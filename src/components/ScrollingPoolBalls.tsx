import { useEffect, useRef } from 'react'

type BallType = 'cue' | 'eight' | 'gold' | 'bronze' | 'light'

type BallConfig = {
  x: string // horizontal position (kept near the edges so text stays clear)
  size: number
  speed: number // how fast it drifts relative to scroll
  dir: 1 | -1
  type: BallType
  startVH: number // starting vertical position as % of viewport height
  opacity: number
  blur: number
}

// Decorative billiard balls scattered down the left/right margins.
const BALLS: BallConfig[] = [
  { x: '2%', size: 58, speed: 0.14, dir: 1, type: 'gold', startVH: 20, opacity: 0.42, blur: 0.4 },
  { x: '94%', size: 40, speed: 0.22, dir: -1, type: 'cue', startVH: 64, opacity: 0.38, blur: 0.6 },
  { x: '5%', size: 30, speed: 0.3, dir: 1, type: 'eight', startVH: 86, opacity: 0.45, blur: 0 },
  { x: '92%', size: 70, speed: 0.09, dir: 1, type: 'bronze', startVH: 38, opacity: 0.32, blur: 0.8 },
  { x: '2.5%', size: 34, speed: 0.19, dir: -1, type: 'light', startVH: 120, opacity: 0.34, blur: 0.5 },
  { x: '96%', size: 26, speed: 0.26, dir: 1, type: 'gold', startVH: 150, opacity: 0.42, blur: 0 },
  { x: '91%', size: 46, speed: 0.16, dir: -1, type: 'eight', startVH: 8, opacity: 0.32, blur: 0.6 },
  { x: '3%', size: 50, speed: 0.12, dir: 1, type: 'cue', startVH: 175, opacity: 0.36, blur: 0.4 },
]

function ballBackground(type: BallType): string {
  switch (type) {
    case 'cue':
      return 'radial-gradient(circle at 35% 30%, #ffffff, #ece6d4 58%, #b9b09a)'
    case 'eight':
      return 'radial-gradient(circle at 35% 30%, #5a5a5a, #0c0a07 66%)'
    case 'gold':
      return 'radial-gradient(circle at 35% 30%, #f7f3e3, #c9a467 55%, #6e5220)'
    case 'bronze':
      return 'radial-gradient(circle at 35% 30%, #e3cd95, #8a6a30 58%, #4a3414)'
    case 'light':
      return 'radial-gradient(circle at 35% 30%, #fbf6e6, #e0d2a4 55%, #a8915f)'
  }
}

export default function ScrollingPoolBalls() {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const span = vh + 160 // wrap distance so balls loop continuously
      BALLS.forEach((b, i) => {
        const el = refs.current[i]
        if (!el) return
        const base = (b.startVH / 100) * vh
        // continuous drift; wrap so they keep rolling through the viewport
        let y = (base + scrollY * b.speed * b.dir) % span
        if (y < 0) y += span
        y -= 80
        const rotation = ((scrollY * b.speed * b.dir) / (b.size / 2)) * (180 / Math.PI)
        el.style.transform = `translate3d(0, ${y}px, 0) rotate(${rotation}deg)`
      })
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden lg:block" aria-hidden="true">
      {BALLS.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="absolute top-0"
          style={{
            left: b.x,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            filter: b.blur ? `blur(${b.blur}px)` : undefined,
            willChange: 'transform',
          }}
        >
          <div
            className="relative h-full w-full rounded-full"
            style={{
              background: ballBackground(b.type),
              boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.4), 0 8px 18px rgba(0,0,0,0.45)',
            }}
          >
            {/* specular highlight */}
            <span
              className="absolute rounded-full"
              style={{
                top: '16%',
                left: '24%',
                width: '26%',
                height: '20%',
                background: 'rgba(255,255,255,0.7)',
                filter: 'blur(1px)',
              }}
            />
            {b.type === 'eight' && (
              <span
                className="absolute inset-0 m-auto flex items-center justify-center rounded-full bg-cream font-display text-ink"
                style={{ width: '46%', height: '46%', fontSize: b.size * 0.24 }}
              >
                8
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
