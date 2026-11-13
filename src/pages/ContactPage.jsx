import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import SiteLayout, { Section, SoftCard } from '../components/Legal/SiteLayout'

const FAQ = [
  {
    q: 'How is my journal data saved?',
    a: 'After you sign in and verify your email, Selfix syncs your pixels, panels, notes, and settings to Firebase (Cloud Firestore) under your user account. Your browser may also use LocalStorage for temporary client-side state. Sign in on another device with the same account to continue your book.',
  },
  {
    q: 'How do I switch themes?',
    a: 'Open your journal and use the theme toggle in the top header. Choose Pinky Cute or Soft Sky — the open-book layout stays the same while colors gently shift.',
  },
  {
    q: 'Is Selfix free?',
    a: 'Yes. Selfix is currently free to use for personal journaling. Features may evolve over time; if pricing ever changes, we will communicate clearly beforehand.',
  },
  {
    q: 'Why do I need to verify my email?',
    a: 'Email verification helps protect accounts and keeps journals tied to real inboxes for password resets and security. Use the verification screen’s resend button if you did not receive the message.',
  },
  {
    q: 'Can I clear a day if I made a mistake?',
    a: 'Yes. Open the day’s right panel and use Clear Today to reset that tracker’s selections and pixel for the selected date.',
  },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const next = {}
    if (!name.trim()) next.name = 'Please enter your name.'
    if (!email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (!message.trim() || message.trim().length < 10) {
      next.message = 'Please write at least a short message (10+ characters).'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setMessage('')
    setErrors({})
    setSubmitted(false)
  }

  return (
    <SiteLayout
      title="Contact"
      subtitle="Say hello, report a soft bug, or share an idea for Selfix. We read every note with care."
    >
      <Section title="Send a message">
        {submitted ? (
          <SoftCard className="bg-[var(--accent-glow)]/80 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--accent-deep)] shadow">
              <CheckCircle2 size={24} />
            </div>
            <p className="font-display text-lg font-semibold text-[var(--ink)]">Message received</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Thank you, {name.trim().split(' ')[0] || 'friend'}. Your note is ready on this device.
              For a direct reply, you can also email mariamgh.data@gmail.com.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 rounded-2xl bg-[var(--accent-deep)] px-4 py-2 text-sm font-bold text-white shadow"
            >
              Send another message
            </button>
          </SoftCard>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-[var(--page-edge)] bg-white/85 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              {errors.name && (
                <span className="mt-1 block text-xs font-semibold text-[#b8385c]">{errors.name}</span>
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-2xl border border-[var(--page-edge)] bg-white/85 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              {errors.email && (
                <span className="mt-1 block text-xs font-semibold text-[#b8385c]">{errors.email}</span>
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Message
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="w-full resize-y rounded-2xl border border-[var(--page-edge)] bg-white/85 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              {errors.message && (
                <span className="mt-1 block text-xs font-semibold text-[#b8385c]">
                  {errors.message}
                </span>
              )}
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent-deep)] px-4 py-2.5 text-sm font-bold text-white shadow-md"
            >
              <Send size={14} />
              Send message
            </button>
          </form>
        )}
      </Section>

      <Section title="FAQ">
        <div className="space-y-3">
          {FAQ.map((item) => (
            <SoftCard key={item.q}>
              <p className="font-display text-base font-semibold text-[var(--ink)]">{item.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">{item.a}</p>
            </SoftCard>
          ))}
        </div>
      </Section>
    </SiteLayout>
  )
}
