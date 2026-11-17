import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { DAYS, MONTHS, MONTHS_FULL, cellKey, isValidDate } from '../../data/trackers'
import { useJournal } from '../../context/JournalContext'
import { scoreSleep } from '../../lib/sleepQuality'

const EMPTY_BG = 'var(--empty-cell)'
const INVALID_BG = 'var(--invalid-cell)'

/** Relative luminance of a #rrggbb fill — used only for Night number contrast. */
function isLightFillColor(color) {
  if (!color || typeof color !== 'string' || color[0] !== '#' || color.length < 7) return false
  const r = parseInt(color.slice(1, 3), 16) / 255
  const g = parseInt(color.slice(3, 5), 16) / 255
  const b = parseInt(color.slice(5, 7), 16) / 255
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return L > 0.45
}

const PixelCell = memo(function PixelCell({
  valid,
  background,
  isSelected,
  isToday = false,
  title,
  month,
  day,
  onActivate,
  className = 'h-full w-full',
}) {
  return (
    <button
      type="button"
      disabled={!valid}
      title={title}
      data-month={month}
      data-day={day}
      onClick={onActivate}
      aria-current={isToday ? 'date' : undefined}
      className={`pixel-btn ${className} ${
        !valid ? 'cursor-not-allowed opacity-25' : 'cursor-pointer'
      } ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
      style={{ background }}
    />
  )
})

/** Calendar day only — no clock time. */
function getTodayParts() {
  const d = new Date()
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
  }
}

function MobileMonthSelect({ month, onChange, year }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const monthMeta = MONTHS[month]

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0 px-1">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Month filter, ${monthMeta?.label || MONTHS_FULL[month]} ${year}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-full border border-[var(--page-edge)]/70 bg-[var(--surface-strong)] px-3.5 text-[13px] font-semibold text-[var(--ink)] shadow-[0_1px_0_rgba(255,255,255,0.45)_inset] transition active:scale-[0.98]"
      >
        <span className="truncate font-display tracking-tight">
          {monthMeta?.label || MONTHS_FULL[month]}
        </span>
        <span className="text-[11px] font-medium text-[var(--ink-soft)]">{year}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-[var(--accent-deep)] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Select month"
          className="absolute left-1 top-[calc(100%+0.35rem)] z-30 max-h-56 w-[min(12.5rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--page-edge)]/75 bg-[var(--surface-strong)] py-1.5 shadow-[0_12px_28px_rgba(160,110,125,0.14)] [-webkit-overflow-scrolling:touch]"
        >
          {MONTHS.map((m) => {
            const active = m.id === month
            return (
              <li key={m.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(m.id)
                    setOpen(false)
                  }}
                  className={`flex min-h-10 w-full items-center px-3.5 text-left text-[13px] font-medium transition ${
                    active
                      ? 'bg-[var(--accent-glow)] font-semibold text-[var(--accent-deep)]'
                      : 'text-[var(--ink)] hover:bg-[var(--accent-glow)]/55'
                  }`}
                >
                  {m.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function MobileYearBoard({
  year,
  selectedDay,
  selectedKey,
  onActivate,
  cellVisual,
  todayParts,
}) {
  const [month, setMonth] = useState(
    () => selectedDay?.month ?? new Date().getMonth(),
  )

  useEffect(() => {
    if (selectedDay?.month != null) setMonth(selectedDay.month)
  }, [selectedDay?.month])

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-2.5 px-1.5 pb-1 pt-1">
      <MobileMonthSelect month={month} onChange={setMonth} year={year} />

      <div className="grid min-h-0 flex-1 grid-cols-7 content-start gap-1.5 overflow-y-auto overscroll-contain px-0.5 pb-1 [-webkit-overflow-scrolling:touch]">
        {DAYS.map((day) => {
          const visual = cellVisual(month, day)
          if (!visual.valid) return null
          const key = `${month}-${day}`
          const isToday =
            todayParts.year === year &&
            todayParts.month === month &&
            todayParts.day === day
          return (
            <div key={key} className="relative aspect-square min-h-10">
              <PixelCell
                valid
                background={visual.background}
                isSelected={selectedKey === key}
                isToday={isToday}
                title={`${MONTHS_FULL[month]} ${day}`}
                month={month}
                day={day}
                onActivate={onActivate}
                className={`absolute inset-0 h-full w-full !rounded-[0.55rem] ${
                  visual.value != null
                    ? `is-filled${isLightFillColor(visual.background) ? ' is-light-fill' : ''}`
                    : 'is-empty'
                }`}
              />
              <span
                className={`pixel-day-num pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-bold leading-none ${
                  visual.value != null
                    ? `is-on-fill${isLightFillColor(visual.background) ? ' is-on-light-fill' : ''}`
                    : ''
                } ${isToday ? 'text-[var(--accent-deep)]' : 'text-[var(--ink)]/80'}`}
              >
                {day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ViewModeToggle({ mode, onChange, compact = false }) {
  return (
    <div
      className={`pixel-view-toggle inline-flex shrink-0 rounded-full border border-[var(--page-edge)]/65 bg-[var(--surface)] p-0.5${
        compact ? ' pixel-view-toggle--compact' : ''
      }`}
      role="group"
      aria-label="Pixel grid view"
    >
      {[
        { id: 'month', label: 'Month' },
        { id: 'year', label: 'Year' },
      ].map((opt) => {
        const active = mode === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={`rounded-full font-semibold tracking-wide transition ${
              compact
                ? 'h-[26px] px-3 text-[12px] leading-none'
                : 'px-3 py-1.5 text-[11px]'
            } ${
              active
                ? 'bg-[var(--toggle-active)] text-white shadow-sm'
                : 'text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]/70 hover:text-[var(--ink)]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function DesktopMonthBoard({
  year,
  month,
  onMonthChange,
  selectedKey,
  onActivate,
  cellVisual,
  viewToggle,
  todayParts,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const monthMeta = MONTHS[month]

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="pixel-month-board flex h-full min-h-0 w-full min-w-0 flex-col gap-2.5">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2 px-0.5">
        <div ref={rootRef} className="pixel-month-dropdown relative z-20 min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--ink-soft)]">
            Month in pixels
          </p>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Select month, ${monthMeta?.label || MONTHS_FULL[month]} ${year}`}
            onClick={() => setOpen((v) => !v)}
            className="pixel-month-dropdown__trigger group mt-0.5 inline-flex max-w-full items-center gap-1.5 rounded-xl py-0.5 text-left transition hover:bg-[var(--accent-glow)]/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <h3 className="font-display text-[1.15rem] font-semibold tracking-tight text-[var(--ink)]">
              {monthMeta?.label || MONTHS_FULL[month]}{' '}
              <span className="font-medium text-[var(--ink-soft)]">{year}</span>
            </h3>
            <ChevronDown
              size={16}
              className={`mt-0.5 shrink-0 text-[var(--accent-deep)] transition-transform duration-200 group-hover:text-[var(--accent-deep)] ${
                open ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
          </button>

          {open ? (
            <ul
              role="listbox"
              aria-label="Months"
              className="pixel-month-dropdown__menu absolute left-0 top-[calc(100%+0.35rem)] z-30 max-h-64 w-[min(13.5rem,calc(100vw-4rem))] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--page-edge)]/70 py-1.5 shadow-[0_14px_32px_rgba(160,110,125,0.16)]"
            >
              {MONTHS.map((m) => {
                const active = m.id === month
                return (
                  <li key={m.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => {
                        onMonthChange(m.id)
                        setOpen(false)
                      }}
                      className={`flex min-h-9 w-full items-center px-3.5 text-left text-[13px] font-medium transition ${
                        active
                          ? 'bg-[var(--accent-glow)] font-semibold text-[var(--accent-deep)]'
                          : 'text-[var(--ink)] hover:bg-[var(--accent-glow)]/75 hover:text-[var(--accent-deep)]'
                      }`}
                    >
                      {m.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        {viewToggle}
      </div>

      <div className="pixel-month-grid grid min-h-0 flex-1 grid-cols-7 content-start gap-2 overflow-y-auto overscroll-contain pb-1 pr-0.5">
        {DAYS.map((day) => {
          const visual = cellVisual(month, day)
          if (!visual.valid) return null
          const key = `${month}-${day}`
          const isToday =
            todayParts.year === year &&
            todayParts.month === month &&
            todayParts.day === day
          return (
            <div key={key} className="relative aspect-square min-h-[2.35rem]">
              <PixelCell
                valid
                background={visual.background}
                isSelected={selectedKey === key}
                isToday={isToday}
                title={`${MONTHS_FULL[month]} ${day}, ${year}`}
                month={month}
                day={day}
                onActivate={onActivate}
                className={`absolute inset-0 h-full w-full !rounded-[0.65rem] ${
                  visual.value != null
                    ? `is-filled${isLightFillColor(visual.background) ? ' is-light-fill' : ''}`
                    : 'is-empty'
                }`}
              />
              <span
                className={`pixel-day-num pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] font-bold leading-none ${
                  visual.value != null
                    ? `is-on-fill${isLightFillColor(visual.background) ? ' is-on-light-fill' : ''}`
                    : ''
                } ${isToday ? 'text-[var(--accent-deep)]' : 'text-[var(--ink)]/85'}`}
              >
                {day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PixelGrid({
  trackerId,
  levels,
  onSelectDay,
  selectedDay,
  tapOpensLog = false,
  desktopView: desktopViewProp,
  onDesktopViewChange,
  onYearStats,
}) {
  const { year, state, paintPixel } = useJournal()
  const pixels = state.pixels
  const panels = state.panels
  const selectedPaint = state.selectedLevel?.[trackerId]

  const [desktopViewInternal, setDesktopViewInternal] = useState('month')
  const desktopView = desktopViewProp ?? desktopViewInternal
  const setDesktopView = onDesktopViewChange ?? setDesktopViewInternal
  const [desktopMonth, setDesktopMonth] = useState(
    () => selectedDay?.month ?? new Date().getMonth(),
  )
  const todayParts = useMemo(() => getTodayParts(), [])

  useEffect(() => {
    if (selectedDay?.month != null) setDesktopMonth(selectedDay.month)
  }, [selectedDay?.month])

  // Keep month selection when the year changes (e.g. November 2025 ↔ 2026)
  useEffect(() => {
    setDesktopMonth((m) => (m >= 0 && m <= 11 ? m : new Date().getMonth()))
  }, [year])

  const selectedDayRef = useRef(selectedDay)
  selectedDayRef.current = selectedDay
  const selectedPaintRef = useRef(selectedPaint)
  selectedPaintRef.current = selectedPaint
  const tapOpensLogRef = useRef(tapOpensLog)
  tapOpensLogRef.current = tapOpensLog

  const colorByValue = useMemo(() => {
    const map = new Map()
    for (const level of levels) map.set(level.value, level.color)
    return map
  }, [levels])

  const validityByCell = useMemo(() => {
    const map = new Map()
    for (const m of MONTHS) {
      for (const day of DAYS) {
        map.set(`${m.id}-${day}`, isValidDate(year, m.id, day))
      }
    }
    return map
  }, [year])

  const selectedKey =
    selectedDay != null ? `${selectedDay.month}-${selectedDay.day}` : null

  const cellVisual = useCallback(
    (month, day) => {
      const valid = validityByCell.get(`${month}-${day}`)
      if (!valid) return { valid: false, background: INVALID_BG }
      let value = pixels?.[`${trackerId}:${cellKey(year, month, day)}`] ?? null
      if (trackerId === 'sleep') {
        const panel = panels?.[`sleep:${cellKey(year, month, day)}`]
        if (panel) {
          const scored = scoreSleep(panel)
          if (scored.pixelLevel != null) value = scored.pixelLevel
        }
      }
      const background =
        value == null ? EMPTY_BG : (colorByValue.get(value) ?? EMPTY_BG)
      return { valid: true, background, value }
    },
    [validityByCell, pixels, panels, trackerId, year, colorByValue],
  )

  const onActivate = useCallback(
    (e) => {
      const btn = e.currentTarget
      if (btn.disabled) return
      const month = Number(btn.dataset.month)
      const day = Number(btn.dataset.day)
      const sel = selectedDayRef.current
      const isSelected = sel != null && sel.month === month && sel.day === day
      const brush = selectedPaintRef.current != null

      // Brush mode (legend pill selected): one click paints that color and
      // selects the day — same on desktop Month/Year and mobile.
      if (brush) {
        paintPixel(trackerId, month, day, levels)
        onSelectDay?.({ month, day })
        return
      }

      // Mobile Cycle mode: select only (no auto-open log).
      if (tapOpensLogRef.current) {
        onSelectDay?.({ month, day })
        return
      }

      // Desktop Cycle mode: first click selects, second click on same cell cycles.
      if (isSelected) {
        paintPixel(trackerId, month, day, levels)
      } else {
        onSelectDay?.({ month, day })
      }
    },
    [trackerId, levels, paintPixel, onSelectDay],
  )

  const currentMonthId =
    todayParts.year === year ? todayParts.month : -1

  const monthLabels = useMemo(
    () =>
      MONTHS.map((m) => (
        <div
          key={m.id}
          className={`pixel-month-label${
            m.id === currentMonthId ? ' is-current-month' : ''
          }`}
          title={m.label}
        >
          <span>{MONTHS_FULL[m.id]}</span>
        </div>
      )),
    [currentMonthId],
  )

  const yearStats = useMemo(() => {
    let logged = 0
    let total = 0
    for (const m of MONTHS) {
      for (const day of DAYS) {
        if (!validityByCell.get(`${m.id}-${day}`)) continue
        total += 1
        let value = pixels?.[`${trackerId}:${cellKey(year, m.id, day)}`] ?? null
        if (trackerId === 'sleep') {
          const panel = panels?.[`sleep:${cellKey(year, m.id, day)}`]
          if (panel) {
            const scored = scoreSleep(panel)
            if (scored.pixelLevel != null) value = scored.pixelLevel
          }
        }
        if (value != null) logged += 1
      }
    }
    return { logged, total }
  }, [validityByCell, pixels, panels, trackerId, year])

  useEffect(() => {
    onYearStats?.(yearStats)
  }, [yearStats, onYearStats])

  const rows = useMemo(() => {
    return DAYS.map((day) => (
      <Fragment key={day}>
        <div className="pixel-day-label" title={`Day ${day}`}>
          <span>{day}</span>
        </div>
        {MONTHS.map((m) => {
          const key = `${m.id}-${day}`
          const valid = validityByCell.get(key)
          let value = valid ? (pixels?.[`${trackerId}:${cellKey(year, m.id, day)}`] ?? null) : null
          if (trackerId === 'sleep' && valid) {
            const panel = panels?.[`sleep:${cellKey(year, m.id, day)}`]
            if (panel) {
              const scored = scoreSleep(panel)
              if (scored.pixelLevel != null) value = scored.pixelLevel
            }
          }
          const level =
            value != null ? levels.find((l) => l.value === value) : null
          const isSelected = selectedKey === key
          const isToday =
            todayParts.year === year &&
            todayParts.month === m.id &&
            todayParts.day === day
          const isCurrentMonth = m.id === currentMonthId
          const filled = valid && value != null
          const background = filled
            ? (colorByValue.get(value) ?? EMPTY_BG)
            : 'transparent'
          const tip = !valid
            ? undefined
            : level
              ? `${MONTHS_FULL[m.id]} ${day} · ${level.label}`
              : `${MONTHS_FULL[m.id]} ${day}`

          return (
            <PixelCell
              key={key}
              valid={!!valid}
              background={background}
              isSelected={isSelected}
              isToday={isToday}
              title={tip}
              month={m.id}
              day={day}
              onActivate={onActivate}
              className={[
                'h-full w-full',
                filled ? 'is-filled' : '',
                filled && isLightFillColor(background) ? 'is-light-fill' : '',
                valid && !filled ? 'is-empty' : '',
                !valid ? 'is-invalid-day' : '',
                isCurrentMonth ? 'is-current-month' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          )
        })}
      </Fragment>
    ))
  }, [
    pixels,
    panels,
    trackerId,
    year,
    levels,
    validityByCell,
    colorByValue,
    selectedKey,
    onActivate,
    todayParts,
    currentMonthId,
  ])

  const brushActive = selectedPaint != null

  return (
    <div
      className={`h-full min-h-0 w-full min-w-0${brushActive ? ' is-brush-mode' : ''}`}
      data-no-flip
      data-brush={brushActive ? String(selectedPaint) : undefined}
    >
      <div className="h-full min-h-0 md:hidden">
        <MobileYearBoard
          year={year}
          selectedDay={selectedDay}
          selectedKey={selectedKey}
          onActivate={onActivate}
          cellVisual={cellVisual}
          todayParts={todayParts}
        />
      </div>

      <div className="hidden h-full min-h-0 w-full min-w-0 flex-col md:flex">
        {desktopView === 'month' ? (
          <div className="pixel-matrix-stage pixel-matrix-stage--month min-h-0 flex-1">
            <DesktopMonthBoard
              year={year}
              month={desktopMonth}
              onMonthChange={setDesktopMonth}
              selectedKey={selectedKey}
              onActivate={onActivate}
              cellVisual={cellVisual}
              todayParts={todayParts}
              viewToggle={
                <ViewModeToggle mode={desktopView} onChange={setDesktopView} />
              }
            />
          </div>
        ) : (
          <div className="pixel-matrix-stage pixel-matrix-stage--year min-h-0 flex-1">
            <div className="pixel-year-grid" role="grid" aria-label="Year in pixels">
              <div aria-hidden />
              {monthLabels}
              {rows}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(PixelGrid)
