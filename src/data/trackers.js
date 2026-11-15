export const MONTHS = [
  { id: 0, short: 'J', label: 'January' },
  { id: 1, short: 'F', label: 'February' },
  { id: 2, short: 'M', label: 'March' },
  { id: 3, short: 'A', label: 'April' },
  { id: 4, short: 'M', label: 'May' },
  { id: 5, short: 'J', label: 'June' },
  { id: 6, short: 'J', label: 'July' },
  { id: 7, short: 'A', label: 'August' },
  { id: 8, short: 'S', label: 'September' },
  { id: 9, short: 'O', label: 'October' },
  { id: 10, short: 'N', label: 'November' },
  { id: 11, short: 'D', label: 'December' },
]

export const MONTHS_FULL = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export function isValidDate(year, monthIndex, day) {
  const d = new Date(year, monthIndex, day)
  return d.getFullYear() === year && d.getMonth() === monthIndex && d.getDate() === day
}

export function cellKey(year, month, day) {
  return `${year}-${month}-${day}`
}

export const TRACKERS = [
  {
    id: 'sleep',
    title: 'Sleep & Rest Tracker',
    subtitle: 'How last night carried into today',
    tab: 'Sleep',
    icon: 'Moon',
    tabColor: '#9fa8da',
    panel: 'sleep',
    levels: [
      { value: 1, label: 'Bad (<5h)', color: '#ef5350' },
      { value: 2, label: 'Fair (5–6h)', color: '#ffca28' },
      { value: 3, label: 'Good (7–8h)', color: '#66bb6a' },
      { value: 4, label: 'Excellent (8h+)', color: '#7e57c2' },
    ],
  },
  {
    id: 'salah',
    title: 'Salah & Spiritual Tracker',
    subtitle: 'Five daily prayers and heart presence',
    tab: 'Praying',
    icon: 'MoonStar',
    tabColor: '#5db9a4',
    panel: 'salah',
    levels: [
      { value: 0, label: 'Missed', color: '#ef9a9a' },
      { value: 1, label: '1 on time', color: '#ffe082' },
      { value: 2, label: '2 on time', color: '#ffd54f' },
      { value: 3, label: '3 on time', color: '#c5e1a5' },
      { value: 4, label: '4 on time', color: '#aed581' },
      { value: 5, label: 'All 5', color: '#66bb6a' },
      { value: 6, label: '5 + Sunnah', color: '#26a69a' },
    ],
  },
  {
    id: 'water',
    title: 'Water Intake',
    subtitle: 'Morning sip to all-day hydration',
    tab: 'Water',
    icon: 'GlassWater',
    tabColor: '#64b5f6',
    panel: 'water',
    levels: [
      { value: 0, label: '0', color: '#eceff1' },
      { value: 1, label: '1', color: '#e3f2fd' },
      { value: 2, label: '2', color: '#bbdefb' },
      { value: 3, label: '3', color: '#90caf9' },
      { value: 4, label: '4', color: '#64b5f6' },
      { value: 5, label: '5', color: '#42a5f5' },
      { value: 6, label: '6', color: '#2196f3' },
      { value: 7, label: '7', color: '#1e88e5' },
      { value: 8, label: '8+', color: '#1565c0' },
    ],
  },
  {
    id: 'teeth',
    title: 'Teeth Brushing',
    subtitle: 'Morning and night oral care',
    tab: 'Teeth',
    icon: 'Smile',
    tabColor: '#80deea',
    panel: 'teeth',
    levels: [
      { value: 0, label: 'Missed', color: '#ef9a9a' },
      { value: 1, label: 'Once', color: '#ffe082' },
      { value: 2, label: 'Twice+', color: '#81c784' },
    ],
  },
  {
    id: 'shower',
    title: 'Shower & Hair Care',
    subtitle: 'Wake-up self-care routine',
    tab: 'Shower',
    icon: 'Droplets',
    tabColor: '#90caf9',
    panel: 'shower',
    levels: [
      { value: 1, label: 'Full + Hair', color: 'var(--c5)' },
      { value: 2, label: 'Body only', color: 'var(--c3)' },
      { value: 3, label: 'No shower', color: 'var(--c1)' },
    ],
  },
  {
    id: 'vitamins',
    title: 'Vitamins & Supplements',
    subtitle: 'Morning supplements with food',
    tab: 'Vitamins',
    icon: 'Pill',
    tabColor: '#aed581',
    panel: 'vitamins',
    levels: [
      { value: 1, label: 'Taken', color: '#7bc47f' },
      { value: 2, label: 'Partial', color: '#f0d45a' },
      { value: 3, label: 'Skipped', color: '#ef6b6b' },
    ],
  },
  {
    id: 'fruits',
    title: 'Fruits & Vegetables',
    subtitle: 'Fresh fuel through the day',
    tab: 'Fruits',
    icon: 'Apple',
    tabColor: '#74bc64',
    panel: 'fruits',
    levels: [
      { value: 0, label: '0', color: '#f0d0d0' },
      { value: 1, label: '1', color: '#c8e6c0' },
      { value: 2, label: '2', color: '#9fd48f' },
      { value: 3, label: '3', color: '#74bc64' },
      { value: 4, label: '4+', color: '#4a9a48' },
    ],
  },
  {
    id: 'sweets',
    title: 'Sweets & Sugar',
    subtitle: 'Treats and cravings check-in',
    tab: 'Sweets',
    icon: 'Candy',
    tabColor: '#ffab91',
    panel: 'sweets',
    levels: [
      { value: 0, label: '0', color: '#e8f5e9' },
      { value: 1, label: '1', color: '#ffe0b2' },
      { value: 2, label: '2', color: '#ffcc80' },
      { value: 3, label: '3', color: '#ffab91' },
      { value: 4, label: '4+', color: '#ef9a9a' },
    ],
  },
  {
    id: 'focus',
    title: 'Focus & Deep Work Tracker',
    subtitle: 'Midday deep work sessions',
    tab: 'Focus',
    icon: 'Target',
    tabColor: '#f48fb1',
    panel: 'focus',
    levels: [
      { value: 0, label: 'None / Rest', color: '#eceff1' },
      { value: 1, label: 'Light (<1h)', color: '#ffca28' },
      { value: 2, label: 'Deep (2–4h)', color: '#66bb6a' },
      { value: 3, label: 'Elite (4h+)', color: '#7e57c2' },
    ],
  },
  {
    id: 'tasks',
    title: 'Daily Tasks',
    subtitle: 'Checklist beside your focus blocks',
    tab: 'Tasks',
    icon: 'CheckSquare',
    tabColor: '#ce93d8',
    panel: 'todos',
    levels: [
      { value: 0, label: '0', color: 'var(--c1)' },
      { value: 1, label: '1', color: 'var(--c2)' },
      { value: 2, label: '2', color: 'var(--c3)' },
      { value: 3, label: '3', color: 'var(--c4)' },
      { value: 4, label: 'All Done', color: 'var(--c5)' },
    ],
  },
  {
    id: 'workout',
    title: 'Gym & Stretching',
    subtitle: 'Afternoon movement and recovery',
    tab: 'Gym',
    icon: 'Dumbbell',
    tabColor: '#81c784',
    panel: 'workout',
    levels: [
      { value: 0, label: 'Rest', color: '#eceff1' },
      { value: 1, label: 'Stretch', color: '#b2dfdb' },
      { value: 2, label: 'Cardio / Walk', color: '#80cbc4' },
      { value: 3, label: 'Gym', color: '#4db6ac' },
      { value: 4, label: 'Intense', color: '#00897b' },
    ],
  },
  {
    id: 'reading',
    title: 'Reading',
    subtitle: 'Pages between the busy hours',
    tab: 'Reading',
    icon: 'BookOpen',
    tabColor: '#d4a574',
    panel: 'reading',
    levels: [
      { value: 1, label: 'None', color: '#f5e6d3' },
      { value: 2, label: 'A few', color: '#e8c9a0' },
      { value: 3, label: 'Chapter', color: '#d4a574' },
      { value: 4, label: 'Lots', color: '#c4895a' },
      { value: 5, label: 'Bookworm', color: '#a86b3c' },
    ],
  },
  {
    id: 'outings',
    title: 'Outings & Hangouts',
    subtitle: 'Evening plans and real-world fun',
    tab: 'Outings',
    icon: 'MapPin',
    tabColor: '#ffb74d',
    panel: 'outings',
    levels: [
      { value: 0, label: 'Home', color: '#eceff1' },
      { value: 1, label: 'Errand', color: '#ffcc80' },
      { value: 2, label: 'Outing', color: '#ff9800' },
    ],
  },
  {
    id: 'energy',
    title: 'Energy & Mood',
    subtitle: 'Evening energy and mood wrap-up',
    tab: 'Energy',
    icon: 'Zap',
    tabColor: '#f0d45a',
    panel: 'energy',
    levels: [
      { value: 1, label: 'None', color: '#ef6b6b' },
      { value: 2, label: 'Low', color: '#f0a05a' },
      { value: 3, label: 'Medium', color: '#f0d45a' },
      { value: 4, label: 'High', color: '#7bc47f' },
    ],
  },
  {
    id: 'rating',
    title: 'Day Rating',
    subtitle: 'How the whole day felt',
    tab: 'Rating',
    icon: 'Star',
    tabColor: '#f2a0b5',
    panel: 'rating',
    levels: [
      { value: 1, label: '1★ Tough', color: 'var(--c1)' },
      { value: 2, label: '2★ Meh', color: 'var(--c2)' },
      { value: 3, label: '3★ Okay', color: 'var(--c3)' },
      { value: 4, label: '4★ Good', color: 'var(--c4)' },
      { value: 5, label: '5★ Amazing', color: 'var(--c5)' },
    ],
  },
  {
    id: 'study',
    title: 'Self-Development',
    subtitle: 'Night growth, reflection, and learning',
    tab: 'Self-Dev',
    icon: 'Sparkles',
    tabColor: '#7eb8e8',
    panel: 'study',
    levels: [
      { value: 0, label: 'Off', color: 'var(--empty-cell)' },
      { value: 1, label: 'Light', color: 'var(--c2)' },
      { value: 2, label: 'Solid', color: 'var(--c3)' },
      { value: 3, label: 'Deep', color: 'var(--c5)' },
    ],
  },
]

