export const QUIZ_DEFAULTS = { q1: null, q2: null, q3: null }

export const SUPPORT_BY_ANSWER = {
  crash: 'Sugar dips happen — be extra gentle with yourself today.',
  craving: 'Cravings are human. Curiosity beats guilt every time.',
  thirsty: 'Your body is whispering for care. Even one sip counts.',
  late: 'Late is still showing up. Tomorrow can start softer.',
  scrolling: 'Screens steal sleep — no judgment. Rest is still available.',
  zombie: 'Rough mornings are valid. A soft start is still a start.',
  nap: 'Your body is asking for recovery. Listening is strength.',
  tossed: 'Restless nights happen. Be kind to tomorrow-you.',
  struggled: 'Finishing imperfectly still counts. You moved.',
  sore: 'Soreness means you showed up. Rest is part of the workout.',
  rush: 'A quick routine still protects future-you. Proud of the effort.',
  sensitive: 'Sensitivity is a signal, not a failure. Soft care helps.',
  home: 'Wanting home time is wise energy management.',
  empty: 'Empty stomachs happen — next time, pair with a snack if you can.',
  track: 'Getting back on track is the win. Consistency is a loop, not a line.',
  sip: 'A quick sip is a start. Hydration can grow from here.',
  reread: 'Foggy focus days are real. Showing up to the page still matters.',
  comfort: 'Stretching your comfort zone is brave — celebrate the stretch.',
  allout: 'Indulgence can be joy. Softness after sweets is welcome.',
  crash_day: 'Hard days count too. You are still worthy of care.',
}

export function supportNoteForAnswers(answers = {}, questions = []) {
  for (const q of questions) {
    const picked = answers?.[q.key]
    if (!picked) continue
    const opt = q.options?.find((o) => o.id === picked)
    if (opt?.support) return opt.support
    if (SUPPORT_BY_ANSWER[picked]) return SUPPORT_BY_ANSWER[picked]
  }
  return null
}

export const SHOWER_QUIZ = [
  {
    key: 'q1',
    question: 'How intentional was your self-care today?',
    options: [
      { id: 'quick', emoji: '⚡', label: 'Quick Essentials' },
      { id: 'spa', emoji: '🧖‍♀️', label: 'Full Spa Ritual' },
      { id: 'relaxing', emoji: '🌿', label: 'Slow & Nurturing' },
    ],
  },
  {
    key: 'q2',
    question: 'What got the most love?',
    options: [
      { id: 'hair', emoji: '💇', label: 'Hair & Scalp' },
      { id: 'face', emoji: '✨', label: 'Face & Skin' },
      { id: 'body', emoji: '🫧', label: 'Body & Relax' },
    ],
  },
  {
    key: 'q3',
    question: 'How do you feel after caring for yourself?',
    options: [
      { id: 'reborn', emoji: '✨', label: 'Fresh & Glowing' },
      { id: 'pampered', emoji: '🧴', label: 'Soft & Pampered' },
      { id: 'bed', emoji: '😴', label: 'Calm & Ready to Rest' },
    ],
  },
]

export const FRUITS_QUIZ = [
  {
    key: 'q1',
    question: 'How did fruit show up for you today?',
    options: [
      { id: 'whole', emoji: '🍎', label: 'Fresh & Whole' },
      { id: 'smoothie', emoji: '🥤', label: 'Blended Smoothie' },
      { id: 'bowl', emoji: '🥗', label: 'Mixed Fruit Bowl' },
    ],
  },
  {
    key: 'q2',
    question: 'When did that colorful bite land?',
    options: [
      { id: 'morning', emoji: '🌅', label: 'Morning Kickstart' },
      { id: 'afternoon', emoji: '☀️', label: 'Afternoon Snack' },
      { id: 'evening', emoji: '🌙', label: 'Evening Sweet Fix' },
    ],
  },
  {
    key: 'q3',
    question: 'Did it land the way you hoped?',
    options: [
      { id: 'refreshing', emoji: '😋', label: 'So Refreshing!' },
      { id: 'healthy', emoji: '⚖️', label: 'Light & Healthy' },
      {
        id: 'craving',
        emoji: '➕',
        label: 'Still Craving Sweets',
        support: 'Cravings are human. Curiosity beats guilt every time.',
      },
    ],
  },
]

