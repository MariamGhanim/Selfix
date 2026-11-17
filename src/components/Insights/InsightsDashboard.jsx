import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight, Home, MapPin, ShoppingBag } from 'lucide-react'
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
    <div
      className="insights-pill-track insights-pill-track--compact inline-flex h-[30px] max-w-full shrink-0 items-center rounded-full p-0.5"
      role="group"
      aria-label="Diary range"
    >
      {DIARY_RANGES.map((range) => {
        const active = value === range.id
        return (
          <button
            key={range.id}
            type="button"
            onClick={() => onChange(range.id)}
            className={`inline-flex h-full items-center rounded-full px-3 text-[12px] font-semibold tracking-wide transition ${
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

function HabitSwitcher({ trackers, selectedId, onSelect, loggedIds }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const selected = trackers.find((t) => t.id === selectedId) || trackers[0]

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const active = listRef.current?.querySelector('[aria-selected="true"]')
    active?.focus?.()
  }, [open])

  const onListKeyDown = useCallback(
    (e) => {
      const buttons = [...(listRef.current?.querySelectorAll('button[role="option"]') || [])]
      if (!buttons.length) return
      const idx = buttons.findIndex((b) => b === document.activeElement)
      const cols = window.matchMedia('(min-width: 480px)').matches ? 4 : 3
      let next = idx
      if (e.key === 'ArrowRight') next = Math.min(buttons.length - 1, (idx < 0 ? 0 : idx) + 1)
      else if (e.key === 'ArrowLeft') next = Math.max(0, (idx < 0 ? 0 : idx) - 1)
      else if (e.key === 'ArrowDown') next = Math.min(buttons.length - 1, (idx < 0 ? 0 : idx) + cols)
      else if (e.key === 'ArrowUp') next = Math.max(0, (idx < 0 ? 0 : idx) - cols)
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = buttons.length - 1
      else return
      e.preventDefault()
      buttons[next]?.focus()
    },
    [],
  )

  if (!selected) return null

  return (
    <div ref={rootRef} className="insights-habit-switcher relative w-full min-w-0 shrink-0 sm:w-auto">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Habit, ${selected.tab || selected.title}`}
        onClick={() => setOpen((v) => !v)}
        className="insights-habit-trigger inline-flex h-10 w-full items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[var(--ink)] transition sm:h-8 sm:w-auto sm:max-w-[11.5rem] sm:px-2.5 sm:text-[12px]"
      >
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white sm:h-5 sm:w-5"
          style={{ background: selected.tabColor }}
          aria-hidden
        >
          <IconByName name={selected.icon} size={12} />
        </span>
        <span className="min-w-0 flex-1 truncate text-left sm:flex-none">{selected.tab || selected.title}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--accent-deep)] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="insights-habit-backdrop"
            aria-label="Close habit menu"
            onClick={() => setOpen(false)}
          />
          <div
            ref={listRef}
            role="listbox"
            aria-label="Habits"
            tabIndex={-1}
            onKeyDown={onListKeyDown}
            className="insights-habit-popover z-40 p-2 shadow-[0_14px_32px_rgba(160,110,125,0.16)] sm:absolute sm:right-0 sm:top-[calc(100%+0.4rem)] sm:w-[min(18.5rem,calc(100vw-2rem))] sm:rounded-2xl"
          >
            <div className="mb-2 flex items-center justify-between px-1 sm:hidden">
              <p className="font-display text-[14px] font-semibold text-[var(--ink)]">Habits</p>
              <button
                type="button"
                className="rounded-full px-2 py-1 text-[12px] font-semibold text-[var(--ink-soft)]"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {trackers.map((t) => {
                const active = t.id === selected.id
                const hasLog = loggedIds?.has(t.id)
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onSelect(t.id)
                      setOpen(false)
                    }}
                    className={`insights-habit-option relative flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-center transition sm:min-h-[3.35rem] ${
                      active ? 'is-active' : ''
                    }`}
                    style={
                      active
                        ? {
                            background: `color-mix(in srgb, ${t.tabColor} 22%, var(--surface-strong))`,
                            boxShadow: `inset 0 0 0 1.5px ${t.tabColor}`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                      style={{ background: t.tabColor }}
                      aria-hidden
                    >
                      <IconByName name={t.icon} size={12} />
                    </span>
                    <span className="w-full truncate text-[10px] font-semibold leading-tight text-[var(--ink)]">
                      {t.tab || t.title}
                    </span>
                    {hasLog ? (
                      <span
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                        style={{ background: t.tabColor }}
                        aria-hidden
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      ) : null}
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
      background: 'color-mix(in srgb, #e0c4e0 42%, var(--legend-chip-base))',
      color: 'var(--legend-chip-text)',
      ring: 'color-mix(in srgb, #e0c4e0 55%, transparent)',
    }
  }
  if (tone === 'rose') {
    return {
      background: 'color-mix(in srgb, #f2b8c6 38%, var(--legend-chip-base))',
      color: 'var(--legend-chip-text)',
      ring: 'color-mix(in srgb, #f2b8c6 50%, transparent)',
    }
  }
  return {
    background: 'color-mix(in srgb, var(--accent-soft) 40%, var(--legend-chip-base))',
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
  const mobileStatus = badge?.label || entry.headline || null

  return (
    <li className="insights-day-row px-3.5 py-3.5 sm:px-4 sm:py-3.5">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: color }}
          aria-hidden
        >
          <IconByName name={tracker.icon} size={15} />
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          {/* Mobile: date left, status right. Desktop: original wrap layout. */}
          <div className="flex items-center justify-between gap-2 sm:hidden">
            <p className="insights-day-date min-w-0 truncate font-display text-[13px] font-bold text-[var(--accent-deep)]">
              {entry.label}
            </p>
            {mobileStatus ? (
              <span
                className="insights-day-status inline-flex max-w-[48%] shrink-0 items-center truncate rounded-full px-2 py-0.5 text-right text-[11px] font-semibold leading-snug text-[var(--ink)]"
                style={
                  badge
                    ? {
                        background: badgeTone.background,
                        color: badgeTone.color,
                        boxShadow: `inset 0 0 0 1px ${badgeTone.ring}`,
                      }
                    : undefined
                }
              >
                {mobileStatus}
              </span>
            ) : null}
          </div>

          <div className="hidden flex-col gap-1 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3 sm:gap-y-1">
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
            <p className="insights-day-details mt-1 text-[12px] leading-relaxed text-[var(--ink-soft)]">
              {details.join(' · ')}
            </p>
          ) : null}
          {notes.length ? (
            <div className="mt-2 space-y-1.5">
              {notes.map((note) => (
                <p
                  key={note}
                  dir="auto"
                  className="insights-day-note rounded-xl bg-[var(--surface)]/70 px-3 py-2 text-start text-[13px] leading-[1.6] text-[var(--ink)] ring-1 ring-[var(--page-edge)]/35 sm:text-[12px] sm:leading-relaxed"
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
  return `color-mix(in srgb, ${color} 78%, var(--legend-chip-base))`
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
    <StoryCard className="insights-chart-card insights-status-card flex h-full min-h-0 flex-col overflow-y-auto px-3 py-3.5 sm:px-5 sm:py-4">
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
                    background: `color-mix(in srgb, ${item.color} 18%, var(--legend-chip-base))`,
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
              background: 'color-mix(in srgb, var(--accent-soft) 35%, var(--legend-chip-base))',
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
  const barMargin = model.margin || { top: 8, right: 10, left: 0, bottom: 8 }
  const yAxisWidth = model.axisWidth ?? (model.kind === 'area' ? 44 : 48)
  const yTickStyle = model.axisWidth
    ? { fill: axisColor, fontSize: 11, whiteSpace: 'nowrap' }
    : { fill: axisColor, fontSize: 10 }

  return (
    <StoryCard className="insights-chart-card flex h-full min-h-0 flex-col overflow-hidden px-3 py-3.5 sm:px-5 sm:py-4">
      <div className="mb-2 shrink-0">
        <p className="font-display text-[14px] font-semibold text-[var(--ink)] sm:text-[15px]">
          {model.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">{diary.bounds.label}</p>
      </div>

      {model.kind === 'empty' ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-[1.2rem] bg-[var(--surface)]/55 px-5 py-8 text-center ring-1 ring-[var(--page-edge)]/35 sm:px-6">
          <p className="max-w-[14rem] text-[13px] leading-relaxed text-[var(--ink-soft)]">
            {model.message || 'Nothing to chart yet.'}
          </p>
        </div>
      ) : (
        <div className="relative min-h-0 w-full flex-1">
          <div className="absolute inset-0 min-h-0">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              {model.kind === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 8 }}>
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

  const loggedIds = useMemo(() => {
    const ids = new Set()
    for (const t of trackers) {
      const d = buildTrackerDiary(state, t.id, rangeId, year, anchor)
      if (d?.loggedCount > 0) ids.add(t.id)
    }
    return ids
  }, [trackers, state, rangeId, year, anchor])

  return (
    <div data-no-flip className="insights-shell flex h-full min-h-0 flex-col overflow-hidden">
      <div className="insights-scroll-root flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] sm:overflow-hidden">
        <header className="insights-header sticky top-0 z-[5] shrink-0 px-3 pt-3 pb-2.5 sm:static sm:px-6 sm:pt-4 sm:pb-3">
          <div className="insights-header__row flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <h2 className="insights-header__title shrink-0 font-display text-[18px] font-bold tracking-tight text-[var(--ink)] sm:text-[20px]">
              Insights Logbook
            </h2>

            <div className="insights-header__toggle shrink-0">
              <PeriodSwitcher
                value={rangeId}
                onChange={(id) => {
                  setRangeId(id)
                  setAnchor(new Date())
                }}
              />
            </div>

            <div className="insights-week-pill flex min-w-0 items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => shift(-1)}
                disabled={!canGoPrev}
                className="insights-nav-btn inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-1 disabled:cursor-default disabled:opacity-35 sm:h-7 sm:w-7 sm:p-0"
                aria-label="Previous period"
              >
                <ChevronLeft size={15} />
              </button>
              <p className="min-w-0 truncate px-1 text-center font-display text-[13px] font-semibold text-[var(--accent-deep)]">
                {boundsLabel}
              </p>
              <button
                type="button"
                onClick={() => shift(1)}
                disabled={!canGoNext}
                className="insights-nav-btn inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-1 disabled:cursor-default disabled:opacity-35 sm:h-7 sm:w-7 sm:p-0"
                aria-label="Next period"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </header>

        <div className="insights-body mx-auto flex w-full max-w-6xl flex-1 flex-col px-2.5 pt-2.5 pb-[calc(72px+env(safe-area-inset-bottom))] sm:min-h-0 sm:overflow-hidden sm:px-5 sm:pb-4 lg:px-6">
          <AnimatePresence mode="wait" initial={false}>
            {diary ? (
              <motion.div
                key={`${diary.tracker.id}-${rangeId}-${boundsLabel}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-3 sm:min-h-0 sm:flex-1"
              >
                <div className="insights-tracker-bar flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white shadow-md sm:h-10 sm:w-10"
                      style={{ background: diary.tracker.tabColor }}
                    >
                      <IconByName name={diary.tracker.icon} size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-[15px] font-semibold tracking-tight text-[var(--ink)] sm:text-[16px]">
                        {diary.tracker.title}
                      </h3>
                      <p className="text-[11px] text-[var(--ink-soft)]">
                        {diary.loggedCount} logged · {diary.bounds.label}
                      </p>
                    </div>
                  </div>
                  <HabitSwitcher
                    trackers={trackers}
                    selectedId={selectedTracker?.id}
                    onSelect={setSelectedId}
                    loggedIds={loggedIds}
                  />
                </div>

                <div className="insights-cards grid grid-cols-1 gap-3 sm:min-h-0 sm:flex-1 lg:grid-cols-2 lg:gap-5">
                  <section className="insights-journal-pane flex min-w-0 flex-col sm:min-h-0 sm:overflow-hidden">
                    <StoryCard className="insights-journal-card flex flex-col !p-0 sm:h-full sm:min-h-0 sm:overflow-hidden">
                      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--page-edge)]/40 px-3.5 py-2.5 sm:px-5">
                        <h4 className="font-display text-[13px] font-semibold text-[var(--ink)]">
                          Journal
                        </h4>
                        <span className="text-[10px] font-medium text-[var(--ink-soft)]">
                          {timeline.length
                            ? `${timeline.length} day${timeline.length === 1 ? '' : 's'}`
                            : 'Empty'}
                        </span>
                      </div>
                      <div className="insights-pane-scroll sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:overscroll-contain">
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
                      </div>
                    </StoryCard>
                  </section>

                  <aside className="insights-chart-pane flex min-w-0 flex-col sm:min-h-0 sm:overflow-hidden max-lg:sm:min-h-[16rem]">
                    <TrackerChart diary={diary} />
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
