import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  AudioWaveform,
  Code,
  Crosshair,
  Gauge,
  Grid2x2,
  Grid3x3,
  MonitorSmartphone,
  Share2,
  Timer,
  Zap,
} from 'lucide-react'
import GitHubIcon from './icons/GitHubIcon'
import { portfolioData } from '../data/portfolioData'

/** The three render presets, modelled after the XHIVA canvas backgrounds. */
type CanvasMode = 'connections' | 'squares' | 'waves'

const modes: readonly {
  id: CanvasMode
  label: string
  hint: string
  icon: typeof Share2
}[] = [
  {
    id: 'connections',
    label: 'Interactive Connections',
    hint: 'Nodes + distance-based joins',
    icon: Share2,
  },
  {
    id: 'squares',
    label: 'Golden Squares',
    hint: 'Rotating mesh + light reflection',
    icon: Grid3x3,
  },
  {
    id: 'waves',
    label: 'Interactive Waves',
    hint: 'Sine grid reacting to the cursor',
    icon: AudioWaveform,
  },
]

const architectureNotes: readonly {
  icon: typeof Zap
  title: string
  detail: string
}[] = [
  {
    icon: Code,
    title: '100% Native HTML5 Canvas API',
    detail: 'No WebGL, no render library — the raw 2D context only.',
  },
  {
    icon: Timer,
    title: 'Single requestAnimationFrame Loop',
    detail: 'One scheduler drives every mode, every frame.',
  },
  {
    icon: Zap,
    title: 'Zero DOM Thrashing',
    detail: 'Motion lives on the canvas; React never re-renders per frame.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Optimized for Mobile & Desktop Frame Rates',
    detail: 'DPR-capped, density-aware, and resize-safe.',
  },
]

/**
 * CanvasShowcase
 *
 * A full-width, interactive showcase of hand-written HTML5 Canvas work.
 * All mutable engine state lives in refs so switching modes or dragging the
 * sliders never tears down or restarts the single animation loop.
 */
function CanvasShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const [mode, setMode] = useState<CanvasMode>('connections')
  const [speed, setSpeed] = useState(() => (prefersReducedMotion ? 0 : 1))
  const [density, setDensity] = useState(1)

  const modeRef = useRef(mode)
  const speedRef = useRef(speed)
  const densityRef = useRef(density)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    densityRef.current = density
  }, [density])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let rafId = 0
    let time = 0
    let lastTimestamp = 0
    let lastDensity = densityRef.current
    let currentMode: CanvasMode = modeRef.current

    const pointer = { x: 0, y: 0, active: false }
    const nodes: { x: number; y: number; vx: number; vy: number }[] = []

    const palette = {
      cobalt: '37, 99, 235',
      cobaltDark: '29, 78, 216',
      gold: '180, 83, 9',
      goldLight: '217, 119, 6',
    }

    const seedNodes = () => {
      nodes.length = 0
      const base = (width * height) / 22000
      const count = Math.max(
        18,
        Math.min(140, Math.round(base * densityRef.current)),
      )
      for (let i = 0; i < count; i += 1) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
        })
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedNodes()
    }

    const drawConnections = (dt: number) => {
      ctx.clearRect(0, 0, width, height)
      const maxDist = 130

      for (const node of nodes) {
        node.x += node.vx * 60 * dt * speedRef.current
        node.y += node.vy * 60 * dt * speedRef.current
        if (node.x <= 0 || node.x >= width) {
          node.vx *= -1
          node.x = Math.min(Math.max(node.x, 0), width)
        }
        if (node.y <= 0 || node.y >= height) {
          node.vy *= -1
          node.y = Math.min(Math.max(node.y, 0), height)
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          if (distance < maxDist) {
            const alpha = (1 - distance / maxDist) * 0.35
            ctx.strokeStyle = `rgba(${palette.cobalt}, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        if (pointer.active) {
          const toPointer = Math.hypot(a.x - pointer.x, a.y - pointer.y)
          if (toPointer < 180) {
            const alpha = (1 - toPointer / 180) * 0.5
            ctx.strokeStyle = `rgba(${palette.cobaltDark}, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      for (const node of nodes) {
        const near = pointer.active
          ? Math.hypot(node.x - pointer.x, node.y - pointer.y)
          : Infinity
        const isNear = near < 120
        ctx.fillStyle = `rgba(${palette.cobaltDark}, ${isNear ? 0.95 : 0.55})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, isNear ? 2.6 : 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawSquares = () => {
      ctx.clearRect(0, 0, width, height)
      const spacing = 56 / Math.max(densityRef.current, 0.4)
      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1
      const t = time * speedRef.current

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const cx = col * spacing
          const cy = row * spacing
          const phase = (col + row) * 0.35
          const scale = 0.28 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.1 + phase))
          const size = spacing * scale

          let reflection = 0
          if (pointer.active) {
            const distance = Math.hypot(cx - pointer.x, cy - pointer.y)
            reflection = Math.max(0, 1 - distance / 260)
          }

          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(t * 0.25 + phase * 0.4)
          ctx.lineWidth = 1 + reflection * 1.4
          ctx.strokeStyle = `rgba(${palette.gold}, ${0.12 + reflection * 0.6})`
          ctx.strokeRect(-size / 2, -size / 2, size, size)
          if (reflection > 0.15) {
            ctx.fillStyle = `rgba(${palette.goldLight}, ${reflection * 0.14})`
            ctx.fillRect(-size / 2, -size / 2, size, size)
          }
          ctx.restore()
        }
      }
    }

    const drawWaves = () => {
      ctx.clearRect(0, 0, width, height)
      const rows = Math.max(6, Math.round(14 * densityRef.current))
      const step = 8
      const t = time * speedRef.current
      const rowHeight = height / rows

      for (let row = 0; row < rows; row += 1) {
        const baseY = (row + 0.5) * rowHeight
        const alpha = 0.12 + (row / rows) * 0.32
        ctx.strokeStyle = `rgba(${palette.cobalt}, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let x = 0; x <= width + step; x += step) {
          const wave =
            Math.sin(x * 0.012 + t * 1.4 + row * 0.6) * (6 + row * 0.9)
          let dip = 0
          if (pointer.active) {
            const distance = Math.abs(x - pointer.x)
            if (distance < 260) {
              dip = Math.sin(t * 3 + x * 0.03) * (1 - distance / 260) * 34
            }
          }
          const y = baseY + wave + dip
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      if (pointer.active) {
        ctx.strokeStyle = `rgba(${palette.cobaltDark}, 0.25)`
        ctx.setLineDash([4, 6])
        ctx.beginPath()
        ctx.moveTo(pointer.x, 0)
        ctx.lineTo(pointer.x, height)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    const render = (timestamp: number) => {
      if (lastTimestamp === 0) lastTimestamp = timestamp
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05)
      lastTimestamp = timestamp

      if (modeRef.current !== currentMode) {
        currentMode = modeRef.current
        if (currentMode === 'connections') seedNodes()
        lastDensity = densityRef.current
        ctx.clearRect(0, 0, width, height)
      }

      const densityChanged =
        Math.abs(densityRef.current - lastDensity) > 0.01
      if (currentMode === 'connections' && densityChanged) {
        lastDensity = densityRef.current
        seedNodes()
      }

      time += dt

      if (currentMode === 'connections') drawConnections(dt)
      else if (currentMode === 'squares') drawSquares()
      else drawWaves()

      rafId = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    const handleVisibility = () => {
      lastTimestamp = 0
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerdown', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibility)

    rafId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(rafId)
      observer.disconnect()
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerdown', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const activeMode = modes.find((entry) => entry.id === mode) ?? modes[0]
  const sourceRepo =
    portfolioData.caseStudies.find((entry) => entry.id === 'xhiva-ltd')
      ?.githubUrl ?? portfolioData.github

  return (
    <section
      id="canvas-showcase"
      className="w-full border-b border-slate-200 bg-white px-6 py-16 md:px-12 lg:px-20"
    >
      <div className="flex w-full flex-col gap-12">
        {/* Section heading */}
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-blue-600">
            <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
            Canvas Engineering
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Interactive Canvas Showcase
          </h2>
          <p className="max-w-2xl text-pretty text-base text-slate-600">
            Three hand-written render modes running on one animation loop — move
            your cursor across the stage to drive them.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 border border-slate-200 bg-slate-50 p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Render mode
            </span>
            <div
              role="group"
              aria-label="Canvas render mode"
              className="flex flex-wrap gap-2"
            >
              {modes.map((entry) => {
                const Icon = entry.icon
                const isActive = entry.id === mode
                return (
                  <button
                    key={entry.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setMode(entry.id)}
                    className={`inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      isActive
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {entry.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:gap-10">
            <label className="flex w-full flex-col gap-2 sm:w-44">
              <span className="inline-flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                  Speed
                </span>
                <span className="text-slate-900">{speed.toFixed(2)}×</span>
              </span>
              <input
                type="range"
                min={0}
                max={2.5}
                step={0.05}
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="h-1 w-full cursor-pointer appearance-none bg-slate-300 accent-blue-600"
              />
            </label>

            <label className="flex w-full flex-col gap-2 sm:w-44">
              <span className="inline-flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Grid2x2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Density
                </span>
                <span className="text-slate-900">{density.toFixed(2)}×</span>
              </span>
              <input
                type="range"
                min={0.4}
                max={2}
                step={0.05}
                value={density}
                onChange={(event) => setDensity(Number(event.target.value))}
                className="h-1 w-full cursor-pointer appearance-none bg-slate-300 accent-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Stage */}
        <div className="relative border border-slate-200 bg-slate-50">
          <canvas
            ref={canvasRef}
            className="block h-[360px] w-full touch-pan-y md:h-[460px]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-blue-600"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-blue-600"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-blue-600"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-blue-600"
          />

          <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            <span className="text-slate-900">{activeMode.label}</span>
            <span>{activeMode.hint}</span>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            rAF · {speed === 0 ? 'paused' : `${speed.toFixed(2)}×`}
          </div>
        </div>

        {/* Architecture callout */}
        <div className="border border-slate-200 bg-slate-50">
          <div className="flex flex-col gap-2 border-b border-slate-200 p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Engine
            </span>
            <h3 className="text-lg font-semibold text-slate-900">
              Rendering architecture
            </h3>
            <p className="max-w-3xl text-pretty text-sm text-slate-600">
              Native browser APIs only — no rendering library, no DOM churn.
            </p>
          </div>

          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {architectureNotes.map((note) => {
              const Icon = note.icon
              return (
                <div key={note.title} className="flex flex-col gap-3 bg-white p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-slate-50 text-blue-600">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {note.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {note.detail}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Reference implementation
            </span>
            <a
              href={sourceRepo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <GitHubIcon className="h-4 w-4" />
              eses-git/xhivaweb
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CanvasShowcase
