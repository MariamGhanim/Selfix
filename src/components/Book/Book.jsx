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
      <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-auto px-4">
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
      <div className="safe-pt safe-px relative flex min-h-[100dvh] h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto px-2.5 py-2 sm:px-5 sm:py-3">
        <AmbientGlow />
        <header className="relative z-10 mb-1 flex shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="soft-shimmer flex min-h-11 shrink-0 items-center rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-bold shadow-md backdrop-blur sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
            >
              <span className="font-display text-[var(--accent-deep)]">Selfix Life</span>
              {profile.displayName && profile.displayName !== 'Selfix Life' ? (
                <span className="hidden text-[var(--ink-soft)] sm:inline"> · {profile.displayName}</span>
              ) : null}
            </motion.div>
            <div className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[var(--surface)] px-1 shadow-md backdrop-blur sm:min-h-0 sm:px-1.5 sm:py-0.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setYear(year - 1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-[var(--accent-glow)] sm:h-8 sm:w-8"
                aria-label="Previous year"
              >
                <ChevronLeft size={18} />
              </motion.button>
              <span className="min-w-[2.75rem] text-center font-display text-sm font-semibold sm:min-w-[3.5rem] sm:text-sm">
                {year}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setYear(year + 1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-[var(--accent-glow)] sm:h-8 sm:w-8"
                aria-label="Next year"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
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
              className={`inline-flex min-h-11 items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold shadow-md backdrop-blur transition sm:min-h-0 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] ${
                showInsights
                  ? 'bg-[var(--accent-deep)] text-white'
                  : 'bg-[var(--surface)] text-[var(--ink-soft)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]'
              }`}
              title="Insights Logbook"
              aria-label="Insights Logbook"
              aria-pressed={showInsights}
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">Logbook</span>
            </motion.button>
            <ThemeToggle />
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, rotate: 18 }}
              whileTap={{ scale: 0.92, rotate: 40 }}
              onClick={() => setSettingsOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink-soft)] shadow-md backdrop-blur transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] sm:h-9 sm:w-9"
              title="Settings"
              aria-label="Settings"
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </header>

        <div className="relative z-10 hidden shrink-0 sm:block">
          <DailyWhisper />
        </div>

        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col overflow-x-hidden sm:max-h-[min(88vh,100%)] sm:w-[min(95%,72rem)]">
          <div className="book-tabs-scroll relative z-20 flex shrink-0 justify-start gap-1 overflow-x-auto px-1 pb-0 sm:justify-center sm:gap-1 sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  className={`relative flex min-h-11 shrink-0 items-center gap-1.5 rounded-t-xl px-3 pb-2 pt-2 text-[11px] font-bold sm:min-h-0 sm:gap-1 sm:px-2 sm:pb-1.5 sm:pt-1 sm:text-[10px] ${
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
                  <TabIcon size={14} className="relative z-10 sm:h-[11px] sm:w-[11px]" />
                  <span className="relative z-10 whitespace-nowrap">{t.tab}</span>
                </motion.button>
              )
            })}
          </div>

          <motion.div
            layout
            className="open-book book-shadow paper-texture relative flex min-h-0 flex-1 overflow-hidden rounded-[20px] border border-[var(--cover)]/40 sm:rounded-b-[30px] sm:rounded-t-[20px]"
          >
            {/* Hardcover rim + page stack at the outer edges */}
            <div className="open-book__cover-edge" aria-hidden />
            <div
              className="pointer-events-none absolute -left-[3px] top-4 bottom-4 z-40 hidden w-[7px] rounded-l-[6px] md:block"
              style={{
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--cover) 80%, white), var(--cover-deep))',
                boxShadow: '2px 0 6px rgba(80,45,55,0.12)',
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-[3px] top-4 bottom-4 z-40 hidden w-[7px] rounded-r-[6px] md:block"
              style={{
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--cover) 80%, white), var(--cover-deep))',
                boxShadow: '-2px 0 6px rgba(80,45,55,0.12)',
              }}
              aria-hidden
            />

            {!showInsights && <div className="open-book__spine hidden md:block" aria-hidden />}

            <div className="relative z-10 flex min-h-0 w-full flex-1">
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

          <div className="book-bottom-nav mt-1 flex shrink-0 items-center justify-between gap-2 px-1 pb-[4.75rem] sm:mt-1.5 sm:pb-0">
            {showInsights ? (
              <>
                <span className="hidden text-[10px] font-medium text-[var(--ink-soft)] sm:inline">
                  Insights view
                </span>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowInsights(false)}
                  className="ml-auto inline-flex min-h-11 items-center gap-1 rounded-2xl bg-[var(--surface)] px-4 py-2.5 text-sm font-bold shadow-md backdrop-blur sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
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
                  className="inline-flex min-h-11 items-center gap-1 rounded-2xl bg-[var(--surface)] px-4 py-2.5 text-sm font-bold shadow-md backdrop-blur disabled:opacity-35 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:inline">Previous</span>
                </motion.button>
                <p className="text-xs font-medium text-[var(--ink-soft)] sm:text-[10px]">
                  {pageIndex + 1} / {trackers.length}
                </p>
                <motion.button
                  type="button"
                  disabled={pageIndex === trackers.length - 1}
                  whileHover={pageIndex === trackers.length - 1 ? undefined : { x: 2, scale: 1.02 }}
                  whileTap={pageIndex === trackers.length - 1 ? undefined : { scale: 0.96 }}
                  onClick={() => go(pageIndex + 1)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-2xl bg-[var(--surface)] px-4 py-2.5 text-sm font-bold shadow-md backdrop-blur disabled:opacity-35 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={18} />
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
