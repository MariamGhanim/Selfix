import { Fragment, memo, useCallback, useMemo, useRef } from 'react'
import { DAYS, MONTHS, MONTHS_FULL, cellKey, isValidDate } from '../../data/trackers'
import { useJournal } from '../../context/JournalContext'

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
}) {
  return (
    <button
      type="button"
      disabled={!valid}
      title={title}
      data-month={month}
      data-day={day}
      onClick={onActivate}
      className={`pixel-btn h-full w-full ${
        !valid ? 'cursor-not-allowed opacity-25' : 'cursor-pointer'
      } ${isSelected ? 'is-selected' : ''}`}
      style={{ background }}
    />
  )
})

function PixelGrid({
  trackerId,
  levels,
  onSelectDay,
  selectedDay,
  tapOpensLog = false,
}) {
  const { year, state, paintPixel } = useJournal()
  const pixels = state.pixels
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

  const onActivate = useCallback(
    (e) => {
      const btn = e.currentTarget
      if (btn.disabled) return
      const month = Number(btn.dataset.month)
      const day = Number(btn.dataset.day)
      const sel = selectedDayRef.current
      const isSelected = sel != null && sel.month === month && sel.day === day

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
          const value = valid
            ? (pixels?.[`${trackerId}:${cellKey(year, m.id, day)}`] ?? null)
            : null
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
    trackerId,
    year,
    validityByCell,
    colorByValue,
    selectedKey,
    onActivate,
  ])

  return (
    <div className="pixel-matrix-stage">
      <div className="pixel-year-grid">
        <div aria-hidden />
        {monthLabels}
        {rows}
      </div>
    </div>
  )
}

export default memo(PixelGrid)
