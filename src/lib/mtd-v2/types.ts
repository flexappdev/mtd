export type Status = "live" | "preview" | "qa" | "draft";

export type Region = {
  id: string;
  name: string;
  letter: string;
  accent: string;
  thumb: [string, string];
};

export type Destination = {
  id: string;
  name: string;
  region: string;
  kind: "city" | "sight" | "region";
  status: Status;
  hotels: number;
  sights: number;
  facts: number;
  rev30: number;
  clicks30: number;
  updated: string;
  initial: string;
  position: string;
  image?: string;
};

export type Hotel = {
  id: string;
  name: string;
  dest: string;
  stars: number;
  rates: { booking: number | null; expedia: number | null; agoda: number | null; awin: number | null };
  clicks30: number;
  rev30: number;
  updated: string;
};

export type Sight = {
  id: string;
  name: string;
  dest: string;
  kind: string;
  unesco: boolean;
  stars: number;
  clicks30: number;
};

export type Restaurant = {
  id: string;
  name: string;
  dest: string;
  kind: string;
  stars: number;
  price: string;
  status: Status;
  clicks30: number;
};

export type CuratedList = {
  id: string;
  title: string;
  kind: string;
  curator: string;
  items: number;
  hero: string;
  trending?: boolean;
  description?: string;
  image?: string;
};

export type Video = {
  id: string;
  title: string;
  dest: string;
  duration: string;
  views: string;
  date: string;
  series: string;
  real: boolean;
  videoId?: string;
  embedUrl?: string;
  thumbUrl?: string;
};

export type Guide = {
  id: string;
  title: string;
  kind: string;
  price: string;
  asin: string;
  rating: number;
  reviews: number;
  hero: string;
  image?: string;
};

export type WikiArticle = {
  id: string;
  title: string;
  dest: string;
  length: string;
  updated: string;
};
