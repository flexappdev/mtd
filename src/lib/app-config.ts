export const APP = {
  id: "mtd",
  name: "Morocco Vibes",
  long: "Discover Morocco",
  tagline: "Morocco, slowed down.",
  description:
    "Souks, riads, mountain villages, and the long road south. A travel guide for the kind of trip that doesn't fit in a weekend.",
  accent: "#b45309",
  brandWarm: "#d97706",
  themeKey: "mtd-theme",
  port: 13009,
  domain: "mtd",
};

export const NAV = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FEATURES = [
  { title: "Cities", body: "Marrakech, Fez, Casablanca, Tangier — and the lesser-knowns.", anchor: "cities" },
  { title: "Souks", body: "Bargaining tips, what to buy, what to skip.", anchor: "souks" },
  { title: "Coast", body: "Essaouira down to Sidi Ifni.", anchor: "coast" },
  { title: "Mountains", body: "Atlas + Anti-Atlas itineraries.", anchor: "mountains" },
  { title: "Scroller", body: "Phone-first vertical feed.", anchor: "scroller" },
  { title: "Videos", body: "Morocco cuts from @mat-siems-production.", anchor: "videos" },
] as const;

export const CATEGORIES = [
  "Marrakech",
  "Fez",
  "Chefchaouen",
  "Essaouira",
  "Sahara",
  "Atlas",
] as const;
