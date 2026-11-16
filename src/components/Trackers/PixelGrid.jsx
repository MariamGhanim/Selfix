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
    <div className="flex h-full min-h-0 w-full max-w-full flex-col overflow-x-hidden pt-0.5">
      <div className="pixel-year-grid">
        <div aria-hidden />
        {MONTHS.map((m) => (
          <div key={m.id} className="pixel-month-label" title={MONTHS_FULL[m.id]}>
            <span aria-hidden>{m.short}</span>
          </div>
        ))}

        {DAYS.map((day) => (
          <Fragment key={day}>
            <div className="pixel-day-label" aria-hidden={false} title={`Day ${day}`}>
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
                  className={`pixel-btn h-full min-h-[24px] w-full rounded-[4px] md:min-h-0 md:rounded-[3px] ${
                    !valid ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'
                  } ${
                    isSelected
                      ? 'z-[1] ring-2 ring-[var(--accent-deep)] ring-offset-1 ring-offset-[var(--paper)]'
                      : ''
                  }`}
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
