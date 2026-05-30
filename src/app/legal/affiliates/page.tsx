export const metadata = {
  title: "Affiliate policy",
  description: "How Morocco Top Destinations earns money from affiliate links.",
};

export default function AffiliatePolicyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 p-8 text-zinc-300">
      <header>
        <h1 className="text-3xl font-bold text-zinc-100">Affiliate policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: 30 May 2026</p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed">
        <p>
          Morocco Top Destinations (<code>moroccotopdestinations.com</code>) is
          a travel-content site funded by affiliate commissions and contextual
          advertising. We never charge readers for access. This policy
          describes how the affiliate programmes work so you can make an
          informed choice when you click an outbound link.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-zinc-100">Programmes we participate in</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Amazon Associates</strong> &mdash; affiliate tag{" "}
            <code>fs08-21</code>. Applies to every product link in{" "}
            <code>/guides</code>.
          </li>
          <li>
            <strong>Booking.com</strong>, <strong>Expedia</strong>,{" "}
            <strong>Agoda</strong> &mdash; hotel partner network. Applies to
            every &ldquo;Book&rdquo; button on hotel and destination pages.
          </li>
          <li>
            <strong>Awin</strong> &mdash; aggregator for additional travel and
            gear partners.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-zinc-100">What this means for you</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Outbound links are marked{" "}
            <code>rel=&quot;sponsored&quot;</code> (or{" "}
            <code>rel=&quot;sponsored nofollow&quot;</code> for Amazon links)
            in compliance with the FTC Endorsement Guides, the UK CMA digital
            markets guidance, and the EU Digital Services Act.
          </li>
          <li>
            We receive a small commission only when you complete a qualifying
            purchase or booking. You pay the same price either way.
          </li>
          <li>
            Rates shown on this site are indicative and may be cached. Always
            verify the final price on the retailer page before you book.
          </li>
          <li>
            Editorial ranking is not for sale. Our top-100 lists are curated by
            our editors and are independent of commission rates.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-zinc-100">Withdrawing consent</h2>
        <p>
          You can disable third-party cookies at any time in your browser
          settings. Disabling cookies will not break the site, but the partner
          retailer may not credit us for your visit, which keeps content free.
        </p>

        <p className="mt-6 text-xs text-zinc-500">
          Questions? <a href="mailto:hello@moroccotopdestinations.com" className="text-emerald-400">hello@moroccotopdestinations.com</a>
        </p>
      </section>
    </article>
  );
}