export const SWEETS_QUIZ = [
  {
    key: 'q1',
    question: 'What invited the sweet treat in today?',
    options: [
      { id: 'coffee', emoji: '☕', label: 'Coffee / Tea Companion' },
      { id: 'reward', emoji: '🎉', label: 'Reward / Celebration' },
      { id: 'craving', emoji: '🤤', label: 'Random Craving' },
    ],
  },
  {
    key: 'q2',
    question: 'How big was the little joy?',
    options: [
      { id: 'tiny', emoji: '🤏', label: 'Just a Tiny Bite' },
      { id: 'normal', emoji: '🧁', label: 'Normal Portion' },
      { id: 'allout', emoji: '🍰', label: 'Went All Out' },
    ],
  },
  {
    key: 'q3',
    question: 'How does your body feel afterward?',
    options: [
      { id: 'worth', emoji: '🥰', label: '100% Worth It' },
      { id: 'fine', emoji: '⚖️', label: 'Totally Fine' },
      {
        id: 'crash',
        emoji: '😵',
        label: 'Sugar Crash',
        support: 'Sugar dips happen — be extra gentle with yourself today.',
      },
    ],
  },
]

export const WATER_QUIZ = [
  {
    key: 'q1',
    question: 'How did hydration flow through your day?',
    options: [
      { id: 'early', emoji: '🌅', label: 'Started Early & Strong' },
      { id: 'sipping', emoji: '⏱️', label: 'Sipping All Day' },
      {
        id: 'late',
        emoji: '🌙',
        label: 'Chugged It Late',
        support: 'Late is still showing up. Tomorrow can start softer.',
      },
    ],
  },
  {
    key: 'q2',
    question: 'What kept you company in the glass?',
    options: [
      { id: 'plain', emoji: '💧', label: 'Plain Cold Water' },
      { id: 'infused', emoji: '🍋', label: 'Infused / Electrolytes' },
      { id: 'tea', emoji: '🍵', label: 'Herbal Tea / Drinks' },
    ],
  },
  {
    key: 'q3',
    question: 'How is your body feeling right now?',
    options: [
      { id: 'glowing', emoji: '✨', label: 'Hydrated & Glowing' },
      { id: 'okay', emoji: '⚖️', label: 'Doing Okay' },
      {
        id: 'thirsty',
        emoji: '🏜️',
        label: 'Still Thirsty',
        support: 'Your body is whispering for care. Even one sip counts.',
      },
    ],
  },
]

export const SLEEP_QUIZ = [
  {
    key: 'q1',
    question: 'How did falling asleep go last night?',
    options: [
      { id: 'light', emoji: '😴', label: 'Out Like a Light' },
      {
        id: 'tossed',
        emoji: '⏳',
        label: 'Tossed & Turned a Bit',
        support: 'Restless nights happen. Be kind to tomorrow-you.',
      },
      {
        id: 'scrolling',
        emoji: '📱',
        label: 'Stayed Up Scrolling',
        support: 'Screens steal sleep — no judgment. Rest is still available.',
      },
    ],
  },
  {
    key: 'q2',
    question: 'What was the first feeling when the alarm rang?',
    options: [
      { id: 'ready', emoji: '☀️', label: 'Refreshed & Ready' },
      { id: 'fivemore', emoji: '🥱', label: 'Needed 5 More Mins' },
      {
        id: 'zombie',
        emoji: '🧟',
        label: 'Total Zombie Mode',
        support: 'Rough mornings are valid. A soft start is still a start.',
      },
    ],
  },
  {
    key: 'q3',
    question: 'Did your sleep feel like it restored you?',
    options: [
      { id: 'deep', emoji: '🔋', label: 'Deep & Restful' },
      { id: 'average', emoji: '⚖️', label: 'Average Night' },
      {
        id: 'nap',
        emoji: '💤',
        label: 'Need a Nap Today',
        support: 'Your body is asking for recovery. Listening is strength.',
      },
    ],
  },
]

