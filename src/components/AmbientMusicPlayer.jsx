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
import { AMBIENT_TRACKS } from '../data/ambientTracks'

const YT_API_SRC = 'https://www.youtube.com/iframe_api'

function loadYouTubeApi() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.YT?.Player) return Promise.resolve(window.YT)
  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT)
    }
    if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
      const tag = document.createElement('script')
      tag.src = YT_API_SRC
      tag.async = true
      document.head.appendChild(tag)
    }
  })
}

export default function AmbientMusicPlayer() {
  const playerRef = useRef(null)
  const hostRef = useRef(null)
  const playingRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [openList, setOpenList] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  const track = AMBIENT_TRACKS[index]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    let cancelled = false

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return
        playerRef.current = new YT.Player(hostRef.current, {
          height: '120',
          width: '200',
          videoId: AMBIENT_TRACKS[0].id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              if (!cancelled) setReady(true)
            },
            onStateChange: (e) => {
              if (cancelled) return
              if (e.data === 0) {
                playingRef.current = true
                setPlaying(true)
                setIndex((i) => (i + 1) % AMBIENT_TRACKS.length)
                return
              }
              if (e.data === 1 || e.data === 3) setPlaying(true)
              if (e.data === 2 || e.data === 5) setPlaying(false)
            },
            onError: () => setPlaying(false),
          },
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      try {
        playerRef.current?.destroy?.()
      } catch {}
      playerRef.current = null
    }
  }, [mounted])

  useEffect(() => {
    const p = playerRef.current
    if (!ready || !p?.loadVideoById) return
    const id = AMBIENT_TRACKS[index].id
    if (playingRef.current) {
      p.loadVideoById({ videoId: id })
    } else {
      p.cueVideoById({ videoId: id })
    }
  }, [index, ready])

  const togglePlay = (e) => {
    e?.stopPropagation?.()
    const p = playerRef.current
    if (!p) return
    const state = p.getPlayerState?.()
    if (state === 1 || state === 3) {
      p.pauseVideo()
      setPlaying(false)
    } else {
      p.playVideo()
      setPlaying(true)
    }
  }

  const stop = () => {
    const p = playerRef.current
    if (!p) return
    p.stopVideo()
    setPlaying(false)
  }

  const toggleMute = () => {
    const p = playerRef.current
    if (!p) return
    if (muted) {
      p.unMute()
      setMuted(false)
    } else {
      p.mute()
      setMuted(true)
    }
  }

  const goTo = (nextIndex) => {
    playingRef.current = true
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
    <>
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: 200,
          height: 120,
          overflow: 'hidden',
          opacity: 0,
        }}
        aria-hidden
      >
        <div ref={hostRef} id="ambient-yt-player" />
      </div>

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
        {!expanded && (
          <div
            className="inline-flex items-center gap-0.5 rounded-full border border-[var(--page-edge)] bg-[var(--surface)] p-1 shadow-lg backdrop-blur-md"
            style={{ boxShadow: '0 8px 22px var(--shadow)' }}
          >
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:scale-105 ${
                playing ? 'bg-[var(--accent-deep)] animate-pulse' : 'bg-[var(--accent)]'
              }`}
              title={`${track.title} — open player`}
            >
              <Music2 size={13} />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              disabled={!ready}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-glow)] text-[var(--accent-deep)] hover:bg-[var(--accent-soft)] disabled:opacity-40"
              title={playing ? 'Pause' : 'Play'}
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
                  {track.title}
                </p>
                <p className="text-[9px] font-semibold text-[var(--ink-soft)]">
                  Track {index + 1}/{AMBIENT_TRACKS.length}
                </p>
              </div>

              <button
                type="button"
                onClick={prev}
                disabled={!ready}
                className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)] disabled:opacity-40"
                title="Previous track"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                disabled={!ready}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-deep)] text-white shadow disabled:opacity-40"
                title={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>

              <button
                type="button"
                onClick={next}
                disabled={!ready}
                className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)] disabled:opacity-40"
                title="Next track"
              >
                <ChevronRight size={14} />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                disabled={!ready}
                className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)] disabled:opacity-40"
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <button
                type="button"
                onClick={stop}
                disabled={!ready}
                className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)] disabled:opacity-40"
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
      </div>
    </>,
    document.body,
  )
}
