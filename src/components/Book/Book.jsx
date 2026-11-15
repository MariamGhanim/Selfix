import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Apple,
  Bike,
  BookOpen,
  Brain,
  Camera,
  Candy,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Droplets,
  Dumbbell,
  Flame,
  GlassWater,
  Heart,
  Leaf,
  MapPin,
  Moon,
  MoonStar,
  Music,
  Palette,
  Pill,
  Settings,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  Wallet,
  Zap,
} from 'lucide-react'
import ThemeToggle from '../ThemeToggle'
import FocusTimer, { FocusTimerProvider } from '../FocusTimer'
import SettingsModal from '../Settings/SettingsModal'
import LegalFooter from '../Legal/LegalFooter'
import AmbientGlow from '../AmbientGlow'
import DailyWhisper from '../DailyWhisper'
import InsightsDashboard from '../Insights/InsightsDashboard'
import PageFlipStage, { flipToPage } from './PageFlipStage'
import { useJournal } from '../../context/JournalContext'

const ICONS = {
  Star,
  Zap,
  Droplets,
  Apple,
  Candy,
  GlassWater,
  Moon,
  MoonStar,
  Target,
  Dumbbell,
  Smile,
  MapPin,
  CheckSquare,
  Pill,
  BookOpen,
  Sparkles,
  Sun,
  Heart,
  Leaf,
  Coffee,
  Music,
  Camera,
  Wallet,
  Bike,
  Palette,
  Brain,
  Flame,
}

