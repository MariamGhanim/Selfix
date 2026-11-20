import { Link } from 'react-router-dom'
import SiteLayout, { Section, SoftCard } from '../components/Legal/SiteLayout'

export default function TermsPage() {
  return (
    <SiteLayout
      title="Terms of Service"
      subtitle="Last updated: November 13, 2026. Please read these Terms carefully before using Selfix Life."
    >
      <Section title="1. Agreement to terms">
        <p>
          These Terms of Service (“Terms”) govern your access to and use of the Selfix Life web
          application and related content. By creating an account or using Selfix Life, you agree to
          these Terms and our Privacy Policy. If you do not agree, please do not use the service.
        </p>
      </Section>

      <Section title="2. Personal use of Selfix Life">
        <p>
          Selfix Life is provided for personal journaling, habit reflection, and private self-tracking.
          You may use the app for your own non-commercial purposes in accordance with these Terms.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Keep your account credentials confidential</li>
          <li>Provide accurate information when registering</li>
          <li>Do not attempt to access another user’s journal data</li>
          <li>Do not misuse, disrupt, scrape, or reverse engineer the service</li>
          <li>Do not upload unlawful, abusive, or harmful content</li>
        </ul>
      </Section>

      <Section title="3. Accounts & eligibility">
        <p>
          You must provide a valid email address and complete verification where required. You are
          responsible for activity under your account. Notify us promptly if you suspect
          unauthorized access. We may suspend or terminate accounts that violate these Terms or
          pose a security risk.
        </p>
      </Section>

      <Section title="4. Intellectual property">
        <SoftCard>
          <p>
            Selfix Life, including its name, logo, visual design, book interface, copy, layouts, and
            original software, are owned by Selfix Life / its creators and are protected by intellectual
            property laws. You may not copy, modify, distribute, sell, or create derivative works
            from Selfix Life’s branding or interface without prior written permission.
          </p>
          <p className="mt-3">
            You retain ownership of the personal journal content you create. By using Selfix Life, you
            grant us a limited license to host and process that content solely to operate the
            service for you (for example, saving and syncing your journal).
          </p>
        </SoftCard>
      </Section>

      <Section title="5. Not medical or psychological advice">
        <SoftCard className="border-[var(--accent-soft)] bg-[var(--accent-glow)]/70">
          <p className="font-bold text-[var(--ink)]">Important disclaimer</p>
          <p className="mt-2">
            Selfix Life is a wellness-oriented journaling and mood/habit tracking tool for personal
            reflection only. It is <strong>not</strong> a medical device, therapy platform, crisis
            service, or substitute for professional medical, psychiatric, or psychological advice,
            diagnosis, or treatment.
          </p>
          <p className="mt-2">
            Color pixels, mood chips, sleep logs, and similar features are subjective personal
            records. They should not be used alone to make health decisions. If you are experiencing
            distress or a mental-health emergency, contact a qualified professional or local
            emergency services immediately.
          </p>
        </SoftCard>
      </Section>

      <Section title="6. Service availability">
        <p>
          We aim to keep Selfix Life available and reliable, but we do not guarantee uninterrupted
          access. Features may change, and temporary outages may occur due to maintenance, hosting
          providers, or factors beyond our control.
        </p>
      </Section>

      <Section title="7. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Selfix Life and its creators are not liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of data,
          profits, or goodwill, arising from your use of (or inability to use) the service.
        </p>
        <p>
          Selfix Life is provided “as is” and “as available,” without warranties of any kind, express or
          implied, including merchantability, fitness for a particular purpose, and
          non-infringement, except where such disclaimers are not allowed by law.
        </p>
        <p>
          Where liability cannot be excluded, our total liability for claims relating to Selfix Life
          shall not exceed the greater of (a) the amount you paid us for the service in the prior
          12 months (if any), or (b) zero if Selfix Life is provided free of charge.
        </p>
      </Section>

      <Section title="8. Indemnification">
        <p>
          You agree to defend and hold harmless Selfix Life and its creators from claims arising out of
          your misuse of the service, your content, or your violation of these Terms.
        </p>
      </Section>

      <Section title="9. Changes to the Terms">
        <p>
          We may update these Terms periodically. The “Last updated” date will reflect changes.
          Continued use after an update constitutes acceptance of the revised Terms.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms can be sent via the{' '}
          <Link to="/contact" className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline">
            Contact
          </Link>{' '}
          page. That form stays on your device. We do not accept requests at a personal email address.
        </p>
      </Section>
    </SiteLayout>
  )
}
