import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, MapPin, ShoppingBag } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useJournal } from '../../context/JournalContext'
import { TRACKERS } from '../../data/trackers'
import {
  buildTrackerDiary,
  canShiftDiary,
  DIARY_RANGES,
  getDiaryBounds,
  shiftDiaryAnchor,
} from '../../lib/trackerDiary'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Trackers where a lower level value means a better outcome (Taken=1, Skipped=3). */
const INVERTED_LEVEL_TRACKERS = new Set(['vitamins', 'shower'])

/**
 * Numeric / trend metrics keep a Recharts view.
 * Everything else (Energy, Outings, Rating, Care, etc.) uses a summary widget
 * so the right column never repeats the left journal list.
 */
const TREND_CHART_TRACKERS = new Set([
  'sleep',
  'focus',
  'water',
  'salah',
  'tasks',
  'fruits',
  'sweets',
])

const OUTING_STATUS_META = {
  0: { icon: Home, short: 'Home' },
  1: { icon: ShoppingBag, short: 'Errand' },
  2: { icon: MapPin, short: 'Outing' },
}

function usesSummaryWidget(tracker) {
  if (!tracker?.id) return false
  if (TREND_CHART_TRACKERS.has(tracker.id)) return false
  return Array.isArray(tracker.levels) && tracker.levels.length > 0
}

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
    <div className="insights-pill-track inline-flex max-w-full rounded-full p-1">
      {DIARY_RANGES.map((range) => {
        const active = value === range.id
        return (
          <button
            key={range.id}
            type="button"
            onClick={() => onChange(range.id)}
            className={`inline-flex min-h-10 items-center rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-wide transition sm:min-h-0 sm:py-1.5 ${
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

function statusBadgeTone(tone) {
  if (tone === 'lavender') {
    return {
      background: 'color-mix(in srgb, #e0c4e0 42%, #fffaf7)',
      color: '#7a5f88',
      ring: 'color-mix(in srgb, #e0c4e0 55%, transparent)',
    }
  }
  if (tone === 'rose') {
    return {
      background: 'color-mix(in srgb, #f2b8c6 38%, #fffaf7)',
      color: '#8a5a68',
      ring: 'color-mix(in srgb, #f2b8c6 50%, transparent)',
    }
  }
  return {
    background: 'color-mix(in srgb, var(--accent-soft) 40%, #fffaf7)',
    color: 'var(--accent-deep)',
    ring: 'color-mix(in srgb, var(--page-edge) 55%, transparent)',
  }
}

function DayRow({ entry, tracker }) {
  const color = entry.color || tracker.tabColor
  const details = (entry.details || []).filter(Boolean)
  const notes = entry.writtenNotes || []
  const badge = entry.statusBadge
  const badgeTone = badge ? statusBadgeTone(badge.tone) : null

  return (
    <li className="px-3.5 py-3.5 sm:px-5 sm:py-4">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: color }}
          aria-hidden
        >
          <IconByName name={tracker.icon} size={15} />
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3 sm:gap-y-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="font-display text-[12px] font-semibold text-[var(--accent-deep)]">
                {entry.label}
              </p>
              {badge ? (
                <span
                  className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide"
                  style={{
                    background: badgeTone.background,
                    color: badgeTone.color,
                    boxShadow: `inset 0 0 0 1px ${badgeTone.ring}`,
                  }}
                >
                  {badge.label}
                </span>
              ) : null}
            </div>
            {entry.headline ? (
              <p className="break-words text-[12px] font-semibold leading-snug text-[var(--ink)]">
                {entry.headline}
              </p>
            ) : null}
          </div>
          {details.length ? (
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--ink-soft)]">
              {details.join(' · ')}
            </p>
          ) : null}
          {notes.length ? (
            <div className="mt-2 space-y-1.5">
              {notes.map((note) => (
                <p
                  key={note}
                  className="rounded-xl bg-[var(--surface)]/70 px-3 py-2 text-[12px] leading-relaxed text-[var(--ink)] ring-1 ring-[var(--page-edge)]/35"
                >
                  {note}
                </p>
              ))}
            </div>
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

  if (tracker.id === 'salah') {
    const prayerLevels = (tracker.levels || []).filter((l) => l.value !== 7)
    const scale = levelChartScale({ ...tracker, levels: prayerLevels })
    const hasPrayerCounts = chronological.some(
      (e) => !e.empty && !e.excused && e.value != null && e.value !== 7,
    )

    if (!hasPrayerCounts) {
      return {
        kind: 'empty',
        title: 'Prayers on time',
        message: `No prayer counts logged this ${diary.bounds.periodWord}`,
        data: [],
      }
    }

    const shortSalahLabel = (label) => {
      if (!label) return ''
      if (label === '5 + Sunnah') return '5+ Sunnah'
      return label
    }

    return {
      kind: 'bar',
      title: 'Prayers on time',
      color,
      domain: scale.domain,
      ticks: scale.ticks,
      axisWidth: 80,
      margin: { top: 8, right: 15, left: 10, bottom: 4 },
      tickFormat: (v) => shortSalahLabel(scale.labelByDisplay[v]),
      tipFormat: (display) => {
        if (display == null) return '—'
        return shortSalahLabel(scale.labelByDisplay[display]) || '—'
      },
      data: chronological.map((e) => {
        const excused = e.excused || e.value === 7
        return {
          day: shortDay(e),
          value: e.empty || excused || e.value == null ? null : scale.toDisplay(e.value),
          full: e.label,
          detail: excused ? 'Excused' : null,
        }
      }),
    }
  }

  const scale = levelChartScale(tracker)

  let title = 'Daily level'
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

function statusMetaFor(tracker, value) {
  if (tracker.id === 'outings') return OUTING_STATUS_META[value] || null
  const level = tracker.levels?.find((l) => l.value === value)
  if (!level) return null
  return { icon: LucideIcons[tracker.icon] || MapPin, short: categoryName(level.label) }
}

/** Human-readable category for chart/legend — never raw level IDs. */
function categoryName(label) {
  let name = String(label ?? '').trim()
  if (!name) return 'Logged'
  // "1★ Tough" / "4★ Good" → "Tough" / "Good"
  const starred = name.match(/^\d+\s*[★*]?\s+(.+)$/u) || name.match(/^\d+★\s*(.+)$/u)
  if (starred?.[1]) name = starred[1].trim()
  else if (name.includes(' / ')) name = name.split(' / ')[0].trim()
  // Guard against leftover pure numeric IDs
  if (/^\d+$/.test(name)) return 'Logged'
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function formatStatusPill(label, count) {
  return `${count} ${categoryName(label)}`
}

function softPastel(color) {
  if (!color) return '#f2b8c6'
  return `color-mix(in srgb, ${color} 78%, #fff6f2)`
}

function SoftDonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div className="rounded-2xl border border-[var(--page-edge)]/55 bg-[var(--surface-strong)] px-3 py-2 shadow-lg">
      <p className="font-display text-[11px] font-semibold text-[var(--accent-deep)]">
        {row.category}
      </p>
      <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">
        {row.count} day{row.count === 1 ? '' : 's'} · {row.share}
      </p>
    </div>
  )
}

function StatusOverviewCard({ diary }) {
  const tracker = diary.tracker
  const levels = tracker.levels || []

  const stats = useMemo(() => {
    const chronological = [...diary.entries].reverse()
    const logged = chronological.filter((e) => !e.empty && e.value != null)
    const counts = Object.fromEntries(levels.map((l) => [l.value, 0]))
    let withCompany = 0
    for (const entry of logged) {
      if (counts[entry.value] == null) counts[entry.value] = 0
      counts[entry.value] += 1
      if (entry.companion) withCompany += 1
    }
    const total = logged.length || 1
    const breakdown = levels
      .map((level) => {
        const count = counts[level.value] || 0
        if (!count) return null
        const category = categoryName(level.label)
        const pct = Math.round((count / total) * 100)
        return {
          id: level.value,
          color: level.color,
          count,
          category,
          pill: `${count} ${category}`,
          share: `${pct}% of logged days`,
          fill: softPastel(level.color),
          meta: statusMetaFor(tracker, level.value),
        }
      })
      .filter(Boolean)

    return {
      loggedCount: logged.length,
      dayCount: chronological.length,
      withCompany,
      breakdown,
      pieData: breakdown.map((b) => ({
        id: b.id,
        name: b.category,
        category: b.category,
        value: b.count,
        count: b.count,
        pill: b.pill,
        share: b.share,
        fill: b.fill,
      })),
    }
  }, [diary.entries, levels, tracker])

  return (
    <StoryCard className="insights-chart-card insights-status-card flex h-full flex-col px-3 py-3.5 sm:px-5 sm:py-5">
      <div className="mb-3 shrink-0">
        <p className="font-display text-[14px] font-semibold text-[var(--ink)] sm:text-[15px]">
          Summary
        </p>
        <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">{diary.bounds.label}</p>
      </div>

      {stats.pieData.length ? (
        <>
          <div className="relative mx-auto h-[11.5rem] w-full max-w-[15rem] sm:h-[13rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={stats.pieData.length > 1 ? 4 : 0}
                  cornerRadius={8}
                  stroke="rgba(255,250,247,0.95)"
                  strokeWidth={3}
                  isAnimationActive
                >
                  {stats.pieData.map((slice) => (
                    <Cell key={slice.id} fill={slice.fill} />
                  ))}
                </Pie>
                <Tooltip content={<SoftDonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-[1.55rem] font-semibold leading-none text-[var(--ink)]">
                {stats.loggedCount}
              </p>
              <p className="mt-1 text-[10px] font-medium text-[var(--ink-soft)]">logged</p>
              <p className="mt-0.5 text-[9px] text-[var(--ink-soft)]/80">
                of {stats.dayCount} days
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {stats.breakdown.map((item) => {
              const Icon = item.meta?.icon || LucideIcons[tracker.icon] || MapPin
              return (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-[var(--ink)] ring-1 ring-[var(--page-edge)]/45"
                  style={{
                    background: `color-mix(in srgb, ${item.color} 18%, #fffaf7)`,
                  }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: item.fill }}
                    aria-hidden
                  />
                  <Icon size={11} strokeWidth={2.2} style={{ color: item.color }} />
                  {item.pill}
                </span>
              )
            })}
          </div>

          {tracker.id === 'outings' && stats.withCompany > 0 ? (
            <p className="mt-3 text-center text-[11px] font-medium text-[var(--ink-soft)]">
              {stats.withCompany} day{stats.withCompany === 1 ? '' : 's'} with company
            </p>
          ) : null}
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-[1.2rem] bg-[var(--surface)]/55 px-4 py-10 ring-1 ring-[var(--page-edge)]/35">
          <div
            className="mb-3 h-16 w-16 rounded-full ring-[10px]"
            style={{
              background: 'color-mix(in srgb, var(--accent-soft) 35%, #fffaf7)',
              boxShadow: 'inset 0 0 0 10px color-mix(in srgb, var(--page-edge) 40%, transparent)',
            }}
            aria-hidden
          />
          <p className="text-[12px] text-[var(--ink-soft)]">Nothing logged yet.</p>
        </div>
      )}
    </StoryCard>
  )
}

function MetricChart({ diary }) {
  const model = useMemo(() => chartModel(diary), [diary])
  const axisColor = 'var(--ink-soft)'
  const gridColor = 'color-mix(in srgb, var(--accent-soft) 55%, transparent)'
  const isWeek = diary.bounds.periodWord === 'week'
  const chartData = model.data || []
  const xInterval = isWeek || chartData.length <= 10 ? 0 : 'preserveStartEnd'
  const barMargin = model.margin || { top: 8, right: 10, left: 0, bottom: 4 }
  const yAxisWidth = model.axisWidth ?? (model.kind === 'area' ? 44 : 48)
  const yTickStyle = model.axisWidth
    ? { fill: axisColor, fontSize: 11, whiteSpace: 'nowrap' }
    : { fill: axisColor, fontSize: 10 }

  return (
    <StoryCard className="insights-chart-card flex h-full min-h-[15rem] flex-col px-3 py-3.5 sm:min-h-[22rem] sm:px-5 sm:py-5">
      <div className="mb-2.5 shrink-0 sm:mb-3">
        <p className="font-display text-[14px] font-semibold text-[var(--ink)] sm:text-[15px]">
          {model.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">{diary.bounds.label}</p>
      </div>

      {model.kind === 'empty' ? (
        <div className="flex min-h-[12rem] flex-1 flex-col items-center justify-center rounded-[1.2rem] bg-[var(--surface)]/55 px-5 py-8 text-center ring-1 ring-[var(--page-edge)]/35 sm:min-h-[16rem] sm:px-6 sm:py-10">
          <p className="max-w-[14rem] text-[13px] leading-relaxed text-[var(--ink-soft)]">
            {model.message || 'Nothing to chart yet.'}
          </p>
        </div>
      ) : (
        <div className="relative min-h-[12.5rem] w-full flex-1 sm:min-h-[16rem]">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              {model.kind === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id="insightsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={model.color} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={model.color} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="day"
                    type="category"
                    tick={{ fill: axisColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={xInterval}
                    padding={{ left: 8, right: 8 }}
                  />
                  <YAxis
                    domain={model.domain}
                    ticks={model.ticks}
                    tickFormatter={model.tickFormat}
                    tick={yTickStyle}
                    axisLine={false}
                    tickLine={false}
                    width={yAxisWidth}
                  />
                  <Tooltip content={<SoftTooltip tipFormat={model.tipFormat} />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={model.color}
                    strokeWidth={2.5}
                    fill="url(#insightsFill)"
                    connectNulls={false}
                    dot={{ r: 3.5, fill: model.color, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={barMargin}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="day"
                    type="category"
                    tick={{ fill: axisColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={xInterval}
                    padding={{ left: 4, right: 4 }}
                  />
                  <YAxis
                    domain={model.domain}
                    ticks={model.ticks}
                    tickFormatter={model.tickFormat}
                    tick={yTickStyle}
                    axisLine={false}
                    tickLine={false}
                    width={yAxisWidth}
                  />
                  <Tooltip content={<SoftTooltip tipFormat={model.tipFormat} />} />
                  <Bar
                    dataKey="value"
                    fill={model.color}
                    radius={[10, 10, 6, 6]}
                    maxBarSize={isWeek ? 28 : 36}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </StoryCard>
  )
}

function TrackerChart({ diary }) {
  if (usesSummaryWidget(diary.tracker)) {
    return <StatusOverviewCard diary={diary} />
  }
  return <MetricChart diary={diary} />
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

  const canGoPrev = canShiftDiary(rangeId, anchor, -1, year)
  const canGoNext = canShiftDiary(rangeId, anchor, 1, year)

  const timeline = useMemo(() => {
    if (!diary?.moments?.length) return []
    return [...diary.moments].sort((a, b) => a.date - b.date)
  }, [diary])

  const shift = (dir) => {
    if (!canShiftDiary(rangeId, anchor, dir, year)) return
    setAnchor((prev) => shiftDiaryAnchor(rangeId, prev, dir))
  }

  return (
    <div data-no-flip className="insights-shell flex h-full min-h-0 flex-col overflow-hidden">
      <header className="insights-header shrink-0 px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
          <h2 className="font-display text-[1.1rem] font-semibold tracking-tight text-[var(--ink)] sm:text-[1.35rem]">
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
            disabled={!canGoPrev}
            className="insights-nav-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:cursor-default disabled:opacity-35 sm:h-8 sm:w-8"
            aria-label="Previous period"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="min-w-0 truncate px-1 text-center font-display text-[12px] font-semibold text-[var(--accent-deep)] sm:text-[13px]">
            {boundsLabel}
          </p>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={!canGoNext}
            className="insights-nav-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:cursor-default disabled:opacity-35 sm:h-8 sm:w-8"
            aria-label="Next period"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="scroll-fade-x scroll-fade-x--surface mt-3">
          <div className="touch-scroll-x flex gap-1.5 px-1 pb-0.5">
            {trackers.map((t) => {
              const active = selectedTracker?.id === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={`insights-chip inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-[11px] ${
                    active ? 'text-white shadow-sm' : ''
                  }`}
                  style={active ? { background: t.tabColor, borderColor: 'transparent' } : undefined}
                >
                  <IconByName name={t.icon} size={13} />
                  {t.tab || t.title}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3 sm:px-5 sm:py-4 lg:px-6">
        <div className="mx-auto w-full max-w-6xl pb-[max(2rem,env(safe-area-inset-bottom))] sm:pb-8">
          <AnimatePresence mode="wait" initial={false}>
            {diary ? (
              <motion.div
                key={`${diary.tracker.id}-${rangeId}-${boundsLabel}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                    style={{ background: diary.tracker.tabColor }}
                  >
                    <IconByName name={diary.tracker.icon} size={17} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-[15px] font-semibold tracking-tight text-[var(--ink)] sm:text-[16px]">
                      {diary.tracker.title}
                    </h3>
                    <p className="text-[11px] text-[var(--ink-soft)]">
                      {diary.loggedCount} logged · {diary.bounds.label}
                    </p>
                  </div>
                </div>

                {/* Mobile: 1-col stack (journal → chart). Desktop: 2-col side-by-side. */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
                  <section className="order-1 min-w-0">
                    <StoryCard className="overflow-hidden !p-0">
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--page-edge)]/40 px-3.5 py-3 sm:px-5">
                        <h4 className="font-display text-[13px] font-semibold text-[var(--ink)]">
                          Journal
                        </h4>
                        <span className="text-[10px] font-medium text-[var(--ink-soft)]">
                          {timeline.length
                            ? `${timeline.length} day${timeline.length === 1 ? '' : 's'}`
                            : 'Empty'}
                        </span>
                      </div>
                      {timeline.length ? (
                        <ul className="divide-y divide-[var(--page-edge)]/35">
                          {timeline.map((entry) => (
                            <DayRow key={entry.key} entry={entry} tracker={diary.tracker} />
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-7 sm:px-5 sm:py-8">
                          <p className="text-[13px] text-[var(--ink-soft)]">
                            No entries yet for this {diary.bounds.periodWord}.
                          </p>
                        </div>
                      )}
                    </StoryCard>
                  </section>

                  <aside className="order-2 min-w-0">
                    <div className="lg:sticky lg:top-2">
                      <TrackerChart diary={diary} />
                    </div>
                  </aside>
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
