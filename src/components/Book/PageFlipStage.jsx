import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import Spread from './Spread'
import { TRACKERS } from '../../data/trackers'

const FLIP_EASE = [0.33, 0.0, 0.2, 1]
const SETTLE_EASE = [0.22, 1, 0.36, 1]
const COMMIT_ANGLE = 48
const MAX_DRAG = 190

export default function PageFlipStage({
  pageIndex,
  onPageChange,
  selectedDay,
  onSelectDay,
}) {
  const stageRef = useRef(null)
  const [fromIndex, setFromIndex] = useState(pageIndex)
  const [toIndex, setToIndex] = useState(pageIndex)
  const [flipping, setFlipping] = useState(false)
  const [dir, setDir] = useState(1)
  const busy = useRef(false)

  const rotateY = useMotionValue(0)
  const progress = useTransform(rotateY, (v) => Math.min(1, Math.abs(v) / 180))

  const shadowOpacity = useTransform(rotateY, [-180, -100, -40, 0, 40, 100, 180], [0.2, 0.85, 0.45, 0, 0.45, 0.85, 0.2])
  const sheetBrightness = useTransform(rotateY, [-180, -90, 0, 90, 180], [0.88, 0.72, 1, 0.72, 0.88])
  const brightnessFilter = useTransform(sheetBrightness, (v) => `brightness(${v})`)
  const curlOpacity = useTransform(rotateY, [-150, -50, 0, 50, 150], [0.35, 0.95, 0, 0.95, 0.35])
  const liftZ = useTransform(progress, [0, 0.45, 1], [0, 42, 8])
  const pageScale = useTransform(progress, [0, 0.5, 1], [1, 1.015, 1])
  const skewHint = useTransform(rotateY, [-180, 0, 180], [4, 0, -4])
  const underDim = useTransform(progress, [0, 0.35, 1], [0, 0.12, 0.04])
  const spineGlow = useTransform(progress, [0, 0.5, 1], [0.15, 0.55, 0.2])
  const cornerLift = useTransform(progress, [0, 0.25, 0.7, 1], [0, 18, 10, 0])

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
        onPageChange(nextIndex)
      } else {
        setToIndex(fromIndex)
      }
      rotateY.set(0)
      setFlipping(false)
      busy.current = false
    },
    [fromIndex, onPageChange, rotateY],
  )

  const runFlip = useCallback(
    async (nextIndex, direction) => {
      if (busy.current) return
      if (nextIndex < 0 || nextIndex >= TRACKERS.length) return
      if (nextIndex === pageIndex) return

      busy.current = true
      setDir(direction)
      setFromIndex(pageIndex)
      setToIndex(nextIndex)
      setFlipping(true)
      rotateY.set(0)

      const target = direction > 0 ? -180 : 180
      await animate(rotateY, target * 0.55, {
        duration: 0.38,
        ease: FLIP_EASE,
      })
      await animate(rotateY, target, {
        duration: 0.42,
        ease: SETTLE_EASE,
      })
      finishFlip(true, nextIndex)
    },
    [finishFlip, pageIndex, rotateY],
  )

  useEffect(() => {
    const onRequest = (e) => {
      const { index, direction } = e.detail || {}
      if (typeof index !== 'number') return
      const d = direction ?? (index > pageIndex ? 1 : index < pageIndex ? -1 : 1)
      runFlip(index, d || 1)
    }
    window.addEventListener('book-flip-to', onRequest)
    return () => window.removeEventListener('book-flip-to', onRequest)
  }, [pageIndex, runFlip])

  const beginDrag = (direction, startX) => {
    const next = pageIndex + direction
    if (next < 0 || next >= TRACKERS.length) return false

    busy.current = true
    setDir(direction)
    setFromIndex(pageIndex)
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
        const target = direction > 0 ? -180 : 180
        await animate(rotateY, target, { duration: 0.48, ease: SETTLE_EASE })
        finishFlip(true, next)
      } else {
        await animate(rotateY, 0, { duration: 0.36, ease: SETTLE_EASE })
        finishFlip(false, pageIndex)
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

  const underTracker = TRACKERS[flipping ? toIndex : pageIndex]
  const sheetTracker = TRACKERS[flipping ? fromIndex : pageIndex]
  const origin = dir > 0 ? 'left center' : 'right center'

  return (
    <div
      ref={stageRef}
      className="page-flip-stage relative h-full min-h-0 w-full flex-1"
      onPointerDown={onPointerDown}
      style={{ perspective: '2600px', perspectiveOrigin: '50% 48%' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="paper-texture h-full w-full">
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
          className="pointer-events-none absolute inset-y-0 left-1/2 z-[25] w-10 -translate-x-1/2"
          style={{
            opacity: spineGlow,
            background:
              'linear-gradient(90deg, transparent, rgba(0,0,0,0.18), rgba(255,255,255,0.12), rgba(0,0,0,0.16), transparent)',
          }}
        />
      )}

      {flipping && (
        <motion.div
          className="page-flip-sheet absolute inset-0 z-20 will-change-transform"
          style={{
            rotateY,
            z: liftZ,
            scale: pageScale,
            skewY: skewHint,
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
            <div
              className="paper-texture h-full w-full"
              style={{
                boxShadow:
                  '0 24px 48px rgba(0,0,0,0.22), -8px 0 24px rgba(0,0,0,0.08)',
              }}
            >
              <Spread tracker={sheetTracker} selectedDay={selectedDay} />
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

            <motion.div
              className="page-corner-curl pointer-events-none absolute"
              style={{
                width: 120,
                height: 120,
                bottom: 0,
                [dir > 0 ? 'right' : 'left']: 0,
                y: cornerLift,
                rotate: dir > 0 ? -8 : 8,
                background:
                  dir > 0
                    ? 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.55), transparent 55%), linear-gradient(225deg, transparent 40%, rgba(0,0,0,0.12) 100%)'
                    : 'radial-gradient(circle at 0% 100%, rgba(255,255,255,0.55), transparent 55%), linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.12) 100%)',
                clipPath:
                  dir > 0
                    ? 'polygon(40% 100%, 100% 40%, 100% 100%)'
                    : 'polygon(0 40%, 60% 100%, 0 100%)',
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

      {pageIndex < TRACKERS.length - 1 && (
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

export function flipToPage(index, direction) {
  window.dispatchEvent(
    new CustomEvent('book-flip-to', {
      detail: { index, direction },
    }),
  )
}
