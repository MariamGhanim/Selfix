import { useCallback, useEffect, useRef, useState } from 'react'
import { useJournal } from '../../context/JournalContext'

const DRAG_THRESHOLD = 4
const KEY_STEP = 80
const ARROW_STEP = 120

export default function Legend({ trackerId, levels, compact = false }) {
  const { state, setSelectedLevel } = useJournal()
  const selected = state.selectedLevel?.[trackerId]

  const scrollerRef = useRef(null)
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startScroll: 0,
    moved: false,
  })
  const suppressClickRef = useRef(false)

  const [edges, setEdges] = useState({ left: false, right: false, overflow: false })
  const [dragging, setDragging] = useState(false)

  const chipBase = compact
    ? 'legend-chip legend-chip--compact inline-flex h-5 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[10px] font-medium tracking-wide transition-colors duration-150'
    : 'legend-chip inline-flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-wide transition-colors duration-150 sm:min-h-0 sm:px-2 sm:py-0.5 sm:text-[9px]'

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const overflow = max > 1
    const scrollLeft = el.scrollLeft
    setEdges({
      overflow,
      left: overflow && scrollLeft > 1,
      right: overflow && scrollLeft < max - 1,
    })
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined

    updateEdges()

    const ro = new ResizeObserver(() => updateEdges())
    ro.observe(el)
    Array.from(el.children).forEach((child) => ro.observe(child))

    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)

    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [updateEdges, levels, compact, trackerId])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 1) return

      const goingLeft = e.deltaY < 0
      const goingRight = e.deltaY > 0
      if (goingLeft && el.scrollLeft <= 0) return
      if (goingRight && el.scrollLeft >= max - 0.5) return

      e.preventDefault()
      el.scrollLeft += e.deltaY
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined

    const onClickCapture = (e) => {
      if (!suppressClickRef.current) return
      e.preventDefault()
      e.stopPropagation()
      suppressClickRef.current = false
    }

    el.addEventListener('click', onClickCapture, true)
    return () => el.removeEventListener('click', onClickCapture, true)
  }, [])

  const endDrag = useCallback((e) => {
    const drag = dragRef.current
    if (!drag.active) return

    if (drag.pointerId != null && scrollerRef.current?.hasPointerCapture?.(drag.pointerId)) {
      try {
        scrollerRef.current.releasePointerCapture(drag.pointerId)
      } catch {
        /* already released */
      }
    }

    if (drag.moved) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 40)
    }

    drag.active = false
    drag.pointerId = null
    drag.moved = false
    setDragging(false)
  }, [])

  const onPointerDown = useCallback(
    (e) => {
      if (e.button != null && e.button !== 0) return
      // Don't steal clicks from legend chips / interactive children
      if (e.target.closest?.('button, a, input, label')) return
      const el = scrollerRef.current
      if (!el) return
      if (el.scrollWidth - el.clientWidth <= 1) return

      dragRef.current = {
        active: true,
        pointerId: e.pointerId,
        startX: e.clientX,
        startScroll: el.scrollLeft,
        moved: false,
      }
      el.setPointerCapture?.(e.pointerId)
    },
    [],
  )

  const onPointerMove = useCallback((e) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== e.pointerId) return
    const el = scrollerRef.current
    if (!el) return

    const dx = e.clientX - drag.startX
    if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      drag.moved = true
      setDragging(true)
    }
    if (!drag.moved) return

    el.scrollLeft = drag.startScroll - dx
    e.preventDefault()
  }, [])

  const onKeyDown = useCallback((e) => {
    const el = scrollerRef.current
    if (!el) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      el.scrollBy({ left: -KEY_STEP, behavior: 'smooth' })
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      el.scrollBy({ left: KEY_STEP, behavior: 'smooth' })
    }
  }, [])

  const scrollByDir = useCallback((dir) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * ARROW_STEP, behavior: 'smooth' })
  }, [])

  const wrapClass = [
    'legend-scroll-wrap',
    edges.left ? 'has-left' : '',
    edges.right ? 'has-right' : '',
    edges.overflow ? 'is-overflow' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const scrollerClass = [
    'legend-scroll',
    compact ? 'legend-scroll--compact' : 'legend-scroll--default',
    edges.overflow ? 'is-overflow' : '',
    dragging ? 'is-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapClass}>
      {edges.left ? (
        <button
          type="button"
          className="legend-scroll-arrow legend-scroll-arrow--left"
          aria-label="Scroll legend left"
          onClick={() => scrollByDir(-1)}
        >
          ‹
        </button>
      ) : null}

      <div
        ref={scrollerRef}
        className={scrollerClass}
        role="group"
        aria-label="Legend"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (dragRef.current.active) endDrag(e)
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedLevel(trackerId, null)}
          className={`${chipBase} ${
            selected == null
              ? 'bg-[var(--accent-soft)]/80 text-[var(--accent-deep)] ring-1 ring-[var(--accent)]/35 shadow-sm'
              : 'bg-[var(--legend-chip-base)] text-[var(--legend-chip-text)] ring-1 ring-[var(--page-edge)]/45'
          }`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--status-cycle)]" />
          Cycle
        </button>
        {levels.map((level) => {
          const active = selected === level.value
          return (
            <button
              key={String(level.value)}
              onClick={() => setSelectedLevel(trackerId, active ? null : level.value)}
              type="button"
              className={`${chipBase} ${
                active
                  ? 'ring-1 shadow-sm'
                  : 'ring-1'
              }`}
              style={{
                background: `color-mix(in srgb, ${level.color} ${active ? 28 : 18}%, var(--legend-chip-base))`,
                color: 'var(--legend-chip-text)',
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${level.color} 35%, transparent)`,
              }}
              title={level.label}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: level.color }}
              />
              <span>{level.label}</span>
            </button>
          )
        })}
      </div>

      {edges.right ? (
        <button
          type="button"
          className="legend-scroll-arrow legend-scroll-arrow--right"
          aria-label="Scroll legend right"
          onClick={() => scrollByDir(1)}
        >
          ›
        </button>
      ) : null}
    </div>
  )
}
