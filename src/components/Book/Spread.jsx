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
      onSelectDay?.(day)
      if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
        setSheetOpen(true)
      }
    },
    [onSelectDay],
  )

  const feed = (
    <section className="book-page--left flex min-h-0 flex-1 flex-col overflow-hidden md:border-0 md:px-6 md:pt-3 md:pb-2 lg:px-8">
      {/* Shared center-aligned header — same stack on every tracker tab */}
      <header className="left-page-header mx-auto flex w-full max-w-xl shrink-0 flex-col items-center gap-2.5 px-3 pt-2 text-center md:gap-2 md:px-2 md:pt-1">
        <div className="flex w-full flex-col items-center gap-1.5">
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
          <div className="min-w-0 max-w-full">
            <h2 className="font-display text-[1.05rem] font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-[0.95rem]">
              {tracker.title}
            </h2>
            <p className="mt-0.5 text-[11px] font-medium leading-snug text-[var(--ink-soft)] md:text-[10px]">
              {tracker.subtitle}
            </p>
          </div>
        </div>

        <div className="left-page-header__legend flex w-full min-h-[2rem] items-start justify-center">
          <Legend trackerId={tracker.id} levels={tracker.levels} />
        </div>

        <div className="flex w-full flex-col items-center gap-1.5">
          {selectedLabel ? (
            <div className="date-anchor mb-2 w-fit max-w-full rounded-full px-3.5 py-1 md:px-3 md:py-0.5">
              <p className="date-anchor__stamp text-center text-sm font-medium">
                {selectedLabel}
              </p>
            </div>
          ) : (
            <div className="h-[1.5rem] w-1 shrink-0" aria-hidden />
          )}

          {isMobile && selectedDay && (
            <div className="flex w-full max-w-sm flex-col items-center gap-2">
              <p className="text-[12px] font-medium leading-snug text-[var(--ink-soft)]">
                {selectedLevel ? (
                  <>
                    Logged as{' '}
                    <span className="font-semibold text-[var(--ink)]">{selectedLevel.label}</span>
                  </>
                ) : (
                  'No pixel yet — open the log to fill this day'
                )}
              </p>
              <button
                type="button"
                onClick={openLog}
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--accent-deep)] px-4 py-2.5 text-sm font-bold text-white shadow-md active:scale-[0.97]"
              >
                Open log
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="page-section-divider shrink-0" aria-hidden>
        <span className="page-section-divider__motif">✦ · ✦</span>
      </div>

      {isMobile && (
        <p className="mb-2 px-2 text-center text-[11px] font-medium leading-relaxed text-[var(--ink-soft)]">
          Tap any day to open your soft log sheet.
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-hidden pb-1 md:pb-0.5">
        <div className="flex h-full min-h-0 w-full items-center justify-center">
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
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden p-2.5 sm:p-3 md:grid md:grid-cols-2 md:gap-0 md:p-0 md:pt-1 md:pb-1">
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
