import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/mtd-v2.css";
import { FrontHeaderV2, StickyFooter } from "@/components/v2/FrontShellV2";
import { AffiliateDisclosure } from "@/components/v2/AffiliateDisclosure";
import MonetisationFooter from "@/components/MonetisationFooter";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DESTINATIONS, TOTAL_RANKED } from "@/lib/mtd-v2/seed";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://moroccotopdestinations.com",
  ),
  title: {
    template: "%s · MTD",
    default: "Morocco Top Destinations",
  },
  description:
    "Cinematic Netflix-style guide to Morocco — cities, kasbahs, beaches, desert, mountains, food.",
  openGraph: {
    type: "website",
    siteName: "Morocco Top Destinations",
    title: "Morocco Top Destinations",
    description:
      "Cinematic Netflix-style guide to Morocco — cities, kasbahs, beaches, desert, mountains, food.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} mtd-v2`}>
        <GoogleAnalytics />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <FrontHeaderV2 />
          {children}
          <MonetisationFooter
            archetype="place"
            brand="Morocco Top Destinations"
            primaryCta={{ label: "Plan with MoroccAI", href: "/moroccai" }}
            disclosure="Booking.com / Expedia / Agoda hotel links and Amazon product links (tag fs08-21) pay us a small commission on qualifying actions. See /legal/affiliates."
          />
          <AffiliateDisclosure />
          <StickyFooter destinations={DESTINATIONS.length} totalRanked={TOTAL_RANKED} />
        </ThemeProvider>
      </body>
    </html>
  );
}
