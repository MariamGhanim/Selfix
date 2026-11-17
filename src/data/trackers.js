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
    subtitle: 'Quality, continuity, and sleep debt',
    tab: 'Sleep',
    icon: 'Moon',
    tabColor: '#9fa8da',
    panel: 'sleep',
    levels: [
      { value: 1, label: 'Needs attention', color: '#f28b82' },
      { value: 2, label: 'Fair', color: '#f6d56a' },
      { value: 3, label: 'Good', color: '#7dcea0' },
      { value: 4, label: 'Optimal', color: '#a78bda' },
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
      { value: 0, label: 'Missed', color: '#f3a6a0' },
      { value: 1, label: '1 on time', color: '#f5c9a8' },
      { value: 2, label: '2 on time', color: '#f0d89a' },
      { value: 3, label: '3 on time', color: '#b8dfc8' },
      { value: 4, label: '4 on time', color: '#9fd4c4' },
      { value: 5, label: 'All 5', color: '#8ec5f0' },
      { value: 6, label: '5 + Sunnah', color: '#b8a0e8' },
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
      { value: 0, label: '0', color: '#f2b8c6' },
      { value: 1, label: '1', color: '#f5c9a8' },
      { value: 2, label: '2', color: '#f0d89a' },
      { value: 3, label: '3', color: '#c5dbb4' },
      { value: 4, label: '4', color: '#b8dfc8' },
      { value: 5, label: '5', color: '#a8d8e8' },
      { value: 6, label: '6', color: '#8ec5f0' },
      { value: 7, label: '7', color: '#a8b8e8' },
      { value: 8, label: '8+', color: '#b8a0e8' },
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
      { value: 0, label: 'Missed', color: '#f3a6a0' },
      { value: 1, label: 'Once', color: '#f0d06a' },
      { value: 2, label: 'Twice+', color: '#8fd4a8' },
    ],
  },
  {
    id: 'shower',
    title: 'Hair & Skin Care',
    subtitle: 'Daily self-care & grooming ritual',
    tab: 'Care',
    icon: 'Droplets',
    tabColor: '#90caf9',
    panel: 'shower',
    levels: [
      { value: 1, label: 'Full ritual', color: '#8ec5f0' },
      { value: 2, label: 'Partial care', color: '#f0d06a' },
      { value: 3, label: 'Skipped', color: '#f3a6a0' },
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
      { value: 1, label: 'Taken', color: '#8fd4a8' },
      { value: 2, label: 'Partial', color: '#f0d06a' },
      { value: 3, label: 'Skipped', color: '#f3a6a0' },
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
      { value: 0, label: '0', color: '#f2b8c6' },
      { value: 1, label: '1', color: '#f5c9a8' },
      { value: 2, label: '2', color: '#f0d89a' },
      { value: 3, label: '3', color: '#8fd4a8' },
      { value: 4, label: '4+', color: '#8ec5f0' },
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
      { value: 0, label: '0', color: '#8fd4a8' },
      { value: 1, label: '1', color: '#f0d89a' },
      { value: 2, label: '2', color: '#f5c9a8' },
      { value: 3, label: '3', color: '#f2b8c6' },
      { value: 4, label: '4+', color: '#d4a0e8' },
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
      { value: 0, label: 'None / Rest', color: '#f2b8c6' },
      { value: 1, label: 'Light (<1h)', color: '#f0d06a' },
      { value: 2, label: 'Deep (2–4h)', color: '#8fd4a8' },
      { value: 3, label: 'Elite (4h+)', color: '#b8a0e8' },
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
      { value: 0, label: '0', color: '#f3a6a0' },
      { value: 1, label: '1', color: '#f0d06a' },
      { value: 2, label: '2', color: '#8fd4a8' },
      { value: 3, label: '3', color: '#8ec5f0' },
      { value: 4, label: 'All Done', color: '#b8a0e8' },
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
      { value: 0, label: 'Rest', color: '#f2b8c6' },
      { value: 1, label: 'Stretch', color: '#f0d89a' },
      { value: 2, label: 'Cardio / Walk', color: '#8fd4a8' },
      { value: 3, label: 'Gym', color: '#8ec5f0' },
      { value: 4, label: 'Intense', color: '#b8a0e8' },
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
      { value: 1, label: 'None', color: '#f2b8c6' },
      { value: 2, label: 'A few', color: '#f5c9a8' },
      { value: 3, label: 'Chapter', color: '#f0d89a' },
      { value: 4, label: 'Lots', color: '#8fd4a8' },
      { value: 5, label: 'Bookworm', color: '#b8a0e8' },
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
      { value: 0, label: 'Home', color: '#f2b8c6' },
      { value: 1, label: 'Errand', color: '#f0d06a' },
      { value: 2, label: 'Outing', color: '#8ec5f0' },
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
      { value: 1, label: 'None', color: '#f3a6a0' },
      { value: 2, label: 'Low', color: '#f5c9a8' },
      { value: 3, label: 'Medium', color: '#f0d06a' },
      { value: 4, label: 'High', color: '#8fd4a8' },
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
      { value: 1, label: '1★ Tough', color: '#f3a6a0' },
      { value: 2, label: '2★ Meh', color: '#f5c9a8' },
      { value: 3, label: '3★ Okay', color: '#f0d06a' },
      { value: 4, label: '4★ Good', color: '#8fd4a8' },
      { value: 5, label: '5★ Amazing', color: '#b8a0e8' },
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
      { value: 0, label: 'Off', color: '#f2b8c6' },
      { value: 1, label: 'Light', color: '#f0d06a' },
      { value: 2, label: 'Solid', color: '#8fd4a8' },
      { value: 3, label: 'Deep', color: '#b8a0e8' },
    ],
  },
]

export const TIMER_PRESETS = [
  { id: 'focus25', label: '25m', seconds: 25 * 60 },
  { id: 'deep50', label: '50m', seconds: 50 * 60 },
  { id: 'break5', label: '5m', seconds: 5 * 60 },
  { id: 'stretch15', label: '15m', seconds: 15 * 60 },
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
