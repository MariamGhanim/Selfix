import { useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJournal } from '../../context/JournalContext'
import { PanelShell, ReviewHeading, SoftTextarea, SoftInput } from './panelUi'

export function CustomNotesPanel({ trackerId, month, day, title }) {
  const { getPanel, setPanel } = useJournal()
  const data = getPanel(trackerId, month, day)
  const [text, setText] = useState(data.note || '')

  useEffect(() => {
    setText(data.note || '')
  }, [month, day, data.note])

  const save = (value) => {
    const next = value.trim()
    setPanel(trackerId, month, day, { note: next }, next ? 1 : null)
  }

  return (
    <PanelShell month={month} day={day} title={title || 'Custom notes'} trackerId={trackerId} hideNotes>
      <ReviewHeading className="mb-2">Today&apos;s notes</ReviewHeading>
      <SoftTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => save(text)}
        placeholder="Write freely for this custom page…"
        className="min-h-[12rem]"
      />
    </PanelShell>
  )
}

export function CustomChecklistPanel({ trackerId, month, day, title }) {
  const { getPanel, setPanel, resetPanel } = useJournal()
  const data = getPanel(trackerId, month, day)
  const items = data.items || []
  const [text, setText] = useState('')

  const levelFor = (list) => {
    const done = list.filter((t) => t.done).length
    const total = list.length
    if (total === 0) return null
    if (done === 0) return 0
    if (done === total || done >= 4) return 4
    return Math.min(3, done)
  }

  const persist = (list) => setPanel(trackerId, month, day, { items: list }, levelFor(list))

  const add = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    persist([...items, { id: crypto.randomUUID(), text: trimmed, done: false }])
    setText('')
  }

  const toggle = (id) => {
    persist(items.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const remove = (id) => persist(items.filter((t) => t.id !== id))
  const doneCount = items.filter((t) => t.done).length

  return (
    <PanelShell
      month={month}
      day={day}
      title={title || 'Custom checklist'}
      onClear={() => resetPanel(trackerId, month, day)}
      hideNotes
    >
      <p className="mb-2 text-[10px] font-medium text-[var(--ink-soft)]">
        {items.length > 0 ? `${doneCount}/${items.length} done` : 'Add soft tasks for today'}
      </p>
      <div className="mb-2.5 flex gap-1.5">
        <SoftInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a task…"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={add}
          className="rounded-full bg-[var(--accent-deep)] px-3 text-white shadow-sm"
        >
          <Plus size={14} />
        </motion.button>
      </div>
      <ul className="space-y-1.5">
        <AnimatePresence initial={false}>
          {items.map((todo) => (
            <motion.li
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-2 rounded-xl bg-[var(--surface)] px-2.5 py-1.5 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(todo.id)}
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  todo.done
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--paper-deep)] text-[var(--ink-soft)]'
                }`}
              >
                <Check size={11} />
              </button>
              <span
                className={`min-w-0 flex-1 text-xs ${
                  todo.done ? 'text-[var(--ink-soft)] line-through' : 'text-[var(--ink)]'
                }`}
              >
                {todo.text}
              </span>
              <button
                type="button"
                onClick={() => remove(todo.id)}
                className="rounded-full p-0.5 text-[var(--ink-soft)]"
              >
                <Trash2 size={12} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </PanelShell>
  )
}

export function CustomGridPanel({ trackerId, month, day, title }) {
  const { getPanel, setPanel } = useJournal()
  const data = getPanel(trackerId, month, day)
  const [text, setText] = useState(data.note || '')

  useEffect(() => {
    setText(data.note || '')
  }, [month, day, data.note])

  return (
    <PanelShell month={month} day={day} title={title || 'Custom tracker'} trackerId={trackerId} hideNotes>
      <p className="mb-3 text-[11px] font-medium text-[var(--ink-soft)]">
        Paint today on the left grid, then leave a soft note here.
      </p>
      <ReviewHeading className="mb-2">Daily note</ReviewHeading>
      <SoftTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => setPanel(trackerId, month, day, { note: text.trim() })}
        placeholder="What mattered on this page today…"
        className="min-h-[10rem]"
      />
    </PanelShell>
  )
}
