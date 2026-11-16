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
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden md:border-0 md:pr-5 md:pl-4">
      <div className="mb-3 flex shrink-0 items-center gap-3 px-1 md:mb-2 md:gap-2.5">
        <motion.div
          key={tracker.id}
          initial={{ scale: 0.88, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="rounded-2xl p-2.5 text-white shadow-md md:rounded-xl md:p-1.5"
          style={{
            background: tracker.tabColor,
            boxShadow: `0 8px 20px ${tracker.tabColor}55`,
          }}
        >
          <Icon size={isMobile ? 20 : 16} />
        </motion.div>
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-lg">
            {tracker.title}
          </h2>
          <p className="truncate text-[12px] leading-snug text-[var(--ink-soft)] md:text-[10px]">
            {tracker.subtitle}
          </p>
        </div>
      </div>

      <div className="mb-3 shrink-0 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mb-2">
        <Legend trackerId={tracker.id} levels={tracker.levels} />
      </div>

      {selectedLabel && (
        <motion.div
          key={selectedLabel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="date-anchor mb-3 shrink-0 rounded-[1.35rem] px-4 py-3 ring-1 ring-[var(--accent-soft)]/60 md:mb-2.5 md:rounded-2xl md:px-4 md:py-2.5"
        >
          <p className="text-center font-display text-base font-semibold tracking-tight text-[var(--ink)] md:text-lg">
            {selectedLabel}
          </p>
          {isMobile && (
            <div className="mt-2.5 flex items-center justify-between gap-3">
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

      {isMobile && (
        <p className="mb-3 px-1 text-[12px] font-medium leading-relaxed text-[var(--ink-soft)]">
          Tap any day on the year grid to open a soft log sheet with the mini-quiz and notes.
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-auto px-1 pb-2 md:px-0">
        <div className="h-auto min-h-0 rounded-[1.25rem] bg-[var(--surface)]/45 p-2.5 pt-3 ring-1 ring-[var(--page-edge)]/40 md:h-full md:rounded-none md:bg-transparent md:p-0 md:pt-1 md:ring-0">
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
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden p-3 md:grid md:grid-cols-2 md:p-0">
        {feed}

        <section className="hidden min-h-0 flex-col overflow-hidden md:flex md:h-full md:min-h-0 md:pl-4">
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
