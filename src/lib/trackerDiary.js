import { cellKey, TRACKERS } from '../data/trackers'
import { FOCUS_ENVIRONMENTS, SALAH_PRAYERS } from '../data/panelOptions'

export const DIARY_RANGES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d, n) {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

function parsePixelKey(key) {
  const colon = key.indexOf(':')
  if (colon < 0) return null
  const trackerId = key.slice(0, colon)
  const parts = key.slice(colon + 1).split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  return { trackerId, year: parts[0], month: parts[1], day: parts[2] }
}

function parsePanelKey(key) {
  const colon = key.indexOf(':')
  if (colon < 0) return null
  const trackerId = key.slice(0, colon)
  const parts = key.slice(colon + 1).split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  return { trackerId, year: parts[0], month: parts[1], day: parts[2] }
}

function inRange(y, m, d, from, to) {
  const t = new Date(y, m, d).getTime()
  return t >= from.getTime() && t <= to.getTime()
}

export function getDiaryBounds(rangeId, year, anchor = new Date()) {
  const today = startOfDay(new Date())
  const focus = startOfDay(anchor)
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)
  const inYear = focus > yearEnd ? yearEnd : focus < yearStart ? yearStart : focus
  const hardCap = today < yearEnd ? today : yearEnd

  if (rangeId === 'monthly') {
    const from = new Date(inYear.getFullYear(), inYear.getMonth(), 1)
    const monthEnd = new Date(inYear.getFullYear(), inYear.getMonth() + 1, 0)
    const to = monthEnd > hardCap ? hardCap : monthEnd
    return {
      from,
      to: to < from ? from : to,
      label: from.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      periodWord: 'month',
    }
  }

  const day = inYear.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  let from = addDays(inYear, mondayOffset)
  let to = addDays(from, 6)
  if (from < yearStart) from = yearStart
  if (to > hardCap) to = hardCap
  if (to < from) to = from
  return {
    from,
    to,
    label: `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    periodWord: 'week',
  }
}

export function shiftDiaryAnchor(rangeId, anchor, direction) {
  const d = new Date(anchor)
  if (rangeId === 'monthly') d.setMonth(d.getMonth() + direction)
  else d.setDate(d.getDate() + direction * 7)
  return d
}

function enumerateDays(from, to) {
  const days = []
  let cursor = startOfDay(from)
  const end = startOfDay(to)
  while (cursor <= end) {
    days.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      day: cursor.getDate(),
      date: new Date(cursor),
      key: cellKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()),
      weekday: cursor.getDay(),
      label: cursor.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    })
    cursor = addDays(cursor, 1)
  }
  return days
}

function levelLabel(tracker, value) {
  if (value == null) return null
  return tracker.levels?.find((l) => l.value === value)?.label || String(value)
}

function joinSoft(parts) {
  const clean = parts.filter(Boolean)
  if (!clean.length) return ''
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]}, and ${clean[1]}`
  return `${clean.slice(0, -1).join(', ')}, and ${clean[clean.length - 1]}`
}

function describeSalahDay(value, panel) {
  const prayers = panel?.prayers || {}
  const statuses = SALAH_PRAYERS.map((p) => ({
    ...p,
    status: prayers[p.id] || null,
  }))
  const onTime = statuses.filter((p) => p.status === 'onTime')
  const late = statuses.filter((p) => p.status === 'late')
  const missed = statuses.filter((p) => p.status === 'missed')
  const bits = []

  if (onTime.length === 5) bits.push('held all five prayers on time, a steady peaceful day')
  else if (onTime.length) {
    bits.push(
      onTime.length === 1
        ? `prayed ${onTime[0].label} gently on time`
        : `kept ${onTime.length} prayers on time (${onTime.map((p) => p.label).join(', ')})`,
    )
  } else if (value === 5) bits.push('held all five prayers on time, a steady peaceful day')
  else if (value === 6) bits.push('prayed all five on time, with a little extra devotion')
  else if (value != null && value > 0) {
    bits.push(`kept ${value} prayer${value === 1 ? '' : 's'} on time with care`)
  }

  if (late.length) {
    bits.push(
      late.length === 1
        ? `${late[0].label} came a little late`
        : `${late.map((p) => p.label).join(', ')} came a little late`,
    )
  }
  if (missed.length && missed.length < 5) {
    bits.push(
      missed.length === 1
        ? `${missed[0].label} slipped by`
        : `${missed.map((p) => p.label).join(', ')} slipped by`,
    )
  }
  if (value === 0 || (missed.length === 5 && !onTime.length && !late.length)) {
    return { headline: 'A softer prayer day. Tomorrow is another chance', details: [], empty: false }
  }

  if (panel?.reflection?.trim()) bits.push(`a quiet note: “${panel.reflection.trim()}”`)

  if (!bits.length) return { headline: null, details: [], empty: true }
  const headline = bits[0].charAt(0).toUpperCase() + bits[0].slice(1)
  return { headline, details: bits.slice(1), empty: false }
}

function describeFocusDay(value, panel, levelText) {
  const mins = Number(panel?.minutes) || 0
  const envs = (panel?.environments || [])
    .map((id) => FOCUS_ENVIRONMENTS.find((e) => e.id === id)?.label || id)
    .filter(Boolean)
  const bits = []
  if (mins > 0) {
    const hours = mins >= 60 ? `${Math.round((mins / 60) * 10) / 10} hours` : `${mins} minutes`
    bits.push(`gave yourself about ${hours} of deep focus`)
  } else if (levelText) {
    bits.push(
      value === 0
        ? 'chose a gentle rest day from deep work'
        : `settled into ${levelText.toLowerCase()} focus`,
    )
  }
  if (envs.length) bits.push(`mostly tucked away at ${joinSoft(envs.map((e) => e.toLowerCase()))}`)
  if (!bits.length) return { headline: null, details: [], empty: true }
  const headline = bits[0].charAt(0).toUpperCase() + bits[0].slice(1)
  return { headline, details: bits.slice(1), empty: false }
}

function describeTasksDay(value, todos) {
  const list = todos || []
  if (!list.length && value == null) return { headline: null, details: [], empty: true }
  const done = list.filter((t) => t.done || t.completed)
  const open = list.filter((t) => !(t.done || t.completed))
  const bits = []
  if (list.length) {
    bits.push(
      done.length === list.length && list.length
        ? `finished every little task (${list.length}), lovely`
        : `checked off ${done.length} of ${list.length} task${list.length === 1 ? '' : 's'}`,
    )
  } else if (value != null) {
    bits.push(
      value === 4
        ? 'closed the day with a finished list'
        : `tended to ${value} task${value === 1 ? '' : 's'}`,
    )
  }
  const names = done
    .map((t) => t.text || t.title || t.label)
    .filter(Boolean)
    .slice(0, 3)
  if (names.length) bits.push(`done with care: ${names.join(', ')}`)
  if (open.length && open.length <= 3) {
    const openNames = open.map((t) => t.text || t.title || t.label).filter(Boolean)
    if (openNames.length) bits.push(`still waiting softly: ${openNames.join(', ')}`)
  }
  const headline = bits[0].charAt(0).toUpperCase() + bits[0].slice(1)
  return { headline, details: bits.slice(1), empty: false }
}

function describeGenericDay(tracker, value, panel, note) {
  const label = levelLabel(tracker, value)
  const bits = []
  if (tracker.id === 'sleep') {
    if (value === 1) bits.push('rest came hard, under 5 hours')
    else if (value === 2) bits.push('slept a fair stretch (about 5 to 6 hours)')
    else if (value === 3) bits.push('slept well, about 7 to 8 cozy hours')
    else if (value === 4) bits.push('slept beautifully (8+ hours of rest)')
  } else if (tracker.id === 'water') {
    if (value === 0) bits.push('a dry day, no cups marked')
    else if (value != null) {
      bits.push(
        `drank ${value === 8 ? '8+' : value} cup${value === 1 ? '' : 's'} of water with care`,
      )
    }
  } else if (tracker.id === 'teeth') {
    if (value === 0) bits.push('skipped brushing today')
    else if (value === 1) bits.push('brushed your teeth with care')
    else if (value === 2) bits.push('brushed twice, fresh and kind to yourself')
  } else if (tracker.id === 'shower') {
    if (label) bits.push(`took a ${label.toLowerCase()} shower`)
  } else if (tracker.id === 'vitamins') {
    if (value === 1) bits.push('took your vitamins gently')
    else if (value === 2) bits.push('took vitamins in part')
    else if (value === 3) bits.push('let vitamins rest for the day')
  } else if (tracker.id === 'fruits' || tracker.id === 'sweets') {
    if (value === 0) bits.push(`no ${tracker.id} today`)
    else if (value != null) {
      bits.push(`enjoyed ${label?.toLowerCase() || value} serving${value === 1 ? '' : 's'} of ${tracker.id}`)
    }
  } else if (tracker.id === 'workout') {
    if (value === 0) bits.push('gave your body a soft recovery day')
    else if (label) bits.push(`moved kindly, ${label.toLowerCase()}`)
  } else if (tracker.id === 'reading') {
    if (value === 1) bits.push('pages stayed closed today')
    else if (label) bits.push(`read a little, ${label.toLowerCase()}`)
    if (panel?.book?.trim()) bits.push(`curled up with “${panel.book.trim()}”`)
    if (panel?.pages) bits.push(`${panel.pages} pages turned`)
  } else if (tracker.id === 'outings') {
    if (value === 0) bits.push('stayed home in your own quiet nest')
    else if (label) bits.push(`stepped out for a ${label.toLowerCase()}`)
    if (panel?.withWho?.trim()) bits.push(`alongside ${panel.withWho.trim()}`)
  } else if (tracker.id === 'energy') {
    if (label) bits.push(`energy felt ${label.toLowerCase()}`)
  } else if (tracker.id === 'rating') {
    if (label) bits.push(`named the day “${label}”`)
    if (panel?.highlight?.trim()) bits.push(`a bright moment: “${panel.highlight.trim()}”`)
  } else if (tracker.id === 'study') {
    if (value === 0) bits.push('let self-development rest')
    else if (label) bits.push(`grew a little, ${label.toLowerCase()}`)
  } else if (tracker.custom) {
    if (label) bits.push(`noted “${label}” with care`)
  } else if (label) {
    bits.push(`noted ${label.toLowerCase()}`)
  }

  if (note?.trim() && tracker.id !== 'rating') {
    bits.push(`a note: “${note.trim().slice(0, 120)}${note.trim().length > 120 ? '…' : ''}”`)
  }

  if (!bits.length) return { headline: null, details: [], empty: true }
  const headline = bits[0].charAt(0).toUpperCase() + bits[0].slice(1)
  return { headline, details: bits.slice(1), empty: false }
}

function describeDay(tracker, value, panel, todos, note) {
  if (tracker.id === 'salah') return describeSalahDay(value, panel)
  if (tracker.id === 'focus') return describeFocusDay(value, panel, levelLabel(tracker, value))
  if (tracker.id === 'tasks') return describeTasksDay(value, todos)
  return describeGenericDay(tracker, value, panel, note)
}

function weekdayName(i) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]
}

