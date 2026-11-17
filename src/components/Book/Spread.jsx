import { memo, useCallback, useEffect, useState } from 'react'
import {
  Apple,
  Bike,
  BookOpen,
  Brain,
  Camera,
  Candy,
  CheckSquare,
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
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  Wallet,
  Zap,
} from 'lucide-react'
import PixelGrid from '../Trackers/PixelGrid'
import Legend from '../Trackers/Legend'
import RightPage from './RightPage'
import MobileLogSheet from './MobileLogSheet'
import { useJournal } from '../../context/JournalContext'

function formatSelectedDate(year, month, day) {
  const date = new Date(year, month, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

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

function useIsMobileBook() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

function Spread({ tracker, selectedDay, onSelectDay }) {
  const { year, getPixel } = useJournal()
  const Icon = ICONS[tracker.icon] || Star
  const isMobile = useIsMobileBook()
  const [sheetOpen, setSheetOpen] = useState(false)

  const selectedLabel =
    selectedDay != null
      ? formatSelectedDate(year, selectedDay.month, selectedDay.day)
      : null

  const selectedValue =
    selectedDay != null ? getPixel(tracker.id, selectedDay.month, selectedDay.day) : null
  const selectedLevel =
    selectedValue != null
      ? tracker.levels.find((level) => level.value === selectedValue)
      : null

  useEffect(() => {
    setSheetOpen(false)
  }, [tracker.id])

  const openLog = useCallback(() => {
    if (selectedDay) setSheetOpen(true)
  }, [selectedDay])

  const closeLog = useCallback(() => {
    setSheetOpen(false)
  }, [])

  const handleSelectDay = useCallback(
    (day) => {
      // Select / paint only — never auto-open the log sheet on pixel tap.
      // Users open the log explicitly via the "Open log" button.
      onSelectDay?.(day)
    },
    [onSelectDay],
  )

  const feed = (
    <section className="book-page--left flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden md:border-0 md:px-6 md:pt-3 md:pb-2 lg:px-8">
      {/* Shared center-aligned header — same stack on every tracker tab */}
      <header className="left-page-header mx-auto flex w-full max-w-full shrink-0 flex-col items-center gap-1 px-2 pt-1 text-center sm:max-w-xl sm:gap-2 sm:px-3 sm:pt-2 md:gap-2 md:px-2 md:pt-1">
        <div className="flex w-full flex-col items-center gap-1">
          <div
            className="left-page-header__icon inline-flex h-8 w-8 items-center justify-center rounded-full md:h-7 md:w-7"
            style={{
              background: `color-mix(in srgb, ${tracker.tabColor} 28%, #fffaf7)`,
              color: tracker.tabColor,
              boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tracker.tabColor} 35%, transparent)`,
            }}
            aria-hidden
          >
            <Icon size={isMobile ? 15 : 13} strokeWidth={2.25} />
          </div>
          <div className="min-w-0 max-w-full px-1">
            <h2 className="font-display text-[1.02rem] font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-[0.95rem]">
              {tracker.title}
            </h2>
            <p className="mt-0.5 line-clamp-1 text-[11px] font-medium leading-snug text-[var(--ink-soft)] md:text-[10px]">
              {tracker.subtitle}
            </p>
          </div>
        </div>

        <div className="left-page-header__legend scroll-fade-x scroll-fade-x--paper w-full min-w-0">
          <div className="touch-scroll-x flex w-full items-center justify-start gap-1.5 px-1 pb-0.5 sm:flex-wrap sm:justify-center sm:overflow-visible">
            <Legend trackerId={tracker.id} levels={tracker.levels} />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-1.5">
          {selectedLabel ? (
            <div className="date-anchor w-fit max-w-full rounded-full px-3 py-1 md:px-3 md:py-0.5">
              <p className="date-anchor__stamp text-center text-[13px] font-medium sm:text-sm">
                {selectedLabel}
              </p>
            </div>
          ) : (
            <div className="h-[1.25rem] w-1 shrink-0 md:h-[1.5rem]" aria-hidden />
          )}

          {isMobile && selectedDay && (
            <div className="day-log-bar mx-1 flex w-full max-w-sm items-center gap-2.5 rounded-2xl px-2.5 py-2">
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                  {selectedLevel ? 'Logged' : 'Today'}
                </p>
                <p className="mt-0.5 truncate text-[12px] font-medium leading-snug text-[var(--ink)]">
                  {selectedLevel ? selectedLevel.label : 'No entry yet'}
                </p>
              </div>
              <button
                type="button"
                onClick={openLog}
                className="open-log-btn inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12px] font-semibold tracking-wide"
              >
                <BookOpen size={14} strokeWidth={2.1} aria-hidden />
                {selectedLevel ? 'Edit log' : 'Open log'}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="page-section-divider shrink-0" aria-hidden>
        <span className="page-section-divider__motif">✦ · ✦</span>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden pb-1 md:pb-0.5">
        <div className="h-full min-h-0 w-full min-w-0 md:flex md:items-center md:justify-center">
          <PixelGrid
            trackerId={tracker.id}
            levels={tracker.levels}
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
            tapOpensLog={isMobile}
          />
        </div>
      </div>
    </section>
  )

  return (
    <>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden p-1.5 sm:p-3 md:grid md:grid-cols-2 md:gap-0 md:p-0 md:pt-1 md:pb-1">
        {feed}

        <section className="book-page--right hidden min-h-0 flex-col overflow-hidden md:flex md:h-full md:min-h-0 md:pl-6 md:pr-5">
          <RightPage tracker={tracker} selectedDay={selectedDay} />
        </section>
      </div>

      <MobileLogSheet
        open={isMobile && sheetOpen && typeof onSelectDay === 'function'}
        onClose={closeLog}
        tracker={tracker}
        selectedDay={selectedDay}
      />
    </>
  )
}

export default memo(Spread)