export const WORKOUT_QUIZ = [
  {
    key: 'q1',
    question: 'How hard did you lovingly push yourself today?',
    options: [
      { id: 'light', emoji: '🚶', label: 'Light & Easy Movement' },
      { id: 'solid', emoji: '💪', label: 'Solid Steady Effort' },
      { id: 'beast', emoji: '🔥', label: 'Beast Mode Unlocked' },
    ],
  },
  {
    key: 'q2',
    question: 'How did your energy feel mid-session?',
    options: [
      { id: 'unstoppable', emoji: '⚡', label: 'Unstoppable' },
      { id: 'paced', emoji: '⚖️', label: 'Paced Myself' },
      {
        id: 'struggled',
        emoji: '😮‍💨',
        label: 'Struggled to Finish',
        support: 'Finishing imperfectly still counts. You moved.',
      },
    ],
  },
  {
    key: 'q3',
    question: 'What is your post-workout mood saying?',
    options: [
      { id: 'proud', emoji: '🏆', label: 'Proud & Accomplished' },
      { id: 'calm', emoji: '😌', label: 'Calm Endorphins' },
      {
        id: 'sore',
        emoji: '🦵',
        label: 'Sore & Ready to Rest',
        support: 'Soreness means you showed up. Rest is part of the workout.',
      },
    ],
  },
]

export const TEETH_QUIZ = [
  {
    key: 'q1',
    question: 'How thorough was your dental care today?',
    options: [
      { id: 'full', emoji: '✨', label: 'Full Routine (Brush + Floss)' },
      { id: 'standard', emoji: '🪥', label: 'Standard Brushing' },
      {
        id: 'rush',
        emoji: '⚡',
        label: 'Quick Rush',
        support: 'A quick routine still protects future-you. Proud of the effort.',
      },
    ],
  },
  {
    key: 'q2',
    question: 'Did morning and night both get some love?',
    options: [
      { id: 'both', emoji: '✅', label: 'Both Morning & Night' },
      { id: 'morning', emoji: '🌅', label: 'Morning Only' },
      { id: 'night', emoji: '🌙', label: 'Night Only' },
    ],
  },
  {
    key: 'q3',
    question: 'How do your teeth and gums feel right now?',
    options: [
      { id: 'clean', emoji: '😁', label: 'Squeaky Clean & Fresh' },
      { id: 'normal', emoji: '⚖️', label: 'Normal' },
      {
        id: 'sensitive',
        emoji: '⚠️',
        label: 'A Bit Sensitive',
        support: 'Sensitivity is a signal, not a failure. Soft care helps.',
      },
    ],
  },
]

export const OUTINGS_QUIZ = [
  {
    key: 'q1',
    question: 'Who shared this outing with you?',
    options: [
      { id: 'solo', emoji: '🧍', label: 'Peaceful Solo Date' },
      { id: 'friends', emoji: '👯', label: 'Bestie / Friends' },
      { id: 'family', emoji: '👨‍👩‍👧', label: 'Family / Partner' },
    ],
  },
  {
    key: 'q2',
    question: 'What was the main vibe of getting out?',
    options: [
      { id: 'cafe', emoji: '☕', label: 'Cozy Cafe & Chill' },
      { id: 'adventure', emoji: '🎉', label: 'Fun Adventure' },
      { id: 'errands', emoji: '🛍️', label: 'Productive Errands' },
    ],
  },
  {
    key: 'q3',
    question: 'How did going out leave your mood?',
    options: [
      { id: 'recharged', emoji: '🔋', label: 'Recharged My Spirit' },
      { id: 'pace', emoji: '⚖️', label: 'Nice Change of Pace' },
      {
        id: 'home',
        emoji: '🪫',
        label: 'Ready to Go Home',
        support: 'Wanting home time is wise energy management.',
      },
    ],
  },
]

export const VITAMINS_QUIZ = [
  {
    key: 'q1',
    question: 'When did your supplements join the day?',
    options: [
      { id: 'breakfast', emoji: '🍳', label: 'With Breakfast' },
      { id: 'lunch', emoji: '🥗', label: 'With Lunch' },
      { id: 'bed', emoji: '🌙', label: 'Before Bed' },
    ],
  },
  {
    key: 'q2',
    question: 'How has consistency felt lately?',
    options: [
      { id: 'schedule', emoji: '🎯', label: 'Right on Schedule' },
      { id: 'late', emoji: '⏰', label: 'Took Them Late' },
      {
        id: 'track',
        emoji: '🔄',
        label: 'Getting Back on Track',
        support: 'Getting back on track is the win. Consistency is a loop, not a line.',
      },
    ],
  },
  {
    key: 'q3',
    question: 'Did they get enough water & food company?',
    options: [
      { id: 'meal', emoji: '💧', label: 'Yes, Full Meal & Water' },
      {
        id: 'sip',
        emoji: '🤏',
        label: 'Just a Quick Sip',
        support: 'A quick sip is a start. Hydration can grow from here.',
      },
      {
        id: 'empty',
        emoji: '⚠️',
        label: 'On an Empty Stomach',
        support: 'Empty stomachs happen — next time, pair with a snack if you can.',
      },
    ],
  },
]

