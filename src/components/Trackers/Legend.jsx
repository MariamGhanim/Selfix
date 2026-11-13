import { useJournal } from '../../context/JournalContext'

export default function Legend({ trackerId, levels }) {
  const { state, setSelectedLevel } = useJournal()
  const selected = state.selectedLevel?.[trackerId]

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => setSelectedLevel(trackerId, null)}
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition ${
          selected == null
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--accent-glow)] text-[var(--ink-soft)]'
        }`}
      >
        Cycle
      </button>
      {levels.map((level) => (
        <button
          key={String(level.value)}
          type="button"
          onClick={() =>
            setSelectedLevel(trackerId, selected === level.value ? null : level.value)
          }
          className={`inline-flex max-w-[5.5rem] items-center gap-1 truncate rounded-full px-1.5 py-0.5 text-[10px] font-bold transition ${
            selected === level.value ? 'ring-1 ring-[var(--accent-deep)]' : ''
          }`}
          style={{ background: level.color, color: '#2a2030' }}
          title={level.label}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full border border-black/10"
            style={{ background: level.color }}
          />
          <span className="truncate">{level.label}</span>
        </button>
      ))}
    </div>
  )
}
