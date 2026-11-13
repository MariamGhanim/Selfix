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

export function SelectChip({ active, onClick, emoji, label, title, compact = false }) {
  return (
    <button
      type="button"
      data-no-flip
      title={title || (active ? `${label} (selected — click to deselect)` : label)}
      onClick={onClick}
      aria-pressed={active}
      className={`relative z-10 inline-flex max-w-full cursor-pointer items-center rounded-full border text-left font-bold leading-tight transition ${
        compact ? 'gap-0.5 px-2 py-1 text-[9px] sm:text-[10px]' : 'gap-1 px-2.5 py-1.5 text-[10px] sm:text-[11px]'
      } ${
        active
          ? 'scale-[1.02] border-[var(--accent-deep)] bg-[var(--accent-deep)] text-white shadow-md'
          : 'border-[var(--page-edge)] bg-[var(--surface)] text-[var(--ink-soft)] opacity-80 hover:opacity-100 hover:shadow-sm'
      }`}
    >
      {active && <span className="shrink-0 text-[10px] leading-none">✓</span>}
      {emoji && (
        <span className={`shrink-0 leading-none ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
          {emoji}
        </span>
      )}
      <span className="truncate">{label}</span>
    </button>
  )
}

export function ReviewHeading({ children, className = '', asQuestion = false }) {
  return (
    <p
      className={`${
        asQuestion
          ? 'text-[11px] font-bold leading-snug tracking-normal text-[var(--accent-deep)] sm:text-xs'
          : 'text-[11px] font-bold uppercase tracking-wide text-[var(--accent-deep)] sm:text-xs'
      } ${className}`}
    >
      {children}
    </p>
  )
}

export function toggleSingle(current, id) {
  return current === id ? null : id
}

export function MiniQuiz({ questions, answers, onAnswer }) {
  return (
    <section className="shrink-0 rounded-2xl border border-[var(--page-edge)]/60 bg-[var(--accent-glow)]/70 px-2 py-1.5">
      <ReviewHeading className="mb-1">Daily Mini-Quiz</ReviewHeading>
      <div className="space-y-1.5">
        {questions.map((q) => (
          <div key={q.key}>
            <ReviewHeading asQuestion className="mb-0.5">
              {q.question}
            </ReviewHeading>
            <div className="flex flex-wrap gap-1">
              {q.options.map((opt) => (
                <SelectChip
                  key={opt.id}
                  compact
                  emoji={opt.emoji}
                  label={opt.label}
                  active={answers?.[q.key] === opt.id}
                  onClick={() => onAnswer(q.key, toggleSingle(answers?.[q.key], opt.id))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ReviewPanelFrame({ month, day, notesPlaceholder = 'Quick note for today…', children }) {
  return (
    <div
      data-no-flip
      className="relative z-10 flex h-full min-h-0 flex-col gap-1.5 overflow-hidden"
    >
      <div className="shrink-0 space-y-1.5">{children}</div>
      <section className="flex min-h-0 flex-1 flex-col border-t border-[var(--page-edge)]/50 pt-1.5">
        <CompactDailyNotes
          month={month}
          day={day}
          tall
          accentLabel
          label="Daily Notes"
          placeholder={notesPlaceholder}
        />
      </section>
    </div>
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
      className={`w-full rounded-xl border border-[var(--page-edge)] bg-[var(--surface)] px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[var(--accent)] ${props.className || ''}`}
    />
  )
}

export function SoftTextarea(props) {
  return (
    <textarea
      {...props}
      className={`min-h-0 w-full flex-1 resize-none rounded-xl border border-[var(--page-edge)] bg-[var(--surface)] px-2.5 py-1.5 text-[11px] leading-relaxed outline-none focus:ring-1 focus:ring-[var(--accent)] ${props.className || ''}`}
    />
  )
}

export function PanelShell({
  month,
  day,
  title,
  trackerId,
  onClear,
  hideNotes = false,
  children,
}) {
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
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--page-edge)] bg-[var(--surface)] px-2 py-1 text-[9px] font-bold text-[var(--ink-soft)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
          title="Clear today's selections for this tracker"
        >
          <RotateCcw size={11} />
          Clear Today
        </button>
      </div>
      <div
        className={`min-h-0 pr-0.5 ${
          hideNotes ? 'flex flex-1 flex-col overflow-hidden' : 'flex-[3] overflow-y-auto'
        }`}
      >
        {children}
      </div>
      {!hideNotes && (
        <div className="mt-1.5 min-h-0 flex-1 border-t border-[var(--page-edge)]/50 pt-1.5">
          <CompactDailyNotes month={month} day={day} />
        </div>
      )}
    </div>
  )
}

export function CompactDailyNotes({
  month,
  day,
  label = 'Daily Notes',
  placeholder,
  tall,
  accentLabel = false,
}) {
  const { getDailyNote, setDailyNote } = useJournal()
  const saved = getDailyNote(month, day)
  const [text, setText] = useState(saved)

  useEffect(() => {
    setText(saved)
  }, [month, day, saved])

  return (
    <div className={`flex min-h-0 flex-col ${tall ? 'flex-1' : 'h-full'}`}>
      {accentLabel ? <ReviewHeading className="mb-1">{label}</ReviewHeading> : <FieldLabel>{label}</FieldLabel>}
      <SoftTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => setDailyNote(month, day, text)}
        placeholder={placeholder || 'Quick note for today...'}
        className={tall ? 'min-h-[5.5rem] flex-1' : ''}
      />
    </div>
  )
}

export function toggleInList(list, item) {
  const arr = list || []
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
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
