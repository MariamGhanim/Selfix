import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Pause, Play, RotateCcw, Timer } from 'lucide-react'
import { TIMER_PRESETS } from '../data/trackers'
import { focusMinutesToLevel } from '../data/panelOptions'
import { useJournal } from '../context/JournalContext'

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02 + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 + i * 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.12)
      osc.stop(now + 0.7 + i * 0.12)
    })
  } catch {}
}

function format(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const FOCUS_PRESET_IDS = new Set(['focus25', 'deep50'])

const FocusTimerContext = createContext(null)

export function FocusTimerProvider({ children }) {
  const { getPanel, setPanel } = useJournal()
  const [presetId, setPresetId] = useState('focus25')
  const [remaining, setRemaining] = useState(TIMER_PRESETS[0].seconds)
  const [running, setRunning] = useState(false)
  const [loggedFlash, setLoggedFlash] = useState(false)
  const endAt = useRef(null)
  const sessionLogged = useRef(false)
  const presetIdRef = useRef(presetId)

  useEffect(() => {
    presetIdRef.current = presetId
  }, [presetId])

  const logFocusMinutes = useCallback(
    (mins) => {
      if (!mins || mins <= 0) return
      const d = new Date()
      const month = d.getMonth()
      const day = d.getDate()
      const data = getPanel('focus', month, day)
      const minutes = (data.minutes || 0) + mins
      setPanel('focus', month, day, { minutes }, focusMinutesToLevel(minutes))
      setLoggedFlash(true)
      window.setTimeout(() => setLoggedFlash(false), 1800)
    },
    [getPanel, setPanel],
  )

  const applyPreset = useCallback((id) => {
    const p = TIMER_PRESETS.find((x) => x.id === id) || TIMER_PRESETS[0]
    setPresetId(p.id)
    setRemaining(p.seconds)
    setRunning(false)
    endAt.current = null
    sessionLogged.current = false
  }, [])

  const tick = useCallback(() => {
    if (!endAt.current) return
    const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
    setRemaining(left)
    if (left <= 0) {
      setRunning(false)
      endAt.current = null
      playChime()
      const current = TIMER_PRESETS.find((x) => x.id === presetIdRef.current)
      if (current && FOCUS_PRESET_IDS.has(current.id) && !sessionLogged.current) {
        sessionLogged.current = true
        logFocusMinutes(Math.round(current.seconds / 60))
      }
    }
  }, [logFocusMinutes])

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [running, tick])

  const toggle = useCallback(() => {
    if (running) {
      setRunning(false)
      endAt.current = null
      return
    }
    if (remaining <= 0) {
      const p = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
      setRemaining(p.seconds)
      endAt.current = Date.now() + p.seconds * 1000
      sessionLogged.current = false
    } else {
      endAt.current = Date.now() + remaining * 1000
    }
    setRunning(true)
  }, [presetId, remaining, running])

  const reset = useCallback(() => {
    const p = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
    setRunning(false)
    endAt.current = null
    setRemaining(p.seconds)
    sessionLogged.current = false
  }, [presetId])

  const manualLog = useCallback(() => {
    const p = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
    if (!FOCUS_PRESET_IDS.has(p.id)) return
    logFocusMinutes(Math.round(p.seconds / 60))
  }, [logFocusMinutes, presetId])

  const value = useMemo(
    () => ({
      presetId,
      remaining,
      running,
      loggedFlash,
      canLog: FOCUS_PRESET_IDS.has(presetId),
      applyPreset,
      toggle,
      reset,
      manualLog,
      format,
    }),
    [applyPreset, loggedFlash, manualLog, presetId, remaining, reset, running, toggle],
  )

  return <FocusTimerContext.Provider value={value}>{children}</FocusTimerContext.Provider>
}

function useFocusTimer() {
  const ctx = useContext(FocusTimerContext)
  if (!ctx) throw new Error('useFocusTimer must be used within FocusTimerProvider')
  return ctx
}

export function FocusTimerBadge({ onOpen } = {}) {
  const { remaining, running, format: fmt } = useFocusTimer()

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2 text-sm shadow-md backdrop-blur transition hover:scale-[1.02] sm:min-h-0 sm:gap-1.5 sm:px-3 sm:py-1.5 ${
        running
          ? 'bg-[var(--accent-deep)] text-white'
          : 'bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--page-edge)]/50'
      }`}
      aria-label="Open Focus timer"
      title="Open Focus timer"
    >
      <Timer size={16} className={running ? 'animate-pulse' : ''} />
      <span className="font-display text-xs font-semibold tabular-nums tracking-wide sm:text-[13px]">
        {fmt(remaining)}
      </span>
    </button>
  )
}

export function FocusTimerCard() {
  const {
    presetId,
    remaining,
    running,
    loggedFlash,
    canLog,
    applyPreset,
    toggle,
    reset,
    manualLog,
    format: fmt,
  } = useFocusTimer()

  return (
    <section
      data-no-flip
      onPointerDown={(e) => e.stopPropagation()}
      className="relative z-20 quote-banner mb-3 rounded-[1.4rem] px-3.5 py-4 ring-1 ring-[var(--accent-soft)]/50"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-display text-[13px] font-semibold tracking-tight text-[var(--ink)]">
            Focus timer
          </p>
          <p className="text-[10px] font-medium text-[var(--ink-soft)]">
            Soft sessions that log into today&apos;s pixel
          </p>
        </div>
        {running && (
          <span className="rounded-full bg-[var(--accent-deep)]/15 px-2.5 py-1 text-[10px] font-semibold text-[var(--accent-deep)]">
            In flow
          </span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {TIMER_PRESETS.map((p) => {
          const active = presetId === p.id
          return (
            <motion.button
              key={p.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => applyPreset(p.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                active
                  ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                  : 'bg-[var(--surface)] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/60 hover:text-[var(--ink)] hover:ring-[var(--accent)]/35'
              }`}
            >
              {p.label}
            </motion.button>
          )
        })}
      </div>

      <div className="mb-4 text-center">
        <p
          className={`font-display text-[2.75rem] font-semibold leading-none tracking-tight tabular-nums text-[var(--ink)] sm:text-[3rem] ${
            running ? 'timer-glow' : ''
          }`}
        >
          {fmt(remaining)}
        </p>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={toggle}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-deep)] px-5 py-2 text-[12px] font-semibold text-white shadow-md"
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? 'Pause' : 'Start'}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-4 py-2 text-[12px] font-medium text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/60 hover:text-[var(--ink)]"
        >
          <RotateCcw size={14} />
          Reset
        </motion.button>
      </div>

      {canLog && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={manualLog}
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-2 text-[11px] font-medium text-[var(--ink)] ring-1 ring-[var(--page-edge)]/55 transition hover:ring-[var(--accent)]/40"
        >
          <Check size={13} />
          Log session to Focus Tracker
        </motion.button>
      )}

      {loggedFlash && (
        <p className="mt-2 text-center text-[11px] font-semibold text-[var(--accent-deep)]">
          Logged to today&apos;s Focus pixel
        </p>
      )}

      <p className="mt-2 text-center text-[10px] font-medium text-[var(--ink-soft)]">
        25m / 50m sessions auto-log when finished
      </p>
    </section>
  )
}

export default function FocusTimer({ onOpen }) {
  return <FocusTimerBadge onOpen={onOpen} />
}
