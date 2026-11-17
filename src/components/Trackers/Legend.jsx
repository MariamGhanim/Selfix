import { useJournal } from '../../context/JournalContext'

export default function Legend({ trackerId, levels }) {
  const { state, setSelectedLevel } = useJournal()
  const selected = state.selectedLevel?.[trackerId]

  return (
    <div className="flex w-max min-w-full flex-nowrap items-center justify-start gap-1.5 px-0.5 sm:w-full sm:flex-wrap sm:justify-center">
      <button
        type="button"
        onClick={() => setSelectedLevel(trackerId, null)}
        className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-wide transition-colors duration-150 sm:min-h-0 sm:px-2 sm:py-0.5 sm:text-[9px] ${
          selected == null
            ? 'bg-[var(--accent-soft)]/80 text-[var(--accent-deep)] ring-1 ring-[var(--accent)]/35 shadow-sm'
            : 'bg-[#fffaf7] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/45'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        Cycle
      </button>
      {levels.map((level) => {
        const active = selected === level.value
        return (
          <button
            key={String(level.value)}
            onClick={() => setSelectedLevel(trackerId, active ? null : level.value)}
            type="button"
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-wide transition-colors duration-150 sm:min-h-0 sm:px-2 sm:py-0.5 sm:text-[9px] ${
              active
                ? 'ring-1 ring-[var(--accent-deep)]/40 shadow-sm'
                : 'ring-1 ring-[var(--page-edge)]/35'
            }`}
            style={{
              background: `color-mix(in srgb, ${level.color} ${active ? 28 : 14}%, #fffaf7)`,
              color: '#6a5560',
            }}
            title={level.label}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: level.color }}
            />
            <span>{level.label}</span>
          </button>
        )
      })}
    </div>
  )
}
