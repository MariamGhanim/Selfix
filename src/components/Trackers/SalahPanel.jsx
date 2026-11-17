import { useEffect, useState } from 'react'
import { useJournal } from '../../context/JournalContext'
import {
  SALAH_COUNT_OPTIONS,
  SALAH_PRAYERS,
  SALAH_STATUSES,
} from '../../data/panelOptions'
import { SALAH_QUIZ } from '../../data/miniQuizzes'
import {
  MiniQuiz,
  PanelShell,
  ReviewHeading,
  ReviewPanelFrame,
  SoftTextarea,
} from './panelUi'

function quizAnswers(data) {
  return { q1: data.q1 ?? null, q2: data.q2 ?? null, q3: data.q3 ?? null }
}

function emptyPrayers() {
  return {
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
  }
}

function prayersFromCount(count) {
  const prayers = emptyPrayers()
  if (count == null) return prayers
  if (count <= 0) {
    for (const p of SALAH_PRAYERS) prayers[p.id] = 'missed'
    return prayers
  }
  const onTimeN = Math.min(5, count)
  SALAH_PRAYERS.forEach((p, i) => {
    prayers[p.id] = i < onTimeN ? 'onTime' : 'missed'
  })
  return prayers
}

function computeSalahLevel(prayers, paintedPlus, excused = false) {
  if (excused) return 7
  if (paintedPlus) return 6
  const statuses = SALAH_PRAYERS.map((p) => prayers?.[p.id] ?? null)
  if (!statuses.some(Boolean)) return null
  const onTime = statuses.filter((s) => s === 'onTime').length
  const late = statuses.filter((s) => s === 'late').length
  const prayed = onTime + late
  if (prayed === 0) return 0
  if (onTime === 5) return 5
  if (prayed === 5 && onTime < 5) return Math.max(1, onTime)
  return onTime > 0 ? onTime : late > 0 ? Math.min(4, late) : 0
}

function statusTone(active, tone) {
  if (!active) {
    return 'bg-[var(--surface)] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/55'
  }
  if (tone === 'good') return 'bg-[#66bb6a] text-white shadow-sm'
  if (tone === 'miss') return 'bg-[#ef9a9a] text-white shadow-sm'
  return 'bg-[#ffca28] text-[#5a4550] shadow-sm'
}

