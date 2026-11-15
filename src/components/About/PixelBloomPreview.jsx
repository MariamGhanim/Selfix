import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PASTELS = [
  { id: 'blush', color: '#f2b8c6', label: 'Mood' },
  { id: 'peach', color: '#f5c9a8', label: 'Warm day' },
  { id: 'butter', color: '#f0d89a', label: 'Bright' },
  { id: 'mint', color: '#b8dfc8', label: 'Rest' },
  { id: 'sky', color: '#b7d7f0', label: 'Calm' },
  { id: 'lilac', color: '#d4c2ef', label: 'Dreamy' },
  { id: 'rose', color: '#e8a0b4', label: 'Tender' },
  { id: 'sage', color: '#c5dbb4', label: 'Steady' },
]

const COLS = 14
const ROWS = 8

function seededPastel(i) {
  return PASTELS[i % PASTELS.length]
}

function buildDemoGrid() {
  const cells = []
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const i = r * COLS + c
      const filled = (i * 7 + r * 3) % 5 !== 0
      cells.push({
        id: `${r}-${c}`,
        color: filled ? seededPastel(i + r).color : null,
        label: filled ? seededPastel(i + r).label : 'Empty',
      })
    }
  }
  return cells
}

export default function PixelBloomPreview() {
  const [cells, setCells] = useState(buildDemoGrid)
  const [active, setActive] = useState(null)
  const [bloomId, setBloomId] = useState(null)

  const legend = useMemo(() => PASTELS.slice(0, 6), [])

  useEffect(() => {
    const tick = () => {
      setCells((prev) => {
        const next = [...prev]
        const idx = Math.floor(Math.random() * next.length)
        const pastel = PASTELS[Math.floor(Math.random() * PASTELS.length)]
        next[idx] = { ...next[idx], color: pastel.color, label: pastel.label }
        setBloomId(next[idx].id)
        return next
      })
    }
    const id = window.setInterval(tick, 1600)
    return () => window.clearInterval(id)
  }, [])

  const paint = (index) => {
    const pastel = PASTELS[Math.floor(Math.random() * PASTELS.length)]
    setCells((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], color: pastel.color, label: pastel.label }
      return next
    })
    setActive(pastel)
    setBloomId(cells[index].id)
  }

  return (
    <div className="about-pixel-stage relative overflow-hidden rounded-[2rem] px-4 py-5 sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute -left-8 top-6 h-28 w-28 rounded-full bg-[var(--orb-a)] blur-2xl" />
      <div className="pointer-events-none absolute -right-6 bottom-4 h-32 w-32 rounded-full bg-[var(--orb-b)] blur-2xl" />

      <div className="relative z-10 mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-deep)]">
            Year in pixels
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">
            Tap a day. Watch it bloom.
          </h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
            Soft pastels for mood, sleep, and habits — a mosaic that grows kinder the longer you stay.
          </p>
        </div>
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1.5 shadow-md ring-1 ring-[var(--page-edge)]/60"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: active.color, boxShadow: `0 0 12px ${active.color}` }}
              />
              <span className="font-display text-[12px] font-semibold text-[var(--ink)]">
                {active.label}
              </span>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] font-medium text-[var(--ink-soft)]"
            >
              Try painting a square
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div
        className="relative z-10 grid gap-[3px] sm:gap-1"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {cells.map((cell, index) => {
          const blooming = bloomId === cell.id
          return (
            <motion.button
              key={cell.id}
              type="button"
              aria-label={cell.color ? `Painted ${cell.label}` : 'Empty day — tap to paint'}
              onClick={() => paint(index)}
              whileHover={{ scale: 1.18, zIndex: 2 }}
              whileTap={{ scale: 0.9 }}
              animate={
                blooming
                  ? { scale: [1, 1.35, 1], boxShadow: `0 0 18px ${cell.color || 'transparent'}` }
                  : { scale: 1 }
              }
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className="aspect-square rounded-[4px] sm:rounded-md"
              style={{
                background: cell.color || 'var(--empty-cell)',
                outline: blooming ? `2px solid color-mix(in srgb, ${cell.color} 70%, white)` : undefined,
              }}
            />
          )
        })}
      </div>

      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {legend.map((swatch) => (
          <span
            key={swatch.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)]/80 px-2.5 py-1 text-[11px] font-semibold text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/50"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: swatch.color }} />
            {swatch.label}
          </span>
        ))}
      </div>
    </div>
  )
}
