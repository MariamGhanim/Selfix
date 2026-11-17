import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
  /** Seconds of this session already written to Logged today (avoids double-count). */
  const [loggedElapsed, setLoggedElapsed] = useState(0)
  const endAt = useRef(null)
  const loggedElapsedRef = useRef(0)
  const presetIdRef = useRef(presetId)
  const remainingRef = useRef(remaining)
  const runningRef = useRef(running)

  useEffect(() => {
    presetIdRef.current = presetId
  }, [presetId])

  useEffect(() => {
    remainingRef.current = remaining
  }, [remaining])

  useEffect(() => {
    runningRef.current = running
  }, [running])

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

  const liveRemainingSeconds = useCallback(() => {
    if (runningRef.current && endAt.current) {
      return Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
    }
    return Math.max(0, remainingRef.current)
  }, [])

  const elapsedSeconds = useCallback(() => {
    const p = TIMER_PRESETS.find((x) => x.id === presetIdRef.current) || TIMER_PRESETS[0]
    return Math.max(0, p.seconds - liveRemainingSeconds())
  }, [liveRemainingSeconds])

  /** Log only the unlogged portion of elapsed focus time. */
  const logElapsedDelta = useCallback(() => {
    const p = TIMER_PRESETS.find((x) => x.id === presetIdRef.current) || TIMER_PRESETS[0]
    if (!FOCUS_PRESET_IDS.has(p.id)) return 0

    const elapsed = elapsedSeconds()
    const unlogged = Math.max(0, elapsed - loggedElapsedRef.current)
    if (unlogged <= 0) return 0

    const mins = Math.max(1, Math.round(unlogged / 60))
    logFocusMinutes(mins)
    loggedElapsedRef.current = elapsed
    setLoggedElapsed(elapsed)
    return mins
  }, [elapsedSeconds, logFocusMinutes])

  const applyPreset = useCallback((id) => {
    const p = TIMER_PRESETS.find((x) => x.id === id) || TIMER_PRESETS[0]
    setPresetId(p.id)
    setRemaining(p.seconds)
    setRunning(false)
    endAt.current = null
    loggedElapsedRef.current = 0
    setLoggedElapsed(0)
  }, [])

  const tick = useCallback(() => {
    if (!endAt.current) return
    const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
    setRemaining(left)
    if (left <= 0) {
      setRunning(false)
      endAt.current = null
      playChime()
      logElapsedDelta()
    }
  }, [logElapsedDelta])

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [running, tick])

  const toggle = useCallback(() => {
    if (running) {
      // Freeze remaining at the live value so pause keeps accurate elapsed.
      const left = liveRemainingSeconds()
      setRemaining(left)
      remainingRef.current = left
      setRunning(false)
      endAt.current = null
      return
    }
    if (remaining <= 0) {
      const p = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
      setRemaining(p.seconds)
      remainingRef.current = p.seconds
      endAt.current = Date.now() + p.seconds * 1000
      loggedElapsedRef.current = 0
      setLoggedElapsed(0)
    } else {
      endAt.current = Date.now() + remaining * 1000
    }
    setRunning(true)
  }, [liveRemainingSeconds, presetId, remaining, running])

  const reset = useCallback(() => {
    const p = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
    setRunning(false)
    endAt.current = null
    setRemaining(p.seconds)
    remainingRef.current = p.seconds
    loggedElapsedRef.current = 0
    setLoggedElapsed(0)
  }, [presetId])

  const manualLog = useCallback(() => {
    logElapsedDelta()
  }, [logElapsedDelta])

  const activePreset = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
  const displayRemaining =
    running && endAt.current
      ? Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      : remaining
  const displayElapsed = Math.max(0, activePreset.seconds - displayRemaining)
  const canLog = FOCUS_PRESET_IDS.has(presetId) && displayElapsed > loggedElapsed

  const value = useMemo(
    () => ({
      presetId,
      remaining,
      running,
      loggedFlash,
      canLog,
      applyPreset,
      toggle,
      reset,
      manualLog,
      format,
    }),
    [applyPreset, canLog, loggedFlash, manualLog, presetId, remaining, reset, running, toggle],
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
      className={`inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-sm shadow-md backdrop-blur transition hover:scale-[1.02] sm:h-auto sm:min-h-0 sm:gap-1.5 sm:px-3 sm:py-1.5 ${
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

/** Slim timer bar — shares state with the header badge via FocusTimerProvider. */
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
      className="relative z-20 mb-2 rounded-2xl bg-[var(--surface)]/90 px-2.5 py-2 ring-1 ring-[var(--page-edge)]/50"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {TIMER_PRESETS.map((p) => {
            const active = presetId === p.id
            const short =
              p.id === 'focus25'
                ? '25m'
                : p.id === 'deep50'
                  ? '50m'
                  : p.id === 'break5'
                    ? '5m'
                    : '15m'
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`rounded-full px-2 py-1 text-[10px] font-semibold transition-colors duration-150 ${
                  active
                    ? 'bg-[var(--accent-deep)] text-white'
                    : 'bg-[var(--accent-glow)]/50 text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {short}
              </button>
            )
          })}
        </div>

        <p
          className={`ml-auto font-display text-lg font-semibold tabular-nums tracking-tight text-[var(--ink)] sm:text-xl ${
            running ? 'timer-glow' : ''
          }`}
        >
          {fmt(remaining)}
        </p>

        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-[var(--accent-deep)] px-2.5 text-[11px] font-semibold text-white"
          aria-label={running ? 'Pause timer' : 'Start timer'}
        >
          {running ? <Pause size={13} /> : <Play size={13} />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/55 hover:text-[var(--ink)]"
          aria-label="Reset timer"
        >
          <RotateCcw size={13} />
        </button>
        {canLog && (
          <button
            type="button"
            onClick={manualLog}
            className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-[10px] font-medium text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/55 hover:text-[var(--ink)]"
            title="Log elapsed focus time to today"
          >
            <Check size={12} />
            Log
          </button>
        )}
      </div>
      {loggedFlash && (
        <p className="mt-1.5 text-[10px] font-semibold text-[var(--accent-deep)]">
          Logged to today&apos;s Focus pixel
        </p>
      )}
    </section>
  )
}

export default function FocusTimer({ onOpen }) {
  return <FocusTimerBadge onOpen={onOpen} />
}