function mostActiveDays(logged) {
  const counts = {}
  for (const e of logged) {
    const name = weekdayName(e.weekday)
    counts[name] = (counts[name] || 0) + 1
  }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (!ranked.length) return []
  const topScore = ranked[0][1]
  return ranked.filter(([, n]) => n === topScore).map(([d]) => d)
}

function avg(nums) {
  if (!nums.length) return null
  return nums.reduce((s, n) => s + n, 0) / nums.length
}

function softDayList(days) {
  if (!days.length) return ''
  if (days.length === 1) return days[0]
  if (days.length === 2) return `${days[0]} and ${days[1]}`
  return `${days[0]}, ${days[1]}`
}

function buildSummary(tracker, entries, periodWord) {
  const logged = entries.filter((e) => !e.empty)
  const name = tracker.tab || tracker.title
  const top = mostActiveDays(logged)
  const latest = logged[0]

  if (!logged.length) {
    return {
      title: 'This page is still soft',
      body: `Nothing much is written here for this ${periodWord} yet. That’s alright. When you feel like it, a single mark on the grid is enough to begin.`,
    }
  }

  if (tracker.id === 'sleep') {
    const deep = logged.filter((e) => e.value === 3 || e.value === 4)
    if (deep.length >= Math.ceil(logged.length / 2)) {
      return {
        title: 'Rest',
        body: `This ${periodWord} held some truly soft nights. ${softDayList(top) ? `${softDayList(top)} felt especially kind to you.` : 'You gave yourself room to recover.'} Hold onto whatever evening calm helped.`,
      }
    }
    return {
      title: 'Rest',
      body: `Sleep came in uneven pieces this ${periodWord}. Be gentle with yourself. One earlier night can reset more than you think.`,
    }
  }

  if (tracker.id === 'salah') {
    const full = logged.filter((e) => e.value === 5 || e.value === 6)
    if (full.length) {
      return {
        title: 'Prayer',
        body: `There were days this ${periodWord} when the prayers landed together and the heart felt steadier afterward. Keep the same quiet corner, the same first step. That is enough.`,
      }
    }
    return {
      title: 'Prayer',
      body: `You still turned toward prayer this ${periodWord}, even on the imperfect days. That turning matters more than getting every moment right.`,
    }
  }

  if (tracker.id === 'focus') {
    const hours = Math.round((logged.reduce((s, e) => s + (e.minutes || 0), 0) / 60) * 10) / 10
    if (hours >= 1) {
      return {
        title: 'Focus',
        body: `You made space to think this ${periodWord}${softDayList(top) ? `, especially around ${softDayList(top)}` : ''}. Those quiet pockets are yours. Protect one of them tomorrow if you can.`,
      }
    }
    return {
      title: 'Focus',
      body: `Focus arrived in small sips this ${periodWord}. Small still counts. Even a short, honest stretch of work is something to be proud of.`,
    }
  }

  if (tracker.id === 'water') {
    return {
      title: 'Water',
      body: `You remembered to drink on the days that needed it most this ${periodWord}. Keep a glass nearby in the morning. Your future self will thank you quietly.`,
    }
  }

  if (tracker.id === 'teeth') {
    return {
      title: 'Little care',
      body: `This small ritual kept finding its way back to you this ${periodWord}. Tiny kindnesses like that stack up into feeling well.`,
    }
  }

  if (tracker.id === 'tasks') {
    return {
      title: 'Tasks',
      body: `You moved things forward this ${periodWord}, one checkmark at a time. Leave tomorrow’s list short enough to finish with a little room left over.`,
    }
  }

  if (tracker.id === 'workout') {
    return {
      title: 'Movement',
      body: `Your body got some honest attention this ${periodWord}. Mix effort with softness so coming back still feels inviting.`,
    }
  }

  if (tracker.id === 'reading') {
    return {
      title: 'Reading',
      body: `Pages turned when they could this ${periodWord}. Leave the book where you’ll see it tonight. Ten more pages is a lovely way to close a day.`,
    }
  }

  const recent = latest?.headline
    ? ` Most recently, ${latest.headline.charAt(0).toLowerCase()}${latest.headline.slice(1)}.`
    : ''
  return {
    title: name,
    body: `This ${periodWord} left a few gentle marks on your ${name.toLowerCase()} page.${softDayList(top) ? ` ${softDayList(top)} stood out a little.` : ''}${recent}`,
  }
}

