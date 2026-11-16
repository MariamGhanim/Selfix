import { useCallback, useEffect, useState } from 'react'
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
import { motion } from 'framer-motion'
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

export default function Spread({ tracker, selectedDay, onSelectDay }) {
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
    <section className="book-page--left flex min-h-0 flex-1 flex-col overflow-hidden md:border-0 md:px-6 md:pt-4 md:pb-2 lg:px-8">
      <div className="mb-2.5 flex shrink-0 flex-col items-center gap-2 px-2 pt-2 text-center md:mb-2 md:gap-2 md:pt-0.5">
        <div className="flex max-w-full items-center justify-center gap-2.5">
          <motion.div
            key={tracker.id}
            initial={{ scale: 0.88, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="shrink-0 rounded-2xl p-2 text-white shadow-md md:rounded-[12px] md:p-1.5"
            style={{
              background: tracker.tabColor,
              boxShadow: `0 6px 14px ${tracker.tabColor}40`,
            }}
          >
            <Icon size={isMobile ? 18 : 14} />
          </motion.div>
          <div className="min-w-0 text-left">
            <h2 className="truncate font-display text-lg font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-[0.98rem]">
              {tracker.title}
            </h2>
            <p className="truncate text-[11px] font-medium leading-snug text-[var(--ink-soft)] md:text-[10px]">
              {tracker.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-2 flex shrink-0 justify-center overflow-x-auto px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mb-1.5">
        <Legend trackerId={tracker.id} levels={tracker.levels} />
      </div>

      {selectedLabel && (
        <motion.div
          key={selectedLabel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="date-anchor mx-auto mb-2 w-fit max-w-[calc(100%-1rem)] shrink-0 rounded-full px-4 py-1.5 md:mb-1.5 md:px-3.5 md:py-1"
        >
          <p className="date-anchor__stamp text-center text-[12px] md:text-[11px]">
            {selectedLabel}
          </p>
          {isMobile && (
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="min-w-0 text-[12px] font-medium text-[var(--ink-soft)]">
                {selectedLevel ? (
                  <>
                    Logged as{' '}
                    <span className="font-semibold text-[var(--ink)]">{selectedLevel.label}</span>
                  </>
                ) : (
                  'No pixel yet — open the log to fill this day'
                )}
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={openLog}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[var(--accent-deep)] px-4 py-2.5 text-sm font-bold text-white shadow-md"
              >
                Open log
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

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
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden p-3 md:grid md:grid-cols-2 md:gap-0 md:p-0 md:pt-1 md:pb-1">
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
