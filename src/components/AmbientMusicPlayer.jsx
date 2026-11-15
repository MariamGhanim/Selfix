import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Music2,
  Pause,
  Play,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { AMBIENT_TRACKS } from '../data/audioTracks'

const TRACK_COUNT = AMBIENT_TRACKS.length

export default function AmbientMusicPlayer() {
  const audioRef = useRef(null)
  const indexRef = useRef(0)
  const wantPlayRef = useRef(false)
  const switchingRef = useRef(false)
  const skipTriesRef = useRef(0)
  const volumeRef = useRef(0.55)

  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.55)
  const [openList, setOpenList] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  const track = AMBIENT_TRACKS[index] || AMBIENT_TRACKS[0]

  const applyVolume = (vol, isMuted) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : Math.min(1, Math.max(0, vol))
    audio.muted = Boolean(isMuted)
  }

  const loadTrack = (nextIndex, { autoplay } = {}) => {
    const audio = audioRef.current
    const next = AMBIENT_TRACKS[nextIndex]
    if (!audio || !next) return

    indexRef.current = nextIndex
    setIndex(nextIndex)
    setUnavailable(false)
    if (autoplay) wantPlayRef.current = true

    switchingRef.current = true
    audio.pause()
    audio.loop = true
    audio.src = next.url
    audio.load()
  }

  const playCurrent = () => {
    const audio = audioRef.current
    if (!audio) return
    wantPlayRef.current = true
    setUnavailable(false)
    const p = audio.play()
    if (p && typeof p.then === 'function') {
      p.catch(() => {
        wantPlayRef.current = false
        setPlaying(false)
        setUnavailable(true)
      })
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Bind listeners once; keep audio element stable.
  useEffect(() => {
    if (!mounted) return
    const audio = audioRef.current
    if (!audio) return

    audio.preload = 'metadata'
    audio.loop = true
    applyVolume(volumeRef.current, false)

    const onCanPlay = () => {
      switchingRef.current = false
      skipTriesRef.current = 0
      // Only start playback after a deliberate load — avoid re-calling play()
      // on every buffer `canplay` while already playing (causes stutter).
      if (wantPlayRef.current && audio.paused) playCurrent()
    }

    const onPlaying = () => {
      switchingRef.current = false
      setPlaying(true)
    }

    const onPause = () => {
      // Ignore pauses caused by src swaps / load().
      if (switchingRef.current) return
      setPlaying(false)
    }

    const onError = () => {
      switchingRef.current = false
      skipTriesRef.current += 1
      if (skipTriesRef.current >= TRACK_COUNT) {
        wantPlayRef.current = false
        setPlaying(false)
        setUnavailable(true)
        return
      }
      const next = (indexRef.current + 1) % TRACK_COUNT
      loadTrack(next, { autoplay: wantPlayRef.current })
    }

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    // Initial src only — no autoplay.
    loadTrack(0, { autoplay: false })

    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      wantPlayRef.current = false
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only wiring
  }, [mounted])

  useEffect(() => {
    applyVolume(volume, muted)
  }, [volume, muted])

  const togglePlay = (e) => {
    e?.stopPropagation?.()
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      wantPlayRef.current = false
      audio.pause()
      setPlaying(false)
      return
    }
    playCurrent()
  }

  const stop = () => {
    const audio = audioRef.current
    if (!audio) return
    wantPlayRef.current = false
    switchingRef.current = false
    audio.pause()
    try {
      audio.currentTime = 0
    } catch {
      /* ignore */
    }
    setPlaying(false)
  }

  const toggleMute = () => setMuted((m) => !m)

  const goTo = (nextIndex) => {
    skipTriesRef.current = 0
    loadTrack(nextIndex, { autoplay: true })
  }

  const prev = () => goTo((indexRef.current - 1 + TRACK_COUNT) % TRACK_COUNT)
  const next = () => goTo((indexRef.current + 1) % TRACK_COUNT)

  const collapse = () => {
    setExpanded(false)
    setOpenList(false)
  }

  if (!mounted) return null

  return createPortal(
    <div
      className="ambient-music-player"
      style={{
        position: 'fixed',
        left: 14,
        bottom: 52,
        zIndex: 40,
        width: expanded ? 'min(calc(100vw - 1.75rem), 17rem)' : 'auto',
        pointerEvents: 'auto',
        contain: 'layout style',
      }}
    >
      <audio ref={audioRef} preload="metadata" playsInline loop />

      {!expanded && (
        <div
          className="inline-flex items-center gap-0.5 rounded-full border border-[var(--page-edge)] bg-[var(--surface)] p-1 shadow-lg"
          style={{ boxShadow: '0 8px 22px var(--shadow)' }}
          title={unavailable ? 'Audio unavailable' : `${track.title} — open player`}
        >
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:scale-105 ${
              playing ? 'bg-[var(--accent-deep)]' : 'bg-[var(--accent)]'
            }`}
            title={unavailable ? 'Audio unavailable' : `${track.title} — open player`}
          >
            <Music2 size={13} />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-glow)] text-[var(--accent-deep)] hover:bg-[var(--accent-soft)]"
            title={unavailable ? 'Audio unavailable' : playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          </button>
        </div>
      )}

      {expanded && (
        <div
          className="rounded-2xl border border-[var(--page-edge)] bg-[var(--surface)]"
          style={{ boxShadow: '0 12px 32px var(--shadow)' }}
        >
          <div className="flex items-center gap-1 px-2 py-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-glow)] text-[var(--accent-deep)]">
              <Music2 size={13} />
            </div>

            <div className="min-w-0 flex-1 px-0.5">
              <p className="truncate font-display text-[11px] font-semibold leading-tight text-[var(--ink)]">
                {unavailable ? 'Audio unavailable' : track.title}
              </p>
              <p className="text-[9px] font-semibold text-[var(--ink-soft)]">
                {unavailable
                  ? 'Try another track or check the file URL'
                  : `Track ${index + 1}/${TRACK_COUNT} · loops`}
              </p>
            </div>

            <button
              type="button"
              onClick={prev}
              className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
              title="Previous track"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-deep)] text-white shadow"
              title={unavailable ? 'Audio unavailable' : playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>

            <button
              type="button"
              onClick={next}
              className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
              title="Next track"
            >
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <button
              type="button"
              onClick={stop}
              className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
              title="Stop"
            >
              <Square size={12} />
            </button>

            <button
              type="button"
              onClick={() => setOpenList((o) => !o)}
              className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
              title="Playlist"
            >
              <ChevronDown size={14} className={`transition ${openList ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={collapse}
              className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
              title="Minimize"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-[var(--page-edge)]/50 px-3 py-1.5">
            <Volume2 size={12} className="shrink-0 text-[var(--ink-soft)]" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const nextVol = Number(e.target.value)
                volumeRef.current = nextVol
                applyVolume(nextVol, false)
                setVolume(nextVol)
                if (nextVol > 0 && muted) setMuted(false)
              }}
              className="h-1 w-full cursor-pointer accent-[var(--accent-deep)]"
              aria-label="Volume"
              title="Volume"
            />
          </div>

          {openList && (
            <ul className="max-h-40 space-y-0.5 overflow-y-auto border-t border-[var(--page-edge)]/60 px-1.5 py-1.5">
              {AMBIENT_TRACKS.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenList(false)
                      goTo(i)
                    }}
                    className={`w-full truncate rounded-xl px-2 py-1 text-left text-[10px] font-bold transition ${
                      i === index
                        ? 'bg-[var(--accent)] text-white'
                        : 'text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]'
                    }`}
                  >
                    {i + 1}. {t.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>,
    document.body,
  )
}
