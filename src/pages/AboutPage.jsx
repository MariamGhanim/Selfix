import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowLeft,
  BookHeart,
  BookOpen,
  CloudMoon,
  Feather,
  MoonStar,
  Music2,
  Sparkles,
} from 'lucide-react'
import LegalFooter from '../components/Legal/LegalFooter'
import PixelBloomPreview from '../components/About/PixelBloomPreview'
import HowItWorks from '../components/About/HowItWorks'
import { useAuth } from '../context/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const MOMENTS = [
  {
    icon: BookHeart,
    title: 'An open book, not a dashboard',
    text: 'Binder tabs, soft flips, and pages that feel held — journaling that remembers it is human.',
  },
  {
    icon: CloudMoon,
    title: 'Patterns without pressure',
    text: 'Sleep dips, brighter weeks, quiet streaks — clarity that arrives gently, never as a score.',
  },
  {
    icon: Feather,
    title: 'Notes that stay soft',
    text: 'Little thoughts beside each habit, encrypted and private, like pressed flowers in a diary.',
  },
  {
    icon: Music2,
    title: 'A room that breathes',
    text: 'Rose mornings, midnight evenings, ambient hush — the same cozy journal in every light.',
  },
]

function FloatingPixel({ className, color, delay = 0, size = 14 }) {
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute rounded-md ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 8px 24px ${color}66`,
      }}
      animate={{ y: [0, -12, 0], rotate: [0, 8, -4, 0], opacity: [0.55, 0.95, 0.55] }}
      transition={{ duration: 5.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

function ScrollReveal({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function ClosingCta({ signedIn }) {
  if (signedIn) {
    return (
      <div className="about-closing relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-[var(--orb-a)] blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-4 h-44 w-44 rounded-full bg-[var(--orb-b)] blur-3xl" />
        <div className="relative z-10 mx-auto max-w-xl">
          <p className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
            So glad you&apos;re here
          </p>
          <p className="mt-4 font-display text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            Your journal is waiting — soft pages, pastel pixels, and whatever today needs from you.
            Slip back in whenever you&apos;re ready.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent-deep)] px-6 py-3 font-display text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
          >
            <BookOpen size={15} />
            Open my journal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="about-closing relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16">
      <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-[var(--orb-a)] blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-4 h-44 w-44 rounded-full bg-[var(--orb-b)] blur-3xl" />
      <div className="relative z-10 mx-auto max-w-xl">
        <p className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
          You are welcome here
        </p>
        <p className="mt-4 font-display text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-lg">
          Whether you visit every morning or only when you need a soft landing — open the book, pick a
          day, and paint what is true. We are glad you are here.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent-deep)] px-6 py-3 font-display text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
        >
          Begin with today
          <Sparkles size={15} />
        </Link>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const scrollRef = useRef(null)
  const { scrollY } = useScroll({ container: scrollRef })
  const heroY = useTransform(scrollY, [0, 420], [0, 80])
  const heroFade = useTransform(scrollY, [0, 320], [1, 0.35])
  const { user, loading: authLoading } = useAuth()
  const signedIn = Boolean(user)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'pinky')
    const title = 'About Selfix · Year in Pixels Journal — Soft Pastel Habit & Mood Tracking'
    const description =
      'Selfix is a soft pastel space for your days, thoughts, and memories. Learn how Year in Pixels helps you track sleep, mood, habits, and daily notes with calm visual clarity.'
    document.title = title

    const ensureMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    ensureMeta('name', 'description', description)
    ensureMeta('property', 'og:title', title)
    ensureMeta('property', 'og:description', description)
    ensureMeta('property', 'og:url', 'https://www.myselfix.me/about')
    ensureMeta('property', 'og:type', 'article')
    ensureMeta('name', 'twitter:title', title)
    ensureMeta('name', 'twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', 'https://www.myselfix.me/about')

    return () => {
      document.title =
        'Selfix · Year in Pixels Journal — Track Sleep, Mood, Habits & Daily Notes'
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="about-page relative h-[100dvh] w-screen overflow-x-hidden overflow-y-auto"
    >
      <div className="about-atmosphere pointer-events-none absolute inset-0 min-h-full" aria-hidden />
      <div className="about-breath pointer-events-none fixed inset-0" aria-hidden />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link
          to="/"
          className="rounded-full bg-[var(--surface)]/90 px-3.5 py-1.5 text-xs font-bold shadow-md backdrop-blur transition hover:bg-[var(--surface-strong)]"
        >
          <span className="font-display text-[var(--accent-deep)]">Selfix</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--page-edge)] bg-[var(--surface)]/90 px-3 py-1.5 text-xs font-bold text-[var(--ink-soft)] shadow-sm backdrop-blur transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
        >
          <ArrowLeft size={13} />
          {signedIn ? 'Open journal' : 'Back to Journal'}
        </Link>
      </header>

      <main className="relative z-10">
        {/* Hero — one composition: brand, headline, line, CTA, visual plane */}
        <section className="relative mx-auto flex min-h-[min(92dvh,920px)] w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-10">
          <FloatingPixel className="left-[8%] top-[18%]" color="#f2b8c6" delay={0} size={16} />
          <FloatingPixel className="right-[12%] top-[22%]" color="#d4c2ef" delay={0.8} size={12} />
          <FloatingPixel className="left-[18%] bottom-[22%]" color="#b8dfc8" delay={1.4} size={14} />
          <FloatingPixel className="right-[22%] bottom-[28%]" color="#f0d89a" delay={0.4} size={10} />
          <FloatingPixel className="right-[6%] top-[48%]" color="#b7d7f0" delay={1.1} size={18} />

          <motion.div style={{ y: heroY, opacity: heroFade }} className="relative max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl font-semibold tracking-tight text-[var(--accent-deep)] sm:text-6xl md:text-7xl"
            >
              Selfix
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-2xl font-display text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-[var(--ink)] sm:mt-5 sm:text-4xl md:text-[2.75rem]"
            >
              A soft space for your days, thoughts, and memories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-xl font-display text-[15px] leading-relaxed text-[var(--ink-soft)] sm:mt-5 sm:text-lg"
            >
              Not a spreadsheet — a pastel year painted one gentle pixel at a time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-deep)] px-5 py-2.5 font-display text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
              >
                <Sparkles size={15} />
                Open your journal
              </Link>
              <a
                href="#story"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)]/90 px-4 py-2.5 font-display text-sm font-semibold text-[var(--ink-soft)] shadow-md ring-1 ring-[var(--page-edge)]/60 backdrop-blur transition hover:text-[var(--ink)]"
              >
                Read our story
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="about-hero-mosaic pointer-events-none absolute inset-x-4 bottom-6 hidden h-28 overflow-hidden rounded-[1.5rem] sm:block md:inset-x-6"
            aria-hidden
          >
            <div className="flex h-full gap-1 p-2">
              {Array.from({ length: 48 }).map((_, i) => {
                const colors = ['#f2b8c6', '#f5c9a8', '#f0d89a', '#b8dfc8', '#b7d7f0', '#d4c2ef', '#e8a0b4', 'var(--empty-cell)']
                const color = colors[(i * 5 + 3) % colors.length]
                return (
                  <motion.span
                    key={i}
                    className="h-full min-w-0 flex-1 rounded-md"
                    style={{ background: color }}
                    animate={{ opacity: [0.45, 1, 0.55, 0.9] }}
                    transition={{ duration: 4 + (i % 5) * 0.35, repeat: Infinity, delay: i * 0.04 }}
                  />
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* Our story */}
        <section id="story" className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
              Our story
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
              Slowing down, painted soft
            </h2>
          </ScrollReveal>

          <motion.div
            className="mx-auto mt-10 max-w-2xl space-y-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p
              variants={fadeUp}
              className="font-display text-lg leading-relaxed text-[var(--ink)] sm:text-xl"
            >
              Selfix began as a quiet wish: that journaling could feel like opening a favorite notebook —
              warm paper, gentle colors, room to breathe — never like staring at a cold dashboard.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
              Inspired by the classic Year in Pixels, we wrapped that idea in an open book: binder tabs,
              page turns, cozy chips, and pastels that forgive low-energy days. You are not optimizing a
              life here. You are tending one — one blush square, one mint evening, one honest note at a time.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
              The philosophy is simple. Slow down. Touch the day that is yours. Paint what is true. Let the
              year gather itself into something you can hold without flinching.
            </motion.p>
          </motion.div>

          <ScrollReveal className="mx-auto mt-12 max-w-xl">
            <blockquote className="about-quote relative rounded-[1.75rem] px-6 py-7 text-center sm:px-10 sm:py-9">
              <MoonStar className="mx-auto mb-3 text-[var(--accent-deep)]" size={22} />
              <p className="font-display text-xl font-semibold leading-snug tracking-tight text-[var(--ink)] sm:text-2xl">
                "There is no perfect streak — only honest pixels and kind attention to your season."
              </p>
            </blockquote>
          </ScrollReveal>
        </section>

        {/* Pixel showcase */}
        <section className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <ScrollReveal>
            <PixelBloomPreview />
          </ScrollReveal>
        </section>

        {/* How it works */}
        <section className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <ScrollReveal>
            <HowItWorks />
          </ScrollReveal>
        </section>

        {/* Inside the journal — soft moments, not a feature grid dump */}
        <section className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <ScrollReveal className="mb-10 max-w-xl">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-deep)]">
              Inside the journal
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              What waits when you open the cover
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {MOMENTS.map((item) => {
              const Icon = item.icon
              return (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                  className="about-moment group relative overflow-hidden rounded-[1.5rem] px-5 py-5"
                >
                  <div className="about-moment-glow pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="relative z-10 flex gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-glow)] text-[var(--accent-deep)] shadow-sm ring-1 ring-[var(--page-edge)]/50">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="font-display text-[16px] font-semibold text-[var(--ink)]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)] sm:text-sm">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </section>

        {/* Closing embrace — guest vs signed-in */}
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 sm:pt-12">
          <ScrollReveal>
            <ClosingCta signedIn={!authLoading && signedIn} />
          </ScrollReveal>
        </section>
      </main>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <LegalFooter alwaysShow />
      </div>
    </div>
  )
}
