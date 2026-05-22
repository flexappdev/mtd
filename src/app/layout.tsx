import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/mtd-v2.css";
import { FrontHeaderV2, StickyFooter } from "@/components/v2/FrontShellV2";
import { DESTINATIONS, TOTAL_RANKED } from "@/lib/mtd-v2/seed";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Morocco Top Destinations",
  description: "Cinematic Netflix-style guide to Morocco — cities, kasbahs, beaches, desert, mountains, food.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body className={`${inter.className} mtd-v2`}>
        <FrontHeaderV2 />
        {children}
        <StickyFooter destinations={DESTINATIONS.length} totalRanked={TOTAL_RANKED} />
      </body>
    </html>
  );
}