export default function SalahPanel({ month, day }) {
  const { getPanel, setPanel } = useJournal()
  const data = getPanel('salah', month, day)
  const prayers = { ...emptyPrayers(), ...(data.prayers || {}) }
  const paintedPlus = Boolean(data.paintedPlus)
  const excused = Boolean(data.excused)
  const level = computeSalahLevel(prayers, paintedPlus, excused)
  const [reflection, setReflection] = useState(data.reflection || '')

  useEffect(() => {
    setReflection(data.reflection || '')
  }, [month, day, data.reflection])

  const patch = (next, pixelValue) => setPanel('salah', month, day, next, pixelValue)

  const setPrayerStatus = (prayerId, status) => {
    const nextStatus = prayers[prayerId] === status ? null : status
    const nextPrayers = { ...prayers, [prayerId]: nextStatus }
    patch(
      { prayers: nextPrayers, paintedPlus: false, excused: false },
      computeSalahLevel(nextPrayers, false, false),
    )
  }

  const isCleanCount = (value) => {
    if (excused || value == null) return false
    const plus = value === 6
    if (paintedPlus !== plus) return false
    if (level !== value) return false
    const onTimeN = value <= 0 ? 0 : Math.min(5, value)
    return SALAH_PRAYERS.every((p, i) => {
      const expected = value <= 0 ? 'missed' : i < onTimeN ? 'onTime' : 'missed'
      return (prayers[p.id] ?? null) === expected
    })
  }

  const setCount = (value) => {
    if (value == null) {
      patch({ prayers: emptyPrayers(), paintedPlus: false, excused: false }, null)
      return
    }
    // Toggle off only when this exact clean quick-paint is already applied
    if (isCleanCount(value)) {
      patch({ prayers: emptyPrayers(), paintedPlus: false, excused: false }, null)
      return
    }
    const nextPrayers = prayersFromCount(value)
    const plus = value === 6
    patch({ prayers: nextPrayers, paintedPlus: plus, excused: false }, value)
  }

  const toggleExcused = () => {
    if (excused) {
      patch({ excused: false, prayers: emptyPrayers(), paintedPlus: false }, null)
      return
    }
    patch({ excused: true, prayers: emptyPrayers(), paintedPlus: false }, 7)
  }

  const onTimeCount = SALAH_PRAYERS.filter((p) => prayers[p.id] === 'onTime').length

  const countChipClass = (active) =>
    `relative z-20 inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:min-h-0 ${
      active
        ? 'bg-[var(--accent-deep)] text-white shadow-md ring-2 ring-[var(--accent-soft)]'
        : 'bg-[var(--surface)] text-[var(--ink-soft)] shadow-sm ring-1 ring-[var(--page-edge)]/70 hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] hover:ring-[var(--accent)]/40'
    }`

  return (
    <PanelShell month={month} day={day} title="Salah & spiritual" trackerId="salah" hideNotes>
      <ReviewPanelFrame
        trackerId="salah"
        month={month}
        day={day}
        notesPlaceholder="Quran notes, duas, or a soft reflection…"
      >
        <section className="relative z-20">
          <ReviewHeading className="mb-1">Prayers on time</ReviewHeading>
          <p className="mb-2 text-[10px] leading-snug text-[var(--ink-soft)]">
            Quick paint for the year grid — or fine-tune each salah below.
          </p>
          <div className="relative z-20 mb-1.5 flex flex-wrap gap-1" data-no-flip>
            {SALAH_COUNT_OPTIONS.map((opt) => {
              const active = !excused && level === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  data-no-flip
                  aria-pressed={active}
                  aria-label={opt.label}
                  className={countChipClass(active)}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCount(opt.value)
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {active ? <span className="mr-1 text-[10px] leading-none">✓</span> : null}
                  {opt.label}
                </button>
              )
            })}
            <button
              type="button"
              data-no-flip
              aria-pressed={excused}
              aria-label="Excused"
              className={countChipClass(excused)}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleExcused()
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {excused ? <span className="mr-1 text-[10px] leading-none">✓</span> : null}
              Excused
            </button>
          </div>
          {excused ? (
            <p className="text-[10px] font-medium text-[#9a7aa8]">Rest day · no prayer count</p>
          ) : (
            <p className="text-[10px] font-medium text-[var(--accent-deep)]">{onTimeCount}/5 on time</p>
          )}
        </section>

        {!excused ? (
          <section>
            <ReviewHeading className="mb-2">Daily prayers</ReviewHeading>
            <ul className="space-y-2">
              {SALAH_PRAYERS.map((prayer) => (
                <li
                  key={prayer.id}
                  className="rounded-2xl bg-[var(--surface)] px-3 py-2.5 ring-1 ring-[var(--page-edge)]/45"
                >
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="text-[14px] leading-none">{prayer.emoji}</span>
                    <span className="text-[12px] font-semibold text-[var(--ink)]">{prayer.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SALAH_STATUSES.map((status) => {
                      const active = prayers[prayer.id] === status.id
                      return (
                        <button
                          key={status.id}
                          type="button"
                          data-no-flip
                          onClick={() => setPrayerStatus(prayer.id, status.id)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${statusTone(
                            active,
                            status.tone,
                          )}`}
                        >
                          {status.label}
                        </button>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section
            className="rounded-[1.2rem] px-4 py-3.5 ring-1 ring-[#e0c4e0]/55"
            style={{ background: 'color-mix(in srgb, #e0c4e0 28%, #fffaf7)' }}
          >
            <p className="text-[12px] font-semibold text-[#7a5f88]">Excused / rest day</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--ink-soft)]">
              No prayer count for today — a gentle pause is still care for your heart.
            </p>
          </section>
        )}

        <MiniQuiz
          title="Spiritual check-in"
          questions={SALAH_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => patch({ [key]: value })}
        />

        <section>
          <ReviewHeading className="mb-1.5">Daily Islamic reflection</ReviewHeading>
          <SoftTextarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            onBlur={() => patch({ reflection })}
            placeholder="Ayah that stayed with you, a dua, or how prayer felt today…"
            className="min-h-[5.5rem]"
          />
        </section>
      </ReviewPanelFrame>
    </PanelShell>
  )
}
