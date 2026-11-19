import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import PublicNav from '../components/Legal/PublicNav'
import LegalFooter from '../components/Legal/LegalFooter'
import usePageMeta from '../hooks/usePageMeta'
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
      <h2 className="font-display text-lg font-semibold text-[var(--ink)] sm:text-xl">
        {section.text}
      </h2>
    )
  }
  if (section.type === 'ul') {
    return (
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--ink)]">
        {section.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    )
  }
  if (section.type === 'ol') {
    return (
      <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--ink)]">
        {section.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ol>
    )
  }
  return <p className="text-sm leading-relaxed text-[var(--ink)]">{section.text}</p>
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  const related = getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3)

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

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto">
      <div className="about-atmosphere pointer-events-none absolute inset-0 min-h-full" aria-hidden />

      <div className="relative z-10 px-4 py-4 sm:px-6 sm:py-5">
        <PublicNav homeLabel="Sign in" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-10 sm:px-6">
        <article className="book-shadow paper-texture overflow-hidden rounded-[28px] border border-[var(--page-edge)]">
          <header className="border-b border-[var(--page-edge)]/70 bg-[var(--accent-glow)]/50 px-6 py-6 sm:px-8 sm:py-7">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--ink-soft)] transition hover:text-[var(--accent-deep)]"
            >
              <ArrowLeft size={13} />
              All guides
            </Link>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
              {categoryLabel(post.category)} · {formatDate(post.date)} · {post.readMinutes} min read
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold leading-snug text-[var(--ink)] sm:text-3xl">
              {post.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
              {post.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-deep)] ring-1 ring-[var(--page-edge)]/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="space-y-5 px-6 py-7 sm:px-8 sm:py-8">
            {post.sections.map((section, index) => (
              <SectionBlock key={`${section.type}-${index}`} section={section} />
            ))}

            {post.references?.length > 0 && (
              <section
                className="rounded-2xl border border-[var(--page-edge)] bg-[var(--surface)]/80 px-4 py-4 sm:px-5"
                aria-labelledby="references-heading"
              >
                <h2
                  id="references-heading"
                  className="font-display text-lg font-semibold text-[var(--ink)]"
                >
                  References &amp; Further Reading
                </h2>
                <ul className="mt-3 space-y-2">
                  {post.references.map((ref) => (
                    <li key={ref.url}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1.5 text-sm font-medium text-[var(--accent-deep)] underline-offset-2 hover:underline"
                      >
                        <ExternalLink size={13} className="mt-0.5 shrink-0 opacity-70" />
                        <span>{ref.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <footer className="border-t border-[var(--page-edge)]/60 pt-6">
              <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                Want to try a soft Year in Pixels journal?{' '}
                <Link to="/" className="font-bold text-[var(--accent-deep)] hover:underline">
                  Open Selfix Life
                </Link>{' '}
                and tap <strong>Try as Guest</strong> to explore the full journal on this device —
                or create an account when you are ready to save and sync.
              </p>
            </footer>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-6 space-y-3" aria-labelledby="more-guides">
            <h2
              id="more-guides"
              className="font-display text-lg font-semibold text-[var(--ink)]"
            >
              More guides
            </h2>
            <ul className="space-y-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/blog/${item.slug}`}
                    className="block rounded-2xl border border-[var(--page-edge)] bg-[var(--surface)]/90 px-4 py-3 text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:bg-[var(--surface-strong)]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-4">
          <LegalFooter alwaysShow />
        </div>
      </main>
    </div>
  )
}
