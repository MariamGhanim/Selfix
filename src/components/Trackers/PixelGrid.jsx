import { Fragment } from 'react'
import { DAYS, MONTHS, MONTHS_FULL, isValidDate } from '../../data/trackers'
import { useJournal } from '../../context/JournalContext'

export default function PixelGrid({
  trackerId,
  levels,
  onSelectDay,
  selectedDay,
  tapOpensLog = false,
}) {
  const { year, getPixel, paintPixel, state } = useJournal()

  const colorFor = (value) => {
    if (value == null) return 'var(--empty-cell)'
    return levels.find((l) => l.value === value)?.color ?? 'var(--empty-cell)'
  }

  return (
    <div className="pixel-matrix-stage">
      <div className="pixel-year-grid">
        <div aria-hidden />
        {MONTHS.map((m) => (
          <div key={m.id} className="pixel-month-label" title={MONTHS_FULL[m.id]}>
            <span>{m.short}</span>
          </div>
        ))}

        {DAYS.map((day) => (
          <Fragment key={day}>
            <div className="pixel-day-label" title={`Day ${day}`}>
              <span>{day}</span>
            </div>
            {MONTHS.map((m) => {
              const valid = isValidDate(year, m.id, day)
              const value = valid ? getPixel(trackerId, m.id, day) : null
              const isSelected =
                selectedDay && selectedDay.month === m.id && selectedDay.day === day

              return (
                <button
                  key={`${m.id}-${day}`}
                  type="button"
                  disabled={!valid}
                  title={valid ? `${MONTHS_FULL[m.id]} ${day}` : 'Invalid'}
                  onClick={() => {
                    if (!valid) return
                    if (tapOpensLog) {
                      if (state.selectedLevel?.[trackerId] != null) {
                        paintPixel(trackerId, m.id, day, levels)
                      }
                      onSelectDay?.({ month: m.id, day })
                      return
                    }
                    if (isSelected) {
                      paintPixel(trackerId, m.id, day, levels)
                    } else {
                      onSelectDay?.({ month: m.id, day })
                    }
                  }}
                  className={`pixel-btn h-full w-full ${
                    !valid ? 'cursor-not-allowed opacity-25' : 'cursor-pointer'
                  } ${isSelected ? 'is-selected' : ''}`}
                  style={{
                    background: valid ? colorFor(value) : 'var(--invalid-cell)',
                  }}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
