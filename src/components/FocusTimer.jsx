import { useCallback, useEffect, useRef, useState } from 'react'
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

export default function FocusTimer() {
  const { getPanel, setPanel } = useJournal()
  const [open, setOpen] = useState(false)
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

  const applyPreset = (id) => {
    const p = TIMER_PRESETS.find((x) => x.id === id) || TIMER_PRESETS[0]
    setPresetId(p.id)
    setRemaining(p.seconds)
    setRunning(false)
    endAt.current = null
    sessionLogged.current = false
  }

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

  const toggle = () => {
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
  }

  const reset = () => {
    const p = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
    setRunning(false)
    endAt.current = null
    setRemaining(p.seconds)
    sessionLogged.current = false
  }

  const manualLog = () => {
    const p = TIMER_PRESETS.find((x) => x.id === presetId) || TIMER_PRESETS[0]
    if (!FOCUS_PRESET_IDS.has(p.id)) return
    logFocusMinutes(Math.round(p.seconds / 60))
  }

  const canLog = FOCUS_PRESET_IDS.has(presetId)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold shadow-md backdrop-blur transition ${
          running
            ? 'bg-[var(--accent-deep)] text-white animate-pulse'
            : 'bg-[var(--surface)] text-[var(--ink)] hover:scale-[1.02]'
        }`}
      >
        <Timer size={14} />
        <span className="font-display tabular-nums">{format(remaining)}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 rounded-3xl border border-[var(--page-edge)] bg-[var(--surface-strong)] p-4 shadow-2xl backdrop-blur">
          <p className="mb-2 font-display text-sm font-semibold text-[var(--ink)]">Focus Timer</p>
          <div className="mb-3 grid grid-cols-2 gap-1.5">
            {TIMER_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`rounded-2xl px-2 py-1.5 text-xs font-bold transition ${
                  presetId === p.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--accent-glow)] text-[var(--ink-soft)] hover:bg-[var(--accent-soft)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mb-3 text-center font-display text-3xl tabular-nums text-[var(--ink)]">
            {format(remaining)}
          </div>

          <div className="mb-2 flex justify-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-1 rounded-2xl bg-[var(--accent-deep)] px-4 py-2 text-sm font-bold text-white shadow"
            >
              {running ? <Pause size={14} /> : <Play size={14} />}
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-2xl bg-[var(--accent-glow)] px-3 py-2 text-sm font-bold text-[var(--ink-soft)]"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {canLog && (
            <button
              type="button"
              onClick={manualLog}
              className="mb-1 flex w-full items-center justify-center gap-1 rounded-2xl border border-[var(--page-edge)] bg-[var(--accent-glow)] px-3 py-2 text-[11px] font-bold text-[var(--ink)] transition hover:bg-[var(--accent-soft)]"
            >
              <Check size={13} />
              Log session to Focus Tracker
            </button>
          )}

          {loggedFlash && (
            <p className="text-center text-[10px] font-bold text-[var(--accent-deep)]">
              Logged to today&apos;s Focus pixel
            </p>
          )}

          <p className="mt-1 text-center text-[9px] text-[var(--ink-soft)]">
            25m / 50m sessions auto-log when the timer finishes
          </p>
        </div>
      )}
    </div>
  )
}
