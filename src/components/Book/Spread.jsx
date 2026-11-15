import { useEffect, useState } from 'react'
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

function MobilePaneSwitch({ value, onChange }) {
  return (
    <div className="mb-2 flex shrink-0 rounded-full bg-[var(--accent-glow)] p-1 ring-1 ring-[var(--page-edge)]/50 md:hidden">
      {[
        { id: 'grid', label: 'Year grid' },
        { id: 'today', label: 'Today' },
      ].map((opt) => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-1 rounded-full px-3 py-1.5 text-center text-[11px] font-bold transition ${
              active
                ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                : 'text-[var(--ink-soft)]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Spread({ tracker, selectedDay, onSelectDay }) {
  const { year } = useJournal()
  const Icon = ICONS[tracker.icon] || Star
  const [mobilePane, setMobilePane] = useState('today')
  const selectedLabel =
    selectedDay != null
      ? formatSelectedDate(year, selectedDay.month, selectedDay.day)
      : null

  useEffect(() => {
    setMobilePane('today')
  }, [tracker.id])

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden md:grid md:grid-cols-2">
      <MobilePaneSwitch value={mobilePane} onChange={setMobilePane} />

      <section
        className={`min-h-0 flex-col overflow-hidden border-[var(--page-edge)]/60 p-2.5 sm:p-3.5 md:flex md:min-h-0 md:pr-5 md:pl-4 ${
          mobilePane === 'grid' ? 'flex flex-1' : 'hidden'
        }`}
      >
        <div className="mb-2 flex shrink-0 items-center gap-2.5">
          <motion.div
            key={tracker.id}
            initial={{ scale: 0.88, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="rounded-xl p-1.5 text-white shadow-md"
            style={{
              background: tracker.tabColor,
              boxShadow: `0 6px 16px ${tracker.tabColor}55`,
            }}
          >
            <Icon size={16} />
          </motion.div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-lg">
              {tracker.title}
            </h2>
            <p className="truncate text-[10px] leading-snug text-[var(--ink-soft)]">{tracker.subtitle}</p>
          </div>
        </div>

        <div className="mb-2 shrink-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Legend trackerId={tracker.id} levels={tracker.levels} />
        </div>

        {selectedLabel && (
          <motion.div
            key={selectedLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="date-anchor mb-2.5 shrink-0 rounded-2xl px-3 py-2 text-center ring-1 ring-[var(--accent-soft)]/60 sm:px-4 sm:py-2.5"
          >
            <p className="font-display text-sm font-semibold tracking-tight text-[var(--ink)] sm:text-lg">
              {selectedLabel}
            </p>
          </motion.div>
        )}

        <div className="min-h-0 flex-1 overflow-auto">
          <PixelGrid
            trackerId={tracker.id}
            levels={tracker.levels}
            selectedDay={selectedDay}
            onSelectDay={(day) => {
              onSelectDay(day)
              if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
                setMobilePane('today')
              }
            }}
          />
        </div>
      </section>

      <section
        className={`min-h-0 flex-col overflow-hidden md:flex md:h-full md:min-h-0 md:pl-4 ${
          mobilePane === 'today' ? 'flex flex-1' : 'hidden'
        }`}
      >
        <RightPage tracker={tracker} selectedDay={selectedDay} />
      </section>
    </div>
  )
}
