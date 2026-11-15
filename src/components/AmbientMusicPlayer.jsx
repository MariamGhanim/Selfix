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

const MAX_SKIP_TRIES = AMBIENT_TRACKS.length

export default function AmbientMusicPlayer() {
  const audioRef = useRef(null)
  const wantPlayRef = useRef(false)
  const skipTriesRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.55)
  const [openList, setOpenList] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  const track = AMBIENT_TRACKS[index] || AMBIENT_TRACKS[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return

    setUnavailable(false)
    audio.pause()
    audio.src = track.url
    audio.load()

    const onCanPlay = () => {
      skipTriesRef.current = 0
      if (wantPlayRef.current) {
        audio.play().catch(() => {
          wantPlayRef.current = false
          setPlaying(false)
        })
      }
    }

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      wantPlayRef.current = true
      setPlaying(true)
      setIndex((i) => (i + 1) % AMBIENT_TRACKS.length)
    }

    const onError = () => {
      skipTriesRef.current += 1
      if (skipTriesRef.current >= MAX_SKIP_TRIES) {
        wantPlayRef.current = false
        setPlaying(false)
        setUnavailable(true)
        return
      }
      setIndex((i) => (i + 1) % AMBIENT_TRACKS.length)
    }

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [track?.id, track?.url])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
    audio.muted = muted
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
    wantPlayRef.current = true
    setUnavailable(false)
    audio.play().catch(() => {
      wantPlayRef.current = false
      setPlaying(false)
      setUnavailable(true)
    })
  }

  const stop = () => {
    const audio = audioRef.current
    if (!audio) return
    wantPlayRef.current = false
    audio.pause()
    audio.currentTime = 0
    setPlaying(false)
  }

  const toggleMute = () => setMuted((m) => !m)

  const goTo = (nextIndex) => {
    skipTriesRef.current = 0
    setUnavailable(false)
    wantPlayRef.current = true
    setPlaying(true)
    setIndex(nextIndex)
  }

  const prev = () => goTo((index - 1 + AMBIENT_TRACKS.length) % AMBIENT_TRACKS.length)
  const next = () => goTo((index + 1) % AMBIENT_TRACKS.length)

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
        zIndex: 9999,
        width: expanded ? 'min(calc(100vw - 1.75rem), 17rem)' : 'auto',
        pointerEvents: 'auto',
      }}
    >
      <audio ref={audioRef} preload="metadata" playsInline />

      {!expanded && (
        <div
          className="inline-flex items-center gap-0.5 rounded-full border border-[var(--page-edge)] bg-[var(--surface)] p-1 shadow-lg backdrop-blur-md"
          style={{ boxShadow: '0 8px 22px var(--shadow)' }}
          title={unavailable ? 'Audio unavailable' : `${track.title} — open player`}
        >
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:scale-105 ${
              playing ? 'bg-[var(--accent-deep)] animate-pulse' : 'bg-[var(--accent)]'
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
          className="rounded-2xl border border-[var(--page-edge)] bg-[var(--surface)] backdrop-blur-md"
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
                  : `Track ${index + 1}/${AMBIENT_TRACKS.length}`}
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
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const nextVol = Number(e.target.value)
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
