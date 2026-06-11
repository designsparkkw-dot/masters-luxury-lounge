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
  sinkStart?: number
  sinkX?: number
  sinkY?: number
  gone?: boolean
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  born: number
  life: number
  size: number
}

type Pocket = { x: number; y: number }

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

const AIM_MS = 2000
const STRIKE_MS = 340
const SLOWMO_MS = 1300
const SINK_MS = 480
const FADE_MS = 900
const PLAY_FADE_MS = 350
const INACTIVITY_MS = 14000

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

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function easeInCubic(t: number) {
  return t * t * t
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
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
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const hintCinematic = coarsePointer ? 'TAP TO PLAY' : 'CLICK TO PLAY'
    const hintPlayIdle = coarsePointer ? 'DRAG THE CUE BALL TO SHOOT' : 'DRAG ANYWHERE TO SHOOT'

    let width = 0
    let height = 0
    let ballR = 0
    let railW = 0
    let pocketR = 0
    let tableL = 0
    let tableT = 0
    let tableR = 0
    let tableB = 0
    let feltL = 0
    let feltT = 0
    let feltR = 0
    let feltB = 0
    let pockets: Pocket[] = []
    let balls: Ball[] = []
    let particles: Particle[] = []
    let raf = 0
    let lastTime = performance.now()

    type Phase = 'aim' | 'strike' | 'break' | 'settle' | 'fadeOut' | 'fadeIn'
    let phase: Phase = 'aim'
    let phaseStart = performance.now()
    let alpha = 1
    let timeScale = 1
    let slowmoStart = 0
    let cueAngle = 0
    let impactTime = -1
    let impactX = 0
    let impactY = 0

    // interactive play state
    type Mode = 'cinematic' | 'play'
    type PlayState = 'idle' | 'aiming' | 'rolling'
    let mode: Mode = 'cinematic'
    let playState: PlayState = 'idle'
    let aimSX = 0
    let aimSY = 0
    let aimCX = 0
    let aimCY = 0
    let shotTime = 0
    let lastActivity = performance.now()
    let fadeJob: { start: number; out: boolean; after?: () => void; chainIn: boolean } | null = null

    function setupRack() {
      const cueX = feltL + (feltR - feltL) * 0.2
      const cueY = (feltT + feltB) / 2
      balls = [{ x: cueX, y: cueY, vx: 0, vy: 0, r: ballR, color: '#f7f2e4', isCue: true }]

      const apexX = feltL + (feltR - feltL) * 0.62
      const apexY = (feltT + feltB) / 2
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
      cueAngle = Math.atan2(apexY - cueY, apexX - cueX)
      particles = []
      impactTime = -1
      timeScale = 1
    }

    function resize() {
      width = parent!.clientWidth
      height = parent!.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // table floats inside the hero with breathing room around it
      const inset = Math.min(width, height) * 0.12
      tableL = inset
      tableT = inset
      tableR = width - inset
      tableB = height - inset
      const tableMin = Math.min(tableR - tableL, tableB - tableT)

      ballR = Math.max(5, tableMin / 28)
      railW = Math.max(10, tableMin * 0.055)
      pocketR = ballR * 1.55
      feltL = tableL + railW
      feltT = tableT + railW
      feltR = tableR - railW
      feltB = tableB - railW

      pockets = [
        { x: feltL + pocketR * 0.3, y: feltT + pocketR * 0.3 },
        { x: feltR - pocketR * 0.3, y: feltT + pocketR * 0.3 },
        { x: feltL + pocketR * 0.3, y: feltB - pocketR * 0.3 },
        { x: feltR - pocketR * 0.3, y: feltB - pocketR * 0.3 },
      ]
      if (width >= height) {
        pockets.push({ x: (feltL + feltR) / 2, y: feltT }, { x: (feltL + feltR) / 2, y: feltB })
      } else {
        pockets.push({ x: feltL, y: (feltT + feltB) / 2 }, { x: feltR, y: (feltT + feltB) / 2 })
      }

      setupRack()
      phase = 'aim'
      phaseStart = performance.now()
      alpha = 1
      fadeJob = null
      playState = 'idle'
      updateCursor()
    }

    function nearestPocketDist(x: number, y: number) {
      let min = Infinity
      for (const p of pockets) {
        const d = Math.hypot(x - p.x, y - p.y)
        if (d < min) min = d
      }
      return min
    }

    function spawnSparks(x: number, y: number, count: number, now: number) {
      const minDim = Math.min(width, height)
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const speed = minDim * (0.08 + Math.random() * 0.4)
        particles.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          born: now,
          life: 450 + Math.random() * 450,
          size: ballR * (0.08 + Math.random() * 0.14),
        })
      }
    }

    function totalSpeed() {
      return balls.reduce((sum, b) => (b.gone || b.sinkStart ? sum : sum + Math.hypot(b.vx, b.vy)), 0)
    }

    function physicsStep(dt: number, now: number) {
      const friction = Math.pow(0.985, dt * 60)

      for (const b of balls) {
        if (b.gone || b.sinkStart !== undefined) continue
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.vx *= friction
        b.vy *= friction
        if (Math.hypot(b.vx, b.vy) < 2) {
          b.vx = 0
          b.vy = 0
        }

        // pocket capture
        for (const p of pockets) {
          if (Math.hypot(b.x - p.x, b.y - p.y) < pocketR * 0.8) {
            b.sinkStart = now
            b.sinkX = p.x
            b.sinkY = p.y
            spawnSparks(p.x, p.y, 6, now)
            break
          }
        }
        if (b.sinkStart !== undefined) continue

        // rail bounce — suppressed near pockets so balls can fall in
        const nearPocket = nearestPocketDist(b.x, b.y) < pocketR * 1.25
        if (!nearPocket) {
          if (b.x - b.r < feltL) {
            b.x = feltL + b.r
            b.vx = Math.abs(b.vx) * 0.9
          }
          if (b.x + b.r > feltR) {
            b.x = feltR - b.r
            b.vx = -Math.abs(b.vx) * 0.9
          }
          if (b.y - b.r < feltT) {
            b.y = feltT + b.r
            b.vy = Math.abs(b.vy) * 0.9
          }
          if (b.y + b.r > feltB) {
            b.y = feltB - b.r
            b.vy = -Math.abs(b.vy) * 0.9
          }
        }
      }

      for (let i = 0; i < balls.length; i++) {
        const a = balls[i]
        if (a.gone || a.sinkStart !== undefined) continue
        for (let j = i + 1; j < balls.length; j++) {
          const b = balls[j]
          if (b.gone || b.sinkStart !== undefined) continue
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
      const tableW = tableR - tableL
      const tableH = tableB - tableT
      const tcx = (tableL + tableR) / 2

      // wooden rails with gold trim, floating on a soft drop shadow
      const railGrad = ctx!.createLinearGradient(0, tableT, 0, tableB)
      railGrad.addColorStop(0, '#2e1f0c')
      railGrad.addColorStop(0.5, '#463113')
      railGrad.addColorStop(1, '#1f1305')
      ctx!.save()
      ctx!.shadowColor = 'rgba(0, 0, 0, 0.65)'
      ctx!.shadowBlur = railW * 1.6
      ctx!.shadowOffsetY = railW * 0.5
      roundedRectPath(ctx!, tableL, tableT, tableW, tableH, railW * 1.1)
      ctx!.fillStyle = railGrad
      ctx!.fill()
      ctx!.restore()
      roundedRectPath(ctx!, tableL, tableT, tableW, tableH, railW * 1.1)
      ctx!.lineWidth = 1.5
      ctx!.strokeStyle = 'rgba(201, 164, 103, 0.45)'
      ctx!.stroke()

      // felt — deep emerald with a darker edge
      const feltW = feltR - feltL
      const feltH = feltB - feltT
      roundedRectPath(ctx!, feltL, feltT, feltW, feltH, railW * 0.45)
      const feltGrad = ctx!.createRadialGradient(
        tcx, feltT + feltH * 0.45, Math.min(feltW, feltH) * 0.1,
        tcx, feltT + feltH * 0.5, Math.max(feltW, feltH) * 0.75
      )
      feltGrad.addColorStop(0, '#155840')
      feltGrad.addColorStop(0.55, '#0c3d2b')
      feltGrad.addColorStop(1, '#051f15')
      ctx!.fillStyle = feltGrad
      ctx!.fill()

      // overhead light pool — volumetric feel
      roundedRectPath(ctx!, feltL, feltT, feltW, feltH, railW * 0.45)
      const pool = ctx!.createRadialGradient(
        tcx, feltT + feltH * 0.42, 0,
        tcx, feltT + feltH * 0.42, Math.max(feltW, feltH) * 0.55
      )
      pool.addColorStop(0, 'rgba(240, 228, 184, 0.13)')
      pool.addColorStop(0.5, 'rgba(240, 228, 184, 0.04)')
      pool.addColorStop(1, 'rgba(240, 228, 184, 0)')
      ctx!.fillStyle = pool
      ctx!.fill()

      // gold trim around felt
      roundedRectPath(ctx!, feltL, feltT, feltW, feltH, railW * 0.45)
      ctx!.lineWidth = Math.max(1, railW * 0.08)
      ctx!.strokeStyle = 'rgba(201, 164, 103, 0.4)'
      ctx!.stroke()

      // diamond sights on the rails
      ctx!.fillStyle = 'rgba(240, 228, 184, 0.5)'
      const dr = railW * 0.14
      for (const f of [0.25, 0.5, 0.75]) {
        for (const [dx, dy] of [
          [feltL + feltW * f, tableT + railW / 2],
          [feltL + feltW * f, tableB - railW / 2],
          [tableL + railW / 2, feltT + feltH * f],
          [tableR - railW / 2, feltT + feltH * f],
        ]) {
          ctx!.save()
          ctx!.translate(dx, dy)
          ctx!.rotate(Math.PI / 4)
          ctx!.fillRect(-dr, -dr, dr * 2, dr * 2)
          ctx!.restore()
        }
      }

      // pockets
      for (const p of pockets) {
        const pg = ctx!.createRadialGradient(p.x, p.y, pocketR * 0.1, p.x, p.y, pocketR)
        pg.addColorStop(0, '#000000')
        pg.addColorStop(0.75, '#0a0703')
        pg.addColorStop(1, '#1c1208')
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, pocketR, 0, Math.PI * 2)
        ctx!.fillStyle = pg
        ctx!.fill()
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, pocketR, 0, Math.PI * 2)
        ctx!.lineWidth = Math.max(1.5, pocketR * 0.12)
        ctx!.strokeStyle = 'rgba(201, 164, 103, 0.5)'
        ctx!.stroke()
      }
    }

    function drawBall(b: Ball, now: number) {
      let x = b.x
      let y = b.y
      let r = b.r
      let ballAlpha = 1

      if (b.sinkStart !== undefined) {
        const t = Math.min(1, (now - b.sinkStart) / SINK_MS)
        if (t >= 1) {
          b.gone = true
          return
        }
        const e = easeInCubic(t)
        x = b.x + (b.sinkX! - b.x) * e
        y = b.y + (b.sinkY! - b.y) * e
        r = b.r * (1 - e * 0.8)
        ballAlpha = 1 - e
      }

      ctx!.save()
      ctx!.globalAlpha = alpha * ballAlpha

      // motion streak for fast balls
      const speed = Math.hypot(b.vx, b.vy)
      if (speed > Math.min(width, height) * 0.45 && b.sinkStart === undefined) {
        ctx!.beginPath()
        ctx!.moveTo(x - b.vx * 0.035, y - b.vy * 0.035)
        ctx!.lineTo(x, y)
        ctx!.lineWidth = r * 1.3
        ctx!.lineCap = 'round'
        ctx!.strokeStyle = 'rgba(240, 228, 184, 0.14)'
        ctx!.stroke()
      }

      // contact shadow on the felt
      ctx!.beginPath()
      ctx!.ellipse(x + r * 0.18, y + r * 0.35, r * 0.95, r * 0.55, 0, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx!.fill()

      // ball body
      const grad = ctx!.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r * 1.05)
      grad.addColorStop(0, shade(b.color, 0.6))
      grad.addColorStop(0.55, b.color)
      grad.addColorStop(1, shade(b.color, -0.4))
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()

      // specular highlight
      ctx!.beginPath()
      ctx!.ellipse(x - r * 0.38, y - r * 0.42, r * 0.18, r * 0.12, -0.6, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx!.fill()

      // felt-reflected rim light on the underside
      ctx!.beginPath()
      ctx!.arc(x, y, r * 0.92, Math.PI * 0.15, Math.PI * 0.85)
      ctx!.lineWidth = r * 0.12
      ctx!.strokeStyle = 'rgba(40, 110, 80, 0.35)'
      ctx!.stroke()

      if (b.label) {
        ctx!.beginPath()
        ctx!.arc(x, y, r * 0.45, 0, Math.PI * 2)
        ctx!.fillStyle = '#f3efe6'
        ctx!.fill()
        ctx!.fillStyle = '#0c0a07'
        ctx!.font = `${r * 0.6}px "Playfair Display", serif`
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(b.label, x, y + r * 0.04)
      }

      ctx!.restore()
    }

    function drawCue(tipDist: number, fade: number) {
      const cue = balls[0]
      if (!cue || cue.gone) return
      const dirX = Math.cos(cueAngle)
      const dirY = Math.sin(cueAngle)
      const perpX = -dirY
      const perpY = dirX

      const len = Math.min(width, height) * 0.95
      const tipX = cue.x - dirX * (cue.r + tipDist)
      const tipY = cue.y - dirY * (cue.r + tipDist)
      const tipW = ballR * 0.32
      const buttW = ballR * 0.85

      // a point `t` (0=tip, 1=butt) along the stick, offset sideways by `s`
      const pt = (t: number, s: number) => {
        const w = tipW + (buttW - tipW) * t
        return [tipX - dirX * len * t + perpX * w * s, tipY - dirY * len * t + perpY * w * s]
      }

      const segment = (t0: number, t1: number, fill: string | CanvasGradient) => {
        const [ax, ay] = pt(t0, -1)
        const [bx, by] = pt(t1, -1)
        const [cx2, cy2] = pt(t1, 1)
        const [dx2, dy2] = pt(t0, 1)
        ctx!.beginPath()
        ctx!.moveTo(ax, ay)
        ctx!.lineTo(bx, by)
        ctx!.lineTo(cx2, cy2)
        ctx!.lineTo(dx2, dy2)
        ctx!.closePath()
        ctx!.fillStyle = fill
        ctx!.fill()
      }

      ctx!.save()
      ctx!.globalAlpha = alpha * fade

      // stick shadow
      ctx!.beginPath()
      ctx!.moveTo(tipX + ballR * 0.2, tipY + ballR * 0.45)
      ctx!.lineTo(tipX - dirX * len + ballR * 0.2, tipY - dirY * len + ballR * 0.45)
      ctx!.lineWidth = buttW * 1.4
      ctx!.lineCap = 'round'
      ctx!.strokeStyle = 'rgba(0, 0, 0, 0.25)'
      ctx!.stroke()

      const shaftGrad = ctx!.createLinearGradient(tipX, tipY, tipX - dirX * len, tipY - dirY * len)
      shaftGrad.addColorStop(0, '#e3c98f')
      shaftGrad.addColorStop(0.6, '#b08648')
      shaftGrad.addColorStop(0.62, '#c9a467')
      shaftGrad.addColorStop(0.66, '#2b1a08')
      shaftGrad.addColorStop(1, '#140c04')

      segment(0.015, 1, shaftGrad)
      segment(0, 0.015, '#f3efe6') // ferrule
      segment(0.8, 0.815, '#c9a467') // gold inlay ring on the butt

      ctx!.restore()
    }

    function drawParticles(now: number, dt: number) {
      if (!particles.length) return
      ctx!.save()
      ctx!.globalCompositeOperation = 'lighter'
      particles = particles.filter((p) => now - p.born < p.life)
      for (const p of particles) {
        const t = (now - p.born) / p.life
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= 0.96
        p.vy *= 0.96
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(240, 228, 184, ${alpha * 0.85 * (1 - t)})`
        ctx!.fill()
      }
      ctx!.restore()
    }

    function drawImpactFlash(now: number) {
      if (impactTime < 0) return
      const t = (now - impactTime) / 280
      if (t >= 1) return
      const r = ballR * (1.5 + t * 3.5)
      const g = ctx!.createRadialGradient(impactX, impactY, 0, impactX, impactY, r)
      g.addColorStop(0, `rgba(240, 228, 184, ${alpha * 0.55 * (1 - t)})`)
      g.addColorStop(1, 'rgba(240, 228, 184, 0)')
      ctx!.save()
      ctx!.globalCompositeOperation = 'lighter'
      ctx!.beginPath()
      ctx!.arc(impactX, impactY, r, 0, Math.PI * 2)
      ctx!.fillStyle = g
      ctx!.fill()
      ctx!.restore()
    }

    function cueTipDistance(now: number): { dist: number; fade: number } | null {
      const elapsed = now - phaseStart
      if (phase === 'aim') {
        const p = Math.min(1, elapsed / AIM_MS)
        if (p < 0.4) {
          // glide in toward the ball
          return { dist: ballR * (10 - 7 * easeOutCubic(p / 0.4)), fade: Math.min(1, p / 0.15) }
        }
        if (p < 0.7) {
          // gentle practice waggle
          const w = Math.sin(((p - 0.4) / 0.3) * Math.PI * 2)
          return { dist: ballR * (3 + w * 0.8), fade: 1 }
        }
        // draw back for the strike
        return { dist: ballR * (3 + 3.5 * easeInOut((p - 0.7) / 0.3)), fade: 1 }
      }
      if (phase === 'strike') {
        const p = Math.min(1, elapsed / STRIKE_MS)
        return { dist: ballR * (6.5 - 5.5 * easeInCubic(p)), fade: 1 }
      }
      if (phase === 'break' && elapsed < 380) {
        // stick eases back out of frame after contact
        const p = elapsed / 380
        return { dist: ballR * (1 + 8 * easeOutCubic(p)), fade: 1 - p }
      }
      return null
    }

    // --- interactive play helpers ---

    function aimVector() {
      // slingshot: pull back and release — shot direction is opposite the drag
      const dx = aimSX - aimCX
      const dy = aimSY - aimCY
      const len = Math.hypot(dx, dy)
      if (len < 4) return null
      const minDim = Math.min(width, height)
      return {
        nx: dx / len,
        ny: dy / len,
        power: Math.min(1, len / (minDim * 0.42)),
      }
    }

    function drawAim() {
      const cue = balls[0]
      if (!cue || cue.gone) return
      const aim = aimVector()
      if (!aim) return
      const { nx, ny, power } = aim
      cueAngle = Math.atan2(ny, nx)
      const minDim = Math.min(width, height)

      ctx!.save()
      ctx!.globalAlpha = alpha

      // dashed guide line
      const guideLen = minDim * (0.14 + 0.4 * power)
      ctx!.setLineDash([ballR * 0.7, ballR * 0.55])
      ctx!.beginPath()
      ctx!.moveTo(cue.x + nx * (cue.r + 2), cue.y + ny * (cue.r + 2))
      ctx!.lineTo(cue.x + nx * guideLen, cue.y + ny * guideLen)
      ctx!.lineWidth = Math.max(1.5, ballR * 0.12)
      ctx!.strokeStyle = 'rgba(240, 228, 184, 0.55)'
      ctx!.stroke()
      ctx!.setLineDash([])

      // target dot at the end of the guide
      ctx!.beginPath()
      ctx!.arc(cue.x + nx * guideLen, cue.y + ny * guideLen, ballR * 0.18, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(240, 228, 184, 0.8)'
      ctx!.fill()

      // power ring around the cue ball
      ctx!.beginPath()
      ctx!.arc(cue.x, cue.y, cue.r * 1.7, -Math.PI / 2, -Math.PI / 2 + power * Math.PI * 2)
      ctx!.lineWidth = Math.max(2, ballR * 0.16)
      ctx!.lineCap = 'round'
      ctx!.strokeStyle = `rgba(201, 164, 103, ${0.35 + power * 0.45})`
      ctx!.stroke()

      ctx!.restore()

      drawCue(ballR * (1.2 + 5.5 * power), 1)
    }

    function drawCueInvite(now: number) {
      const cue = balls[0]
      if (!cue || cue.gone) return
      const t = (now % 1600) / 1600
      ctx!.save()
      ctx!.globalAlpha = alpha * (1 - t) * 0.5
      ctx!.beginPath()
      ctx!.arc(cue.x, cue.y, cue.r * (1.4 + t * 1.1), 0, Math.PI * 2)
      ctx!.lineWidth = 2
      ctx!.strokeStyle = '#f0e4b8'
      ctx!.stroke()
      ctx!.restore()
    }

    function drawHint(text: string, now: number) {
      const minDim = Math.min(width, height)
      ctx!.save()
      ctx!.globalAlpha = alpha * (0.5 + 0.18 * Math.sin(now / 450))
      ctx!.font = `600 ${Math.max(11, Math.round(minDim * 0.022))}px Inter, system-ui, sans-serif`
      ;(ctx as unknown as { letterSpacing?: string }).letterSpacing = '0.25em'
      ctx!.fillStyle = '#f0e4b8'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText(text, (tableL + tableR) / 2, (tableB + height) / 2)
      ;(ctx as unknown as { letterSpacing?: string }).letterSpacing = '0em'
      ctx!.restore()
    }

    function respawnCue(now: number) {
      const cue = balls[0]
      cue.gone = false
      cue.sinkStart = undefined
      cue.x = feltL + (feltR - feltL) * 0.2
      cue.y = (feltT + feltB) / 2
      cue.vx = 0
      cue.vy = 0
      let guard = 0
      while (
        balls.some((b, i) => i > 0 && !b.gone && Math.hypot(b.x - cue.x, b.y - cue.y) < ballR * 2.1) &&
        guard++ < 60
      ) {
        cue.x += ballR * 1.6
        if (cue.x > feltR - ballR * 2) {
          cue.x = feltL + ballR * 2
          cue.y += ballR * 2
          if (cue.y > feltB - ballR * 2) cue.y = feltT + ballR * 2
        }
      }
      spawnSparks(cue.x, cue.y, 8, now)
    }

    function startFade(after?: () => void, chainIn = true) {
      fadeJob = { start: performance.now(), out: true, after, chainIn }
    }

    function updateCursor() {
      if (mode === 'cinematic') {
        canvas!.style.cursor = 'pointer'
      } else if (playState === 'idle') {
        canvas!.style.cursor = 'grab'
      } else if (playState === 'aiming') {
        canvas!.style.cursor = 'grabbing'
      } else {
        canvas!.style.cursor = 'default'
      }
    }

    // --- pointer input ---

    function canvasPos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function onPointerDown(e: PointerEvent) {
      lastActivity = performance.now()
      if (fadeJob) return
      if (mode === 'cinematic') {
        mode = 'play'
        startFade(() => {
          setupRack()
          playState = 'idle'
          lastActivity = performance.now()
        })
        updateCursor()
        return
      }
      if (playState !== 'idle') return
      const cue = balls[0]
      if (!cue || cue.gone || cue.sinkStart !== undefined) return
      const { x, y } = canvasPos(e)
      // touch must start near the cue ball so the page can still be scrolled;
      // mouse can start a drag anywhere on the table
      const nearCue = Math.hypot(x - cue.x, y - cue.y) < ballR * 6
      if (e.pointerType === 'mouse' || nearCue) {
        playState = 'aiming'
        aimSX = x
        aimSY = y
        aimCX = x
        aimCY = y
        try {
          canvas!.setPointerCapture(e.pointerId)
        } catch {
          // synthetic events can't be captured — fine
        }
        updateCursor()
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (playState !== 'aiming') return
      lastActivity = performance.now()
      const { x, y } = canvasPos(e)
      aimCX = x
      aimCY = y
    }

    function onPointerUp() {
      if (playState !== 'aiming') return
      lastActivity = performance.now()
      const aim = aimVector()
      const cue = balls[0]
      if (aim && aim.power > 0.04 && cue && !cue.gone) {
        const speed = Math.max(width, height) * (0.15 + aim.power)
        cue.vx = aim.nx * speed
        cue.vy = aim.ny * speed
        shotTime = performance.now()
        playState = 'rolling'
      } else {
        playState = 'idle'
      }
      updateCursor()
    }

    function onTouchStart(e: TouchEvent) {
      // stop the page from scrolling when the gesture starts on the cue ball
      if (mode !== 'play' || playState !== 'idle') return
      const cue = balls[0]
      if (!cue || cue.gone) return
      const rect = canvas!.getBoundingClientRect()
      const t = e.touches[0]
      if (t && Math.hypot(t.clientX - rect.left - cue.x, t.clientY - rect.top - cue.y) < ballR * 6) {
        e.preventDefault()
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (playState === 'aiming') e.preventDefault()
    }

    canvas.style.touchAction = 'pan-y'
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })

    function render(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now
      let effDt = dt

      if (fadeJob) {
        const t = (now - fadeJob.start) / PLAY_FADE_MS
        alpha = fadeJob.out ? Math.max(0, 1 - t) : Math.min(1, t)
        if (t >= 1) {
          const job = fadeJob
          fadeJob = null
          if (job.out) {
            job.after?.()
            if (job.chainIn) fadeJob = { start: now, out: false, chainIn: false }
          }
        }
      } else if (mode === 'cinematic' && !reduceMotion) {
        const elapsed = now - phaseStart
        if (phase === 'aim') {
          if (elapsed > AIM_MS) {
            phase = 'strike'
            phaseStart = now
          }
        } else if (phase === 'strike') {
          if (elapsed >= STRIKE_MS) {
            const cue = balls[0]
            const speed = Math.max(width, height) * 1.05
            cue.vx = Math.cos(cueAngle) * speed
            cue.vy = Math.sin(cueAngle) * speed
            impactTime = now
            impactX = cue.x - Math.cos(cueAngle) * cue.r
            impactY = cue.y - Math.sin(cueAngle) * cue.r
            spawnSparks(impactX, impactY, 14, now)
            slowmoStart = now
            timeScale = 0.28
            phase = 'break'
            phaseStart = now
          }
        } else if (phase === 'break') {
          const t = Math.min(1, (now - slowmoStart) / SLOWMO_MS)
          timeScale = 0.28 + 0.72 * easeInOut(t)
          effDt = dt * timeScale
          physicsStep(effDt, now)
          if ((elapsed > 3200 && totalSpeed() < 8) || elapsed > 11000) {
            phase = 'settle'
            phaseStart = now
          }
        } else if (phase === 'settle') {
          physicsStep(dt, now)
          if (elapsed > 1600) {
            phase = 'fadeOut'
            phaseStart = now
          }
        } else if (phase === 'fadeOut') {
          physicsStep(dt, now)
          alpha = Math.max(0, 1 - elapsed / FADE_MS)
          if (elapsed > FADE_MS) {
            setupRack()
            phase = 'fadeIn'
            phaseStart = now
          }
        } else if (phase === 'fadeIn') {
          alpha = Math.min(1, elapsed / FADE_MS)
          if (elapsed > FADE_MS) {
            phase = 'aim'
            phaseStart = now
            alpha = 1
          }
        }
      }

      if (mode === 'play' && !fadeJob) {
        if (playState === 'rolling') {
          physicsStep(dt, now)
          if (now - shotTime > 600 && totalSpeed() < 6) {
            const cue = balls[0]
            const cleared = balls.slice(1).every((b) => b.gone)
            if (cleared) {
              startFade(() => {
                setupRack()
                playState = 'idle'
              })
            } else if (cue.gone) {
              respawnCue(now)
            }
            playState = 'idle'
            lastActivity = now
            updateCursor()
          }
        } else if (playState === 'idle') {
          if (now - lastActivity > INACTIVITY_MS) {
            startFade(() => {
              setupRack()
              mode = 'cinematic'
              phase = 'fadeIn'
              phaseStart = performance.now()
              updateCursor()
            }, false)
          }
        }
      }

      ctx!.clearRect(0, 0, width, height)
      ctx!.globalAlpha = alpha
      drawTable()
      ctx!.globalAlpha = 1

      for (const b of balls) {
        if (!b.gone) drawBall(b, now)
      }

      if (mode === 'cinematic' && !reduceMotion) {
        const cueState = cueTipDistance(now)
        if (cueState) drawCue(cueState.dist, cueState.fade)
      }
      if (mode === 'play' && !fadeJob) {
        if (playState === 'aiming') drawAim()
        else if (playState === 'idle') drawCueInvite(now)
      }
      drawImpactFlash(now)
      drawParticles(now, effDt)

      if (!fadeJob) {
        if (mode === 'cinematic') drawHint(hintCinematic, now)
        else if (playState === 'idle') drawHint(hintPlayIdle, now)
      }

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
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
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
