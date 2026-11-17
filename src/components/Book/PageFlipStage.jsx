import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import Spread from './Spread'

const FLIP_EASE = [0.33, 0.0, 0.2, 1]
const SETTLE_EASE = [0.22, 1, 0.36, 1]
const COMMIT_ANGLE = 48
const MAX_DRAG = 190

/** Lightweight departing page — avoids mounting a second 365-cell grid mid-flip. */
function FlipGhost({ tracker }) {
  if (!tracker) return null
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3 p-8">
      <div
        className="rounded-2xl px-4 py-3 text-white shadow-md"
        style={{ background: tracker.tabColor }}
      >
        <p className="font-display text-sm font-semibold">{tracker.title}</p>
        <p className="text-[11px] opacity-90">{tracker.subtitle}</p>
      </div>
      <div
        className="h-24 w-40 rounded-xl opacity-40"
        style={{ background: `color-mix(in srgb, ${tracker.tabColor} 35%, #fffdfb)` }}
        aria-hidden
      />
    </div>
  )
}

function PageFlipStage({
  pageIndex,
  onPageChange,
  selectedDay,
  onSelectDay,
  trackers = [],
}) {
  const stageRef = useRef(null)
  const [fromIndex, setFromIndex] = useState(pageIndex)
  const [toIndex, setToIndex] = useState(pageIndex)
  const [flipping, setFlipping] = useState(false)
  const [dir, setDir] = useState(1)
  const busy = useRef(false)
  const pageIndexRef = useRef(pageIndex)
  pageIndexRef.current = pageIndex

  const rotateY = useMotionValue(0)
  const progress = useTransform(rotateY, (v) => Math.min(1, Math.abs(v) / 180))

  const shadowOpacity = useTransform(rotateY, [-180, -100, -40, 0, 40, 100, 180], [0.2, 0.85, 0.45, 0, 0.45, 0.85, 0.2])
  const sheetBrightness = useTransform(rotateY, [-180, -90, 0, 90, 180], [0.88, 0.72, 1, 0.72, 0.88])
  const brightnessFilter = useTransform(sheetBrightness, (v) => `brightness(${v})`)
  const curlOpacity = useTransform(rotateY, [-150, -50, 0, 50, 150], [0.35, 0.95, 0, 0.95, 0.35])
  const liftZ = useTransform(progress, [0, 0.45, 1], [0, 28, 6])
  const underDim = useTransform(progress, [0, 0.35, 1], [0, 0.1, 0.03])

  useEffect(() => {
    if (!flipping && !busy.current) {
      setFromIndex(pageIndex)
      setToIndex(pageIndex)
      rotateY.set(0)
    }
  }, [pageIndex, flipping, rotateY])

  const finishFlip = useCallback(
    (committed, nextIndex) => {
      if (committed) {
        setFromIndex(nextIndex)
        setToIndex(nextIndex)
        if (pageIndexRef.current !== nextIndex) {
          onPageChange(nextIndex)
        }
      } else {
        setToIndex(fromIndex)
        if (pageIndexRef.current !== fromIndex) {
          onPageChange(fromIndex)
        }
      }
      rotateY.set(0)
      setFlipping(false)
      busy.current = false
    },
    [fromIndex, onPageChange, rotateY],
  )

  const runFlip = useCallback(
    async (nextIndex, direction, fromOverride) => {
      if (busy.current) return
      if (nextIndex < 0 || nextIndex >= trackers.length) return

      const from = typeof fromOverride === 'number' ? fromOverride : pageIndexRef.current
      if (nextIndex === from && !flipping) return

      busy.current = true
      setDir(direction)
      setFromIndex(from)
      setToIndex(nextIndex)
      setFlipping(true)
      rotateY.set(0)

      const target = direction > 0 ? -180 : 180
      await animate(rotateY, target, {
        duration: 0.32,
        ease: FLIP_EASE,
      })
      finishFlip(true, nextIndex)
    },
    [finishFlip, flipping, rotateY, trackers.length],
  )

  useEffect(() => {
    const onRequest = (e) => {
      const { index, direction, fromIndex: from } = e.detail || {}
      if (typeof index !== 'number') return
      const current = typeof from === 'number' ? from : pageIndexRef.current
      const d = direction ?? (index > current ? 1 : index < current ? -1 : 1)
      runFlip(index, d || 1, current)
    }
    window.addEventListener('book-flip-to', onRequest)
    return () => window.removeEventListener('book-flip-to', onRequest)
  }, [runFlip])

  const beginDrag = (direction, startX) => {
    const from = pageIndexRef.current
    const next = from + direction
    if (next < 0 || next >= trackers.length) return false

    busy.current = true
    setDir(direction)
    setFromIndex(from)
    setToIndex(next)
    setFlipping(true)
    rotateY.set(0)

    const onMove = (ev) => {
      const dx = ev.clientX - startX
      if (direction > 0) {
        const t = Math.max(-MAX_DRAG, Math.min(0, dx))
        rotateY.set((t / MAX_DRAG) * 175)
      } else {
        const t = Math.min(MAX_DRAG, Math.max(0, dx))
        rotateY.set((t / MAX_DRAG) * 175)
      }
    }

    const onUp = async () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)

      const angle = Math.abs(rotateY.get())
      const commit = angle >= COMMIT_ANGLE
      if (commit) {
        onPageChange(next)
        const target = direction > 0 ? -180 : 180
        await animate(rotateY, target, { duration: 0.28, ease: SETTLE_EASE })
        finishFlip(true, next)
      } else {
        await animate(rotateY, 0, { duration: 0.22, ease: SETTLE_EASE })
        finishFlip(false, from)
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return true
  }

  const onPointerDown = (e) => {
    if (busy.current || flipping) return
    if (
      e.target.closest?.(
        'button, input, textarea, a, label, select, [data-no-flip], [role="dialog"]',
      )
    ) {
      return
    }

    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const mid = rect.width / 2
    const edgeX = Math.max(28, rect.width * 0.08)
    const corner = Math.max(48, rect.width * 0.12)
    const nearRight = x > rect.width - edgeX
    const nearLeft = x < edgeX
    const bottomRight = x > rect.width - corner && y > rect.height - corner
    const bottomLeft = x < corner && y > rect.height - corner

    if (!nearRight && !nearLeft && !bottomRight && !bottomLeft) return
    if (x > mid && e.target.closest?.('[data-right-page]')) return

    const direction = nearRight || bottomRight ? 1 : -1
    e.preventDefault()
    beginDrag(direction, e.clientX)
  }

  // During a flip, show the destination under the peeling ghost sheet.
  const underTracker = trackers[flipping ? toIndex : pageIndex] || trackers[0]
  const sheetTracker = trackers[fromIndex] || trackers[0]
  const origin = dir > 0 ? 'left center' : 'right center'

  return (
    <div
      ref={stageRef}
      className="page-flip-stage relative h-full min-h-0 w-full min-w-0 flex-1"
      onPointerDown={onPointerDown}
      style={{ perspective: '2200px', perspectiveOrigin: '50% 48%' }}
    >
      <div className="absolute inset-0 min-w-0 overflow-hidden">
        <div className="paper-texture h-full w-full min-w-0">
          <Spread
            tracker={underTracker}
            selectedDay={selectedDay}
            onSelectDay={flipping ? undefined : onSelectDay}
          />
        </div>
        {flipping && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-black"
            style={{ opacity: underDim }}
          />
        )}
      </div>

      {flipping && (
        <motion.div
          className="page-flip-sheet absolute inset-0 z-20 will-change-transform"
          style={{
            rotateY,
            z: liftZ,
            transformOrigin: origin,
            transformStyle: 'preserve-3d',
            filter: brightnessFilter,
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="paper-texture h-full w-full shadow-lg">
              <FlipGhost tracker={sheetTracker} />
            </div>

            <motion.div
              className="page-flip-gradient pointer-events-none absolute inset-0"
              style={{ opacity: shadowOpacity }}
            />

            <motion.div
              className="pointer-events-none absolute inset-y-0"
              style={{
                opacity: curlOpacity,
                ...(dir > 0
                  ? {
                      left: 0,
                      width: '34%',
                      background:
                        'linear-gradient(90deg, rgba(0,0,0,0.28), rgba(0,0,0,0.08) 38%, rgba(255,255,255,0.12) 62%, transparent)',
                    }
                  : {
                      right: 0,
                      width: '34%',
                      background:
                        'linear-gradient(270deg, rgba(0,0,0,0.28), rgba(0,0,0,0.08) 38%, rgba(255,255,255,0.12) 62%, transparent)',
                    }),
              }}
            />
          </div>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="paper-texture page-back-pattern h-full w-full" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  dir > 0
                    ? 'linear-gradient(90deg, rgba(0,0,0,0.16), transparent 42%, rgba(0,0,0,0.05))'
                    : 'linear-gradient(270deg, rgba(0,0,0,0.16), transparent 42%, rgba(0,0,0,0.05))',
              }}
            />
          </div>
        </motion.div>
      )}

      {pageIndex < trackers.length - 1 && (
        <>
          <div className="page-edge-hint absolute inset-y-10 right-0 z-30 w-3 rounded-l-full" />
          <div className="page-corner-hint absolute bottom-2 right-2 z-30 h-14 w-14" />
        </>
      )}
      {pageIndex > 0 && (
        <>
          <div className="page-edge-hint absolute inset-y-10 left-0 z-30 w-3 rounded-r-full" />
          <div className="page-corner-hint absolute bottom-2 left-2 z-30 h-14 w-14 scale-x-[-1]" />
        </>
      )}
    </div>
  )
}

export default memo(PageFlipStage)

export function flipToPage(index, direction, fromIndex) {
  window.dispatchEvent(
    new CustomEvent('book-flip-to', {
      detail: { index, direction, fromIndex },
    }),
  )
}
