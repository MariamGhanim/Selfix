import { Fragment } from 'react'
import { DAYS, MONTHS, MONTHS_FULL, isValidDate } from '../../data/trackers'
import { useJournal } from '../../context/JournalContext'

export default function PixelGrid({ trackerId, levels, onSelectDay, selectedDay }) {
  const { year, getPixel, paintPixel } = useJournal()

  const colorFor = (value) => {
    if (value == null) return 'var(--empty-cell)'
    return levels.find((l) => l.value === value)?.color ?? 'var(--empty-cell)'
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className="grid h-full w-full gap-[2px]"
        style={{
          gridTemplateColumns: `18px repeat(12, minmax(0, 1fr))`,
          gridTemplateRows: `14px repeat(31, minmax(0, 1fr))`,
        }}
      >
        <div />
        {MONTHS.map((m) => (
          <div
            key={m.id}
            className="flex items-end justify-center pb-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--ink-soft)]"
            title={MONTHS_FULL[m.id]}
          >
            {m.short}
          </div>
        ))}

        {DAYS.map((day) => (
          <Fragment key={day}>
            <div className="flex items-center justify-center text-[8px] font-semibold leading-none text-[var(--ink-soft)]">
              {day}
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
                    paintPixel(trackerId, m.id, day, levels)
                    onSelectDay?.({ month: m.id, day })
                  }}
                  className={`pixel-btn h-full min-h-0 w-full rounded-[3px] ${
                    !valid ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'
                  } ${isSelected ? 'ring-1 ring-[var(--accent-deep)] ring-offset-0' : ''}`}
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