function buildReflection(tracker, entries, periodWord) {
  const logged = entries.filter((e) => !e.empty)
  const name = (tracker.tab || tracker.title || 'this').toLowerCase()
  const top = mostActiveDays(logged)

  if (!logged.length) {
    return {
      title: 'A soft note',
      body: `I’m not going to invent a lesson from an empty page. Come back when you’ve lived a little more of this ${periodWord}. I’ll be here, ready to listen.`,
    }
  }

  if (tracker.id === 'sleep') {
    const thin = logged.filter((e) => e.value === 1 || e.value === 2)
    const deep = logged.filter((e) => e.value === 3 || e.value === 4)
    const thinWithNotes = thin.filter((e) => e.hasNote)

    if (thin.length && thinWithNotes.length >= Math.ceil(thin.length / 2)) {
      const day = weekdayName(thinWithNotes[0].weekday)
      return {
        title: 'A soft note',
        body: `I noticed something tender about your nights this ${periodWord}. On days like ${day}, when the journal stayed open a little longer, sleep seemed to arrive thinner. Maybe tonight you close the notebook earlier, dim the light, and let the day end without finishing every thought.`,
      }
    }
    if (deep.length > thin.length) {
      return {
        title: 'A soft note',
        body: `Your rest has a kindness to it lately. Whatever you’ve been doing before bed, keep a little of that. Same tea, same stretch, same soft landing. Your body seems to recognize it.`,
      }
    }
    return {
      title: 'A soft note',
      body: `Some nights asked more of you than others this ${periodWord}. You don’t need a perfect sleep schedule. Just one evening where you choose rest a little sooner than usual.`,
    }
  }

  if (tracker.id === 'salah') {
    const full = logged.filter((e) => e.value === 5 || e.value === 6)
    if (full.length) {
      return {
        title: 'A soft note',
        body: `There is a quiet strength in the days when all the prayers found their place. On the days that feel rushed, start with the one you never want to miss, and let the rest come as they can. God sees the effort, not only the neatness.`,
      }
    }
    return {
      title: 'A soft note',
      body: `Prayer this ${periodWord} wasn’t about perfection. It was about returning. Keep returning. Even a single mindful prayer can soften an entire afternoon.`,
    }
  }

  if (tracker.id === 'focus') {
    const withTime = logged.filter((e) => e.minutes > 0)
    const avgMins = avg(withTime.map((e) => e.minutes))
    if (withTime.length && avgMins != null && avgMins < 45) {
      return {
        title: 'A soft note',
        body: `Your focus came in short, honest bursts this ${periodWord}. That isn’t failure. Tomorrow, before the noise starts, give yourself one small pocket of quiet work and treat it like a gift, not a test.`,
      }
    }
    if (top.length) {
      return {
        title: 'A soft note',
        body: `${softDayList(top)} seemed to hold your clearest thinking this ${periodWord}. If you can, leave a little open space around days like that. Fewer errands. One true task. Your mind already knows how to settle when the room is kinder.`,
      }
    }
  }

  if (tracker.id === 'water') {
    const mean = avg(logged.map((e) => e.value).filter((v) => v != null))
    if (mean != null && mean < 4) {
      return {
        title: 'A soft note',
        body: `You might be running a little dry without noticing. Fill a glass when you wake, and again after your first prayer or coffee. It’s such a small mercy, and your energy will feel it.`,
      }
    }
    return {
      title: 'A soft note',
      body: `You’ve been taking care of yourself in a simple way: sip by sip. Keep the glass where your hands already go. Care doesn’t have to be dramatic to be real.`,
    }
  }

  if (tracker.id === 'teeth') {
    return {
      title: 'A soft note',
      body: `I love that this tiny habit keeps showing up in your journal. Leave the brush where you’ll see it tonight. Future-you, standing at the sink half-asleep, will still manage the kindness.`,
    }
  }

  if (tracker.id === 'tasks') {
    const rates = logged.filter((e) => e.tasksTotal > 0).map((e) => e.tasksDone / e.tasksTotal)
    const meanRate = avg(rates)
    if (meanRate != null && meanRate < 0.5) {
      return {
        title: 'A soft note',
        body: `Your lists have been a little heavier than your hours. Tomorrow, write only three things. Finish those, then stop. Leaving room is also a kind of progress.`,
      }
    }
    return {
      title: 'A soft note',
      body: `You’ve been closing loops with care. Keep the list short enough that finishing still feels possible. You’re allowed to do less and feel proud of it.`,
    }
  }

  if (tracker.id === 'workout') {
    const moved = logged.filter((e) => e.value != null && e.value > 0)
    if (moved.length >= 3) {
      return {
        title: 'A soft note',
        body: `You’ve been showing up for your body. Leave one day softer so the next stretch or walk still feels like an invitation, not an obligation.`,
      }
    }
    return {
      title: 'A soft note',
      body: `Movement can be tiny and still true. A walk around the block, a stretch by the window. You don’t owe anyone a perfect workout. Just a little return to yourself.`,
    }
  }

  if (tracker.id === 'reading') {
    return {
      title: 'A soft note',
      body: `Books are patient friends. Leave yours open on the bedside table tonight. Even a few pages can make the day feel finished in a gentle way.`,
    }
  }

  return {
    title: 'A soft note',
    body: `Sitting with your ${name} page this ${periodWord}, what stands out isn’t the gaps. It’s that you came back at all. Keep coming back. One honest mark is already a kind of hope.`,
  }
}

