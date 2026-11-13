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
  const Icon = ICONS[tracker.icon] || Star

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
