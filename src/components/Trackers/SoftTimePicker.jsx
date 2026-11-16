import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Clock3 } from 'lucide-react'
import {
  formatDisplayTime,
  parseTimeInput,
  partsToStorage,
  storageToParts,
  toStorageTime,
} from '../../lib/timeParse'

const QUICK_TIMES = [
  { label: '9 PM', storage: '21:00' },
  { label: '10 PM', storage: '22:00' },
  { label: '11 PM', storage: '23:00' },
  { label: '12 AM', storage: '00:00' },
  { label: '6 AM', storage: '06:00' },
  { label: '7 AM', storage: '07:00' },
  { label: '8 AM', storage: '08:00' },
]

const MINUTE_PILLS = [0, 15, 30, 45]

function commitText(text) {
  const parsed = parseTimeInput(text)
  if (!parsed) return null
  return toStorageTime(parsed.hours24, parsed.minutes)
}

export default function SoftTimePicker({
  value = '',
  onChange,
  onCommit,
  placeholder = 'e.g. 11:30 PM',
  className = '',
  'aria-label': ariaLabel = 'Time',
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const popoverRef = useRef(null)
  const [text, setText] = useState(() => (value ? formatDisplayTime(value) : ''))
  const [open, setOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, width: 260 })

  const parts = storageToParts(value)

  useEffect(() => {
    if (document.activeElement === inputRef.current) return
    setText(value ? formatDisplayTime(value) : '')
  }, [value])

  useEffect(() => {
    if (!open) return undefined

    const place = () => {
      const el = rootRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const width = Math.min(280, Math.max(240, rect.width))
      let left = rect.left
      if (left + width > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - width - 8)
      }
      const below = rect.bottom + 8
      const estimatedH = 320
      const top =
        below + estimatedH > window.innerHeight - 8
          ? Math.max(8, rect.top - estimatedH - 8)
          : below
      setPopoverPos({ top, left, width })
    }

    place()
    const onDoc = (e) => {
      if (rootRef.current?.contains(e.target)) return
      if (popoverRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    document.addEventListener('pointerdown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      document.removeEventListener('pointerdown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const emit = (storage, { commit = true } = {}) => {
    onChange?.(storage)
    if (commit) onCommit?.(storage)
    setText(storage ? formatDisplayTime(storage) : '')
  }

  const applyParts = (hour12, minutes, isPm) => {
    emit(partsToStorage(hour12, minutes, isPm))
  }

  const finalizeText = () => {
    const storage = commitText(text)
    if (storage) {
      emit(storage)
      return storage
    }
    setText(value ? formatDisplayTime(value) : '')
    return value || ''
  }

  const nudgeHour = (delta) => {
    let next = parts.hour12 + delta
    if (next > 12) next = 1
    if (next < 1) next = 12
    applyParts(next, parts.minutes, parts.isPm)
  }

  const nudgeMinute = (delta) => {
    let next = parts.minutes + delta
    let hour12 = parts.hour12
    let isPm = parts.isPm
    if (next >= 60) {
      next = 0
      hour12 += 1
      if (hour12 > 12) {
        hour12 = 1
        isPm = !isPm
      }
    } else if (next < 0) {
      next = 45
      hour12 -= 1
      if (hour12 < 1) {
        hour12 = 12
        isPm = !isPm
      }
    }
    applyParts(hour12, next, isPm)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          data-no-flip
          aria-label={ariaLabel}
          aria-controls={open ? listId : undefined}
          aria-expanded={open}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => {
            if (value) setText(formatDisplayTime(value))
          }}
          onBlur={() => {
            // Delay so picker clicks can land first.
            window.setTimeout(() => {
              if (popoverRef.current?.contains(document.activeElement)) return
              finalizeText()
            }, 120)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              finalizeText()
              setOpen(false)
              inputRef.current?.blur()
            }
          }}
          className="soft-field relative z-20 min-h-11 w-full min-w-0 flex-1 rounded-2xl border-0 bg-[var(--surface)] px-3 py-2.5 text-base text-[var(--ink)] shadow-sm ring-1 ring-[var(--page-edge)]/60 outline-none transition duration-200 placeholder:text-[var(--ink-soft)]/70 focus:ring-2 focus:ring-[var(--accent)]/40 sm:min-h-0 sm:py-1.5 sm:text-sm"
        />
        <button
          type="button"
          data-no-flip
          aria-label="Open cute time picker"
          onClick={() => {
            finalizeText()
            setOpen((o) => !o)
          }}
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 transition sm:h-9 sm:w-9 ${
            open
              ? 'bg-[var(--accent-deep)] text-white ring-[var(--accent-deep)]'
              : 'bg-[var(--accent-glow)] text-[var(--accent-deep)] ring-[var(--page-edge)]/55 hover:bg-[var(--accent-soft)]'
          }`}
        >
          <Clock3 size={16} />
        </button>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={popoverRef}
                id={listId}
                role="dialog"
                aria-label="Choose a time"
                data-no-flip
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="fixed z-[90] overflow-hidden rounded-[1.35rem] border border-[var(--page-edge)]/70 bg-[var(--surface)] p-3 shadow-[0_18px_40px_rgba(90,50,70,0.18)] backdrop-blur-md"
                style={{
                  top: popoverPos.top,
                  left: popoverPos.left,
                  width: popoverPos.width,
                }}
              >
                <div
                  className="mb-3 rounded-[1.1rem] px-3 py-2.5 text-center"
                  style={{
                    background:
                      'linear-gradient(135deg, color-mix(in srgb, var(--accent-glow) 85%, white), color-mix(in srgb, var(--accent-soft) 35%, var(--surface)))',
                  }}
                >
                  <p className="font-display text-lg font-semibold tracking-tight text-[var(--accent-deep)]">
                    {value ? formatDisplayTime(value) : 'Pick a soft time'}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-[var(--ink-soft)]">
                    Type freely · or tap below
                  </p>
                </div>

                <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="flex flex-col items-center rounded-2xl bg-[var(--accent-glow)]/55 p-1.5 ring-1 ring-[var(--page-edge)]/40">
                    <button
                      type="button"
                      aria-label="Hour up"
                      onClick={() => nudgeHour(1)}
                      className="inline-flex h-8 w-full items-center justify-center rounded-xl text-[var(--accent-deep)] hover:bg-[var(--surface)]"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <p className="font-display text-2xl font-semibold tabular-nums text-[var(--ink)]">
                      {parts.hour12}
                    </p>
                    <button
                      type="button"
                      aria-label="Hour down"
                      onClick={() => nudgeHour(-1)}
                      className="inline-flex h-8 w-full items-center justify-center rounded-xl text-[var(--accent-deep)] hover:bg-[var(--surface)]"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <span className="font-display text-2xl font-semibold text-[var(--accent-deep)]">:</span>

                  <div className="flex flex-col items-center rounded-2xl bg-[var(--accent-glow)]/55 p-1.5 ring-1 ring-[var(--page-edge)]/40">
                    <button
                      type="button"
                      aria-label="Minute up"
                      onClick={() => nudgeMinute(15)}
                      className="inline-flex h-8 w-full items-center justify-center rounded-xl text-[var(--accent-deep)] hover:bg-[var(--surface)]"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <p className="font-display text-2xl font-semibold tabular-nums text-[var(--ink)]">
                      {String(parts.minutes).padStart(2, '0')}
                    </p>
                    <button
                      type="button"
                      aria-label="Minute down"
                      onClick={() => nudgeMinute(-15)}
                      className="inline-flex h-8 w-full items-center justify-center rounded-xl text-[var(--accent-deep)] hover:bg-[var(--surface)]"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-1.5">
                  {['AM', 'PM'].map((label) => {
                    const active = label === 'PM' ? parts.isPm : !parts.isPm
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => applyParts(parts.hour12, parts.minutes, label === 'PM')}
                        className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                          active
                            ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                            : 'bg-[var(--surface)] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/60 hover:bg-[var(--accent-glow)]'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {MINUTE_PILLS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => applyParts(parts.hour12, m, parts.isPm)}
                      className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold transition ${
                        parts.minutes === m
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--accent-glow)] text-[var(--accent-deep)]'
                      }`}
                    >
                      :{String(m).padStart(2, '0')}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TIMES.map((q) => (
                    <button
                      key={q.storage}
                      type="button"
                      onClick={() => {
                        emit(q.storage)
                        setOpen(false)
                      }}
                      className="rounded-full bg-[var(--surface)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/55 transition hover:bg-[var(--accent-glow)] hover:text-[var(--accent-deep)]"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