export default function Book() {
  const { year, setYear, profile, activeTrackers } = useJournal()
  const trackers = activeTrackers?.length ? activeTrackers : []
  const [pageIndex, setPageIndex] = useState(0)
  const [showInsights, setShowInsights] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const today = useMemo(() => {
    const d = new Date()
    return { month: d.getMonth(), day: d.getDate() }
  }, [])
  const [selectedDay, setSelectedDay] = useState(today)

  useEffect(() => {
    if (!trackers.length) return
    if (pageIndex >= trackers.length) setPageIndex(Math.max(0, trackers.length - 1))
  }, [trackers, pageIndex])

  const go = (next) => {
    if (next < 0 || next >= trackers.length) return
    setShowInsights(false)
    if (next === pageIndex && !showInsights) return
    if (showInsights) {
      setPageIndex(next)
      return
    }
    flipToPage(next, next > pageIndex ? 1 : -1)
  }

  const toggleInsights = () => setShowInsights((v) => !v)

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches?.('input, textarea')) return
      if (showInsights) return
      if (e.key === 'ArrowRight' && pageIndex < trackers.length - 1) {
        flipToPage(pageIndex + 1, 1)
      }
      if (e.key === 'ArrowLeft' && pageIndex > 0) {
        flipToPage(pageIndex - 1, -1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pageIndex, trackers.length, showInsights])

  if (!trackers.length) {
    return (
      <div className="flex h-screen w-screen items-center justify-center px-4">
        <div className="quote-banner max-w-md rounded-[1.5rem] px-5 py-6 text-center ring-1 ring-[var(--accent-soft)]/50">
          <p className="font-display text-lg font-semibold text-[var(--ink)]">No pages visible</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Open Settings and enable at least one tracker page.
          </p>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="mt-4 rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-semibold text-white"
          >
            Open Settings
          </button>
          <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
      </div>
    )
  }

  return (
    <FocusTimerProvider>
      <div className="relative flex h-screen w-screen flex-col overflow-hidden px-3 py-2 sm:px-5 sm:py-3">
        <AmbientGlow />
        <header className="relative z-10 mb-1 flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="soft-shimmer rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur"
            >
              <span className="font-display text-[var(--accent-deep)]">Selfix</span>
              {profile.displayName && profile.displayName !== 'Selfix' ? (
                <span className="text-[var(--ink-soft)]"> · {profile.displayName}</span>
              ) : null}
            </motion.div>
            <div className="inline-flex items-center rounded-full bg-[var(--surface)] px-1.5 py-0.5 shadow-md backdrop-blur">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setYear(year - 1)}
                className="rounded-full p-1 hover:bg-[var(--accent-glow)]"
              >
                <ChevronLeft size={14} />
              </motion.button>
              <span className="min-w-[3.5rem] text-center font-display text-sm font-semibold">
                {year}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setYear(year + 1)}
                className="rounded-full p-1 hover:bg-[var(--accent-glow)]"
              >
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FocusTimer
              onOpen={() => {
                const focusIndex = trackers.findIndex((t) => t.id === 'focus')
                if (focusIndex >= 0) go(focusIndex)
              }}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleInsights}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold shadow-md backdrop-blur transition sm:px-3 ${
                showInsights
                  ? 'bg-[var(--accent-deep)] text-white'
                  : 'bg-[var(--surface)] text-[var(--ink-soft)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]'
              }`}
              title="Insights Logbook"
              aria-label="Insights Logbook"
              aria-pressed={showInsights}
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">Logbook</span>
            </motion.button>
            <ThemeToggle />
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, rotate: 18 }}
              whileTap={{ scale: 0.92, rotate: 40 }}
              onClick={() => setSettingsOpen(true)}
              className="rounded-full bg-[var(--surface)] p-2 text-[var(--ink-soft)] shadow-md backdrop-blur transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
              title="Settings"
              aria-label="Settings"
            >
              <Settings size={16} />
            </motion.button>
          </div>
        </header>

        <div className="relative z-10 shrink-0">
          <DailyWhisper />
        </div>

        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

        <div
          className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-visible"
          style={{ maxHeight: '88vh', width: '95vw' }}
        >
          <div className="relative z-20 flex shrink-0 justify-center gap-0.5 px-4 sm:gap-1 sm:px-8">
            {trackers.map((t, i) => {
              const TabIcon = ICONS[t.icon] || Star
              const active = !showInsights && i === pageIndex
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  layout
                  whileHover={active ? undefined : { y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => go(i)}
                  title={t.title}
                  className={`relative flex items-center gap-1 rounded-t-xl px-1.5 pb-1.5 pt-1 text-[9px] font-bold sm:px-2 sm:text-[10px] ${
                    active
                      ? 'translate-y-0 text-white shadow-md'
                      : '-translate-y-0.5 text-[var(--ink)] opacity-90'
                  }`}
                  style={{
                    background: active ? t.tabColor : `${t.tabColor}99`,
                    marginBottom: active ? 0 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-glow"
                      className="pointer-events-none absolute inset-0 rounded-t-xl"
                      style={{
                        boxShadow: `0 -4px 18px ${t.tabColor}66, inset 0 1px 0 rgba(255,255,255,0.35)`,
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <TabIcon size={11} className="relative z-10 hidden sm:block" />
                  <span className="relative z-10 max-w-[3rem] truncate sm:max-w-none">{t.tab}</span>
                </motion.button>
              )
            })}
          </div>

          <motion.div
            layout
            className="book-shadow paper-texture relative flex min-h-0 flex-1 overflow-hidden rounded-b-[28px] rounded-t-[18px] border border-[var(--page-edge)]"
          >
            <div className="pointer-events-none absolute -left-1 top-3 bottom-3 z-40 w-2 rounded-l-md bg-[var(--page-edge)] opacity-80" />
            <div className="pointer-events-none absolute -left-2 top-5 bottom-5 z-40 w-2 rounded-l-md bg-[var(--accent-soft)] opacity-50" />
            <div className="pointer-events-none absolute -right-1 top-3 bottom-3 z-40 w-2 rounded-r-md bg-[var(--page-edge)] opacity-80" />
            <div className="pointer-events-none absolute -right-2 top-5 bottom-5 z-40 w-2 rounded-r-md bg-[var(--accent-soft)] opacity-50" />

            <div className="relative flex min-h-0 w-full flex-1">
              {!showInsights && (
                <>
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
                </>
              )}

              {showInsights ? (
                <div className="relative z-10 min-h-0 w-full flex-1 overflow-hidden">
                  <InsightsDashboard />
                </div>
              ) : (
                <PageFlipStage
                  pageIndex={pageIndex}
                  onPageChange={setPageIndex}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  trackers={trackers}
                />
              )}
            </div>
          </motion.div>

          <div className="mt-1.5 flex shrink-0 items-center justify-between px-1">
            {showInsights ? (
              <>
                <span className="text-[10px] font-medium text-[var(--ink-soft)]">Insights view</span>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowInsights(false)}
                  className="inline-flex items-center gap-1 rounded-2xl bg-[var(--surface)] px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur"
                >
                  Back to journal
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  type="button"
                  disabled={pageIndex === 0}
                  whileHover={pageIndex === 0 ? undefined : { x: -2, scale: 1.02 }}
                  whileTap={pageIndex === 0 ? undefined : { scale: 0.96 }}
                  onClick={() => go(pageIndex - 1)}
                  className="inline-flex items-center gap-1 rounded-2xl bg-[var(--surface)] px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur disabled:opacity-35"
                >
                  <ChevronLeft size={14} /> Previous
                </motion.button>
                <p className="hidden text-[10px] font-medium text-[var(--ink-soft)] sm:block">
                  {pageIndex + 1} / {trackers.length}
                </p>
                <motion.button
                  type="button"
                  disabled={pageIndex === trackers.length - 1}
                  whileHover={pageIndex === trackers.length - 1 ? undefined : { x: 2, scale: 1.02 }}
                  whileTap={pageIndex === trackers.length - 1 ? undefined : { scale: 0.96 }}
                  onClick={() => go(pageIndex + 1)}
                  className="inline-flex items-center gap-1 rounded-2xl bg-[var(--surface)] px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur disabled:opacity-35"
                >
                  Next <ChevronRight size={14} />
                </motion.button>
              </>
            )}
          </div>

          <LegalFooter />
        </div>
      </div>
    </FocusTimerProvider>
  )
}
