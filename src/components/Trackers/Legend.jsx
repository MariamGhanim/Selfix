import { motion } from 'framer-motion'
import { useJournal } from '../../context/JournalContext'

export default function Legend({ trackerId, levels }) {
  const { state, setSelectedLevel } = useJournal()
  const selected = state.selectedLevel?.[trackerId]

  return (
    <div className="flex w-max min-w-full flex-nowrap items-center justify-center gap-1.5">
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setSelectedLevel(trackerId, null)}
        className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-wide transition-colors duration-150 sm:min-h-0 sm:px-2 sm:py-1 sm:text-[9px] ${
          selected == null
            ? 'bg-[var(--accent-soft)]/80 text-[var(--accent-deep)] ring-1 ring-[var(--accent)]/35 shadow-sm'
            : 'bg-[#fffaf7] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/45'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        Cycle
      </motion.button>
      {levels.map((level) => {
        const active = selected === level.value
        return (
          <motion.button
            key={String(level.value)}
            type="button"
            whileHover={{ scale: 1.03, y: -0.5 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedLevel(trackerId, active ? null : level.value)}
            className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-wide transition-colors duration-150 sm:min-h-0 sm:px-2 sm:py-1 sm:text-[9px] ${
              active
                ? 'ring-1 ring-[var(--accent-deep)]/40 shadow-sm'
                : 'ring-1 ring-[var(--page-edge)]/35'
            }`}
            style={{
              background: `color-mix(in srgb, ${level.color} ${active ? 28 : 16}%, #fffaf7)`,
              color: '#6a5560',
            }}
            title={level.label}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: level.color }}
            />
            <span>{level.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
