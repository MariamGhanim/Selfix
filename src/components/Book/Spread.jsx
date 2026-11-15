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

export default function Spread({ tracker, selectedDay, onSelectDay }) {
  const { year } = useJournal()
  const Icon = ICONS[tracker.icon] || Star
  const selectedLabel =
    selectedDay != null
      ? formatSelectedDate(year, selectedDay.month, selectedDay.day)
      : null

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
      <section className="flex min-h-[52vh] flex-col overflow-hidden border-b border-[var(--page-edge)]/60 p-3.5 md:min-h-0 md:border-b-0 md:pr-5 md:pl-4">
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

        <div className="mb-2 shrink-0">
          <Legend trackerId={tracker.id} levels={tracker.levels} />
        </div>

        {selectedLabel && (
          <motion.div
            key={selectedLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="date-anchor mb-2.5 shrink-0 rounded-2xl px-4 py-2.5 text-center ring-1 ring-[var(--accent-soft)]/60"
          >
            <p className="font-display text-base font-semibold tracking-tight text-[var(--ink)] sm:text-lg">
              {selectedLabel}
            </p>
          </motion.div>
        )}

        <div className="min-h-0 flex-1">
          <PixelGrid
            trackerId={tracker.id}
            levels={tracker.levels}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
          />
        </div>
      </section>

      <section className="flex min-h-[48vh] min-h-0 flex-col overflow-hidden md:h-full md:pl-4">
        <RightPage tracker={tracker} selectedDay={selectedDay} />
      </section>
    </div>
  )
}
