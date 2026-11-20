import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
import AdsterraNativeBanner from '../Ads/AdsterraNativeBanner'
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
  const tabsScrollRef = useRef(null)
  const tabBtnRefs = useRef([])

  const today = useMemo(() => {
    const d = new Date()
    return { month: d.getMonth(), day: d.getDate() }
  }, [])
  const maxYear = useMemo(() => new Date().getFullYear(), [])
  const [selectedDay, setSelectedDay] = useState(today)

  useEffect(() => {
    if (!trackers.length) return
    if (pageIndex >= trackers.length) setPageIndex(Math.max(0, trackers.length - 1))
  }, [trackers, pageIndex])

  useEffect(() => {
    if (showInsights) return
    const btn = tabBtnRefs.current[pageIndex]
    if (!btn) return
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [pageIndex, showInsights, trackers.length])

  const go = (next) => {
    if (next < 0 || next >= trackers.length) return
    const from = pageIndex
    const wasInsights = showInsights
    setShowInsights(false)
    if (next === from && !wasInsights) return
    // Update active tab UI immediately — don't wait for the page flip to finish.
    setPageIndex(next)
    if (wasInsights) return
    flipToPage(next, next > from ? 1 : -1, from)
  }

  const toggleInsights = () => setShowInsights((v) => !v)

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches?.('input, textarea')) return
      if (showInsights) return
      if (e.key === 'ArrowRight' && pageIndex < trackers.length - 1) {
        const next = pageIndex + 1
        setPageIndex(next)
        flipToPage(next, 1, pageIndex)
      }
      if (e.key === 'ArrowLeft' && pageIndex > 0) {
        const next = pageIndex - 1
        setPageIndex(next)
        flipToPage(next, -1, pageIndex)
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
      <div
        className={`safe-pt safe-px relative flex h-[100dvh] min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto py-1.5 sm:px-5 sm:py-3 ${
          showInsights ? 'px-2 sm:px-5' : 'px-1.5'
        }`}
      >
        <AmbientGlow />
        <header className="app-topbar relative z-[80] mb-1 flex w-full max-w-full shrink-0 flex-row items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="soft-shimmer flex h-9 min-w-0 items-center truncate rounded-full bg-[var(--surface)] px-2.5 text-xs font-bold shadow-md backdrop-blur sm:h-auto sm:min-h-0 sm:px-3 sm:py-1.5"
            >
              <span className="truncate font-display text-[var(--accent-deep)]">Selfix Life</span>
              {profile.displayName && profile.displayName !== 'Selfix Life' ? (
                <span className="hidden text-[var(--ink-soft)] sm:inline"> · {profile.displayName}</span>
              ) : null}
            </motion.div>
            <div className="inline-flex h-9 shrink-0 items-center rounded-full bg-[var(--surface)] px-0.5 shadow-md backdrop-blur sm:h-auto sm:min-h-0 sm:px-1.5 sm:py-0.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setYear(year - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--accent-glow)] sm:h-8 sm:w-8"
                aria-label="Previous year"
              >
                <ChevronLeft size={16} />
              </motion.button>
              <span className="min-w-[2.4rem] text-center font-display text-[13px] font-semibold sm:min-w-[3.5rem] sm:text-sm">
                {year}
              </span>
              <motion.button
                type="button"
                whileTap={year < maxYear ? { scale: 0.9 } : undefined}
                onClick={() => setYear(year + 1)}
                disabled={year >= maxYear}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent sm:h-8 sm:w-8"
                aria-label="Next year"
                title={
                  year >= maxYear
                    ? 'Future years unlock when they begin'
                    : 'Next year'
                }
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
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
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition sm:h-auto sm:w-auto sm:min-h-0 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] ${
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
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
              <Link
                to="/blog"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink-soft)] shadow-md backdrop-blur transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] sm:h-auto sm:w-auto sm:min-h-0 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] sm:font-semibold"
                title="Journal Guides · Blog"
                aria-label="Open journal guides blog"
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Guides</span>
              </Link>
            </motion.div>
            <ThemeToggle />
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, rotate: 18 }}
              whileTap={{ scale: 0.92, rotate: 40 }}
              onClick={() => setSettingsOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink-soft)] shadow-md backdrop-blur transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] sm:h-9 sm:w-9"
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

        <div className="relative z-10 mx-auto flex w-full max-w-full min-h-0 flex-1 flex-col overflow-x-hidden sm:max-h-[min(88vh,100%)] sm:w-[min(95%,72rem)] sm:max-w-7xl">
          <div
            className={`book-tabs-fade scroll-fade-x relative z-20 w-full max-w-full shrink-0 ${
              showInsights ? 'hidden sm:block' : ''
            }`}
          >
            <div
              ref={tabsScrollRef}
              className="book-tabs-scroll touch-scroll-x relative flex h-11 w-full items-end justify-start gap-1.5 px-2 pb-0 sm:h-9 sm:justify-center sm:gap-1 sm:px-8"
            >
              {trackers.map((t, i) => {
                const TabIcon = ICONS[t.icon] || Star
                const active = !showInsights && i === pageIndex
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabBtnRefs.current[i] = el
                    }}
                    type="button"
                    onClick={() => go(i)}
                    title={t.title}
                    className={`relative inline-flex h-11 min-w-[2.75rem] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-t-xl px-3.5 text-[11px] font-bold leading-none transition-colors duration-150 sm:h-7 sm:min-w-0 sm:gap-1 sm:px-2 sm:text-[10px] ${
                      active
                        ? 'z-[1] text-white shadow-sm'
                        : 'text-[var(--ink)] opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      background: active ? t.tabColor : `${t.tabColor}99`,
                    }}
                  >
                    <TabIcon size={13} className="relative z-10 shrink-0" aria-hidden />
                    <span className="relative z-10 whitespace-nowrap">{t.tab}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            className={`open-book book-shadow paper-texture relative flex min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-[16px] border border-[var(--cover)]/40 sm:rounded-b-[30px] sm:rounded-t-[20px] ${
              showInsights ? 'open-book--insights' : ''
            }`}
          >
            {/* Hardcover rim, stacked paper edges, spine + ribbon */}
            <div className="open-book__cover-edge" aria-hidden />
            <div className="open-book__page-stack open-book__page-stack--left hidden md:block" aria-hidden />
            <div className="open-book__page-stack open-book__page-stack--right hidden md:block" aria-hidden />
            {!showInsights && (
              <>
                <div className="open-book__spine hidden md:block" aria-hidden />
                <div className="open-book__ribbon hidden md:block" aria-hidden />
              </>
            )}

            <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1">
              {showInsights ? (
                <div className="relative z-10 min-h-0 w-full min-w-0 flex-1 overflow-hidden">
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
          </div>

          <div className="book-bottom-nav mt-1 flex shrink-0 items-center justify-between gap-2 px-1 sm:mt-1.5">
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

          <AdsterraNativeBanner
            refreshToken={
              showInsights ? 'insights' : trackers[pageIndex]?.id || String(pageIndex)
            }
          />

          <div className="adsterra-footer-gap pb-[max(3.4rem,calc(env(safe-area-inset-bottom)+2.6rem))] sm:pb-0">
            <LegalFooter />
          </div>
        </div>
      </div>
    </FocusTimerProvider>
  )
}
