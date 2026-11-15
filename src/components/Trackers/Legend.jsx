import { motion } from 'framer-motion'
import { useJournal } from '../../context/JournalContext'

export default function Legend({ trackerId, levels }) {
  const { state, setSelectedLevel } = useJournal()
  const selected = state.selectedLevel?.[trackerId]

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedLevel(trackerId, null)}
        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
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
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
            selected === level.value ? 'ring-1 ring-[var(--accent-deep)] shadow-sm' : ''
          }`}
          style={{ background: level.color, color: '#2a2030' }}
          title={level.label}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full border border-black/10"
            style={{ background: level.color }}
          />
          <span>{level.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
