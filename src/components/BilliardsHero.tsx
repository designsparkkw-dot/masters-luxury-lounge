import { useEffect, useRef } from 'react'

type Ball = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  isCue?: boolean
  label?: string
}

const PALETTE = [
  '#f0e4b8',
  '#c9a467',
  '#8a6a30',
  '#0c0a07',
  '#d9bf86',
  '#b8924f',
  '#efe1b0',
  '#6e5220',
  '#caa860',
  '#9c7a3c',
]

function shade(hex: string, percent: number) {
  const num = parseInt(hex.slice(1), 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  if (percent >= 0) {
    r = r + (255 - r) * percent
    g = g + (255 - g) * percent
    b = b + (255 - b) * percent
  } else {
    r = r * (1 + percent)
    g = g * (1 + percent)
    b = b * (1 + percent)
  }
  r = Math.max(0, Math.min(255, Math.round(r)))
  g = Math.max(0, Math.min(255, Math.round(g)))
  b = Math.max(0, Math.min(255, Math.round(b)))
  return `rgb(${r}, ${g}, ${b})`
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default function BilliardsHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !parent || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let ballR = 0
    let margin = 0
    let balls: Ball[] = []
    let raf = 0
    let lastTime = performance.now()

    type Phase = 'rack' | 'break' | 'fadeOut' | 'fadeIn'
    let phase: Phase = 'rack'
    let phaseStart = performance.now()
    let alpha = 1

    function setupRack() {
      balls = [
        { x: width * 0.2, y: height * 0.5, vx: 0, vy: 0, r: ballR, color: '#f7f2e4', isCue: true },
      ]

      const apexX = width * 0.6
      const apexY = height * 0.5
      const spacingX = ballR * 1.85
      const spacingY = ballR * 2.05
      let idx = 0
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col <= row; col++) {
          const color = PALETTE[idx % PALETTE.length]
          balls.push({
            x: apexX + row * spacingX,
            y: apexY + (col - row / 2) * spacingY,
            vx: 0,
            vy: 0,
            r: ballR,
            color,
            label: color === '#0c0a07' ? '8' : undefined,
          })
          idx++
        }
      }
    }

    function resize() {
      width = parent!.clientWidth
      height = parent!.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ballR = Math.max(6, Math.min(width, height) / 32)
      margin = ballR * 1.4
      setupRack()
      phase = 'rack'
      phaseStart = performance.now()
    }

    function totalSpeed() {
      return balls.reduce((sum, b) => sum + Math.hypot(b.vx, b.vy), 0)
    }

    function physicsStep(dt: number) {
      const railMargin = margin + ballR * 0.15
      const friction = Math.pow(0.985, dt * 60)

      for (const b of balls) {
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.vx *= friction
        b.vy *= friction
        if (Math.hypot(b.vx, b.vy) < 2) {
          b.vx = 0
          b.vy = 0
        }

        if (b.x - b.r < railMargin) {
          b.x = railMargin + b.r
          b.vx = Math.abs(b.vx) * 0.9
        }
        if (b.x + b.r > width - railMargin) {
          b.x = width - railMargin - b.r
          b.vx = -Math.abs(b.vx) * 0.9
        }
        if (b.y - b.r < railMargin) {
          b.y = railMargin + b.r
          b.vy = Math.abs(b.vy) * 0.9
        }
        if (b.y + b.r > height - railMargin) {
          b.y = height - railMargin - b.r
          b.vy = -Math.abs(b.vy) * 0.9
        }
      }

      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i]
          const b = balls[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          const minDist = a.r + b.r
          if (dist > 0 && dist < minDist) {
            const overlap = (minDist - dist) / 2
            const nx = dx / dist
            const ny = dy / dist
            a.x -= nx * overlap
            a.y -= ny * overlap
            b.x += nx * overlap
            b.y += ny * overlap
            const dvx = b.vx - a.vx
            const dvy = b.vy - a.vy
            const dot = dvx * nx + dvy * ny
            if (dot < 0) {
              const restitution = 0.95
              const impulse = (-(1 + restitution) * dot) / 2
              a.vx -= impulse * nx
              a.vy -= impulse * ny
              b.vx += impulse * nx
              b.vy += impulse * ny
            }
          }
        }
      }
    }

    function drawTable() {
      const x = margin
      const y = margin
      const w = width - margin * 2
      const h = height - margin * 2
      roundedRectPath(ctx!, x, y, w, h, ballR * 0.6)
      ctx!.fillStyle = 'rgba(20, 16, 9, 0.4)'
      ctx!.fill()
      ctx!.lineWidth = Math.max(1, ballR * 0.12)
      ctx!.strokeStyle = 'rgba(201, 164, 103, 0.35)'
      ctx!.stroke()
    }

    function drawBall(b: Ball) {
      // soft shadow
      ctx!.save()
      ctx!.beginPath()
      ctx!.ellipse(b.x + b.r * 0.2, b.y + b.r * 0.35, b.r * 0.95, b.r * 0.55, 0, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.35)'
      ctx!.filter = 'blur(2px)'
      ctx!.fill()
      ctx!.restore()

      // ball body
      const grad = ctx!.createRadialGradient(
        b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.05,
        b.x, b.y, b.r * 1.05
      )
      grad.addColorStop(0, shade(b.color, 0.6))
      grad.addColorStop(0.55, b.color)
      grad.addColorStop(1, shade(b.color, -0.35))
      ctx!.beginPath()
      ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()

      // rim highlight
      ctx!.beginPath()
      ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      ctx!.lineWidth = Math.max(1, b.r * 0.06)
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx!.stroke()

      // label disc (e.g. 8-ball)
      if (b.label) {
        ctx!.beginPath()
        ctx!.arc(b.x, b.y, b.r * 0.45, 0, Math.PI * 2)
        ctx!.fillStyle = '#f3efe6'
        ctx!.fill()
        ctx!.fillStyle = '#0c0a07'
        ctx!.font = `${b.r * 0.6}px "Playfair Display", serif`
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(b.label, b.x, b.y + b.r * 0.04)
      }
    }

    function render(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now

      if (!reduceMotion) {
        const elapsed = now - phaseStart
        if (phase === 'rack') {
          if (elapsed > 1500) {
            const cue = balls[0]
            cue.vx = width * 0.95
            cue.vy = (Math.random() - 0.5) * width * 0.06
            phase = 'break'
            phaseStart = now
          }
        } else if (phase === 'break') {
          physicsStep(dt)
          if ((elapsed > 2800 && totalSpeed() < 6) || elapsed > 9000) {
            phase = 'fadeOut'
            phaseStart = now
          }
        } else if (phase === 'fadeOut') {
          alpha = Math.max(0, 1 - elapsed / 800)
          if (elapsed > 800) {
            setupRack()
            phase = 'fadeIn'
            phaseStart = now
          }
        } else if (phase === 'fadeIn') {
          alpha = Math.min(1, elapsed / 800)
          if (elapsed > 800) {
            phase = 'rack'
            phaseStart = now
            alpha = 1
          }
        }
      }

      ctx!.clearRect(0, 0, width, height)
      ctx!.globalAlpha = alpha
      drawTable()
      for (const b of balls) drawBall(b)
      ctx!.globalAlpha = 1

      raf = requestAnimationFrame(render)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    resize()

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        lastTime = performance.now()
        raf = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  )
}
