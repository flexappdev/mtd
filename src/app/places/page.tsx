import { SectionPage } from "@/components/v2/SectionPage";

export const revalidate = 300;

export const metadata = {
  title: "Places",
  description: "Browse Morocco by region, city, sight, hotel, or restaurant.",
};

const SECTIONS = [
  { id: "regions", title: "Regions", subtitle: "5 regions, from coast to desert", href: "/places/regions" },
  { id: "cities", title: "Cities", subtitle: "14 cities & towns with travel info", href: "/places/cities" },
  { id: "sights", title: "Sights", subtitle: "212 kasbahs, ruins, viewpoints, beaches", href: "/places/sights" },
  { id: "hotels", title: "Hotels", subtitle: "Riads, resorts, kasbah hotels, desert camps", href: "/places/hotels" },
  { id: "restaurants", title: "Restaurants", subtitle: "Restaurants, cafés, street food, tea houses", href: "/places/restaurants" },
];

export default function PlacesIndex() {
  return (
    <SectionPage
      crumb="Places"
      title="Places in Morocco"
      tagline="Browse Morocco by region, city, sight, hotel, or restaurant."
      tiles={SECTIONS}
    />
  );
}
