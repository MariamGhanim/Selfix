import { useEffect, useMemo, useState } from 'react'
import {
  Apple,
  BookOpen,
  Candy,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Dumbbell,
  GlassWater,
  MapPin,
  Moon,
  Pill,
  Settings,
  Smile,
  Sparkles,
  Star,
  Target,
  Zap,
} from 'lucide-react'
import ThemeToggle from '../ThemeToggle'
import FocusTimer from '../FocusTimer'
import SettingsModal from '../Settings/SettingsModal'
import PageFlipStage, { flipToPage } from './PageFlipStage'
import { TRACKERS } from '../../data/trackers'
import { useJournal } from '../../context/JournalContext'

const ICONS = {
  Star,
  Zap,
  Droplets,
  Apple,
  Candy,
  GlassWater,
  Moon,
  Target,
  Dumbbell,
  Smile,
  MapPin,
  CheckSquare,
  Pill,
  BookOpen,
  Sparkles,
}

export default function Book() {
  const { year, setYear, profile } = useJournal()
  const [pageIndex, setPageIndex] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const today = useMemo(() => {
    const d = new Date()
    return { month: d.getMonth(), day: d.getDate() }
  }, [])
  const [selectedDay, setSelectedDay] = useState(today)

  const go = (next) => {
    if (next < 0 || next >= TRACKERS.length || next === pageIndex) return
    flipToPage(next, next > pageIndex ? 1 : -1)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches?.('input, textarea')) return
      if (e.key === 'ArrowRight' && pageIndex < TRACKERS.length - 1) {
        flipToPage(pageIndex + 1, 1)
      }
      if (e.key === 'ArrowLeft' && pageIndex > 0) {
        flipToPage(pageIndex - 1, -1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pageIndex])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden px-3 py-2 sm:px-5 sm:py-3">
      <header className="mb-1.5 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur">
            <span className="font-display text-[var(--accent-deep)]">Selfix</span>
            {profile.displayName && profile.displayName !== 'Selfix' ? (
              <span className="text-[var(--ink-soft)]"> · {profile.displayName}</span>
            ) : null}
          </div>
          <div className="inline-flex items-center rounded-full bg-white/85 px-1.5 py-0.5 shadow-md">
            <button
              type="button"
              onClick={() => setYear(year - 1)}
              className="rounded-full p-1 hover:bg-[var(--accent-glow)]"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="min-w-[3.5rem] text-center font-display text-sm font-semibold">
              {year}
            </span>
            <button
              type="button"
              onClick={() => setYear(year + 1)}
              className="rounded-full p-1 hover:bg-[var(--accent-glow)]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FocusTimer />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="rounded-full bg-white/85 p-2 text-[var(--ink-soft)] shadow-md backdrop-blur transition hover:bg-white hover:text-[var(--ink)]"
            title="Account settings"
            aria-label="Account settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <div
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-visible"
        style={{ maxHeight: '88vh', width: '95vw' }}
      >
        <div className="relative z-20 flex shrink-0 justify-center gap-0.5 px-4 sm:gap-1 sm:px-8">
          {TRACKERS.map((t, i) => {
            const TabIcon = ICONS[t.icon] || Star
            const active = i === pageIndex
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => go(i)}
                title={t.title}
                className={`relative flex items-center gap-1 rounded-t-xl px-1.5 pb-1.5 pt-1 text-[9px] font-bold transition sm:px-2 sm:text-[10px] ${
                  active
                    ? 'translate-y-0 text-white shadow-md'
                    : '-translate-y-0.5 text-[var(--ink)] opacity-90 hover:opacity-100'
                }`}
                style={{
                  background: active ? t.tabColor : `${t.tabColor}99`,
                  marginBottom: active ? 0 : 2,
                }}
              >
                <TabIcon size={11} className="hidden sm:block" />
                <span className="max-w-[3rem] truncate sm:max-w-none">{t.tab}</span>
              </button>
            )
          })}
        </div>

        <div className="book-shadow relative flex min-h-0 flex-1 overflow-hidden rounded-b-[28px] rounded-t-[18px] border border-white/50">
          <div className="pointer-events-none absolute -left-1 top-3 bottom-3 z-40 w-2 rounded-l-md bg-[var(--page-edge)] opacity-80" />
          <div className="pointer-events-none absolute -left-2 top-5 bottom-5 z-40 w-2 rounded-l-md bg-[var(--accent-soft)] opacity-50" />
          <div className="pointer-events-none absolute -right-1 top-3 bottom-3 z-40 w-2 rounded-r-md bg-[var(--page-edge)] opacity-80" />
          <div className="pointer-events-none absolute -right-2 top-5 bottom-5 z-40 w-2 rounded-r-md bg-[var(--accent-soft)] opacity-50" />

          <div className="relative flex min-h-0 w-full flex-1">
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-6 -translate-x-1/2"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.07), rgba(0,0,0,0.14) 45%, rgba(255,255,255,0.25) 50%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.05))',
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-[2px] -translate-x-1/2"
              style={{ background: 'var(--spine)', opacity: 0.55 }}
            />

            <PageFlipStage
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </div>
        </div>

        <div className="mt-1.5 flex shrink-0 items-center justify-between px-1">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => go(pageIndex - 1)}
            className="inline-flex items-center gap-1 rounded-2xl bg-white/85 px-3 py-1.5 text-xs font-bold shadow-md disabled:opacity-35"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <button
            type="button"
            disabled={pageIndex === TRACKERS.length - 1}
            onClick={() => go(pageIndex + 1)}
            className="inline-flex items-center gap-1 rounded-2xl bg-white/85 px-3 py-1.5 text-xs font-bold shadow-md disabled:opacity-35"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
