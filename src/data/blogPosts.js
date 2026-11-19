/**
 * Static blog content for Selfix Life.
 * Word counts are measured from section text and list items.
 */

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mood', label: 'Mood & Emotions' },
  { id: 'sleep', label: 'Sleep & Rest' },
  { id: 'habits', label: 'Daily Habits' },
  { id: 'journaling', label: 'Journaling Tips' },
]

export const blogPosts = [
  {
    slug: 'what-is-a-year-in-pixels',
    title: 'What is a Year in Pixels and How Does It Improve Mental Clarity?',
    description:
      'A Year in Pixels turns each day into one soft color. See how a pastel grid can quiet mental clutter and make emotional patterns easier to notice.',
    date: '2026-11-18',
    readMinutes: 10,
    category: 'journaling',
    tags: ['Year in Pixels', 'Mental clarity', 'Journaling'],
    sections: [
      {
        type: 'p',
        text: 'A Year in Pixels is a simple visual journal. Every day of the year gets one square, and you fill that square with a color that stands for how the day felt. Mood, energy, sleep, or some mix of the three can all live in that one mark. You do not owe the page a paragraph. You owe it a moment of honesty. Over weeks, the squares stop looking like a craft project and start looking like weather you can actually see.',
      },
      {
        type: 'p',
        text: 'People often find the method in bullet journals or quiet mental-health corners of the internet, then keep it because it is fast on hard days. A blank notebook can feel like another job at 10 p.m. A pixel asks for one decision: which color is closest to the truth? That small decision is why the practice can clear mental fog. You stop carrying the whole day as a vague story in your head. You put it somewhere and let it be one square.',
      },
      {
        type: 'h2',
        text: 'Why a grid can feel clearer than a wall of words',
      },
      {
        type: 'p',
        text: 'Mental clutter is often unfinished thinking. Did last week drain me, or am I just tired tonight? Was March really that heavy, or did one bad Wednesday take over the memory? Words can answer those questions, and sometimes they should. They can also sprawl. A grid compresses the answer into something your eyes can scan. Humans are good at noticing a change in color. A run of cooler squares after a run of warm ones is easier to trust than a feeling that “everything has been awful lately,” which might be true, or might be tonight’s mood talking.',
      },
      {
        type: 'p',
        text: 'Clarity, in this sense, is not a sudden life plan. It is a reduction in noise. When the record exists, your mind does less late-night detective work. You can look at October and say, the first half was thin and the last ten days lifted, without rewriting history to match how you feel on a Sunday. That is a kinder kind of accuracy. Memory is loyal to whatever emotion is loudest. A mosaic is loyal to the days themselves.',
      },
      {
        type: 'h2',
        text: 'Color as a bridge when words are slow',
      },
      {
        type: 'p',
        text: 'Naming feelings precisely is a skill, and not everyone was handed a rich vocabulary for it. Color gives you a bridge. Butter yellow might mean “I had some ease.” Soft blue might mean “I was tired and still okay.” A dusty rose might mean “tender, a bit raw.” You do not need a public legend that would make sense to a stranger. You need a legend that makes sense to you next month. Many people write four or five labels once, then let the colors do the daily work.',
      },
      {
        type: 'p',
        text: 'This is awareness, not a report card. A week of heavier colors is information. It is not a verdict on your character, your productivity, or whether you are “doing life right.” The American Psychological Association describes mindfulness as paying attention to the present with acceptance rather than a rush to judge. A pixel practice borrows that spirit. You notice the day. You let the square hold it. You do not cross-examine yourself for having a human afternoon.',
      },
      {
        type: 'h2',
        text: 'What patterns are actually useful',
      },
      {
        type: 'p',
        text: 'The useful part arrives when a pattern repeats enough times that you can ask a gentle question. Maybe low-energy colors cluster on the days after late screens. Maybe your mood softens during weeks with a real lunch and a walk. Maybe Sundays look different from Wednesdays for a reason you can name: social plans, meal prep, or the quiet after a noisy job. None of that requires a spreadsheet. It requires looking at the month the way you might look at a sky and say, oh, it has been cloudy, that explains the light in the kitchen.',
      },
      {
        type: 'ul',
        items: [
          'A multi-week dip becomes visible before it hardens into “I always feel this way.”',
          'Quiet steady weeks show up, even when memory only saved the dramatic days.',
          'Sleep, mood, and a habit can sit side by side if you keep more than one soft grid.',
          'You can change one small thing and watch the next two weeks, instead of overhauling everything on a whim.',
          'A hard month can be held as a season, which is easier to talk about than a foggy accusation.',
        ],
      },
      {
        type: 'h2',
        text: 'Keeping the practice light enough to last',
      },
      {
        type: 'p',
        text: 'The method gets heavy when the grid becomes a perfection project. Missed days happen. Travel happens. Flu happens. A night when you simply do not want to perform wellness happens. Leave the square blank, or fill it later with what you actually remember, not with the color you wish had been true. A small palette helps. Five colors you can remember beat twenty colors you have to look up. A one-line note is optional. Some days the color is the whole entry, and that is complete.',
      },
      {
        type: 'p',
        text: 'If you like a digital book, a calm layout matters. Selfix Life keeps Year in Pixels inside an open-book page so the check-in feels closer to a notebook than to a dashboard with streaks and alarms. Paper works too. The best tool is the one you will open on a Tuesday when you are already in pajamas. Mental clarity grows from regular, low-friction contact with your own days, not from a beautiful system you abandon in week three.',
      },
      {
        type: 'h2',
        text: 'A soft way to start this month',
      },
      {
        type: 'ol',
        items: [
          'Choose three to five colors and write a plain-language meaning next to each one.',
          'Pick one question, such as “How was my energy?” or “How kind did the day feel?”',
          'Color today only. Do not backfill the whole month on night one unless you want to.',
          'Once a week, look at the row without fixing it. Notice, then close the book.',
        ],
      },
      {
        type: 'p',
        text: 'A year from now, those squares will not explain your whole life. They will give you a portrait that is easier to understand and easier to hold without flinching. That is the clarity most of us actually need: not a slogan, just a cleaner view of what our days have been.',
      },
    ],
    references: [
      {
        label: 'American Psychological Association — Mindfulness meditation',
        url: 'https://www.apa.org/topics/mindfulness/meditation',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
      {
        label: 'American Psychological Association — Coping with stress at work',
        url: 'https://www.apa.org/topics/healthy-workplaces/work-stress',
      },
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
    ],
  },
  {
    slug: 'science-backed-habits-for-daily-energy',
    title: '5 Science-Backed Habits to Track for Better Daily Energy',
    description:
      'Five everyday habits linked with steadier energy: sleep timing, morning light, movement, a caffeine cutoff, and a short evening landing. No streaks required.',
    date: '2026-11-13',
    readMinutes: 10,
    category: 'habits',
    tags: ['Energy', 'Habits', 'Daily rhythm'],
    sections: [
      {
        type: 'p',
        text: 'Energy is rarely one switch. It is sleep, light, food, movement, caffeine, and the mood you carried in from yesterday, all sharing one body. That is why a single “be more productive” plan tends to collapse by Thursday. A calmer approach is to watch a few habits that research already links with how awake and steady people feel, then track them softly. Not as a score. As a trail you can look back on when the afternoon slump starts to feel personal.',
      },
      {
        type: 'p',
        text: 'The five below are ordinary on purpose. You already do versions of them. The shift is noticing which ones actually move your day, in your life, not in a generic plan. A pixel or a simple mark is enough. If you track all five every day and start dreading the log, you are tracking too much. Pick two for a fortnight. Add another only if the book still feels friendly.',
      },
      {
        type: 'h2',
        text: '1. A wake time you can mostly keep',
      },
      {
        type: 'p',
        text: 'The CDC describes good sleep as both enough hours and a rhythm you can repeat: similar bed and wake times, a quiet cool room, and fewer late screens. The Sleep Foundation puts special weight on a fixed wake-up time, including on days off, because a swinging schedule makes the next night harder. For energy, this often matters more than chasing a perfect bedtime you cannot keep. If you wake at 6:40 for work and at 9:30 on Sunday, Monday is not a motivation problem. It is a clock problem.',
      },
      {
        type: 'p',
        text: 'Track the wake time in a loose way. “Close to my usual” and “much later” are enough. Adults are generally advised to get seven or more hours. If you are far under that for weeks, the habit to watch is sleep itself, not a new morning routine stacked on top of a deficit. A tracker should point you toward rest, not give you another task while you are already short.',
      },
      {
        type: 'h2',
        text: '2. Daylight in the first part of the day',
      },
      {
        type: 'p',
        text: 'Light is information for your body clock. Harvard Health notes that bright light during the day supports alertness and mood, and that light at night, especially blue-heavy screen light, can push melatonin and sleep timing around. You do not need a perfect sunrise ritual. Ten minutes outside with a mug, or a walk to the bus in real daylight, is a real dose. On dark winter mornings, opening the blinds and getting out for a few minutes still counts.',
      },
      {
        type: 'p',
        text: 'A simple pixel for “saw daylight before noon” will teach you more than you expect. Many people discover that their flattest days are the ones spent entirely under office lighting, from the car to the desk to the car again. That is a design problem you can nudge: lunch outside, a loop around the block, a desk closer to a window.',
      },
      {
        type: 'h2',
        text: '3. Movement in pieces, not a personality',
      },
      {
        type: 'p',
        text: 'The CDC’s adult activity guidance is about 150 minutes a week of moderate movement, and it is explicit that you can split that up. Twenty-two minutes, a pair of ten-minute walks, dancing while the pasta boils: all of it counts. Harvard Health has also described exercise as one support for mood, with the practical advice to start at a few minutes if that is what today allows. Energy and movement feed each other. Waiting until you “feel energetic enough to work out” can keep the loop stuck.',
      },
      {
        type: 'p',
        text: 'Track the smallest honest version. “I moved my body on purpose” is a kinder mark than a missed gym streak. Look back after two weeks. If the days you moved are also the days your energy color is less flat, you have a clue. If they are not, you may be overdoing intensity or sleeping too little for the workout you chose. The grid is allowed to tell you to go easier.',
      },
      {
        type: 'h2',
        text: '4. Caffeine with a cutoff you chose',
      },
      {
        type: 'p',
        text: 'Caffeine blocks adenosine, one of the chemicals that makes you feel sleepy, which is why the cup works. The Sleep Foundation notes that it can also delay sleep, shorten it, and lighten deep sleep, and suggests avoiding it for at least eight hours before bed as a general guide. Sensitivity varies. Some people feel a 2 p.m. coffee at 11 p.m. Others do not. Your tracker is how you find your own line without borrowing someone else’s rule as a moral law.',
      },
      {
        type: 'p',
        text: 'Mark “late caffeine” on the days it happens, then look at the next morning’s energy and the night’s sleep color. If they dip together, you have a lever that does not require a new identity. If they do not, you can stop worrying about the occasional afternoon tea. Data you can see is more settling than a vague suspicion that coffee is “probably bad.”',
      },
      {
        type: 'h2',
        text: '5. A short landing at the end of the day',
      },
      {
        type: 'p',
        text: 'Energy tomorrow is partly built tonight. Sleep hygiene guidance often suggests a wind-down of about half an hour: dimmer lights, a repeated sequence, and a break from the most stimulating screens. This is not a spa checklist. It can be pajamas, teeth, a glass of water, and the pixel. The point is a cue your body recognizes. When every evening is different, your nervous system stays on call.',
      },
      {
        type: 'ul',
        items: [
          'Track two habits at a time so the log stays smaller than the life it describes.',
          'Use words like “mostly” and “not today” instead of pass or fail.',
          'Compare habits with how the next morning felt, not with an ideal week from the internet.',
          'If a habit only happens when life is already easy, shrink it until it can happen on a messy day.',
          'Pause the whole tracker if it starts sounding like a critic. Rest is a habit too.',
        ],
      },
      {
        type: 'p',
        text: 'Better daily energy is usually a cluster of small repeats, not a single heroic morning. A soft tracker lets you see which repeats are yours. Keep the ones that change the color of the week. Let the others go without a speech.',
      },
    ],
    references: [
      {
        label: 'CDC — About sleep',
        url: 'https://www.cdc.gov/sleep/about/',
      },
      {
        label: 'Sleep Foundation — Sleep hygiene',
        url: 'https://www.sleepfoundation.org/sleep-hygiene',
      },
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
      {
        label: 'CDC — Adult physical activity overview',
        url: 'https://www.cdc.gov/physical-activity-basics/guidelines/adults.html',
      },
      {
        label: 'Sleep Foundation — Caffeine and sleep',
        url: 'https://www.sleepfoundation.org/nutrition/caffeine-and-sleep',
      },
    ],
  },
  {
    slug: 'tracking-sleep-patterns-morning-routine',
    title: 'How Tracking Your Sleep Patterns Can Transform Your Morning Routine',
    description:
      'A simple sleep log can show why mornings feel foggy or clear. Use timing, daylight, and caffeine patterns to shape a kinder start to the day.',
    date: '2026-11-10',
    readMinutes: 10,
    category: 'sleep',
    tags: ['Sleep', 'Morning routine', 'Circadian rhythm'],
    sections: [
      {
        type: 'p',
        text: 'Mornings get blamed for a lot. The alarm, the personality, the lack of discipline. Often the morning is just the bill for the night, and for the nights before that. If you want a gentler start to the day, it helps to see your sleep as a pattern instead of a mood. A few notes — when you went to bed, when you woke, how rested you felt — will usually tell a clearer story than another list of habits you are supposed to love before sunrise.',
      },
      {
        type: 'p',
        text: 'The CDC even suggests a sleep diary when someone is trying to understand poor sleep: bedtimes, wake times, naps, exercise, caffeine, alcohol, and medicines. You do not need a clinical form on the nightstand. A color for sleep quality, plus a word or two, is a human version of the same idea. After ten days you can see whether your mornings are chaotic because sleep is short, because the timing swings, or because you are asking your brain to be charming fifteen minutes after it opened.',
      },
      {
        type: 'h2',
        text: 'What is worth writing down',
      },
      {
        type: 'p',
        text: 'Keep the log boring. Time you intended to sleep. Rough time you think you fell asleep. Wake time. A color for how the night felt. One note if something obvious happened: a late meal, wine, a sick kid, a deadline, a second coffee at four. The Sleep Foundation’s guidance on healthy sleep keeps circling the same basics: a consistent schedule, morning daylight, a wind-down, a cool dark room, and care with caffeine and alcohol. Your notes are how you find which of those basics is wobbling in your actual week.',
      },
      {
        type: 'ul',
        items: [
          'Hours, loosely: under six, around seven, or a long lie-in.',
          'Timing: did bedtime and wake time stay within about an hour of usual?',
          'Restedness: did you feel usable within an hour, or foggy until lunch?',
          'Helpers and hurdles: daylight, a walk, late caffeine, alcohol, a heavy scroll.',
          'The morning you actually had, not the morning you planned on Sunday.',
        ],
      },
      {
        type: 'h2',
        text: 'A steadier wake time changes the morning more than a prettier routine',
      },
      {
        type: 'p',
        text: 'It is tempting to fix mornings by adding things: lemon water, journaling, a workout, a perfect breakfast. Those can be lovely when sleep is already okay. When sleep timing is swinging, they become decorations on a tired day. Sleep hygiene advice puts a fixed wake time near the center of the practice, including on weekends, because the body clock learns from when you get up. If Saturday sleep runs two or three hours later, Monday morning will feel like travel. Researchers describe that mismatch between biological time and social schedules as social jet lag.',
      },
      {
        type: 'p',
        text: 'Try one experiment before you redesign breakfast. For two weeks, keep your wake time inside a one-hour window as often as life allows. Color the mornings. Many people find the first half hour is still quiet and slow, and that is normal. The CDC notes that feeling fully awake can take time. The win is not bouncing out of bed. The win is a morning that is predictably yours, so a short routine has somewhere to land.',
      },
      {
        type: 'h2',
        text: 'Let light and caffeine show up in the picture',
      },
      {
        type: 'p',
        text: 'Morning light is one of the simplest supports for a body clock that has drifted. Getting outside early tells your system that day has started. Evening light, especially from bright screens, does the opposite job and can delay sleep. If your tracker shows late nights lined up with late scrolling, the morning routine to change might be “phone stays in the kitchen after 10,” not “buy a sunrise lamp and a new blender.”',
      },
      {
        type: 'p',
        text: 'Caffeine belongs in the same picture. It is a tool for alertness, and it has a long tail. If your sleep colors worsen on days with coffee after mid-afternoon, an earlier cutoff is a morning intervention in disguise. You will feel it the next day, which is exactly why a tracker helps. The cause and the effect are not in the same hour, so memory drops the link. The grid keeps it.',
      },
      {
        type: 'h2',
        text: 'Build a morning that fits the sleeper you are',
      },
      {
        type: 'p',
        text: 'Once the pattern is visible, choose a morning that respects it. If you are short on sleep, the honest routine might be water, daylight, and one small task, not a five-step ritual. If you sleep enough but wake foggy, give yourself a slower first twenty minutes and stop calling that laziness. If weekends repair a real deficit, protect a bit more sleep on work nights before you judge the Monday mood. Harvard Health’s writing on light is a useful reminder here: daytime brightness and a darker evening are both part of feeling awake at the right time.',
      },
      {
        type: 'p',
        text: 'Use the month view as a review, not a trial. Look for repeats. Short sleep followed by brittle mornings. Outdoor mornings followed by a clearer head. Late caffeine followed by a restless color. Then change one thing. A morning routine that comes out of your own pattern will feel quieter and last longer than a routine copied from someone whose life starts at 5 a.m. by choice.',
      },
      {
        type: 'p',
        text: 'If sleep stays poor, or you snore loudly, gasp, or feel sleepy in unsafe ways, a diary is a starting point to take to a clinician, not the whole solution. The CDC is clear that ongoing sleep trouble deserves a conversation with a healthcare provider. Tracking is for understanding. It is not a substitute for care when something medical is in the way.',
      },
    ],
    references: [
      {
        label: 'CDC — About sleep',
        url: 'https://www.cdc.gov/sleep/about/',
      },
      {
        label: 'Sleep Foundation — How to sleep better',
        url: 'https://www.sleepfoundation.org/sleep-hygiene/healthy-sleep-tips',
      },
      {
        label: 'Sleep Foundation — How to reset your sleep routine',
        url: 'https://www.sleepfoundation.org/sleep-hygiene/how-to-reset-your-sleep-routine',
      },
      {
        label: 'PubMed — Social jetlag: misalignment of biological and social time',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16687322/',
      },
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
    ],
  },
  {
    slug: 'digital-journaling-vs-paper-journaling',
    title: 'Digital Journaling vs. Paper Journaling: Finding Your Calm Space',
    description:
      'Paper and digital journals offer different kinds of quiet. Compare friction, privacy, and light at night so you can pick a calm place to write.',
    date: '2026-11-06',
    readMinutes: 9,
    category: 'journaling',
    tags: ['Digital journaling', 'Paper journals', 'Calm space'],
    sections: [
      {
        type: 'p',
        text: 'The best journal is the one that feels like a place you can sit down. For some people that place is a notebook with a bent cover and a pen that only lives in the kitchen drawer. For others it is a phone note or a soft app opened after the dishes. The argument about paper versus digital is less about purity and more about friction, privacy, and what your nervous system does when the tool is in your hand.',
      },
      {
        type: 'p',
        text: 'Both can hold a Year in Pixels, a gratitude line, or a longer page on a hard day. Both can become another chore. The useful question is not “which one do serious people use?” It is “which one will I open when I am tired, and which one leaves me a little quieter than I started?”',
      },
      {
        type: 'h2',
        text: 'What paper still does beautifully',
      },
      {
        type: 'p',
        text: 'Paper has edges. You can see the month. You can leave a page messy. There is no notification badge waiting under the sentence you just wrote. Many people think more slowly with a pen, which is a gift when the point of journaling is to hear yourself. A notebook on the nightstand is also a physical cue, the same way a mug cues tea. Habit research keeps finding that a stable context — the same place, the same small sequence — helps a behavior become more automatic.',
      },
      {
        type: 'p',
        text: 'Paper has costs too. It can be lost, soaked, or left at home on the trip when you actually needed it. Searching for “what did I write in March?” means flipping, not finding. If your handwriting frustrates you, the page can become a place you avoid. None of that makes paper lesser. It means paper is a good home if you like objects, you write in one or two places, and you do not need to search the archive often.',
      },
      {
        type: 'h2',
        text: 'What a digital journal can carry',
      },
      {
        type: 'p',
        text: 'A digital journal travels. The pixel for a rough day can happen on a bus, and the longer entry can happen later from the same account. Search helps when you are looking for a pattern: every note that mentions sleep, or the week you started walking. Backups matter if the journal holds things you would grieve losing. For a Year in Pixels, a screen also makes color consistent. You are not guessing whether this pencil is the same blue as last Tuesday.',
      },
      {
        type: 'p',
        text: 'The risk is the device itself. Phones are built to pull you sideways. You open a journal and land in a message. At night, bright screens are not neutral. Harvard Health has described how blue-weighted light can suppress melatonin more strongly than other light and shift the body clock. If your calm space is in bed at midnight, a glowing app can undo the calm. A kinder digital setup is a small ritual: night mode, a time limit, or journaling earlier, with the phone charging outside the bedroom afterward.',
      },
      {
        type: 'h2',
        text: 'Privacy is part of feeling calm',
      },
      {
        type: 'p',
        text: 'A notebook is private if the people in your home respect a closed cover. A digital journal is private if the account, the lock screen, and the app’s data practices deserve your trust. The American Psychological Association notes that many wellness apps are not medical treatment and are not covered by health-privacy rules that apply to clinics. That does not make every app reckless. It means you should know, in plain language, whether your moods stay on your device, whether they are tied to your account, and who can see them.',
      },
      {
        type: 'p',
        text: 'Read the privacy notes the way you would read the label on something you eat daily. Look for a clear purpose, a way to export or delete, and no surprise sharing. If you share a device, use a lock. If you are journaling about someone else in your household, write as if they might someday read it, or keep those pages in a place that is truly yours. Calm depends on not bracing while you write.',
      },
      {
        type: 'h2',
        text: 'A hybrid that many people actually keep',
      },
      {
        type: 'ul',
        items: [
          'Daily pixel in an app, because color and dates are easy to keep honest.',
          'Longer writing on paper when a day needs more than a square.',
          'A weekly look at the screen, then the notebook closed, so review has an ending.',
          'No journaling in bed if the light keeps you up. Move the ritual earlier by twenty minutes.',
          'One home base. Two tools are fine. Five tools become a project about tools.',
        ],
      },
      {
        type: 'p',
        text: 'Selfix Life is built for the digital side of that hybrid: a pastel book, a year grid, and a mood that feels closer to paper than to a fitness scoreboard. If paper is your calm space, keep it. You can still borrow the pixel idea with a printed grid and four colored pencils. The container should disappear a little, so the day you are recording can be the point.',
      },
      {
        type: 'p',
        text: 'Try each option for ten days if you are unsure. Notice which one you resent and which one you open without bargaining. The calmer space is usually obvious in the body before it is obvious in a pros-and-cons list. Trust that. A journal is a room you enter often. The lighting, the lock, and the way the door opens matter more than the brand of the chair.',
      },
    ],
    references: [
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
      {
        label: 'APA — Digital mental health technologies',
        url: 'https://www.apa.org/practice/digital-therapeutics-mobile-health',
      },
      {
        label: 'Lally and colleagues — How are habits formed (doi.org)',
        url: 'https://doi.org/10.1002/ejsp.674',
      },
      {
        label: 'Sleep Foundation — Sleep hygiene',
        url: 'https://www.sleepfoundation.org/sleep-hygiene',
      },
    ],
  },
  {
    slug: 'mindful-mood-tracking-without-judgment',
    title: 'Mindful Mood Tracking: Understanding Your Emotional Patterns Without Judgment',
    description:
      'Mood tracking can reveal emotional patterns while staying kind. Learn a nonjudgmental way to color feelings, read them, and know when to pause.',
    date: '2026-11-03',
    readMinutes: 10,
    category: 'mood',
    tags: ['Mood tracking', 'Mindfulness', 'Self-compassion'],
    sections: [
      {
        type: 'p',
        text: 'Mood tracking goes wrong when it turns into grading. A yellow day means you won. A gray day means you failed at being a person. That frame will make you dread the log, or worse, it will make you color the day you wish you had. Mindful tracking is a different posture. You are a witness with a pencil, not a judge with a rubric. The feeling gets a color. The color does not get a lecture.',
      },
      {
        type: 'p',
        text: 'The American Psychological Association describes mindfulness as attention plus acceptance: noticing breath, body, thoughts, and feelings, and letting them be there without an immediate fight. Mood tracking can be a tiny daily version of that. It takes about a minute. Over a month it shows you the weather of your emotional life, including the climates you tend to forget when you are inside one of them.',
      },
      {
        type: 'h2',
        text: 'Pick a scale that sounds like you',
      },
      {
        type: 'p',
        text: 'Numbers make some people tense. Colors make some people vague. Either can work if the labels are human. “Heavy,” “tender,” “steady,” “bright,” and “numb” may fit better than “1 to 5 productivity of feelings.” You can also track one slice instead of your whole soul: irritability, loneliness, ease, or the feeling of being on edge in your body. A narrower question is often more honest. “How was your mood?” is so big that people answer with whatever happened in the last hour.',
      },
      {
        type: 'p',
        text: 'Decide when you will mark the day. Late evening captures the whole arc and is colored by how tired you are. A mid-afternoon mark captures the workday and misses the evening with people you love. There is no correct clock. There is only consistency. If you always log at bedtime, your “mood” grid is partly a fatigue grid, and that is useful as long as you know it. Name the question at the top of the month so future-you does not misread the legend.',
      },
      {
        type: 'h2',
        text: 'Patterns worth noticing, gently',
      },
      {
        type: 'p',
        text: 'After two or three weeks, look for repeats before you look for fixes. Do Sundays carry a particular color? Does your mood dip when sleep was short, or when you skipped meals, or when a certain meeting sits on the calendar? The National Institute of Mental Health lists ordinary supports — sleep, movement, food, water, connection, less alcohol — because they change how a day feels for many people. A tracker lets you see your own version of that list instead of assuming you are the exception or the failure.',
      },
      {
        type: 'ul',
        items: [
          'A color that shows up every time sleep drops below your usual.',
          'A lift on days with a real conversation, not just messages.',
          'A slump that follows conflict, even when you “handled it fine.”',
          'A flat stretch in a particular season or work cycle.',
          'Days you labeled as bad that, in the note, also held one small good thing.',
        ],
      },
      {
        type: 'p',
        text: 'Notice the story you tell while you look. “I am so inconsistent” is a judgment. “My mood moves with sleep and with Tuesdays” is a pattern. The second sentence gives you somewhere to stand. You might protect sleep. You might make Tuesdays smaller. You might also see that the hard color passes, which matters if your mind tends to treat today’s feeling as a permanent forecast.',
      },
      {
        type: 'h2',
        text: 'When tracking starts to hurt',
      },
      {
        type: 'p',
        text: 'Mindful does not mean mandatory. If logging makes you more anxious, more obsessive, or more compared-against-yourself, stop. Some seasons need a weekly check-in instead of a daily one. Some seasons need a therapist, a doctor, or a friend, not a finer palette. Checking mood many times a day can become a way of poking a bruise. Once a day is plenty for most adults who are journaling for clarity rather than for a clinical protocol.',
      },
      {
        type: 'p',
        text: 'A private log is also an ethical one. Your mood record is sensitive. It is not a scoreboard to show a partner as proof, and it is not something to collect about another adult “for their own good” without a clear ask. If you share a home with teenagers, their inner life is not your dataset. The APA’s guidance for families treats writing and conversation as supports for young people, offered with respect, not extracted. Track your own weather. Let other people own theirs.',
      },
      {
        type: 'h2',
        text: 'From noticing to one small kindness',
      },
      {
        type: 'p',
        text: 'The point of the mosaic is not a permanently sunny grid. It is a relationship with yourself that can include heavy colors without exile. When you can look at a difficult month and say, that was a hard season and I kept a small honest square, you have practiced something quieter than self-improvement. You have practiced staying on your own side.',
      },
      {
        type: 'p',
        text: 'End a review with one kindness that fits the pattern, not five. If short sleep lines up with brittle moods, the kindness might be a earlier phone cutoff three nights this week. If loneliness lines up with the gray squares, the kindness might be one plan with a person who is easy to be around. Then close the book. Understanding does not need to become a project every time it appears.',
      },
    ],
    references: [
      {
        label: 'American Psychological Association — Mindfulness meditation',
        url: 'https://www.apa.org/topics/mindfulness/meditation',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
      {
        label: 'American Psychological Association — Helping children and teens manage stress',
        url: 'https://www.apa.org/topics/children/stress/',
      },
      {
        label: 'APA — Digital mental health technologies',
        url: 'https://www.apa.org/practice/digital-therapeutics-mobile-health',
      },
    ],
  },
  {
    slug: 'expressive-writing-and-emotional-health',
    title: 'Expressive Writing and Emotional Health: What Pennebaker’s Research Actually Found',
    description:
      'Expressive writing can help some people process stress, and the evidence is mixed. Here is a calm, honest way to try it beside a daily pixel.',
    date: '2026-10-30',
    readMinutes: 11,
    category: 'journaling',
    tags: ['Expressive writing', 'Pennebaker', 'Emotional health'],
    sections: [
      {
        type: 'p',
        text: 'There is a kind of journaling that is not a mood color and not a gratitude list. You sit down and write, for a short burst, about something that actually weighs on you: the thoughts you have been editing in your head, the feeling under the polished version of the story. Psychologist James Pennebaker and colleagues made this famous. In the classic setup, people wrote about a stressful or emotional experience for about fifteen to twenty minutes, on three or four occasions, and researchers watched what happened to mood and health afterward.',
      },
      {
        type: 'p',
        text: 'The early findings were striking enough to build a whole field. People often felt worse right after the writing session — more stirred up, not instantly soothed — and some studies later found fewer doctor visits, shifts in immune measures, or improvements in how people reported their well-being. A widely read review by Baikie and Wilhelm walked through that pattern: short-term discomfort, and in many studies, longer-term benefits. If you have ever cried while writing and then slept better three days later, you already know the shape of that arc.',
      },
      {
        type: 'h2',
        text: 'The evidence is real, and it is not magic',
      },
      {
        type: 'p',
        text: 'Later reviews are more cautious, and honesty matters more than an inspiring summary. A meta-analysis of randomized trials on expressive writing about stressful events, published in an open archive on PubMed Central, did not find a clear overall effect on physical or psychological health. Another study found that the benefit may depend on the person: people who already tend to express emotion showed less anxiety after expressive writing, while people who usually hold feelings in showed more anxiety. Pennebaker’s own later reflections describe a large, messy literature rather than a guarantee.',
      },
      {
        type: 'p',
        text: 'So what should a regular person do with that? Treat expressive writing as a tool with a range of outcomes, not as a cure you failed if you still feel sad. It seems to help some people organize a story that was stuck on a loop. It can overwhelm others, especially if the topic is traumatic and there is no support around the writing. Feeling raw for an hour afterward is common in the research. Feeling flooded for days, or unable to function, is a sign to stop and get human help, not to push through for the sake of a method.',
      },
      {
        type: 'h2',
        text: 'A small, safe way to try it',
      },
      {
        type: 'p',
        text: 'If you want to experiment, borrow the original container and keep it modest. Choose one stressor that is heavy but not the most dangerous story you carry. Set a timer for fifteen minutes. Write by hand or on a device, continuously, without worrying about grammar. You can write “I don’t know what to say” until the next true sentence shows up. Stop when the timer ends. Do not reread it if rereading pulls you back under. Do this on three days when you have a little margin afterward — a walk, a shower, a normal evening — not in the last fragile minutes before sleep.',
      },
      {
        type: 'ol',
        items: [
          'Pick a specific situation, not your entire personality.',
          'Write the feelings and the thoughts, including the ones that sound unfair or confused.',
          'Skip performing wisdom. Insight can show up later, or not.',
          'Plan a gentle landing after the timer: tea, a short walk, or a familiar show.',
          'Skip the exercise entirely if you are in crisis or freshly traumatized. Call a person or a professional instead.',
        ],
      },
      {
        type: 'h2',
        text: 'How this sits next to a Year in Pixels',
      },
      {
        type: 'p',
        text: 'A pixel and a deep writing session do different jobs. The pixel is a daily breadcrumb. It answers “what was the weather?” Expressive writing is occasional weather radar for a storm you can feel but cannot quite map. You might color the day in a heavier shade and, twice a month, write the longer page about why that shade keeps returning. You do not need to excavate every evening. Daily excavation is how a helpful method becomes another source of stress.',
      },
      {
        type: 'p',
        text: 'Some people use the writing to name what the color has been hinting at. A string of irritable squares turns out to be grief. A string of numb squares turns out to be overwork. Once the story is on paper, the daily log can go back to being small. That rhythm — mostly light marks, sometimes a deeper page — matches what the research implies. Dose matters. Topic matters. The person matters. More writing is not automatically more healing.',
      },
      {
        type: 'h2',
        text: 'What to hope for, realistically',
      },
      {
        type: 'p',
        text: 'Hope for a little more room in your head. People often say the benefit is not happiness on command. It is that the story stops ambushing them in the shower, because some of it has been put in order. You might also notice you are kinder in the pixel log afterward, because you have language for a feeling that used to show up as a vague bad color. If nothing shifts, that result is allowed. The mixed evidence means a null result is not a personal flaw.',
      },
      {
        type: 'p',
        text: 'Keep the pages private unless you choose to share them. Expressive writing is not a performance for a partner or a manager. If a theme keeps returning — panic, hopelessness, a relationship that frightens you — let the writing point you toward a therapist, a physician, or a trusted person. A journal can accompany care. It should not be asked to replace it. The kindest version of this practice is optional, time-limited, and followed by something ordinary that reminds you the day continues.',
      },
    ],
    references: [
      {
        label: 'Baikie and Wilhelm — Emotional and physical health benefits of expressive writing',
        url: 'https://www.cambridge.org/core/journals/advances-in-psychiatric-treatment/article/emotional-and-physical-health-benefits-of-expressive-writing/ED2976A61F5DE56B46F07A1CE9EA9F9F',
      },
      {
        label: 'PMC — Health effects of expressive writing: a meta-analysis',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2736499/',
      },
      {
        label: 'PMC — Expressive writing and emotional expressivity',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3830620/',
      },
      {
        label: 'Pennebaker — Expressive Writing in Psychological Science (2018)',
        url: 'https://journals.sagepub.com/doi/full/10.1177/1745691617707315',
      },
    ],
  },
  {
    slug: 'gentle-evening-wind-down',
    title: 'Building a Gentle Evening Wind-Down You Will Actually Keep',
    description:
      'A short, repeatable evening landing can make sleep easier. Build a wind-down from dimmer light, a familiar sequence, and cues you already trust.',
    date: '2026-10-27',
    readMinutes: 9,
    category: 'sleep',
    tags: ['Sleep hygiene', 'Evening routine', 'Rest'],
    sections: [
      {
        type: 'p',
        text: 'An evening wind-down is not a reward you earn after a perfect day. It is a landing strip. The day has been loud, lit, and full of decisions. Sleep likes a taper. The Sleep Foundation’s sleep hygiene guidance suggests giving yourself about thirty minutes to shift gears, dimming the lights, and stepping away from the most stimulating screens for thirty to sixty minutes if you can. That is a human-sized ask. It is not a ninety-minute routine with six products and a journal prompt that feels like homework.',
      },
      {
        type: 'p',
        text: 'People abandon wind-downs for a predictable reason: the routine is designed for a fantasy evening. In the real evening there are leftovers, a last email, a show you actually want, and a brain that treats bedtime as the first quiet moment it has had since morning. A gentle wind-down fits inside that real evening. It is short, repeated, and a little boring on purpose. Boring is a signal. It tells your body that nothing urgent is required.',
      },
      {
        type: 'h2',
        text: 'Start with light and a stopping point',
      },
      {
        type: 'p',
        text: 'Light is the loudest signal in the room. Bright overheads and close-up screens tell your clock that the day is still on. Harvard researchers have shown that blue light can suppress melatonin for longer, and shift timing more, than other colors of light at a similar brightness. You do not have to sit in the dark like a Victorian. Lower one lamp. Leave the big ceiling light off. If you watch something, watch it earlier, or at least farther from your face, and let the last stretch of the evening belong to dimmer light.',
      },
      {
        type: 'p',
        text: 'Pick a stopping point you can say out loud. “Kitchen closes at ten.” “Laptop lives on the desk after the show.” The words matter less than the repeat. The CDC lists turning off electronic devices at least thirty minutes before bed among the habits that support sleep, alongside a consistent schedule and a cool, quiet room. If thirty minutes feels impossible, start with ten. A small taper beats a perfect plan you skip.',
      },
      {
        type: 'h2',
        text: 'Use a sequence you could do half-asleep',
      },
      {
        type: 'p',
        text: 'The content of the routine can be almost humble. Change clothes. Wash your face. Brush your teeth. Set out tomorrow’s mug or your bag. Fill a glass of water for the morning. Then one settling thing: a paper book, a stretch on the floor, or the day’s pixel. The Sleep Foundation notes that repeating the same steps helps your mind link those actions with sleep. That is cue learning, not romance. The third step should not require willpower. If it requires a decision, it is too fancy for the hour.',
      },
      {
        type: 'ul',
        items: [
          'Same order most nights, even if the clock time shifts a little.',
          'One pleasant item, not five. Pleasure helps you return.',
          'The pixel or a one-line note at the end, when the day is actually over.',
          'Phone charging outside the bedroom if notifications undo your landing.',
          'A backup version for late nights: teeth, lights down, bed. No guilt annex.',
        ],
      },
      {
        type: 'h2',
        text: 'What to leave out',
      },
      {
        type: 'p',
        text: 'Leave out the debate about the day. Problem-solving in bed is a classic way to teach your brain that the pillow is an office. If a worry shows up, write the next step on a scrap of paper in the kitchen and return to the sequence. Leave out a huge glass of water right before lights out if it guarantees a 2 a.m. trip; drink earlier. Leave out alcohol as a wind-down. It can make you sleepy and then fragment the night, which is a poor trade if the goal is a kinder morning.',
      },
      {
        type: 'p',
        text: 'Also leave out self-scoring. A wind-down you did halfway still counts. Habit researchers have found that missing a single chance to repeat a behavior does not wreck the process of it becoming more automatic. One late work night is not a relapse. The landing strip is still there tomorrow. Tracking the wind-down with a harsh streak counter is how a rest practice turns into another performance. A soft mark — “landed” or “not tonight” — is plenty.',
      },
      {
        type: 'h2',
        text: 'Let the morning tell you if it worked',
      },
      {
        type: 'p',
        text: 'Judge the routine by the next day, not by how aesthetic it looked. Did you fall asleep with less of a fight? Did you wake slightly less scraped? Did the nights you skipped the landing look different in your sleep color? Give it two weeks before you add anything. Most people need subtraction, not another step. If you want one addition after that, make it daylight in the morning. Evening darkness and morning light are a pair.',
      },
      {
        type: 'p',
        text: 'If you still lie awake for long stretches, or you are sleepy in the daytime no matter how careful the evening is, take that pattern to a healthcare provider. Sleep hygiene is a strong foundation and, as the Sleep Foundation says plainly, it does not by itself treat every sleep disorder. A gentle wind-down is a way to stop making nights harder. It is a good gift. It is not the whole of medicine, and it does not need to be.',
      },
    ],
    references: [
      {
        label: 'Sleep Foundation — Sleep hygiene',
        url: 'https://www.sleepfoundation.org/sleep-hygiene',
      },
      {
        label: 'Sleep Foundation — How to sleep better',
        url: 'https://www.sleepfoundation.org/sleep-hygiene/healthy-sleep-tips',
      },
      {
        label: 'CDC — About sleep',
        url: 'https://www.cdc.gov/sleep/about/',
      },
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
      {
        label: 'Lally and colleagues — How are habits formed (doi.org)',
        url: 'https://doi.org/10.1002/ejsp.674',
      },
    ],
  },
  {
    slug: 'why-blank-days-in-a-tracker-are-okay',
    title: 'Why Blank Days in a Tracker Are Okay',
    description:
      'Empty squares are part of an honest year. Learn why missed days do not ruin a habit, and how to return without turning the grid into a guilt chart.',
    date: '2026-10-23',
    readMinutes: 9,
    category: 'habits',
    tags: ['Habits', 'Self-compassion', 'Year in Pixels'],
    sections: [
      {
        type: 'p',
        text: 'A blank square can feel louder than a colored one. You open the month and there it is: a hole where a person was supposed to be consistent. The story arrives fast. I fell off. I always do this. The tracker only works if it is full, so I have already failed the year. That story is understandable, and it is also a misunderstanding of how habits, memory, and kindness actually work.',
      },
      {
        type: 'p',
        text: 'A blank day is data. It might mean you were sick, traveling, grieving, absorbed in a good day, or simply done with being observed, even by yourself. Those are all real states. Forcing a color you do not remember, just to protect a streak, makes the record less true. An honest gap is cleaner than a decorative lie. Future-you can read a gap. Future-you cannot trust a grid that was filled to look impressive.',
      },
      {
        type: 'h2',
        text: 'Missing once does not erase a habit',
      },
      {
        type: 'p',
        text: 'Habit researchers have looked at what happens when people repeat a behavior in the same context, day after day, like drinking a glass of water after breakfast. Automaticity tends to grow in a curve, fast at first and then leveling off, and the time to get there varies wildly between people. One finding is especially useful for anyone staring at an empty pixel: missing a single opportunity did not materially throw off the habit-forming process. The chain is sturdier than the guilt suggests.',
      },
      {
        type: 'p',
        text: 'What does fray a habit is a long pause plus a story that you must start over from zero, which often leads to not starting. The practical move is smaller. Come back on the next ordinary day. Color that day only. Do not hold a ceremony about the gap. If you want a note, “flu” or “away” is enough. The tracker is a companion to a life, and lives include interruptions. A method that cannot survive a Wednesday is not a method you can live with.',
      },
      {
        type: 'h2',
        text: 'Streaks are a sharp tool',
      },
      {
        type: 'p',
        text: 'Streaks feel motivating until the day they feel like a threat. Then people do strange things to protect the number. They log a mood they did not feel. They stay up late to “keep the chain” on a sleep tracker, which is a special kind of irony. They avoid opening the app for a week because one miss has made the whole thing emotionally expensive. If a streak helps you for a while, fine. If it makes you hide, turn it off. Consistency that depends on fear is brittle.',
      },
      {
        type: 'ul',
        items: [
          'Leave the square empty when you do not remember. Empty is a true answer.',
          'Fill it later only with what you actually recall, even if the recall is “tired, I think.”',
          'Use a neutral color for “did not track” if a literal blank bothers your eye. Label it honestly.',
          'Count returns, not perfect runs. Coming back seven times is a real practice.',
          'Shrink the habit before you abandon the month. One color is enough. Zero extra notes is allowed.',
        ],
      },
      {
        type: 'h2',
        text: 'What a gap can tell you',
      },
      {
        type: 'p',
        text: 'Sometimes the blanks cluster, and that cluster is the insight. A week of nothing during a deadline. A blank stretch every time you visit a certain relative. Three missed days whenever your mood drops, because tracking feels like too much contact with yourself. That last one matters. If the log becomes another way to feel behind, the compassionate design is a lighter log or a pause, not a stricter reminder. The National Institute of Mental Health’s everyday mental health guidance includes rest, connection, and realistic goals. A tracker that steals rest has drifted from its job.',
      },
      {
        type: 'p',
        text: 'You can also plan for blanks. Travel weeks, holidays, and the first days of a new baby are poor times to demand a perfect grid. Decide in advance: “I will color the days I remember and leave the rest.” That sentence removes the moral drama. When you return, the month still shows the shape of your life, including the part where life got bigger than the book.',
      },
      {
        type: 'h2',
        text: 'Coming back without a speech',
      },
      {
        type: 'p',
        text: 'The return can be almost boring, and boring is good. Open the day. Pick the color that fits now. Close it. If you want one sentence, write what today asked of you. Skip the paragraph about how you “need to be better.” Need-to-be-better is how people turn a soft tool into a stick. You already came back. That is the whole plot.',
      },
      {
        type: 'p',
        text: 'Over a year, the blanks become part of the texture. They show illness, joy that did not stop to be recorded, and ordinary forgetting. A full grid is not a more virtuous life. It is often just a life with more margin. Let the empty squares stand. They are not holes in your character. They are days you lived without an audience, including the small audience of your own tracking habit. You can pick up the pencil again whenever you want the company.',
      },
    ],
    references: [
      {
        label: 'Lally and colleagues — How are habits formed (doi.org)',
        url: 'https://doi.org/10.1002/ejsp.674',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
      {
        label: 'American Psychological Association — Mindfulness meditation',
        url: 'https://www.apa.org/topics/mindfulness/meditation',
      },
      {
        label: 'CDC — Steps for getting started with physical activity',
        url: 'https://www.cdc.gov/healthy-weight-growth/physical-activity/getting-started.html',
      },
    ],
  },
  {
    slug: 'habit-stacking-with-soft-trackers',
    title: 'Habit Stacking with Soft Trackers',
    description:
      'Attach a small new habit to something you already do, then track it gently. A soft pixel shows what stuck without turning the stack into a test.',
    date: '2026-10-20',
    readMinutes: 9,
    category: 'habits',
    tags: ['Habit stacking', 'Routines', 'Gentle tracking'],
    sections: [
      {
        type: 'p',
        text: 'Most new habits fail in the gap between “I should” and “when, exactly?” The day gets moving, the cue never arrives, and at night the habit is still an idea. Habit stacking is a plain fix for that gap. You hitch the new behavior to something that already happens: after the kettle boils, after you lock the door, after you sit down with lunch. The old action becomes the reminder. You are not relying on a burst of motivation at a random hour.',
      },
      {
        type: 'p',
        text: 'Researchers who watched people build everyday habits — a walk, a piece of fruit, a glass of water — asked them to do the behavior in a stable context, often something like “after breakfast.” Repetition in the same setting is what let the action start to feel automatic. The timeline varied hugely, from a few weeks to many months, which is a relief if you have been told that twenty-one days is a law. A soft tracker fits this science better than a loud one. You are watching whether the link happened, not prosecuting yourself when it did not.',
      },
      {
        type: 'h2',
        text: 'Choose an anchor that is already boring and reliable',
      },
      {
        type: 'p',
        text: 'Good anchors are frequent and hard to skip. Brushing your teeth, starting the dishwasher, putting your bag down, feeding the cat, opening the laptop. Bad anchors are moods. “When I feel calm” is not a time. “After I become the kind of person who stretches” is not a time either. The CDC’s practical notes on getting active say something similar in plainer clothes: set aside specific points in the day you already have, start with something you can enjoy, and let short bouts count. A stack is just that advice with a sentence attached.',
      },
      {
        type: 'p',
        text: 'Write the sentence in the least poetic way you can. “After I pour coffee, I drink a glass of water.” “After I shut the laptop, I color the day.” “After I take my shoes off, I step outside for five minutes.” If the second half takes more than two minutes, it is probably two habits pretending to be one. Shrink it until a tired version of you could still do it. The tired version is the one who decides whether the stack survives a real week.',
      },
      {
        type: 'h2',
        text: 'Let the tracker watch the link, not your worth',
      },
      {
        type: 'p',
        text: 'A soft tracker asks one question: did the pair happen? Yes, partly, or not today. That is enough. You can use a single color for “stack happened” or a tiny note beside your mood pixel. What you want to see after two weeks is the shape of the misses. Do they cluster on late meetings? On days you skipped the anchor itself, because you bought coffee out and never poured the kettle? The miss is often about the anchor, not about laziness. Change the anchor and the habit may suddenly look easy.',
      },
      {
        type: 'ul',
        items: [
          'One stack at a time. A tower of five new behaviors usually falls over by Friday.',
          'Keep the new piece smaller than the anchor. The anchor should still feel like the main event.',
          'Track “did the pair happen?” rather than how impressive the new habit looked.',
          'If you miss a day, do the next anchor as usual. One miss does not reset the learning.',
          'Retire a stack that only works on vacation. Real life is the test that matters.',
        ],
      },
      {
        type: 'h2',
        text: 'Stacks that suit a Year in Pixels practice',
      },
      {
        type: 'p',
        text: 'The pixel itself can be the second half of a stack you already trust. After pajamas, color the day. After the lunch dishes, mark energy. After you plug in your phone in the kitchen, write one line if the day needs it. Putting the log inside an existing landing makes it more likely to happen than a floating reminder at 9:07 p.m., which you will swipe away while stirring a pot. The book should meet you where your hands already are.',
      },
      {
        type: 'p',
        text: 'You can also stack a habit the pixel is meant to support. After the morning light hits the kitchen, you drink water. After the school run, you walk one extra block. After the pixel, you close the book and do not reopen it to edit the color. That last one is a stack worth keeping. Review has its own day. Night is for the mark, not for a trial.',
      },
      {
        type: 'h2',
        text: 'When the stack should be unhooked',
      },
      {
        type: 'p',
        text: 'Sometimes the anchor is the problem. If “after I get into bed” is when you try to journal on a bright phone, you have tied a calming habit to a cue that wakes you up. Move it earlier. If “after work” is when you are too depleted to move, the stack needs a smaller action or a different door: after you change clothes, shoes on, mailbox and back. Habit research is clear that context matters. It is also clear that people differ in how fast automaticity grows. A stack that is still effortful after a month may need a smaller dose, not a harsher opinion of you.',
      },
      {
        type: 'p',
        text: 'Look at the soft record before you add a second stack. If the first pair shows up most days, and your energy or mood color is no worse, you have earned a new experiment. If the first pair is shaky, do not build a second floor. Tend the link you have. A tracker is helpful here because it remembers the ordinary days your pride forgets and the missed days your shame inflates. Let it be that neutral. The stack is a piece of carpentry. You are allowed to recut the joint.',
      },
    ],
    references: [
      {
        label: 'Lally and colleagues — How are habits formed (doi.org)',
        url: 'https://doi.org/10.1002/ejsp.674',
      },
      {
        label: 'CDC — Steps for getting started with physical activity',
        url: 'https://www.cdc.gov/healthy-weight-growth/physical-activity/getting-started.html',
      },
      {
        label: 'CDC — Adult physical activity overview',
        url: 'https://www.cdc.gov/physical-activity-basics/guidelines/adults.html',
      },
      {
        label: 'Sleep Foundation — How to reset your sleep routine',
        url: 'https://www.sleepfoundation.org/sleep-hygiene/how-to-reset-your-sleep-routine',
      },
    ],
  },
  {
    slug: 'seasonal-light-and-color-journals',
    title: 'Seasonal Affective Patterns and What a Color Journal Can Show',
    description:
      'Shorter days can shift sleep, energy, and mood. A color journal can reveal seasonal bands and help you decide when ordinary support is not enough.',
    date: '2026-10-16',
    readMinutes: 10,
    category: 'mood',
    tags: ['Seasonal mood', 'Daylight', 'Color journal'],
    sections: [
      {
        type: 'p',
        text: 'There is a particular tiredness that arrives when the evenings swallow the afternoon. You are not imagining the light. Many people feel flatter, sleepier, or more pulled inward when the days shorten, and they feel more like themselves when the light returns. For some, that shift is a mild case of the winter blues. For others it is seasonal affective disorder, a form of depression that follows the seasons, most often beginning in late fall or winter and easing in spring. A color journal will not diagnose you. It can show whether your heavier colors have a season, which is a kinder discovery than deciding you have become a worse person since October.',
      },
      {
        type: 'p',
        text: 'The National Institute of Mental Health describes winter-pattern seasonal depression as more than a preference for soup and early nights. Sleep may lengthen, energy may drop, and mood can sink in a way that interferes with life. One working explanation involves serotonin and melatonin, the chemistry that helps tie mood and sleep to the length of the day. People with winter-pattern symptoms may be producing more melatonin and feeling the drag of that. Summer-pattern seasonal depression exists too, with its own sleep trouble, and it is less common. A year of pixels is long enough to tell those shapes apart from a single bad month.',
      },
      {
        type: 'h2',
        text: 'What to watch in the mosaic',
      },
      {
        type: 'p',
        text: 'Look across months, not just across a week. A hard week can be a deadline. A hard November and December, two years running, with sleep colors getting longer and mood colors getting heavier as the daylight shrinks, is a seasonal pattern. Note wake time as well as mood. Winter-pattern symptoms often include oversleeping and a body that wants to hibernate. If your grid shows both, you have a more useful sentence than “I am lazy in the cold.” You have a rhythm that is sensitive to light.',
      },
      {
        type: 'ul',
        items: [
          'Heavier mood colors that begin as the evenings grow long and lift as the mornings brighten.',
          'Sleep squares that drift later or longer in the same months.',
          'A drop in the “I went outside” marks, which then feeds the mood.',
          'Cravings, withdrawal from people, or a short fuse that shows up in your notes each winter.',
          'A similar band last year, if you have it. One season is a hint. Two seasons is a pattern.',
        ],
      },
      {
        type: 'h2',
        text: 'Light is a practical response, not a personality fix',
      },
      {
        type: 'p',
        text: 'Mayo Clinic’s guidance on seasonal affective disorder puts light near the front of care for fall-onset symptoms: bright light therapy used with a clinician’s advice, talk therapy, and sometimes medication. The self-care list is concrete. Open the blinds. Get outside in the morning, even when the sky is gray, because outdoor light still outruns a dim room. Keep sleep and wake times steadier than the urge to hibernate. Move your body. Stay in touch with people when the couch is campaigning for you. None of this is a demand to feel sunny. It is a way to stop the season from shrinking your life more than it has to.',
      },
      {
        type: 'p',
        text: 'A color journal can help you aim those steps. If your darkest squares are the days you never went out, the experiment is a ten-minute morning loop, not a new identity. If your sleep is stretching later and later, the experiment is a wake time you protect and a dimmer evening. Harvard Health’s overview of light and circadian timing is a useful companion here: bright days and darker nights help the clock. In winter, you may have to go find the bright part on purpose. It will not knock on the bedroom door.',
      },
      {
        type: 'h2',
        text: 'A journal is not a diagnosis',
      },
      {
        type: 'p',
        text: 'Please keep this boundary clear. Feeling a bit lower in January is common. Depression that drains pleasure, sleep, appetite, and hope is a health issue, seasonal or not. If your notes include hopelessness, if getting through work or care has become a grind for weeks, or if you are thinking about harming yourself, the next step is a person with clinical training, not a finer set of pastel labels. Light therapy can also be the wrong tool if you have bipolar disorder, because it can stir mania. That is a conversation for a prescriber, not for a blog or an app.',
      },
      {
        type: 'p',
        text: 'Use the mosaic as a letter you can take with you. “Here is how my mood and sleep looked from October to March” is more helpful in an appointment than “I think winter is bad, maybe.” You are allowed to be an expert on your own calendar and still ask for medical expertise. Both can be true.',
      },
      {
        type: 'h2',
        text: 'Color the season without fighting it',
      },
      {
        type: 'p',
        text: 'There is a gentler reading available too. Some slowing in winter is human. A journal that expects June energy in December will call you a failure every year. Let the palette include a color for “quiet and okay” that is different from “depressed and stuck.” Cozy, early, inward days can be honest squares. The signal to act is when quiet slides into numb, when sleep stops being restful, or when you are disappearing from the people and tasks that matter to you.',
      },
      {
        type: 'p',
        text: 'If you track only one extra thing through the dark months, track daylight contact and mood side by side. At the end of the season, read the two rows together. You may find a lever. You may find that you need more help than a walk. Either result is worth having in color, where you can see it without arguing with a foggy memory of “last winter was fine, I think.” The light changes. Your record can change with it, and it can tell you when to reach past the book.',
      },
    ],
    references: [
      {
        label: 'National Institute of Mental Health — Seasonal affective disorder',
        url: 'https://www.nimh.nih.gov/health/publications/seasonal-affective-disorder',
      },
      {
        label: 'Mayo Clinic — Seasonal affective disorder: diagnosis and treatment',
        url: 'https://www.mayoclinic.org/diseases-conditions/seasonal-affective-disorder/diagnosis-treatment/drc-20364722',
      },
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
    ],
  },
  {
    slug: 'hydration-and-focus-without-perfectionism',
    title: 'Hydration and Focus Without Turning Water into a Score',
    description:
      'Mild dehydration can cloud thinking and mood. Track water in a human way, with meals and a bottle you like, not as a perfect daily ounce count.',
    date: '2026-10-13',
    readMinutes: 9,
    category: 'habits',
    tags: ['Hydration', 'Focus', 'Daily habits'],
    sections: [
      {
        type: 'p',
        text: 'The afternoon fog is not always sleep, and it is not always a character flaw. Sometimes you have been in a dry room since eight, living on coffee, and your brain is doing its job with less water than it wanted. The CDC notes that not getting enough water can contribute to unclear thinking and changes in mood, along with more obvious problems like overheating. That is a modest claim, and it is enough. Water is not a miracle. It is one of the quiet inputs that make focus easier to come by.',
      },
      {
        type: 'p',
        text: 'The trouble starts when hydration becomes a sport. A giant bottle with hour markers can help one person and shame another. If you spend the day behind, the bottle turns into a scoreboard, and you chug at 9 p.m., then wake up twice. A calmer practice is closer to how people already eat: drink with meals, keep water nearby, and notice the signals your body sends before they become a headache. A pixel can mark “water was easy today” without counting every sip like a debt.',
      },
      {
        type: 'h2',
        text: 'What “enough” can mean without a spreadsheet',
      },
      {
        type: 'p',
        text: 'Needs change. The CDC points out that age, activity, heat, illness, pregnancy, and breastfeeding all shift how much fluid you need, and that food counts too, especially fruit and vegetables. There is no single number that makes you a good person. A practical test is ordinary: urine that is pale yellow most of the day, a mouth that is not dry, and a head that is not carrying a thirst headache you have been calling “stress.” If you exercise, sweat, or live through a hot week, you will need more. If you are vomiting or have diarrhea, you need a different plan, and sometimes medical advice, not a lifestyle post.',
      },
      {
        type: 'p',
        text: 'Coffee and tea are not the enemy of this picture, but they are not a full plan either. They come with caffeine’s effects on sleep if they run late, and they do not replace a plain drink at lunch. Sugary drinks can crowd out water while adding a spike and a dip that feels like a focus problem. The simplest swap is the one the CDC repeats: choose water, including at meals and when you eat out. Lemon, mint, or cold from the freezer are allowed. Plain is not a moral category. Pleasant is what you will repeat.',
      },
      {
        type: 'h2',
        text: 'A soft way to track it',
      },
      {
        type: 'ul',
        items: [
          'A glass with breakfast, lunch, and dinner. Three anchors beat an all-day negotiation.',
          'A bottle that lives where you work, refilled when you stand up for something else.',
          'One pixel or check for “I drank water with meals,” not a milliliter diary.',
          'A note on heavy-sweat days so next week’s fog has a context.',
          'Front-load the day if nighttime bathroom trips are wrecking your sleep.',
        ],
      },
      {
        type: 'p',
        text: 'The Sleep Foundation’s writing on hydration and sleep is worth reading before you set a huge evening goal. Dehydration can come with a dry mouth, headache, or cramps that make it harder to fall asleep. Poor sleep may also leave you more prone to dehydration. At the same time, a large drink right before bed is a common reason for a broken night. The gentle pattern is steady fluid through the day and a smaller sip in the evening if you are thirsty. Your sleep color and your water mark can sit next to each other for a fortnight and show you which timing feels better.',
      },
      {
        type: 'h2',
        text: 'Focus is a cluster, and water is one member',
      },
      {
        type: 'p',
        text: 'If you track hydration beside mood and sleep, be careful about the story you tell. A clear day after a well-watered morning is a nice clue, not proof that water cured your attention. Short sleep, a skipped meal, a windowless room, and a tense inbox can all fog the same afternoon. Water is worth fixing because it is cheap and kind. It is not worth blaming when the real issue is a 1 a.m. bedtime. Let the mosaic hold more than one cause. That is how you avoid turning a glass of water into a superstition.',
      },
      {
        type: 'p',
        text: 'Notice body cues without turning them into a project. Thirst, a dull headache, irritability that arrives before lunch, and the moment you realize you have not stood up since the first meeting: these are invitations. Drink, and also eat something, and also look at daylight if you can. The National Institute of Mental Health lists regular meals and hydration together among everyday supports for energy and focus. They sit beside sleep and movement, not above them. A balanced day is allowed to be unremarkable.',
      },
      {
        type: 'h2',
        text: 'Drop the perfection without dropping the habit',
      },
      {
        type: 'p',
        text: 'You will forget on busy days. Habit research suggests a missed repetition does not ruin the process of a behavior becoming more automatic, especially if the cue stays in place. The cue here can be the plate. Sit down to eat, drink water, then eat. If you forget, the next plate is a fresh cue. There is no streak to protect and no gallon to finish so the app will praise you. Praise is not the mechanism. A mouth that feels normal at 4 p.m. is the mechanism.',
      },
      {
        type: 'p',
        text: 'If you want a monthly review question, make it small. On the days my focus color was better, had I eaten and had water, or was I running on coffee and air? Answer it once. Then set the bottle where tomorrow’s hands will find it. Focus loves a little less friction. Water is one of the few supports that does not need a personality, a plan, or a perfect record. It needs a glass in reach, and a tracker gentle enough that you still want to tell the truth.',
      },
    ],
    references: [
      {
        label: 'CDC — About water and healthier drinks',
        url: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html',
      },
      {
        label: 'Sleep Foundation — Hydration and sleep',
        url: 'https://www.sleepfoundation.org/nutrition/hydration-and-sleep',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
      {
        label: 'Lally and colleagues — How are habits formed (doi.org)',
        url: 'https://doi.org/10.1002/ejsp.674',
      },
    ],
  },
  {
    slug: 'reading-your-month-mosaic',
    title: 'Reading Your Month Mosaic: A Calm Review Ritual',
    description:
      'Once a month, read your color grid before you explain it. A short ritual can show patterns without turning the review into a performance critique.',
    date: '2026-10-09',
    readMinutes: 9,
    category: 'journaling',
    tags: ['Monthly review', 'Year in Pixels', 'Reflection'],
    sections: [
      {
        type: 'p',
        text: 'A daily pixel is easy to keep and easy to ignore. The value shows up when you actually look. Not every night, and not with a red pen. Once a month, for about fifteen quiet minutes, you sit with the grid the way you might sit with a photo of a trip: first you see it, then you remember, then you decide if anything needs to change. That order matters. People who explain before they look tend to repeat the story they already believe. The mosaic’s gift is a chance to be surprised.',
      },
      {
        type: 'p',
        text: 'Pick a regular door into the ritual so it does not depend on feeling reflective. The last Sunday morning. The first coffee of a new month. After you pay a bill you already have to face. Put the phone in another room if you are looking at a paper grid, or open only the journal if you are in an app. You are trying to give the month your eyes, not your whole evening. A review that sprawls becomes a second job, and second jobs get quit.',
      },
      {
        type: 'h2',
        text: 'Look before you narrate',
      },
      {
        type: 'p',
        text: 'Start with silence and the colors. Where is the month dense, and where is it blank? Is there a band of similar shades, or a scatter? Do weekends look different from the middle of the week? Do not fix a blank or recolor a day you regret. You are reading, not editing the past. Memory will want to argue. You may remember the month as “mostly fine” and see a long heavier stretch, or remember it as terrible and see a handful of genuinely warm days your mind dropped. Both corrections are useful. Mood biases recall toward whatever you feel while you are remembering. The grid was colored closer to the days themselves.',
      },
      {
        type: 'p',
        text: 'Then read your notes, if you kept any, but only after the visual pass. Notes explain. Color summarizes. If you let the longest note dominate, one dramatic Wednesday will narrate thirty quieter days. The American Psychological Association’s stress guidance suggests tracking stressors and your responses for a week or two precisely because patterns hide inside anecdotes. A month mosaic is that idea with a gentler face. You are looking for repeats, not for the most quotable pain.',
      },
      {
        type: 'h2',
        text: 'Three questions are enough',
      },
      {
        type: 'ol',
        items: [
          'What repeated, even if it was small? A sleep dip, a lonely color, a walk that kept showing up.',
          'What surprised me when I saw the month whole, compared with the story I had been telling?',
          'What do I want a little more of, or a little less of, in the next two weeks — one thing only?',
        ],
      },
      {
        type: 'p',
        text: 'Write the answers in a few lines. Full sentences are optional. “Tuesdays were thin. Walks helped. I want lunch outside twice.” That is a complete review. The third answer should be small enough to do while life stays life. A monthly ritual that produces a twelve-point plan will make you dread the next one. Insight can be acted on at the size of a week. The rest can wait without being wasted. You will still know it.',
      },
      {
        type: 'h2',
        text: 'Bring sleep, mood, and habits into the same glance',
      },
      {
        type: 'p',
        text: 'If you keep more than one row — mood, sleep, movement, water, a wind-down — lay them in the same look. You are not hunting a scientific proof. You are noticing neighbors. Short sleep sitting next to brittle mood. Late caffeine sitting next to restless nights. Days outside sitting next to a lighter color. The CDC’s sleep diary idea is built on this kind of side-by-side noticing: timing, caffeine, naps, and how the night went. Your pastel version can stay softer and still be informative. Correlation is a clue. It is an invitation to try one change, not a verdict.',
      },
      {
        type: 'p',
        text: 'Be suspicious of a single cause. A heavy month might be a season of light, a workload, a relationship, and a cold that stole a week. The ritual does not need to pick a villain. It needs to pick a next kindness. If everything looks hard, the kindness might be rest and a conversation with someone who can help, not another habit. Mindfulness, as the APA describes it, includes acceptance. A review that cannot accept a hard month will try to optimize you out of being human.',
      },
      {
        type: 'h2',
        text: 'Close the book on purpose',
      },
      {
        type: 'p',
        text: 'End the ritual with a physical close. Shut the notebook. Leave the screen. Say, in whatever words you like, that the month has been seen. This sounds small, and it keeps the review from leaking into the rest of the day as a low-grade audit. You are not supposed to hold thirty days in your working memory until bedtime. You looked. You chose one nudge. You can go make soup.',
      },
      {
        type: 'p',
        text: 'If you share the review with a partner or a friend, share the pattern and the one nudge, not a demand that they manage your colors. If a month shows distress that is getting heavier, wider, or more hopeless, let the ritual point you toward care. A calm review is honest enough to say “this is bigger than a journaling trick.” Most months will not be that. Most months will be a mix, a few blanks, and one thing you understand a little better. That is a good use of fifteen minutes. Over a year, those sittings become how the pixels turn into a life you can actually read.',
      },
    ],
    references: [
      {
        label: 'American Psychological Association — Coping with stress at work',
        url: 'https://www.apa.org/topics/healthy-workplaces/work-stress',
      },
      {
        label: 'CDC — About sleep',
        url: 'https://www.cdc.gov/sleep/about/',
      },
      {
        label: 'American Psychological Association — Mindfulness meditation',
        url: 'https://www.apa.org/topics/mindfulness/meditation',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
    ],
  },
  {
    slug: 'mood-tracking-privacy-and-consent',
    title: 'Mood Tracking, Privacy, and Consent: An Adult Guide',
    description:
      'A mood log is private, sensitive information. Here is how adults can track their own emotions without surveilling anyone else or oversharing the record.',
    date: '2026-11-01',
    readMinutes: 9,
    category: 'mood',
    tags: ['Privacy', 'Consent', 'Mood tracking'],
    sections: [
      {
        type: 'p',
        text: 'A mood pixel feels small until you imagine someone else scrolling it. There is your irritability, your low weeks, your note about a fight, sitting in a place you thought was only yours. Mood tracking is emotionally useful when it is voluntary and private. It becomes something else when it is collected about a person who did not agree, or when it is shared as proof in an argument. Adults can use these tools with a clear ethic: track yourself, guard the record, and do not turn another person’s inner life into your dataset.',
      },
      {
        type: 'p',
        text: 'This matters more because the information is sensitive even when it is “just wellness.” The American Psychological Association distinguishes wellness apps — habit logs, gratitude, journaling — from clinical treatment. Those apps are generally not medical devices and are not covered by the health-privacy rules that bind clinics. Your pastel grid may still describe your mental state in enough detail to feel exposing. Treat it with the care you would give a paper diary left on a kitchen table. Charming design does not make the contents casual.',
      },
      {
        type: 'h2',
        text: 'Your log is yours',
      },
      {
        type: 'p',
        text: 'Start with the practical locks. A device passcode. An account that is not shared “for convenience.” A quick read of what the product says it stores and whether you can export or delete it. If you cannot tell, from ordinary language, who can see your entries, pause before you pour your most honest months into it. Psychologists have been warning for years that people rarely read the terms on mental health apps, even as those apps collect moods, sleep, and movement. You do not need to become a lawyer. You do need a product whose privacy story you could explain to a friend in two sentences.',
      },
      {
        type: 'p',
        text: 'Decide what you will write as if a future export might exist. Names of other people, details of their health, and scenes you would hate to read aloud deserve extra caution. You can process a conflict without building a file on someone else. “I felt small after the meeting” is your mood. A paragraph diagnosing a coworker is a different kind of document. Keeping the log about your weather protects you and protects them.',
      },
      {
        type: 'h2',
        text: 'Consent is not a vibe',
      },
      {
        type: 'p',
        text: 'Tracking another adult’s mood, sleep, or habits without a clear yes is surveillance, even if you love them and you are worried. Worry can be real and the method can still be wrong. If a partner wants to share a grid, talk about what is in bounds, how often you will look, and how either of you can revoke the share without a fight. “We both wanted this last January” is not a permanent key. Consent can be specific: sleep timing yes, journal text no. It can expire.',
      },
      {
        type: 'ul',
        items: [
          'Do not open someone else’s journal, app, or pixel grid just because the phone was already in your hand.',
          'Do not ask a partner to log moods so you can manage them. Offer listening instead.',
          'Do not require mood tracking at work. Feelings are not a performance metric.',
          'If you share a household, keep your log in a space that is actually private.',
          'Parents: a child’s or teen’s inner record is not yours to mine. Support is not the same as access.',
        ],
      },
      {
        type: 'p',
        text: 'The family point deserves a plain word. Adults sometimes want to monitor a teenager’s mood app out of care. Care still has to leave young people a private interior. The APA’s guidance for helping children and teens with stress emphasizes sleep, conversation with a trusted adult, writing if they want it, and modeling healthy coping. It does not describe parents as the audience for every feeling a young person writes down. If you are worried about a young person’s safety, talk to them and, when needed, to a professional. Secretly reading their log may get you information and cost you the trust that makes help possible.',
      },
      {
        type: 'h2',
        text: 'Sharing on purpose',
      },
      {
        type: 'p',
        text: 'There are good reasons to show a slice of your record. A therapist can use a month of sleep and mood as context. A doctor can use a sleep diary. A close friend can hear, “my heavier colors lined up with the weeks I did not see anyone,” without receiving your entire archive. Share a summary you chose, for a reason you can name, with someone who has agreed to hold it kindly. Screenshot culture makes this easy to overdo. A grid posted for encouragement can feel different a year later. You can keep the practice and skip the broadcast.',
      },
      {
        type: 'p',
        text: 'Also notice when tracking itself becomes too much contact. If reviewing your mood makes you spiral, the ethical move toward yourself is to pause. You are allowed to stop a wellness tool. You are allowed to delete a stretch you no longer want stored. A compassionate log has an exit. The National Institute of Mental Health’s everyday care list — sleep, movement, people, help when you need it — does not include “never miss a mood entry.”',
      },
      {
        type: 'h2',
        text: 'A simple personal policy',
      },
      {
        type: 'p',
        text: 'You can write your policy in four lines and keep it. I track my own mood, not other people’s. I know where the data lives and how to delete it. I share summaries on purpose, not passwords by habit. I stop if the log makes me harsher with myself. That is enough governance for a personal journal. It will not solve every digital-privacy question in the world. It will keep a soft practice from sliding into something sharper.',
      },
      {
        type: 'p',
        text: 'Selfix Life is meant to feel like a private book on your shelf: your colors, your notes, your year. Use it, or paper, in that spirit. The point of seeing your emotional patterns is to understand your own days with less judgment. That aim falls apart if the record is a window someone else presses their face against. Keep the window yours. Open it when you choose, to people who have earned the view.',
      },
    ],
    references: [
      {
        label: 'APA — Digital mental health technologies',
        url: 'https://www.apa.org/practice/digital-therapeutics-mobile-health',
      },
      {
        label: 'APA Monitor — Protecting privacy as psychology goes digital',
        url: 'https://www.apa.org/monitor/2020/01/cover-trends-protect-privacy',
      },
      {
        label: 'American Psychological Association — Helping children and teens manage stress',
        url: 'https://www.apa.org/topics/children/stress/',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
    ],
  },
  {
    slug: 'gratitude-pixels-without-forced-cheer',
    title: 'Gratitude Pixels Without Forced Cheer',
    description:
      'Gratitude can sit beside a hard day. Mark real, specific thanks without painting every square yellow or pushing sadness off the page. A calmer practice.',
    date: '2026-11-16',
    readMinutes: 9,
    category: 'mood',
    tags: ['Gratitude', 'Mood', 'Honesty'],
    sections: [
      {
        type: 'p',
        text: 'Gratitude has a public-relations problem. It is a real human warmth — noticing that the soup was good, that a friend texted back, that the bus came before the rain — and it is also a stick people use to hush anyone who is hurting. “At least you have your health.” “Other people have it worse.” “Just be grateful.” That second use is what people mean when they talk about toxic positivity. It asks you to cover a true feeling with a brighter one so everyone else can stay comfortable. A gratitude pixel, used badly, does the same job in pastel.',
      },
      {
        type: 'p',
        text: 'Used well, gratitude does not evict the rest of the day. Harvard Health describes gratitude as a way of noticing what is already sustaining you, and it summarizes research in which people who wrote about what they were thankful for felt more optimistic than people who wrote about irritations. A later review of gratitude interventions, gathered on PubMed Central, found small improvements in feelings of gratitude, mood, and symptoms of anxiety and depression. Small is the honest word. Gratitude is a complement. It is not a treatment you failed if you are still depressed, and it is not a reason to skip care.',
      },
      {
        type: 'h2',
        text: 'Specific thanks beats a yellow fog',
      },
      {
        type: 'p',
        text: '“I am so blessed” is hard to feel and easy to perform. “The neighbor took the bin in” is specific, and your body can recognize it. Harvard’s practical suggestions lean this way: write a note to someone, keep a short list, be concrete about what happened and what it meant. In a pixel practice, you might keep your main color for the emotional weather and add a tiny mark, or a five-word note, for one real thanks. The color stays honest. The thanks stays particular. You do not have to repaint a grief day gold because the coffee was hot.',
      },
      {
        type: 'p',
        text: 'Three things is plenty, and some days one is plenty. On a truly stripped day, the honest thanks might be “the shower was warm” or “I got home.” If even that feels like a lie, skip it. Forced gratitude is just compliance. The National Institute of Mental Health includes “practice gratitude” and “be specific” on its everyday mental health page, right beside sleep, food, and connection. It does not say to be cheerful on command. Specificity is what separates noticing from a slogan.',
      },
      {
        type: 'h2',
        text: 'Let hard colors stay on the grid',
      },
      {
        type: 'p',
        text: 'A Year in Pixels loses its mind if every square must prove growth. Some days are heavy. Recording them as heavy is respect, not negativity. You can be grateful for a friend and still furious about your job. You can love your child and still find the evening long. Mixed days are the normal case. A palette that only has “good” and “should be grateful” will train you to lie in the direction of pleasant. Over a month, that lie becomes a grid you cannot use, because it no longer matches your memory of being alive.',
      },
      {
        type: 'ul',
        items: [
          'Main pixel: how the day actually felt, including flat, sad, or irritable.',
          'Optional note: one concrete thing that helped, if one exists.',
          'No rule that the note must cancel the color.',
          'Skip gratitude entirely on days when searching for it makes you feel worse.',
          'Never tell someone else their pain is invalid because they “have so much to be grateful for.”',
        ],
      },
      {
        type: 'h2',
        text: 'When gratitude practices backfire',
      },
      {
        type: 'p',
        text: 'They backfire when they are used to bypass. If you write three thanks to avoid feeling lonely, the loneliness usually waits. If a community praises only the bright squares, people learn to hide. Research on gratitude is encouraging and modest; it does not say that listing blessings replaces therapy, medicine, sleep, or friendship. Mindfulness, in the APA’s description, includes acceptance of present feelings rather than an instant push to replace them. Gratitude can be one thing you notice inside that acceptance. It cannot be the bouncer at the door.',
      },
      {
        type: 'p',
        text: 'Watch your own reaction for a week. If a gratitude line leaves you a little warmer or more connected, keep the dose small and specific. If it leaves you guilty for not feeling better, drop it. You can return in a month. A tool you dread is giving you information. The information is that this tool, right now, is too sharp. There is no prize for muscling through a practice that makes you dishonest.',
      },
      {
        type: 'h2',
        text: 'A quiet way to practice',
      },
      {
        type: 'p',
        text: 'Try this for ten days and then read it the way you would read any other pattern. Color the day for mood, as usual. Under it, if you want, write one sentence that a camera could have caught: who did what, or what you tasted, heard, or was spared. No life lesson required. At the end of the ten days, see whether the notes cluster around people, places, or times of day. That cluster is more interesting than a streak of performed thanks. It shows you where warmth already lives, so you can visit it on purpose.',
      },
      {
        type: 'p',
        text: 'On the hard days, let the sentence be allowed to sit beside the heavy color without fixing it. “The day was gray. My sister called.” Both are true. A life that can hold both is sturdier than a life that must pick a branding color. Gratitude, at its best, is just accurate noticing of what sustains you. Accuracy has room for the rest. Your grid should too.',
      },
    ],
    references: [
      {
        label: 'Harvard Health — Giving thanks can make you happier',
        url: 'https://www.harvardhealth.org/healthbeat/giving-thanks-can-make-you-happier',
      },
      {
        label: 'PMC — Effects of gratitude interventions: a systematic review',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10393216/',
      },
      {
        label: 'National Institute of Mental Health — Caring for your mental health',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
      {
        label: 'American Psychological Association — Mindfulness meditation',
        url: 'https://www.apa.org/topics/mindfulness/meditation',
      },
    ],
  },
  {
    slug: 'weekend-sleep-and-monday-mornings',
    title: 'Weekend Sleep Shifts and Why Monday Mornings Feel So Far Away',
    description:
      'Sleeping in on days off can create social jet lag. A smaller weekend shift, plus morning light, can make Monday feel less like overnight travel.',
    date: '2026-10-06',
    readMinutes: 9,
    category: 'sleep',
    tags: ['Social jet lag', 'Sleep schedule', 'Weekends'],
    sections: [
      {
        type: 'p',
        text: 'Sunday night arrives, and your body is in a different time zone from your alarm. You stayed up because Saturday allowed it, you slept until late morning because the bed allowed it, and now Monday feels like a moral failure. It is often a timing mismatch. Researchers call the gap between your biological clock and your work or school schedule social jet lag. Late chronotypes — people who naturally fall asleep and wake later — tend to carry the largest gap, because weekdays yank them up early and free days let them snap back.',
      },
      {
        type: 'p',
        text: 'A review of work hours and sleep describes a common pattern: sleep on free days runs two or three hours longer or later as people try to repay a weekday debt, and that shift feels a bit like travel jet lag. You are not weak because Monday is foggy. You may be asking one clock to live in two cities. A sleep pixel that separates weekdays from weekends will show this faster than a resolution to “just go to bed early,” which your Sunday-night brain has already voted against.',
      },
      {
        type: 'h2',
        text: 'What to mark so the pattern is visible',
      },
      {
        type: 'p',
        text: 'For two weeks, note four things in the loosest language you can stand. Wake time. Rough bedtime. How long it took to feel usable. Whether the day was a work day or a free day. Color sleep quality if you already do that. You are looking for the size of the swing. A half-hour lie-in is a different creature from a three-hour one. The Sleep Foundation’s advice on resetting a schedule puts a consistent wake time at the center, including on days off, and suggests shifting only gradually if you need to move the clock. Dramatic Sunday-to-Monday jumps are the opposite of gradual.',
      },
      {
        type: 'ul',
        items: [
          'Wake time on work mornings versus wake time on free mornings.',
          'The night you stayed up because “tomorrow is free,” and how the next night went.',
          'Naps: short and early, or long enough to steal bedtime.',
          'Monday mood and Monday focus, next to Sunday’s lie-in.',
          'How much of the weekend sleep felt like pleasure, and how much felt like debt collection.',
        ],
      },
      {
        type: 'h2',
        text: 'A smaller swing beats a perfect weekend',
      },
      {
        type: 'p',
        text: 'You do not have to wake at 6:30 on Saturday to be a serious person. Many people do well keeping the free-day wake time within about an hour of the weekday one, then using the morning for something that makes the early rise feel chosen: a slow breakfast, a market, a walk with no headphones. The CDC recommends seven or more hours for most adults and lists a stable schedule among the habits that support sleep. If weekdays are short, the better repair is often an earlier night during the week, not a Sunday that ends at noon. Sleeping in can pay back some debt. It can also delay your clock so Sunday night becomes another late night. That loop is the jet lag.',
      },
      {
        type: 'p',
        text: 'Naps belong in the same conversation. A short early-afternoon nap can be a kindness on a short night. A two-hour late nap is often a second night that makes the real night harder. Sleep hygiene guidance is consistent on this: keep naps brief and not too late if you want bedtime to remain bedtime. Track it once, without drama. If the days with long naps are the nights you were “not tired until 1,” you have your answer.',
      },
      {
        type: 'h2',
        text: 'Light is the other weekend habit',
      },
      {
        type: 'p',
        text: 'If you sleep until late morning, you also miss the early light that tells your clock the day has started, and you may add bright screens late at night because the evening feels young. Harvard Health notes that daytime bright light supports alertness and that night light can push melatonin and timing the other way. A practical weekend pair is: get outside within an hour or so of waking, whenever waking is, and dim the last hour. You can still stay up a little. You do not have to turn Saturday into a second Monday. You are just not flying three time zones and back.',
      },
      {
        type: 'p',
        text: 'Social plans can respect this without becoming gloomy. Meet for a late breakfast instead of a 1 a.m. goodbye if Mondays are currently a crash site. Leave one evening for the friend who only exists after ten, and keep the other evening closer to your weekday landing. A soft tracker lets you see the trade. One late night might be worth a foggier morning. Two, plus a lie-in, plus Sunday scrolling in bed, might be why the week starts already behind. Seeing it is more dignified than blaming your personality every Monday at 7:05.',
      },
      {
        type: 'h2',
        text: 'When the pattern needs more than a schedule tweak',
      },
      {
        type: 'p',
        text: 'Some people are very late chronotypes living inside very early jobs. A one-hour compromise will not feel like enough, and the research on social jet lag suggests the strain is real, especially for younger adults whose clocks run late. If you can move a start time, work from home for the first hour, or get morning light and a ruthlessly dark bedroom, try that before you decide you are broken. If you still cannot sleep at a livable hour, or you are sleepy in dangerous ways, talk with a clinician. Circadian issues and sleep disorders are medical territory. A pixel can illustrate them. It cannot treat them.',
      },
      {
        type: 'p',
        text: 'For everyone else, the experiment is modest. For fourteen days, keep wake time inside a one-hour window, get morning light, and color the Monday mood. Compare it with the two Mondays before you started, if you can remember them honestly. If Monday moves closer, you have found a lever that does not require becoming a morning person in your soul. You only have to stop commuting, inside your own week, farther than your body can fly overnight.',
      },
    ],
    references: [
      {
        label: 'PubMed — Social jetlag: misalignment of biological and social time',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16687322/',
      },
      {
        label: 'PMC — How work hours induce social jetlag and sleep deficiency',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172912/',
      },
      {
        label: 'Sleep Foundation — How to reset your sleep routine',
        url: 'https://www.sleepfoundation.org/sleep-hygiene/how-to-reset-your-sleep-routine',
      },
      {
        label: 'CDC — About sleep',
        url: 'https://www.cdc.gov/sleep/about/',
      },
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
    ],
  },
  {
    slug: 'caffeine-and-the-afternoon-dip',
    title: 'Caffeine, the Afternoon Dip, and What to Track Before the Third Cup',
    description:
      'The afternoon slump is often circadian, not a personal failing. Learn how caffeine timing affects sleep and how a soft log can find your cutoff.',
    date: '2026-10-02',
    readMinutes: 9,
    category: 'sleep',
    tags: ['Caffeine', 'Energy', 'Sleep'],
    sections: [
      {
        type: 'p',
        text: 'Around three in the afternoon, a lot of good people stare at a mug and negotiate. The morning cup has worn off. Lunch was large. The inbox is still there. Another coffee feels like the only adult in the room. Sometimes it is a reasonable tool. Sometimes it is the reason you are staring at the ceiling at midnight, which is the reason tomorrow’s three o’clock will be just as desperate. Caffeine and the afternoon dip are a pair. Tracking them together, lightly, tells you which kind of day you are having.',
      },
      {
        type: 'p',
        text: 'Caffeine works by blocking adenosine, a chemical that builds the pressure to sleep. That is why it feels like clarity. The Sleep Foundation notes that it can also push sleep later, shorten it, and reduce deep sleep, and that a practical buffer for many people is to avoid caffeine for at least eight hours before bed. If you sleep at eleven, that buffer points at three in the afternoon, which is exactly when the dip arrives. The collision is not a coincidence. It is the hard part of using a stimulant you also want to sleep after.',
      },
      {
        type: 'h2',
        text: 'The dip is a rhythm, not a verdict',
      },
      {
        type: 'p',
        text: 'Feeling lower in the early afternoon is common even in people who slept. Body temperature, a heavy meal, a windowless room, and a night that was a bit short can all stack. Before you add a third cup, check the cheaper levers. Have you had water and an actual meal, not only caffeine? Have you seen daylight? Can you walk for ten minutes, which the CDC would count toward the movement that supports both health and, indirectly, sleep? A dip that lifts after a walk and a snack is a different dip from one that only lifts after espresso and then charges you interest at night.',
      },
      {
        type: 'p',
        text: 'Sleep debt makes the dip louder. If your weekday nights are short, caffeine becomes a mask. The mask works until it disturbs the next night, and then you need the mask again. Social jet lag — the weekend timing swing many people live with — can add a Monday and Tuesday version of the same fog. A pixel for energy, a mark for “caffeine after 2,” and a sleep color will show the loop in a way that memory, which loves the afternoon rescue and forgets the midnight cost, will not.',
      },
      {
        type: 'h2',
        text: 'Find your cutoff by watching your own nights',
      },
      {
        type: 'p',
        text: 'Sensitivity is personal. Some people metabolize caffeine quickly and sleep fine after a late tea. Others feel a noon latte at bedtime. The only respectful way to set a rule is to watch yourself for two weeks. Mark the time of the last caffeinated drink in a rough bucket: morning only, early afternoon, or later. In the morning, color sleep and note how long you took to drift off, if you noticed. You are not running a laboratory. You are looking for a repeat. If “later” lines up with restless nights and heavier next-day dips, you have a cutoff worth trying. If it does not, you can stop treating every afternoon tea as a crime.',
      },
      {
        type: 'ul',
        items: [
          'Bucket the last caffeine: before noon, early afternoon, or evening.',
          'Note the size only if it varies wildly. A small tea and a large cold brew are not the same event.',
          'Color the night and the next afternoon, since the cost and the craving are a day apart.',
          'Try one substitute on purpose: a walk, a snack, or daylight, and mark whether the dip moved.',
          'Keep morning caffeine if you love it. The experiment is about the late cup, not about purity.',
        ],
      },
      {
        type: 'h2',
        text: 'What to do at 3 p.m. while you learn',
      },
      {
        type: 'p',
        text: 'Give the dip a sequence before the automatic refill. Stand up. Drink water. Eat something with protein or fiber if lunch was only bread and urgency. Step outside or at least to a window. If you still want caffeine, choose a smaller cup and an earlier line than yesterday, not a larger one and a later one. Decaf or herbal is a fine bridge if the ritual of a warm cup is half of what you wanted. The ritual can stay. The dose can shrink. Habit research suggests that keeping the context — the kitchen, the break, the mug — is what makes a new version easier to repeat.',
      },
      {
        type: 'p',
        text: 'Protect the evening on the days you do have a late cup. Dimmer light, a real wind-down, and a bedtime that does not slide further will not erase caffeine, but they will stop you from adding three other reasons to be awake. Harvard Health’s notes on evening light are relevant: screens and bright lamps push in the same direction as a late stimulant. On a day with an afternoon coffee, be stricter with the 10 p.m. phone, not looser. You already spent one of your sleep advantages.',
      },
      {
        type: 'h2',
        text: 'When caffeine is covering something else',
      },
      {
        type: 'p',
        text: 'If you need large amounts of caffeine to feel safe driving, to stay awake in meetings, or to feel like yourself at all, look at sleep duration and sleep quality before you look at willpower. Loud snoring, gasping, or sleepiness that persists after a genuine week of seven-hour nights is a reason to talk with a clinician. The CDC is direct: ongoing sleep problems deserve medical attention. Caffeine can hide a disorder for a long time. A tracker that shows “plenty of coffee, still exhausted” is a useful thing to bring to that conversation.',
      },
      {
        type: 'p',
        text: 'For ordinary dips, let the experiment stay ordinary. Two weeks, one cutoff, a few colors. Keep the cups that make the morning kinder. Move the cups that invoice you overnight. You do not need to quit coffee to have a quieter night and a less desperate afternoon. You need to see the distance between the sip and the cost, and then choose, on purpose, how far apart you want them to be.',
      },
    ],
    references: [
      {
        label: 'Sleep Foundation — Caffeine and sleep',
        url: 'https://www.sleepfoundation.org/nutrition/caffeine-and-sleep',
      },
      {
        label: 'CDC — About sleep',
        url: 'https://www.cdc.gov/sleep/about/',
      },
      {
        label: 'Harvard Health — Blue light has a dark side',
        url: 'https://www.harvardhealth.org/healthy-aging-and-longevity/blue-light-has-a-dark-side',
      },
      {
        label: 'CDC — About water and healthier drinks',
        url: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html',
      },
      {
        label: 'Lally and colleagues — How are habits formed (doi.org)',
        url: 'https://doi.org/10.1002/ejsp.674',
      },
    ],
  },
]

export function getAllPosts() {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null
}

export function getFeaturedPosts(limit = 3) {
  return getAllPosts().slice(0, limit)
}

export function estimateWordCount(post) {
  if (!post?.sections) return 0
  let words = 0
  for (const section of post.sections) {
    if (section.text) words += section.text.trim().split(/\s+/).filter(Boolean).length
    if (section.items) {
      for (const item of section.items) words += item.trim().split(/\s+/).filter(Boolean).length
    }
  }
  return words
}

