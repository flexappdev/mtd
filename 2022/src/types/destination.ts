export interface Destination {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: 'city' | 'beach' | 'mountain' | 'desert' | 'cultural' | 'historical';
  category: string[];
  tags: string[];
  images: string[];
  video?: string;
  cta: {
    text: string;
    link: string;
  };
  aiContent: {
    overview: string;
    history?: string;
    culture?: string;
    attractions?: string[];
    bestTimeToVisit?: string;
    tips?: string[];
  };
  stats?: {
    visitors?: string;
    rating?: number;
    temperature?: string;
  };
  quote?: {
    text: string;
    author: string;
  };
}

export type ViewType = 'scroll' | 'tiles' | 'table';
export type SortField = 'title' | 'type' | 'rating';
export type SortOrder = 'asc' | 'desc';