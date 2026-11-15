import { Link } from 'react-router-dom'
import SiteLayout, { Section, SoftCard } from '../components/Legal/SiteLayout'

export default function PrivacyPage() {
  return (
    <SiteLayout
      title="Privacy Policy"
      subtitle="Last updated: November 15, 2026. This policy explains how Selfix Life handles information in a way intended to support transparency, user privacy, and Google AdSense compliance."
    >
      <Section title="1. Introduction">
        <p>
          Selfix Life (“we,” “us,” or “our”) respects your privacy. This Privacy Policy describes what
          information may be collected when you use the Selfix Life web application, how that information
          is used, and the choices available to you. By using Selfix Life, you agree to the practices
          described here.
        </p>
      </Section>

      <Section title="2. Client-side encryption of private notes">
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Your words stay yours</p>
          <p className="mt-1">
            Journal notes and other private text entries (including daily notes, reflections,
            highlights, free-text panel fields, and todo item text) are <strong>encrypted on your
            device</strong> before they are written to Cloud Firestore. Selfix Life uses AES encryption
            so that private narrative content is not stored as readable plaintext in the database.
          </p>
          <p className="mt-2">
            When you reopen your book, those fields are decrypted locally in your browser for
            display. Grid values, theme preferences, and non-narrative structure needed to render
            your pixel year may still sync in structured form associated with your user ID.
          </p>
        </SoftCard>
      </Section>

      <Section title="3. Information we collect">
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Account information</p>
          <p className="mt-1">
            When you create an account, we collect your email address and authentication credentials
            through Firebase Authentication. Passwords are handled by Firebase’s secure password
            hashing and are not stored in readable form by Selfix Life itself.
          </p>
        </SoftCard>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Journal content</p>
          <p className="mt-1">
            Pixel colors, panel selections, encrypted notes, todos, theme preference, and related
            journal entries you create are stored so you can reopen your book later. Cloud journal
            data is associated with your authenticated user ID in Cloud Firestore. Private note
            text is encrypted client-side as described above.
          </p>
        </SoftCard>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Local browser storage (LocalStorage)</p>
          <p className="mt-1">
            Selfix Life may use your browser’s LocalStorage to keep temporary client-side state needed
            for a smooth experience (for example theme preference helpers or short-lived client
            caches). LocalStorage data stays on your device unless you clear site data in your
            browser settings. It is not a public database and is limited to the Selfix Life origin on
            that browser.
          </p>
        </SoftCard>
      </Section>

      <Section title="4. Cookies and similar technologies">
        <p>
          Cookies are small text files stored on your device. Selfix Life and third-party partners may
          use cookies or similar technologies to remember preferences, maintain secure sessions,
          measure traffic, and — where enabled — support advertising features.
        </p>
        <p>
          You can control cookies through your browser settings. Blocking certain cookies may affect
          login persistence or analytics/advertising features.
        </p>
      </Section>

      <Section title="5. Third-party advertising (Google AdSense)">
        <p>
          Selfix Life may display advertisements served by Google AdSense or similar networks. Google,
          as a third-party vendor, uses cookies to serve ads based on a user’s prior visits to this
          website or other websites.
        </p>
        <p>
          Google’s use of advertising cookies enables it and its partners to serve ads based on
          your visits to Selfix Life and/or other sites on the Internet. Users may opt out of
          personalized advertising by visiting{' '}
          <a
            className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline"
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </p>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">DoubleClick DART cookie</p>
          <p className="mt-1">
            Third-party vendors, including Google, may use the DoubleClick DART cookie. The DART
            cookie enables Google to serve ads based on a user’s visit to Selfix Life and other sites
            that use AdSense. Users may opt out of the use of the DART cookie by visiting the{' '}
            <a
              className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline"
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noreferrer"
            >
              Google ad and content network privacy policy
            </a>
            .
          </p>
        </SoftCard>
        <p>
          Selfix Life has no direct access to or control over cookies used by advertisers. This Privacy
          Policy covers Selfix Life’s own practices; third-party policies apply to their cookies and
          data processing.
        </p>
      </Section>

      <Section title="6. How we use information">
        <ul className="list-disc space-y-1 pl-5">
          <li>Provide, maintain, and improve the Selfix Life journaling experience</li>
          <li>Authenticate users and protect accounts</li>
          <li>Sync journal entries across sessions and devices</li>
          <li>Respond to support messages you send through Contact</li>
          <li>Understand aggregate usage and keep the service reliable</li>
          <li>Display advertising where AdSense or similar partners are enabled</li>
        </ul>
      </Section>

      <Section title="7. Data sharing">
        <p>
          We do not sell your personal journal content. Private notes are encrypted before sync so
          service operators do not receive them as readable plaintext in Firestore. We may share
          limited account/operational information with service providers necessary to run Selfix Life
          (such as Firebase/Google Cloud for authentication and database hosting) under their
          respective privacy terms. We may also disclose information if required by law or to
          protect the rights, safety, and integrity of Selfix Life and its users.
        </p>
      </Section>

      <Section title="8. Your privacy rights & choices">
        <p>Depending on your location, you may have rights to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Access or request a copy of personal data we hold about you</li>
          <li>Correct inaccurate account information</li>
          <li>Request deletion of your account and associated journal data</li>
          <li>Opt out of personalized ads via Google Ads Settings</li>
          <li>Clear LocalStorage and cookies from your browser</li>
          <li>Log out to end your authenticated session</li>
        </ul>
        <p>
          To exercise access or deletion requests related to your Selfix Life account, contact us through
          the <Link to="/contact" className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline">Contact</Link> page. We will respond within a reasonable timeframe.
        </p>
      </Section>

      <Section title="9. Children’s privacy">
        <p>
          Selfix Life is not directed to children under 13 (or the minimum digital consent age in your
          region). We do not knowingly collect personal information from children. If you believe a
          child has provided personal data, contact us so we can take appropriate steps.
        </p>
      </Section>

      <Section title="10. Security">
        <p>
          We use industry-standard providers and security practices (including authenticated access,
          Firestore security rules that restrict each user to their own data, and client-side AES
          encryption for private notes and narrative entries). No method of transmission or storage
          is 100% secure; please use a strong unique password and keep your login private.
        </p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The “Last updated” date at the top
          will change when we do. Continued use of Selfix Life after updates means you acknowledge the
          revised policy.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions about privacy can be sent through the{' '}
          <Link to="/contact" className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline">
            Contact
          </Link>{' '}
          page or emailed to mariamgh.data@gmail.com.
        </p>
      </Section>
    </SiteLayout>
  )
}
