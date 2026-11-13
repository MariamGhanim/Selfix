import {
  Apple,
  BookOpen,
  Candy,
  CheckSquare,
  Droplets,
  Dumbbell,
  GlassWater,
  MapPin,
  Moon,
  Pill,
  Smile,
  Sparkles,
  Star,
  Target,
  Zap,
} from 'lucide-react'
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
  Target,
  Dumbbell,
  Smile,
  MapPin,
  CheckSquare,
  Pill,
  BookOpen,
  Sparkles,
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
      <section className="flex min-h-[52vh] flex-col overflow-hidden border-b border-[var(--page-edge)]/60 p-3 md:min-h-0 md:border-b-0 md:pr-5 md:pl-4">
        <div className="mb-1.5 flex shrink-0 items-center gap-2">
          <div
            className="rounded-xl p-1.5 text-white shadow"
            style={{ background: tracker.tabColor }}
          >
            <Icon size={16} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-base leading-tight text-[var(--ink)] sm:text-lg">
              {tracker.title}
            </h2>
            <p className="truncate text-[10px] text-[var(--ink-soft)]">{tracker.subtitle}</p>
          </div>
        </div>

        <div className="mb-1.5 shrink-0">
          <Legend trackerId={tracker.id} levels={tracker.levels} />
        </div>

        {selectedLabel && (
          <div className="mb-1.5 shrink-0 rounded-full bg-[var(--accent-glow)]/90 px-3 py-1 text-center">
            <p className="font-display text-[11px] font-semibold text-[var(--accent-deep)] sm:text-xs">
              {selectedLabel}
            </p>
          </div>
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

      <section className="min-h-[48vh] overflow-hidden md:min-h-0 md:pl-4">
        <RightPage tracker={tracker} selectedDay={selectedDay} />
      </section>
    </div>
  )
}
