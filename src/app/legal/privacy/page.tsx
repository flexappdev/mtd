export const metadata = {
  title: "Privacy notice",
  description: "Privacy and cookie practices for Morocco Top Destinations.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 p-8 text-zinc-300">
      <header>
        <h1 className="text-3xl font-bold text-zinc-100">Privacy notice</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: 30 May 2026</p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed">
        <p>
          This site is operated from the United Kingdom. We process minimal
          personal data and rely on first-party storage wherever possible.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-zinc-100">What we collect</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Authentication.</strong> If you sign in (admin only) we
            store your email via Supabase auth.
          </li>
          <li>
            <strong>Local preferences.</strong> Theme, scroller mode, saved
            destinations &mdash; all kept in your browser&apos;s{" "}
            <code>localStorage</code>, never sent to us.
          </li>
          <li>
            <strong>Anonymous analytics.</strong> Aggregate page-view counts,
            no IP retention.
          </li>
          <li>
            <strong>Affiliate referral cookies.</strong> Set by Amazon,
            Booking.com, Expedia, Agoda or Awin when you click an outbound
            link. See the{" "}
            <a href="/legal/affiliates" className="text-emerald-400">affiliate policy</a>.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-zinc-100">Your rights</h2>
        <p>
          Under UK GDPR and EU GDPR you may request access to, correction of,
          or deletion of any personal data we hold. Email{" "}
          <a href="mailto:hello@moroccotopdestinations.com" className="text-emerald-400">hello@moroccotopdestinations.com</a>
          and we will respond within 30 days.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-zinc-100">Cookies</h2>
        <p>
          You can disable third-party cookies in your browser without breaking
          this site. The only first-party cookie we set is the optional admin
          dev-bypass token used by the development environment.
        </p>
      </section>
    </article>
  );
}
