import { motion } from 'framer-motion'
import { useJournal } from '../../context/JournalContext'

export default function Legend({ trackerId, levels }) {
  const { state, setSelectedLevel } = useJournal()
  const selected = state.selectedLevel?.[trackerId]

  return (
    <div className="flex w-max min-w-full flex-nowrap items-center gap-2 sm:gap-1.5">
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedLevel(trackerId, null)}
        className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[10px] ${
          selected == null
            ? 'bg-[var(--accent)] text-white shadow-sm'
            : 'bg-[var(--accent-glow)] text-[var(--ink-soft)]'
        }`}
      >
        Cycle
      </motion.button>
      {levels.map((level) => (
        <motion.button
          key={String(level.value)}
          type="button"
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setSelectedLevel(trackerId, selected === level.value ? null : level.value)
          }
          className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[10px] ${
            selected === level.value ? 'ring-1 ring-[var(--accent-deep)] shadow-sm' : ''
          }`}
          style={{ background: level.color, color: '#2a2030' }}
          title={level.label}
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10 sm:h-2 sm:w-2"
            style={{ background: level.color }}
          />
          <span>{level.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
