import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/mtd-v2.css";
import { FrontHeaderV2, StickyFooter } from "@/components/v2/FrontShellV2";
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <FrontHeaderV2 />
          {children}
          <StickyFooter destinations={DESTINATIONS.length} totalRanked={TOTAL_RANKED} />
        </ThemeProvider>
      </body>
    </html>
  );
}