export const TIMER_PRESETS = [
  { id: 'focus25', label: '25m Focus', seconds: 25 * 60 },
  { id: 'deep50', label: '50m Deep', seconds: 50 * 60 },
  { id: 'break5', label: '5m Break', seconds: 5 * 60 },
  { id: 'stretch15', label: '15m Stretch', seconds: 15 * 60 },
]

export function defaultTrackerPrefs() {
  return {
    order: TRACKERS.map((t) => t.id),
    hidden: [],
    custom: [],
  }
}

export function normalizeTrackerPrefs(raw) {
  const base = defaultTrackerPrefs()
  const custom = Array.isArray(raw?.custom) ? raw.custom.filter((t) => t?.id && t?.title) : []
  const catalogIds = new Set([...TRACKERS.map((t) => t.id), ...custom.map((t) => t.id)])
  const order = Array.isArray(raw?.order)
    ? raw.order.filter((id) => catalogIds.has(id))
    : [...base.order]
  for (const id of catalogIds) {
    if (!order.includes(id)) order.push(id)
  }
  const hidden = Array.isArray(raw?.hidden) ? raw.hidden.filter((id) => catalogIds.has(id)) : []
  return { order, hidden, custom }
}

export function resolveActiveTrackers(prefsInput) {
  const prefs = normalizeTrackerPrefs(prefsInput)
  const catalog = [...TRACKERS, ...prefs.custom]
  const byId = Object.fromEntries(catalog.map((t) => [t.id, t]))
  return prefs.order.map((id) => byId[id]).filter((t) => t && !prefs.hidden.includes(t.id))
}

export function resolveManagedTrackers(prefsInput) {
  const prefs = normalizeTrackerPrefs(prefsInput)
  const catalog = [...TRACKERS, ...prefs.custom]
  const byId = Object.fromEntries(catalog.map((t) => [t.id, t]))
  return prefs.order
    .map((id) => byId[id])
    .filter(Boolean)
    .map((t) => ({
      ...t,
      enabled: !prefs.hidden.includes(t.id),
      isCustom: Boolean(t.custom),
    }))
}
