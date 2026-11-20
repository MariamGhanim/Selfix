import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import PublicNav from '../components/Legal/PublicNav'
import LegalFooter from '../components/Legal/LegalFooter'
import AdsterraDisplayBanner from '../components/Ads/AdsterraDisplayBanner'
import usePageMeta from '../hooks/usePageMeta'
import { useAuth } from '../context/AuthContext'
import { BLOG_CATEGORIES, getAllPosts, getPostBySlug } from '../data/blogPosts'

function formatDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function categoryLabel(id) {
  return BLOG_CATEGORIES.find((c) => c.id === id)?.label || id
}

function SectionBlock({ section }) {
  if (section.type === 'h2') {
    return (
      <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">
        {section.text}
      </h2>
    )
  }
  if (section.type === 'ul') {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-[1.8] text-[var(--ink)] sm:text-base">
        {section.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    )
  }
  if (section.type === 'ol') {
    return (
      <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-[1.8] text-[var(--ink)] sm:text-base">
        {section.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ol>
    )
  }
  if (section.type === 'callout') {
    return (
      <aside className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-glow)]/45 px-5 py-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent-deep)]">
          Takeaway
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--ink)] sm:text-base">
          {section.text}
        </p>
      </aside>
    )
  }
  if (section.type === 'quote') {
    return (
      <blockquote className="relative rounded-2xl border-l-[3px] border-[var(--accent)] bg-[var(--surface)]/80 px-5 py-4 italic text-[var(--ink)] shadow-sm">
        <p className="text-[15px] leading-relaxed sm:text-base sm:leading-[1.75]">
          “{section.text}”
        </p>
      </blockquote>
    )
  }
  return (
    <p className="text-[15px] leading-[1.8] text-[var(--ink)] sm:text-base sm:leading-[1.85]">
      {section.text}
    </p>
  )
}

function ReadingProgress({ containerRef }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const onScroll = () => {
      const scrollTop = el.scrollTop
      const height = el.scrollHeight - el.clientHeight
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0)
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [containerRef])

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[80] h-[3px] bg-transparent"
      aria-hidden
    >
      <div
        className="h-full origin-left rounded-r-full bg-[var(--accent-deep)] transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  const related = getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
  const scrollRef = useRef(null)
  const navigate = useNavigate()
  const { enterGuestMode, isGuest } = useAuth()

  usePageMeta({
    title: post
      ? `${post.title} · Selfix Life Blog`
      : 'Article · Selfix Life Blog',
    description: post?.description || 'Selfix Life journal guide.',
    path: post ? `/blog/${post.slug}` : '/blog',
    type: 'article',
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'pinky')
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [slug])

  if (!post) return <Navigate to="/blog" replace />

  const tryGuest = () => {
    if (!isGuest) enterGuestMode()
    navigate('/')
  }

  return (
    <div
      ref={scrollRef}
      className="relative flex h-[100dvh] min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto"
    >
      <ReadingProgress containerRef={scrollRef} />
      <div className="about-atmosphere pointer-events-none absolute inset-0 min-h-full" aria-hidden />

      <div className="relative z-10 px-4 py-4 sm:px-6 sm:py-5">
        <PublicNav homeLabel="Sign in" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-14 sm:px-6">
        <article>
          <header className="mb-8 sm:mb-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--ink-soft)] transition hover:text-[var(--accent-deep)]"
            >
              <ArrowLeft size={13} />
              All guides
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--accent-glow)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
                {categoryLabel(post.category)}
              </span>
              <span className="text-[12px] font-semibold text-[var(--ink-soft)]">
                {formatDate(post.date)} · {post.readMinutes} min read
              </span>
            </div>
            <h1 className="mt-4 font-display text-[1.85rem] font-semibold leading-[1.2] tracking-tight text-[var(--ink)] sm:text-4xl sm:leading-[1.15]">
              {post.title}
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-soft)] sm:text-lg">
              {post.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--page-edge)]/60 bg-white/60 px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-deep)] backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="space-y-6 border-t border-[var(--page-edge)]/50 pt-8">
            {post.sections.map((section, index) => (
              <SectionBlock key={`${section.type}-${index}`} section={section} />
            ))}
          </div>

          <div className="mt-10 overflow-x-hidden rounded-2xl border border-[var(--page-edge)]/50 bg-white/50 px-3 py-5 backdrop-blur-sm">
            <AdsterraDisplayBanner />
          </div>

          {post.references?.length > 0 && (
            <section
              className="mt-10 rounded-2xl border border-[var(--page-edge)]/65 bg-white/70 px-5 py-5 backdrop-blur-sm sm:px-6"
              aria-labelledby="references-heading"
            >
              <h2
                id="references-heading"
                className="font-display text-lg font-semibold text-[var(--ink)]"
              >
                References &amp; Further Reading
              </h2>
              <ol className="mt-3 list-decimal space-y-2.5 pl-5">
                {post.references.map((ref) => (
                  <li key={ref.url} className="text-sm leading-relaxed text-[var(--ink)]">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 font-medium text-[var(--accent-deep)] underline-offset-2 hover:underline"
                    >
                      <span>{ref.label}</span>
                      <ExternalLink size={12} className="mt-1 shrink-0 opacity-60" />
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <aside className="mt-10 overflow-hidden rounded-3xl border border-[var(--page-edge)]/65 bg-gradient-to-br from-[var(--accent-glow)]/80 via-white/70 to-[var(--paper-deep)]/50 p-6 shadow-[0_12px_36px_rgba(160,110,125,0.1)] backdrop-blur-sm sm:p-8">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent-deep)]">
              <Sparkles size={12} />
              Soft invitation
            </p>
            <p className="mt-3 font-display text-xl font-semibold leading-snug text-[var(--ink)] sm:text-2xl">
              Try tracking your own days in Selfix Life — no account needed
            </p>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)]">
              Open the full journal as a guest, paint a few pixels, and see how a calm Year in
              Pixels feels. Sign in later if you want cloud save and sync.
            </p>
            <button
              type="button"
              onClick={tryGuest}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-deep)] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
            >
              Try as Guest
              <ArrowRight size={14} />
            </button>
          </aside>
        </article>

        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="more-guides">
            <h2
              id="more-guides"
              className="font-display text-xl font-semibold text-[var(--ink)]"
            >
              Keep reading
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/blog/${item.slug}`}
                  className="rounded-2xl border border-[var(--page-edge)]/65 bg-white/70 px-4 py-4 text-sm font-semibold leading-snug text-[var(--ink)] shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:text-[var(--accent-deep)]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <LegalFooter alwaysShow />
        </div>
      </main>
    </div>
  )
}
