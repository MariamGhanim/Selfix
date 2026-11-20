import { Link } from 'react-router-dom'
import SiteLayout, { Section, SoftCard } from '../components/Legal/SiteLayout'

export default function PrivacyPage() {
  return (
    <SiteLayout
      title="Privacy Policy"
      subtitle="Last updated: November 20, 2026. This policy explains what Selfix Life collects, what stays on your device, how notes are encrypted, and the choices you have."
    >
      <Section title="1. Introduction">
        <p>
          Selfix Life (“we,” “us,” or “our”) is a personal year-in-pixels journal for mood, sleep,
          habits, and daily notes. This Privacy Policy describes the information the app handles,
          why it is handled, who can see it, and what you can do about it. By using Selfix Life, you
          agree to the practices described here.
        </p>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Please read these points first</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Selfix Life is a personal journal. It is not medical, therapy, or crisis care.</li>
            <li>Your account uses your email. Passwords are handled by Firebase Authentication.</li>
            <li>Private notes are encrypted in your browser before they are saved to the cloud.</li>
            <li>Pixel colors, habit levels, dates, and theme are stored as structured journal data tied to your account.</li>
            <li>A guest book stays in this browser only. It is not synced until you sign in.</li>
            <li>We do not sell your journal content.</li>
            <li>The site may show third-party ads, which can use their own cookies.</li>
            <li>Do not email a personal address. The Contact form confirms your note on this device only.</li>
          </ul>
        </SoftCard>
      </Section>

      <Section title="2. Who this policy covers">
        <p>
          This policy applies to the Selfix Life website and web app, including signed-in journals,
          guest use on a single browser, the Insights Logbook, and the About, Contact, Terms, and
          Privacy pages. It does not control websites or ad networks you open from a link or an ad.
        </p>
      </Section>

      <Section title="3. Information we collect">
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Account information</p>
          <p className="mt-1">
            When you create an account, we collect your email address and authentication credentials
            through Firebase Authentication. You must verify your email before the cloud journal is
            fully available. Passwords are handled by Firebase’s secure password hashing and are not
            stored in readable form by Selfix Life itself. We use your email for sign-in, password
            reset, and account security.
          </p>
        </SoftCard>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Journal content</p>
          <p className="mt-1">
            After you sign in, Selfix Life stores the book you create so you can reopen it later:
            pixel colors, tracker selections, habit and sleep levels, todos, theme preference, and
            related entries. Cloud journal data is associated with your authenticated user ID in
            Cloud Firestore. Private note text is encrypted on your device before that write, as
            described below.
          </p>
        </SoftCard>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Guest data on this device</p>
          <p className="mt-1">
            If you use Selfix Life before signing in, a guest journal can be kept in your browser’s
            LocalStorage under this site only. That copy stays on the device and browser where you
            created it. Clearing site data, using a private window, or switching browsers can remove
            it. Guest data is not a cloud backup.
          </p>
        </SoftCard>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Contact form</p>
          <p className="mt-1">
            The Contact page checks your name, email, and message in the browser and then shows a
            confirmation. That note stays in the page session on your device. It is not emailed and
            it is not saved to your journal. Do not put your password in it.
          </p>
        </SoftCard>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Technical information</p>
          <p className="mt-1">
            Like most websites, hosting, authentication, and advertising partners may process
            standard technical data such as browser type, device type, IP address, and cookie
            identifiers. Selfix Life uses this kind of data to keep sessions working, protect
            accounts, and serve the site. We do not build a public profile of your journal.
          </p>
        </SoftCard>
      </Section>

      <Section title="4. What is encrypted, and what is not">
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Your words stay encrypted before cloud save</p>
          <p className="mt-1">
            Journal notes and other private text entries (including daily notes, reflections,
            highlights, free-text panel fields, and todo item text) are <strong>encrypted on your
            device</strong> with AES before they are written to Cloud Firestore. Those fields are
            decrypted locally in your browser when you reopen your book.
          </p>
          <p className="mt-2">
            Pixel colors, tracker levels, dates, theme preference, and other non-narrative structure
            needed to draw your year are stored in structured form and linked to your user ID. Treat
            that structured record as private account data, not as ciphertext.
          </p>
          <p className="mt-2">
            Encryption reduces the chance that note text sits in the database as readable plaintext.
            It does not replace a strong password, a private device, or care about who can sign in
            as you. No storage method is perfect.
          </p>
        </SoftCard>
      </Section>

      <Section title="5. How we use information">
        <ul className="list-disc space-y-1 pl-5">
          <li>Create and protect your account, including email verification and password reset</li>
          <li>Save and reopen your journal on this browser and, once signed in, across sessions</li>
          <li>Show your pixels, trackers, notes, and Insights Logbook from the entries you logged</li>
          <li>Remember theme and short-lived client state so the book feels consistent</li>
          <li>Let you draft a note on the Contact page without storing it in your journal</li>
          <li>Keep the service reliable and enforce our Terms</li>
          <li>Display advertising where third-party ad partners are enabled</li>
          <li>Comply with law and protect the safety and integrity of Selfix Life and its users</li>
        </ul>
        <p>
          We use journal content to operate the product for you. We do not sell it, and we do not use
          your private notes to train public advertising profiles.
        </p>
      </Section>

      <Section title="6. Cookies and local storage">
        <p>
          Cookies are small text files stored on your device. Selfix Life and third-party partners may
          use cookies or similar technologies to remember preferences, keep you signed in, measure
          traffic, and support advertising.
        </p>
        <p>
          LocalStorage is storage inside your browser for this site. Selfix Life may use it for a guest
          journal and for temporary client-side state. That data stays on your device until you
          clear site data, unless a signed-in sync separately stores your book in the cloud.
        </p>
        <p>
          You can control cookies and site data in your browser settings. Blocking cookies can sign
          you out or break login persistence. Clearing site data can delete a guest journal that was
          never saved to an account.
        </p>
      </Section>

      <Section title="7. Third-party advertising">
        <p>
          Selfix Life may show advertisements from third-party networks so the journal can stay free.
          Current placements can include Adsterra units (such as display, native, and social-bar
          formats). We may also use Google AdSense or similar Google advertising products. Ad
          partners can set or read their own cookies and use technical identifiers to deliver,
          limit, or measure ads, including ads based on visits to this site or other sites.
        </p>
        <p>
          Selfix Life does not give advertisers your journal notes. We do not control the cookies,
          pixels, or data practices of ad networks. Their own privacy policies govern that
          processing. Ads are labeled as sponsored where the placement supports a label.
        </p>
        <SoftCard>
          <p className="font-bold text-[var(--ink)]">Your ad choices</p>
          <p className="mt-1">
            You can opt out of Google personalized advertising in{' '}
            <a
              className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline"
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noreferrer"
            >
              Google Ads Settings
            </a>
            . You can also use{' '}
            <a
              className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline"
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noreferrer"
            >
              www.aboutads.info
            </a>{' '}
            and the{' '}
            <a
              className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline"
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noreferrer"
            >
              Google advertising privacy policy
            </a>
            . Browser settings and common ad blockers can limit many third-party ad cookies,
            including advertising cookies used by networks such as Adsterra. Blocking ads does not
            delete your journal.
          </p>
        </SoftCard>
      </Section>

      <Section title="8. Who we share information with">
        <p>
          We do not sell your personal journal content. We share information only in these cases:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Infrastructure.</strong> Firebase and Google Cloud host authentication and Cloud
            Firestore so your account and journal can be saved. They process data under their own
            terms.
          </li>
          <li>
            <strong>Advertising partners.</strong> Ad networks receive the technical and cookie data
            their scripts collect in the browser. They do not receive your encrypted notes from us as
            a customer list.
          </li>
          <li>
            <strong>Legal and safety.</strong> We may disclose information if required by law, or to
            investigate abuse, security incidents, or violations of our Terms.
          </li>
          <li>
            <strong>With you.</strong> Insights exports and print views are generated from your
            entries for you to save. You choose where that file goes after export.
          </li>
        </ul>
      </Section>

      <Section title="9. Where data lives and how long we keep it">
        <p>
          Account and cloud journal data are stored with Google Firebase / Cloud Firestore. Google
          may process that data in data centers outside your country. Guest journals and other
          LocalStorage stay on your device.
        </p>
        <p>
          We keep cloud journal data for as long as your account exists so you can reopen your book.
          There is no delete-account button in the app today. Clearing your browser does not delete
          the cloud copy. Signing out does not delete it either. Cloud data remains under your
          Firebase account until an in-app deletion control is available or the account is removed
          from Firebase Authentication.
        </p>
      </Section>

      <Section title="10. Your choices and privacy rights">
        <p>Depending on where you live, you may have the right to access, correct, or delete personal data, or to object to certain processing. In the product, you can:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Review and edit journal entries in the app</li>
          <li>Export or print an Insights report from your own logged entries</li>
          <li>Use Clear Today on a day when you want to reset that tracker’s selections</li>
          <li>Sign out to end the session on this device</li>
          <li>Clear cookies and LocalStorage in your browser, including a guest journal</li>
          <li>Opt out of personalized ads using the links in the advertising section</li>
          <li>Stop using the account if you no longer want new journal data saved</li>
        </ul>
        <p>
          The{' '}
          <Link to="/contact" className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline">
            Contact
          </Link>{' '}
          page does not deliver a privacy request to an inbox. Do not send passwords or journal
          exports through it, and do not email a personal address.
        </p>
      </Section>

      <Section title="11. Children’s privacy">
        <p>
          Selfix Life is not directed to children under 13, or under the minimum digital-consent age
          where you live. We do not knowingly collect personal information from children. If you
          believe a child has created an account, do not email a personal address. Removal has to be
          done on the Firebase account itself until an in-app deletion control exists.
        </p>
      </Section>

      <Section title="12. Security">
        <p>
          We rely on authenticated access, Firestore security rules that limit each signed-in user to
          their own journal, HTTPS in production, and client-side AES encryption for private notes.
          You are responsible for your password, your email inbox, and the devices you stay signed
          in on. Use a unique password. Sign out on shared computers. No method of transmission or
          storage is completely secure.
        </p>
      </Section>

      <Section title="13. International users">
        <p>
          Selfix Life is operated as an online service and may be used from many countries. If you use
          the app from outside the country where our providers store data, your information will be
          processed in those provider locations. You can edit entries in the app, clear this
          browser’s site data, and sign out. Cloud deletion is not available from the Contact page.
        </p>
      </Section>

      <Section title="14. Changes to this policy">
        <p>
          We may update this Privacy Policy when the product, ads, or legal duties change. The “Last
          updated” date at the top will change when we do. Continued use of Selfix Life after an update
          means you acknowledge the revised policy. If a change materially reduces how we protect
          journal content, we will describe it on this page.
        </p>
      </Section>

      <Section title="15. Contact">
        <p>
          We do not accept privacy requests by email, and this policy does not publish an email
          address. Messages sent to a personal inbox may be ignored. The{' '}
          <Link to="/contact" className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline">
            Contact
          </Link>{' '}
          page is for on-device confirmation only. It does not send your note to us.
        </p>
      </Section>
    </SiteLayout>
  )
}
