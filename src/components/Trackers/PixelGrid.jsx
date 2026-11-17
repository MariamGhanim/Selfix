import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { DAYS, MONTHS, MONTHS_FULL, cellKey, isValidDate } from '../../data/trackers'
import { useJournal } from '../../context/JournalContext'
import { scoreSleep } from '../../lib/sleepQuality'

const EMPTY_BG = 'var(--empty-cell)'
const INVALID_BG = 'var(--invalid-cell)'

const PixelCell = memo(function PixelCell({
  valid,
  background,
  isSelected,
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
      className={`pixel-btn ${className} ${
        !valid ? 'cursor-not-allowed opacity-25' : 'cursor-pointer'
      } ${isSelected ? 'is-selected' : ''}`}
      style={{ background }}
    />
  )
})

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
          return (
            <div key={key} className="relative aspect-square min-h-10">
              <PixelCell
                valid
                background={visual.background}
                isSelected={selectedKey === key}
                title={`${MONTHS_FULL[month]} ${day}`}
                month={month}
                day={day}
                onActivate={onActivate}
                className="absolute inset-0 h-full w-full !rounded-[0.55rem]"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[var(--ink)]/75">
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
}) {
  const { year, state, paintPixel } = useJournal()
  const pixels = state.pixels
  const panels = state.panels
  const selectedPaint = state.selectedLevel?.[trackerId]

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

      // Mobile (tapOpensLog): one tap paints when a color is selected, and
      // always updates the selected day — without opening the log sheet.
      if (tapOpensLogRef.current) {
        if (selectedPaintRef.current != null) {
          paintPixel(trackerId, month, day, levels)
        }
        onSelectDay?.({ month, day })
        return
      }

      if (isSelected) {
        paintPixel(trackerId, month, day, levels)
      } else {
        onSelectDay?.({ month, day })
      }
    },
    [trackerId, levels, paintPixel, onSelectDay],
  )

  const monthLabels = useMemo(
    () =>
      MONTHS.map((m) => (
        <div key={m.id} className="pixel-month-label" title={MONTHS_FULL[m.id]}>
          <span>{m.short}</span>
        </div>
      )),
    [],
  )

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
          const isSelected = selectedKey === key
          const background = !valid
            ? INVALID_BG
            : value == null
              ? EMPTY_BG
              : (colorByValue.get(value) ?? EMPTY_BG)

          return (
            <PixelCell
              key={key}
              valid={!!valid}
              background={background}
              isSelected={isSelected}
              title={valid ? `${MONTHS_FULL[m.id]} ${day}` : 'Invalid'}
              month={m.id}
              day={day}
              onActivate={onActivate}
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
    validityByCell,
    colorByValue,
    selectedKey,
    onActivate,
  ])

  return (
    <div className="h-full min-h-0 w-full min-w-0" data-no-flip>
      <div className="h-full min-h-0 md:hidden">
        <MobileYearBoard
          year={year}
          selectedDay={selectedDay}
          selectedKey={selectedKey}
          onActivate={onActivate}
          cellVisual={cellVisual}
        />
      </div>
      <div className="pixel-matrix-stage hidden h-full w-full min-w-0 md:flex">
        <div className="pixel-year-grid" role="grid" aria-label="Year in pixels">
          <div aria-hidden />
          {monthLabels}
          {rows}
        </div>
      </div>
    </div>
  )
}

export default memo(PixelGrid)
