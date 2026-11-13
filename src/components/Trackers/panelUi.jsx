import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useJournal } from '../../context/JournalContext'
import { MONTHS_FULL } from '../../data/trackers'
import { PASTEL_CHIP_COLORS } from '../../data/panelOptions'

export function Chip({ active, onClick, emoji, label, colorIndex = 0, title }) {
  const palette = PASTEL_CHIP_COLORS[colorIndex % PASTEL_CHIP_COLORS.length]
  return (
    <button
      type="button"
      title={title || (active ? `${label} (click to deselect)` : label)}
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-1 text-left text-[10px] font-bold leading-tight transition sm:text-[11px] ${
        active ? 'scale-[1.02] shadow-md ring-1 ring-black/10' : 'hover:scale-[1.02] hover:shadow-sm'
      }`}
      style={{
        background: active ? palette.active : palette.bg,
        color: active ? '#fff' : palette.text,
        borderColor: active ? 'transparent' : `${palette.active}55`,
      }}
    >
      {emoji && <span className="shrink-0 text-[12px] leading-none">{emoji}</span>}
      <span className="truncate">{label}</span>
    </button>
  )
}

export function ChipGroup({ label, children }) {
  return (
    <div className="mb-2 shrink-0">
      {label && (
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

export function FieldLabel({ children }) {
  return (
    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
      {children}
    </p>
  )
}

export function SoftInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[var(--page-edge)] bg-white/80 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[var(--accent)] ${props.className || ''}`}
    />
  )
}

export function SoftTextarea(props) {
  return (
    <textarea
      {...props}
      className={`min-h-0 w-full flex-1 resize-none rounded-xl border border-[var(--page-edge)] bg-white/80 px-2.5 py-1.5 text-[11px] leading-relaxed outline-none focus:ring-1 focus:ring-[var(--accent)] ${props.className || ''}`}
    />
  )
}

export function PanelShell({ month, day, title, trackerId, onClear, children }) {
  const { resetPanel } = useJournal()

  const clearToday = () => {
    if (onClear) onClear()
    else if (trackerId) resetPanel(trackerId, month, day)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-[var(--accent-glow)]/80 p-2.5 sm:p-3">
      <div className="mb-1.5 flex shrink-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate font-display text-sm font-semibold text-[var(--ink)]">{title}</h4>
          <span className="text-[10px] font-semibold text-[var(--ink-soft)]">
            {MONTHS_FULL[month]} {day}
          </span>
        </div>
        <button
          type="button"
          onClick={clearToday}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--page-edge)] bg-white/80 px-2 py-1 text-[9px] font-bold text-[var(--ink-soft)] transition hover:bg-white hover:text-[var(--ink)]"
          title="Clear today's selections for this tracker"
        >
          <RotateCcw size={11} />
          Clear Today
        </button>
      </div>
      <div className="min-h-0 flex-[3] overflow-y-auto pr-0.5">{children}</div>
      <div className="mt-1.5 min-h-0 flex-1 border-t border-[var(--page-edge)]/50 pt-1.5">
        <CompactDailyNotes month={month} day={day} />
      </div>
    </div>
  )
}

function CompactDailyNotes({ month, day }) {
  const { getDailyNote, setDailyNote } = useJournal()
  const saved = getDailyNote(month, day)
  const [text, setText] = useState(saved)

  useEffect(() => {
    setText(saved)
  }, [month, day, saved])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <FieldLabel>Daily Notes</FieldLabel>
      <SoftTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => setDailyNote(month, day, text)}
        placeholder="Quick note for today..."
      />
    </div>
  )
}

export function toggleInList(list, item) {
  const arr = list || []
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export function toggleSingle(current, id) {
  return current === id ? null : id
}

export function ChoiceChips({ options, selected, onToggle, startIndex = 0 }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt, i) => (
        <Chip
          key={opt.id}
          emoji={opt.emoji}
          label={opt.label}
          active={(selected || []).includes(opt.id)}
          onClick={() => onToggle(opt.id)}
          colorIndex={startIndex + i}
        />
      ))}
    </div>
  )
}