export function buildTrackerDiary(state, trackerId, rangeId, year, anchor = new Date()) {
  const y = year ?? state?.profile?.year ?? new Date().getFullYear()
  const bounds = getDiaryBounds(rangeId, y, anchor)
  const days = enumerateDays(bounds.from, bounds.to)
  const catalog = [...TRACKERS, ...(state?.trackerPrefs?.custom || [])]
  const tracker = catalog.find((t) => t.id === trackerId) || TRACKERS[0]

  const pixelIndex = {}
  for (const [key, value] of Object.entries(state?.pixels || {})) {
    const parsed = parsePixelKey(key)
    if (!parsed || parsed.trackerId !== tracker.id) continue
    if (!inRange(parsed.year, parsed.month, parsed.day, bounds.from, bounds.to)) continue
    pixelIndex[cellKey(parsed.year, parsed.month, parsed.day)] = value
  }

  const panelIndex = {}
  for (const [key, value] of Object.entries(state?.panels || {})) {
    const parsed = parsePanelKey(key)
    if (!parsed || parsed.trackerId !== tracker.id) continue
    if (!inRange(parsed.year, parsed.month, parsed.day, bounds.from, bounds.to)) continue
    panelIndex[cellKey(parsed.year, parsed.month, parsed.day)] = value
  }

  const entries = days
    .map((d) => {
      const value = pixelIndex[d.key] ?? null
      const panel = panelIndex[d.key] || {}
      const todos = state?.todos?.[d.key] || []
      const note = state?.dailyNotes?.[d.key] || ''
      const described = describeDay(tracker, value, panel, todos, note)
      const mins = Number(panel?.minutes) || 0
      return {
        ...d,
        value,
        color: tracker.levels?.find((l) => l.value === value)?.color || tracker.tabColor,
        empty: described.empty,
        headline: described.headline,
        details: described.details,
        minutes: mins,
        hasNote: Boolean(note?.trim()),
        noteLength: note?.trim()?.length || 0,
        tasksDone: todos.filter((t) => t.done || t.completed).length,
        tasksTotal: todos.length,
      }
    })
    .reverse()

  const summary = buildSummary(tracker, entries, bounds.periodWord)
  const reflection = buildReflection(tracker, entries, bounds.periodWord)
  const moments = entries.filter((e) => !e.empty)

  return {
    tracker,
    bounds,
    entries,
    moments,
    summary,
    reflection,
    loggedCount: moments.length,
    dayCount: entries.length,
  }
}
