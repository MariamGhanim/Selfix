import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useJournal } from '../../context/JournalContext'
import { TRACKERS } from '../../data/trackers'
import {
  buildTrackerDiary,
  DIARY_RANGES,
  getDiaryBounds,
  shiftDiaryAnchor,
} from '../../lib/trackerDiary'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Trackers where a lower level value means a better outcome (Taken=1, Skipped=3). */
const INVERTED_LEVEL_TRACKERS = new Set(['vitamins', 'shower'])

function levelChartScale(tracker) {
  const levels = tracker.levels || []
  if (!levels.length) {
    return {
      levels,
      domain: [0, 1],
      ticks: [0, 1],
      toDisplay: (v) => (v == null ? 0 : v),
      labelByDisplay: {},
      tipForDisplay: () => '—',
    }
  }

  const values = levels.map((l) => l.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const inverted = INVERTED_LEVEL_TRACKERS.has(tracker.id)
  const labelByValue = Object.fromEntries(levels.map((l) => [l.value, l.label]))

  const toDisplay = (raw) => {
    if (raw == null) return 0
    return inverted ? maxV + minV - raw : raw
  }

  const fromDisplay = (display) => {
    if (display == null || display === 0) return null
    return inverted ? maxV + minV - display : display
  }

  const ticks = inverted
    ? [...values].sort((a, b) => toDisplay(a) - toDisplay(b))
    : [...values].sort((a, b) => a - b)

  const displayTicks = ticks.map(toDisplay)
  const labelByDisplay = Object.fromEntries(
    levels.map((l) => [toDisplay(l.value), l.label]),
  )

  return {
    levels,
    domain: [Math.min(0, ...displayTicks), Math.max(...displayTicks)],
    ticks: displayTicks,
    toDisplay,
    labelByDisplay,
    tipForDisplay: (display) => {
      if (!display) return '—'
      const raw = fromDisplay(display)
      return labelByValue[raw] || String(raw)
    },
  }
}

function IconByName({ name, size = 14 }) {
  const Icon = LucideIcons[name] || LucideIcons.Sparkles
  return <Icon size={size} strokeWidth={2} />
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
          {entry.headline ? (
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink)]">{entry.headline}</p>
          ) : null}
          {entry.details?.length ? (
            <ul className="mt-1 space-y-0.5">
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

function chartModel(diary) {
  const tracker = diary.tracker
  const chronological = [...diary.entries].reverse()
  const isWeek = diary.bounds.periodWord === 'week'
  const color = tracker.tabColor || '#d4a0ae'
  const shortDay = (entry) => (isWeek ? WEEKDAYS[entry.weekday] : String(entry.day))

  if (tracker.id === 'sleep') {
    return {
      kind: 'area',
      title: 'Sleep quality',
      color,
      domain: [0, 100],
      ticks: [0, 50, 70, 85, 100],
      tickFormat: (v) => (v === 0 ? '0' : String(v)),
      tipFormat: (v) => (v ? `Quality ${Math.round(v)}` : '—'),
      data: chronological.map((e) => ({
        day: shortDay(e),
        value: e.empty || e.qualityScore == null ? 0 : e.qualityScore,
        full: e.label,
        detail: e.qualityDetail || null,
      })),
    }
  }

  if (tracker.id === 'focus') {
    const maxMins = Math.max(60, ...chronological.map((e) => e.minutes || 0))
    return {
      kind: 'area',
      title: 'Focus minutes',
      color,
      domain: [0, Math.ceil(maxMins / 30) * 30 || 60],
      ticks: undefined,
      tickFormat: (v) => `${v}m`,
      tipFormat: (v) => (v ? `${v} minutes` : '—'),
      data: chronological.map((e) => ({
        day: shortDay(e),
        value: e.minutes || 0,
        full: e.label,
      })),
    }
  }

  if (tracker.id === 'water') {
    return {
      kind: 'bar',
      title: 'Cups of water',
      color,
      domain: [0, 8],
      ticks: [0, 2, 4, 6, 8],
      tickFormat: (v) => (v === 8 ? '8+' : String(v)),
      tipFormat: (v) => (v ? `${v === 8 ? '8+' : v} cups` : '—'),
      data: chronological.map((e) => ({
        day: shortDay(e),
        value: e.empty || e.value == null ? 0 : e.value,
        full: e.label,
      })),
    }
  }

  const scale = levelChartScale(tracker)

  let title = 'Daily level'
  if (tracker.id === 'salah') title = 'Prayers on time'
  if (tracker.id === 'teeth') title = 'Brushing'
  if (tracker.id === 'tasks') title = 'Tasks'
  if (tracker.id === 'workout') title = 'Movement'
  if (tracker.id === 'vitamins') title = 'Vitamins'
  if (tracker.id === 'shower') title = 'Hair & Skin'

  return {
    kind: 'bar',
    title,
    color,
    domain: scale.domain,
    ticks: scale.ticks,
    tickFormat: (v) => {
      const label = scale.labelByDisplay[v]
      if (!label) return v === 0 ? '' : String(v)
      return label.length > 10 ? label.slice(0, 9) + '…' : label
    },
    tipFormat: scale.tipForDisplay,
    data: chronological.map((e) => ({
      day: shortDay(e),
      value: e.empty || e.value == null ? 0 : scale.toDisplay(e.value),
      full: e.label,
    })),
  }
}

function SoftTooltip({ active, payload, tipFormat }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  const value = payload[0]?.value
  return (
    <div className="rounded-2xl border border-[var(--page-edge)]/60 bg-[var(--surface-strong)] px-3 py-2 shadow-lg">
      <p className="font-display text-[11px] font-semibold text-[var(--accent-deep)]">{row?.full}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-[var(--ink)]">{row?.detail || tipFormat(value)}</p>
    </div>
  )
}

function TrackerChart({ diary }) {
  const model = useMemo(() => chartModel(diary), [diary])
  const axisColor = 'var(--ink-soft)'
  const gridColor = 'color-mix(in srgb, var(--accent-soft) 55%, transparent)'

  return (
    <StoryCard className="insights-chart-card flex h-full min-h-[18rem] flex-col px-3 py-3 sm:min-h-[22rem] sm:px-5 sm:py-4">
      <div className="mb-3">
        <p className="font-display text-[14px] font-semibold text-[var(--ink)] sm:text-[15px]">{model.title}</p>
        <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">{diary.bounds.label}</p>
      </div>

      <div className="relative min-h-[14rem] w-full flex-1 sm:min-h-[16rem]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            {model.kind === 'area' ? (
              <AreaChart data={model.data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="insightsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={model.color} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={model.color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={model.data.length > 10 ? 'preserveStartEnd' : 0}
                />
                <YAxis
                  domain={model.domain}
                  ticks={model.ticks}
                  tickFormatter={model.tickFormat}
                  tick={{ fill: axisColor, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<SoftTooltip tipFormat={model.tipFormat} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={model.color}
                  strokeWidth={2.5}
                  fill="url(#insightsFill)"
                  dot={{ r: 3.5, fill: model.color, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={model.data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={model.data.length > 10 ? 'preserveStartEnd' : 0}
                />
                <YAxis
                  domain={model.domain}
                  ticks={model.ticks}
                  tickFormatter={model.tickFormat}
                  tick={{ fill: axisColor, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip content={<SoftTooltip tipFormat={model.tipFormat} />} />
                <Bar dataKey="value" fill={model.color} radius={[10, 10, 6, 6]} maxBarSize={36} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </StoryCard>
  )
}

export default function InsightsDashboard() {
  const { state, year, activeTrackers } = useJournal()
  const trackers = useMemo(() => {
    const list = [...(activeTrackers?.length ? activeTrackers : TRACKERS)]
    if (!list.some((t) => t.id === 'salah')) {
      const salah = TRACKERS.find((t) => t.id === 'salah')
      if (salah) {
        const afterSleep = list.findIndex((t) => t.id === 'sleep')
        list.splice(afterSleep >= 0 ? afterSleep + 1 : 0, 0, salah)
      }
    }
    return list
  }, [activeTrackers])

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
      <header className="insights-header shrink-0 px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <h2 className="font-display text-[1.15rem] font-semibold tracking-tight text-[var(--ink)] sm:text-[1.35rem]">
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

        <div className="mt-3 flex items-center justify-between gap-2">
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

        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3 sm:px-5 sm:py-4 lg:px-6">
        <div className="mx-auto w-full max-w-6xl pb-8">
          <AnimatePresence mode="wait" initial={false}>
            {diary ? (
              <motion.div
                key={diary.tracker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                    style={{ background: diary.tracker.tabColor }}
                  >
                    <IconByName name={diary.tracker.icon} size={17} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[16px] font-semibold tracking-tight text-[var(--ink)]">
                      {diary.tracker.title}
                    </h3>
                    <p className="text-[11px] text-[var(--ink-soft)]">{diary.bounds.label}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
                  <div className="flex min-w-0 flex-col gap-5 lg:col-span-7">
                    {diary.notes?.length ? (
                      <section className="space-y-2.5">
                        <h4 className="px-1 font-display text-[13px] font-semibold text-[var(--ink)]">
                          Your notes
                        </h4>
                        <ul className="space-y-2.5">
                          {diary.notes.map((item) => (
                            <li key={item.key}>
                              <StoryCard className="px-4 py-3.5">
                                <p className="font-display text-[11px] font-semibold text-[var(--accent-deep)]">
                                  {item.label}
                                </p>
                                {item.notes.map((note) => (
                                  <p
                                    key={note}
                                    className="mt-1.5 font-display text-[13px] leading-relaxed text-[var(--ink)]"
                                  >
                                    {note}
                                  </p>
                                ))}
                              </StoryCard>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}

                    <section className="space-y-2.5">
                      <h4 className="px-1 font-display text-[13px] font-semibold text-[var(--ink)]">
                        Entries
                      </h4>
                      {diary.moments?.length ? (
                        <ul className="space-y-2.5">
                          {diary.moments.map((entry) => (
                            <DayRow key={entry.key} entry={entry} tracker={diary.tracker} />
                          ))}
                        </ul>
                      ) : (
                        <StoryCard className="px-5 py-6">
                          <p className="text-[13px] text-[var(--ink-soft)]">No entries yet.</p>
                        </StoryCard>
                      )}
                    </section>
                  </div>

                  <div className="min-w-0 lg:col-span-5">
                    <div className="lg:sticky lg:top-2">
                      <TrackerChart diary={diary} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <StoryCard className="px-5 py-8 text-center">
                <p className="text-[14px] text-[var(--ink-soft)]">
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