export const READING_QUIZ = [
  {
    key: 'q1',
    question: 'How did you meet your pages today?',
    options: [
      { id: 'physical', emoji: '📖', label: 'Physical Book' },
      { id: 'kindle', emoji: '📱', label: 'Kindle / E-Reader' },
      { id: 'audio', emoji: '🎧', label: 'Audiobook' },
    ],
  },
  {
    key: 'q2',
    question: 'How focused did the session feel?',
    options: [
      { id: 'hooked', emoji: '🤿', label: 'Completely Hooked' },
      { id: 'casual', emoji: '☕', label: 'Relaxed Casual Read' },
      {
        id: 'reread',
        emoji: '😴',
        label: 'Kept Re-reading Lines',
        support: 'Foggy focus days are real. Showing up to the page still matters.',
      },
    ],
  },
  {
    key: 'q3',
    question: 'What did today\'s pages leave you with?',
    options: [
      { id: 'idea', emoji: '💡', label: 'New Idea / Inspired' },
      { id: 'escape', emoji: '🧘', label: 'Peaceful Escape' },
      { id: 'goal', emoji: '📈', label: 'Closer to My Goal' },
    ],
  },
]

export const STUDY_QUIZ = [
  {
    key: 'q1',
    question: 'What kind of growth got your attention today?',
    options: [
      { id: 'course', emoji: '🎥', label: 'Course / Tutorial' },
      { id: 'planning', emoji: '✍️', label: 'Planning & Journaling' },
      { id: 'practice', emoji: '🧠', label: 'Hands-on Practice' },
    ],
  },
  {
    key: 'q2',
    question: 'How challenging did the session feel?',
    options: [
      { id: 'easy', emoji: '🌱', label: 'Easy & Enjoyable' },
      { id: 'stretch', emoji: '🧩', label: 'Stretched My Brain' },
      {
        id: 'comfort',
        emoji: '🔥',
        label: 'Out of My Comfort Zone',
        support: 'Stretching your comfort zone is brave — celebrate the stretch.',
      },
    ],
  },
  {
    key: 'q3',
    question: 'What is your biggest takeaway from today?',
    options: [
      { id: 'aha', emoji: '💡', label: 'Aha! Breakthrough' },
      { id: 'brick', emoji: '🧱', label: 'One Brick Closer' },
      { id: 'review', emoji: '🔄', label: 'Good Review' },
    ],
  },
]

export const SALAH_QUIZ = [
  {
    key: 'q1',
    question: 'How was your connection in prayer today?',
    options: [
      { id: 'present', emoji: '💚', label: 'Present & Soft' },
      { id: 'mixed', emoji: '🌤️', label: 'A Little of Both' },
      {
        id: 'distracted',
        emoji: '🌀',
        label: 'Mind Drifted',
        support: 'Khushu grows gently. Returning your heart is already worship.',
      },
    ],
  },
  {
    key: 'q2',
    question: 'Did you rush through any prayers?',
    options: [
      { id: 'calm', emoji: '🕊️', label: 'Took My Time' },
      { id: 'one', emoji: '⏱️', label: 'Rushed One' },
      {
        id: 'rush',
        emoji: '💨',
        label: 'Felt Rushed',
        support: 'Even a hurried salah is still a return. Tomorrow can be slower.',
      },
    ],
  },
  {
    key: 'q3',
    question: 'How present was your heart (khushu\')?',
    options: [
      { id: 'deep', emoji: '✨', label: 'Deep Presence' },
      { id: 'trying', emoji: '🤲', label: 'Trying Softly' },
      { id: 'scattered', emoji: '🍃', label: 'Scattered Thoughts' },
    ],
  },
]
