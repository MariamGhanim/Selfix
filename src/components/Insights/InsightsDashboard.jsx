import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useJournal } from '../../context/JournalContext'
import {
  buildTrackerDiary,
  DIARY_RANGES,
  getDiaryBounds,
  shiftDiaryAnchor,
} from '../../lib/trackerDiary'

function IconByName({ name, size = 14 }) {
  const Icon = LucideIcons[name] || LucideIcons.Sparkles
  return <Icon size={size} strokeWidth={2} />
}

function tintStyle(color, alpha = 0.18) {
  if (!color) return undefined
  return {
    background: `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, var(--log-card-base))`,
  }
}

function PeriodSwitcher({ value, onChange }) {
  return (
    <div className="insights-pill-track inline-flex rounded-full p-1">
      {DIARY_RANGES.map((range) => {
        const active = value === range.id
        return (
          <button
            key={range.id}
            type="button"
            onClick={() => onChange(range.id)}
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wide transition ${
              active
                ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            {range.label}
          </button>
        )
      })}
    </div>
  )
}

function StoryCard({ children, className = '', style }) {
  return (
    <div className={`insights-story-card ${className}`} style={style}>
      {children}
    </div>
  )
}

function DayRow({ entry, tracker }) {
  const color = entry.color || tracker.tabColor

  return (
    <li className="insights-day-entry rounded-2xl px-4 py-3.5">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: color }}
        >
          <IconByName name={tracker.icon} size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[12px] font-semibold text-[var(--accent-deep)]">
            {entry.label}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink)]">{entry.headline}</p>
          {entry.details?.length ? (
            <ul className="mt-1.5 space-y-0.5">
              {entry.details.map((detail) => (
                <li key={detail} className="text-[12px] leading-relaxed text-[var(--ink-soft)]">
                  {detail}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  )
}

export default function InsightsDashboard() {
  const { state, year, activeTrackers } = useJournal()
  const trackers = activeTrackers?.length ? activeTrackers : []
  const [selectedId, setSelectedId] = useState(null)
  const [rangeId, setRangeId] = useState('weekly')
  const [anchor, setAnchor] = useState(() => new Date())

  useEffect(() => {
    if (!trackers.length) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !trackers.some((t) => t.id === selectedId)) {
      setSelectedId(trackers[0].id)
    }
  }, [trackers, selectedId])

  const selectedTracker = trackers.find((t) => t.id === selectedId) || trackers[0] || null

  const diary = useMemo(() => {
    if (!selectedTracker) return null
    return buildTrackerDiary(state, selectedTracker.id, rangeId, year, anchor)
  }, [state, selectedTracker, rangeId, year, anchor])

  const boundsLabel = useMemo(
    () => getDiaryBounds(rangeId, year, anchor).label,
    [rangeId, year, anchor],
  )

  const shift = (dir) => setAnchor((prev) => shiftDiaryAnchor(rangeId, prev, dir))

  return (
    <div data-no-flip className="insights-shell flex h-full min-h-0 flex-col overflow-hidden">
      <header className="insights-header shrink-0 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-[1.35rem] font-semibold tracking-tight text-[var(--ink)]">
            Insights Logbook
          </h2>
          <PeriodSwitcher
            value={rangeId}
            onChange={(id) => {
              setRangeId(id)
              setAnchor(new Date())
            }}
          />
        </div>

        <div className="mt-3.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="insights-nav-btn rounded-full p-1.5"
            aria-label="Previous period"
          >
            <ChevronLeft size={14} />
          </button>
          <p className="font-display text-[12px] font-semibold text-[var(--accent-deep)]">{boundsLabel}</p>
          <button
            type="button"
            onClick={() => shift(1)}
            className="insights-nav-btn rounded-full p-1.5"
            aria-label="Next period"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="mt-3.5 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trackers.map((t) => {
            const active = selectedTracker?.id === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`insights-chip inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                  active ? 'text-white shadow-sm' : ''
                }`}
                style={active ? { background: t.tabColor, borderColor: 'transparent' } : undefined}
              >
                <IconByName name={t.icon} size={12} />
                {t.tab || t.title}
              </button>
            )
          })}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
        <div className="mx-auto w-full max-w-2xl pb-8">
          <AnimatePresence mode="wait" initial={false}>
            {diary ? (
              <motion.div
                key={diary.tracker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <StoryCard className="px-5 py-4" style={tintStyle(diary.tracker.tabColor, 0.16)}>
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                      style={{ background: diary.tracker.tabColor }}
                    >
                      <IconByName name={diary.tracker.icon} size={18} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[17px] font-semibold tracking-tight text-[var(--ink)]">
                        {diary.tracker.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">{diary.bounds.label}</p>
                    </div>
                  </div>
                </StoryCard>

                <StoryCard className="insights-story-panel px-5 py-5">
                  <p className="font-display text-[15px] font-semibold text-[var(--accent-deep)]">
                    {diary.summary.title}
                  </p>
                  <p className="mt-2 font-display text-[14px] leading-relaxed text-[var(--ink)]">
                    {diary.summary.body}
                  </p>
                </StoryCard>

                <section className="space-y-2.5">
                  <h4 className="px-1 font-display text-[13px] font-semibold text-[var(--ink)]">
                    Moments
                  </h4>
                  {diary.moments?.length ? (
                    <ul className="space-y-2.5">
                      {diary.moments.map((entry) => (
                        <DayRow key={entry.key} entry={entry} tracker={diary.tracker} />
                      ))}
                    </ul>
                  ) : (
                    <StoryCard className="px-5 py-6">
                      <p className="font-display text-[13px] leading-relaxed text-[var(--ink-soft)]">
                        No moments written here yet for this stretch. When you paint a day, it will
                        appear softly on this page.
                      </p>
                    </StoryCard>
                  )}
                </section>

                {diary.reflection ? (
                  <StoryCard className="insights-reflection px-5 py-5">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--accent-glow)] text-[var(--accent-deep)]">
                        <Leaf size={15} />
                      </span>
                      <h4 className="font-display text-[15px] font-semibold text-[var(--ink)]">
                        {diary.reflection.title}
                      </h4>
                    </div>
                    <p className="font-display text-[14px] leading-relaxed text-[var(--ink)]">
                      {diary.reflection.body}
                    </p>
                  </StoryCard>
                ) : null}
              </motion.div>
            ) : (
              <StoryCard className="px-5 py-8 text-center">
                <p className="font-display text-[14px] text-[var(--ink-soft)]">
                  Enable a tracker in Settings to begin.
                </p>
              </StoryCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
