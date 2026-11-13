import { useState } from 'react'
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
        embedded ? '' : 'rounded-2xl bg-[var(--accent-glow)]/80 p-3'
      }`}
    >
      {!embedded ? (
        <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
          <div>
            <h4 className="font-display text-sm font-semibold text-[var(--ink)]">To-Do Checklist</h4>
            <p className="text-[10px] text-[var(--ink-soft)]">Paired with today&apos;s pixel</p>
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

      <div className="mb-2 flex shrink-0 gap-1.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a task..."
          className="min-w-0 flex-1 rounded-xl border border-[var(--page-edge)] bg-[var(--surface)] px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-[var(--accent-deep)] px-2.5 text-white shadow"
        >
          <Plus size={14} />
        </button>
      </div>

      <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
        {todos.length === 0 && (
          <li className="rounded-xl bg-[var(--surface)] px-3 py-4 text-center text-[11px] text-[var(--ink-soft)]">
            No tasks yet — add one above
          </li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 rounded-xl bg-[var(--surface)] px-2.5 py-1.5 shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(todo.id)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
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
              className="rounded-full p-0.5 text-[var(--ink-soft)] hover:bg-[var(--paper-deep)]"
            >
              <Trash2 size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
