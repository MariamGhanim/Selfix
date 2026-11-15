import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Trash2 } from 'lucide-react'
import { useJournal } from '../../context/JournalContext'
import { MONTHS_FULL } from '../../data/trackers'

export default function TodoList({ month, day, embedded = false }) {
  const { getTodos, setTodos } = useJournal()
  const [text, setText] = useState('')
  const todos = getTodos(month, day)

  const levelFor = (list) => {
    const done = list.filter((t) => t.done).length
    const total = list.length
    if (total === 0) return null
    if (done === 0) return 0
    if (done === total || done >= 4) return 4
    return Math.min(3, done)
  }

  const add = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    const next = [...todos, { id: crypto.randomUUID(), text: trimmed, done: false }]
    setTodos(month, day, next, levelFor(next))
    setText('')
  }

  const toggle = (id) => {
    const next = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    setTodos(month, day, next, levelFor(next))
  }

  const remove = (id) => {
    const next = todos.filter((t) => t.id !== id)
    setTodos(month, day, next, levelFor(next))
  }

  const doneCount = todos.filter((t) => t.done).length

  return (
    <div
      className={`flex h-full min-h-0 flex-col ${
        embedded ? '' : 'panel-card rounded-[1.35rem] p-3'
      }`}
    >
      {!embedded ? (
        <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2">
          <div>
            <h4 className="font-display text-[15px] font-semibold text-[var(--ink)]">
              To-Do Checklist
            </h4>
            <p className="text-[10px] text-[var(--ink-soft)]">Little wins, logged with today&apos;s pixel</p>
          </div>
          <span className="text-[10px] font-semibold text-[var(--ink-soft)]">
            {MONTHS_FULL[month]} {day}
            {todos.length > 0 ? ` · ${doneCount}/${todos.length}` : ''}
          </span>
        </div>
      ) : todos.length > 0 ? (
        <p className="mb-1.5 text-[10px] font-semibold text-[var(--ink-soft)]">
          {doneCount}/{todos.length} done
        </p>
      ) : null}

      <div className="mb-2.5 flex shrink-0 gap-1.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a gentle task..."
          className="min-w-0 flex-1 rounded-xl border border-[var(--page-edge)] bg-[var(--surface)] px-2.5 py-1.5 text-xs outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={add}
          className="rounded-xl bg-[var(--accent-deep)] px-2.5 text-white shadow"
        >
          <Plus size={14} />
        </motion.button>
      </div>

      <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
        {todos.length === 0 && (
          <li className="rounded-xl bg-[var(--surface)] px-3 py-4 text-center text-[11px] text-[var(--ink-soft)]">
            No tasks yet — add one above
          </li>
        )}
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex items-center gap-2 rounded-xl bg-[var(--surface)] px-2.5 py-1.5 shadow-sm"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => toggle(todo.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition ${
                  todo.done
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'bg-[var(--paper-deep)] text-[var(--ink-soft)]'
                }`}
              >
                <Check size={11} />
              </motion.button>
              <span
                className={`min-w-0 flex-1 text-xs transition ${
                  todo.done ? 'text-[var(--ink-soft)] line-through' : 'text-[var(--ink)]'
                }`}
              >
                {todo.text}
              </span>
              <button
                type="button"
                onClick={() => remove(todo.id)}
                className="rounded-full p-0.5 text-[var(--ink-soft)] transition hover:bg-[var(--paper-deep)]"
              >
                <Trash2 size={12} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
