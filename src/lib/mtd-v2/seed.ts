import type {
  CuratedList,
  Destination,
  Guide,
  Hotel,
  Region,
  Restaurant,
  Sight,
  Video,
  WikiArticle,
} from "./types";

export const REGIONS: Region[] = [
  { id: "imperial", name: "Imperial Cities", letter: "I", accent: "imperial", thumb: ["#2a3a5a", "#0d1422"] },
  { id: "coast", name: "Atlantic Coast", letter: "A", accent: "coast", thumb: ["#5a2a2a", "#2a1414"] },
  { id: "atlas", name: "Atlas & Mountains", letter: "M", accent: "atlas", thumb: ["#2a4a32", "#0e1a13"] },
  { id: "sahara", name: "Sahara & Desert", letter: "S", accent: "sahara", thumb: ["#3a3a5a", "#101728"] },
  { id: "mediterranean", name: "Mediterranean", letter: "N", accent: "mediterranean", thumb: ["#2a3a44", "#10171c"] },
];

export const DESTINATIONS: Destination[] = [
  { id: "marrakech", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/marrakech.webp", name: "Marrakech", region: "imperial", kind: "city", status: "live", hotels: 47, sights: 18, facts: 24, rev30: 8420, clicks30: 12840, updated: "2h ago", initial: "M", position: "Top destination" },
  { id: "fes", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/fes.webp", name: "Fes", region: "imperial", kind: "city", status: "live", hotels: 28, sights: 14, facts: 19, rev30: 4180, clicks30: 6420, updated: "5h ago", initial: "F", position: "Cultural capital" },
  { id: "chefchaouen", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/chefchaouen.webp", name: "Chefchaouen", region: "mediterranean", kind: "city", status: "live", hotels: 14, sights: 9, facts: 12, rev30: 3960, clicks30: 9180, updated: "1d ago", initial: "C", position: "Blue city" },
  { id: "essaouira", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/essaouira.webp", name: "Essaouira", region: "coast", kind: "city", status: "live", hotels: 18, sights: 11, facts: 14, rev30: 2840, clicks30: 5210, updated: "4h ago", initial: "E", position: "Windy port" },
  { id: "merzouga", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/merzouga.webp", name: "Merzouga", region: "sahara", kind: "city", status: "live", hotels: 9, sights: 6, facts: 11, rev30: 5210, clicks30: 4180, updated: "6h ago", initial: "M", position: "Erg Chebbi gateway" },
  { id: "casablanca", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/casablanca.webp", name: "Casablanca", region: "coast", kind: "city", status: "live", hotels: 32, sights: 9, facts: 17, rev30: 3120, clicks30: 7240, updated: "3h ago", initial: "C", position: "Economic capital" },
  { id: "rabat", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/rabat.webp", name: "Rabat", region: "imperial", kind: "city", status: "live", hotels: 21, sights: 13, facts: 18, rev30: 1840, clicks30: 3120, updated: "12h ago", initial: "R", position: "Capital" },
  { id: "ouarzazate", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/ouarzazate.webp", name: "Ouarzazate", region: "atlas", kind: "city", status: "preview", hotels: 7, sights: 8, facts: 13, rev30: 920, clicks30: 2410, updated: "2d ago", initial: "O", position: "Hollywood of Africa" },
  { id: "ait-benhaddou", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/ait-benhaddou.webp", name: "Aït Benhaddou", region: "atlas", kind: "sight", status: "draft", hotels: 3, sights: 1, facts: 9, rev30: 0, clicks30: 0, updated: "8h ago", initial: "A", position: "UNESCO ksar" },
  { id: "atlas-mountains", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/atlas-mountains.webp", name: "Atlas Mountains", region: "atlas", kind: "region", status: "live", hotels: 11, sights: 16, facts: 21, rev30: 2140, clicks30: 4820, updated: "1d ago", initial: "A", position: "Trekking & Berber villages" },
  { id: "meknes", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/meknes.webp", name: "Meknes", region: "imperial", kind: "city", status: "qa", hotels: 12, sights: 11, facts: 16, rev30: 880, clicks30: 1620, updated: "4d ago", initial: "M", position: "Imperial old town" },
  { id: "tangier", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/tangier.webp", name: "Tangier", region: "mediterranean", kind: "city", status: "live", hotels: 24, sights: 10, facts: 15, rev30: 2410, clicks30: 4180, updated: "6h ago", initial: "T", position: "Strait gateway" },
  { id: "agadir", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/agadir.webp", name: "Agadir", region: "coast", kind: "city", status: "live", hotels: 38, sights: 7, facts: 12, rev30: 3640, clicks30: 6840, updated: "5h ago", initial: "A", position: "Beach resort" },
  { id: "tetouan", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/dest/tetouan.webp", name: "Tetouan", region: "mediterranean", kind: "city", status: "preview", hotels: 8, sights: 7, facts: 13, rev30: 410, clicks30: 920, updated: "3d ago", initial: "T", position: "Andalusian medina" },
];

export const HOTELS: Hotel[] = [
  { id: "la-mamounia", name: "La Mamounia", dest: "marrakech", stars: 5, rates: { booking: 640, expedia: 655, agoda: 635, awin: null }, clicks30: 1840, rev30: 1240, updated: "12m ago" },
  { id: "royal-mansour", name: "Royal Mansour", dest: "marrakech", stars: 5, rates: { booking: 2400, expedia: 2450, agoda: null, awin: null }, clicks30: 410, rev30: 980, updated: "32m ago" },
  { id: "riad-yasmine", name: "Riad Yasmine", dest: "marrakech", stars: 4, rates: { booking: 110, expedia: null, agoda: 105, awin: 108 }, clicks30: 2840, rev30: 720, updated: "8m ago" },
  { id: "el-fenn", name: "El Fenn", dest: "marrakech", stars: 5, rates: { booking: 480, expedia: 495, agoda: 475, awin: null }, clicks30: 1280, rev30: 840, updated: "24m ago" },
  { id: "palais-amani", name: "Palais Amani", dest: "fes", stars: 5, rates: { booking: 185, expedia: null, agoda: 180, awin: 175 }, clicks30: 920, rev30: 410, updated: "1h ago" },
  { id: "riad-fes", name: "Riad Fes", dest: "fes", stars: 5, rates: { booking: 240, expedia: 250, agoda: 235, awin: null }, clicks30: 640, rev30: 380, updated: "46m ago" },
  { id: "dar-bensouda", name: "Dar Bensouda", dest: "fes", stars: 4, rates: { booking: 95, expedia: null, agoda: 92, awin: 89 }, clicks30: 1140, rev30: 290, updated: "2h ago" },
  { id: "lina-ryad", name: "Lina Ryad & Spa", dest: "chefchaouen", stars: 4, rates: { booking: 145, expedia: 150, agoda: null, awin: null }, clicks30: 1620, rev30: 480, updated: "18m ago" },
  { id: "casa-hassan", name: "Casa Hassan", dest: "chefchaouen", stars: 3, rates: { booking: 78, expedia: null, agoda: 75, awin: null }, clicks30: 2410, rev30: 420, updated: "8m ago" },
  { id: "heure-bleue", name: "Heure Bleue Palais", dest: "essaouira", stars: 5, rates: { booking: 230, expedia: 240, agoda: 225, awin: 218 }, clicks30: 740, rev30: 410, updated: "54m ago" },
  { id: "villa-maroc", name: "Villa Maroc", dest: "essaouira", stars: 4, rates: { booking: 165, expedia: 170, agoda: null, awin: null }, clicks30: 580, rev30: 290, updated: "1h ago" },
  { id: "erg-chebbi-camp", name: "Erg Chebbi Luxury Camp", dest: "merzouga", stars: 4, rates: { booking: 280, expedia: null, agoda: 270, awin: 265 }, clicks30: 1840, rev30: 920, updated: "24m ago" },
  { id: "sahara-stars-camp", name: "Sahara Stars Desert Camp", dest: "merzouga", stars: 4, rates: { booking: 195, expedia: null, agoda: 190, awin: null }, clicks30: 1240, rev30: 540, updated: "3h ago" },
  { id: "four-seasons-cas", name: "Four Seasons Casablanca", dest: "casablanca", stars: 5, rates: { booking: 420, expedia: 430, agoda: 415, awin: null }, clicks30: 480, rev30: 480, updated: "2h ago" },
  { id: "sofitel-cas", name: "Sofitel Casablanca Tour Blanche", dest: "casablanca", stars: 5, rates: { booking: 240, expedia: 250, agoda: 235, awin: null }, clicks30: 620, rev30: 310, updated: "1h ago" },
  { id: "sofitel-rabat", name: "Sofitel Rabat Jardin des Roses", dest: "rabat", stars: 5, rates: { booking: 220, expedia: 225, agoda: 218, awin: null }, clicks30: 410, rev30: 240, updated: "3h ago" },
  { id: "kasbah-tamadot", name: "Kasbah Tamadot", dest: "atlas-mountains", stars: 5, rates: { booking: 540, expedia: 555, agoda: null, awin: null }, clicks30: 720, rev30: 480, updated: "5h ago" },
  { id: "el-minzah", name: "El Minzah Hotel", dest: "tangier", stars: 5, rates: { booking: 180, expedia: 185, agoda: 178, awin: 172 }, clicks30: 540, rev30: 220, updated: "2h ago" },
  { id: "riad-arabesque", name: "Dar Arabesque", dest: "tangier", stars: 4, rates: { booking: 95, expedia: null, agoda: 92, awin: null }, clicks30: 820, rev30: 180, updated: "4h ago" },
  { id: "sofitel-agadir", name: "Sofitel Agadir Royal Bay", dest: "agadir", stars: 5, rates: { booking: 195, expedia: 200, agoda: 192, awin: null }, clicks30: 1240, rev30: 480, updated: "1h ago" },
];

export const SIGHTS: Sight[] = [
  { id: "jemaa-el-fna", name: "Jemaa el-Fna", dest: "marrakech", kind: "square", unesco: true, stars: 5, clicks30: 4810 },
  { id: "majorelle", name: "Jardin Majorelle", dest: "marrakech", kind: "garden", unesco: false, stars: 5, clicks30: 3940 },
  { id: "koutoubia", name: "Koutoubia Mosque", dest: "marrakech", kind: "mosque", unesco: false, stars: 4, clicks30: 2410 },
  { id: "bahia-palace", name: "Bahia Palace", dest: "marrakech", kind: "palace", unesco: false, stars: 4, clicks30: 1840 },
  { id: "medina-fes", name: "Fes el-Bali medina", dest: "fes", kind: "medina", unesco: true, stars: 5, clicks30: 3120 },
  { id: "chouara", name: "Chouara tannery", dest: "fes", kind: "craft", unesco: false, stars: 4, clicks30: 1740 },
  { id: "medersa", name: "al-Attarine Madrasa", dest: "fes", kind: "religious", unesco: false, stars: 4, clicks30: 940 },
  { id: "kasbah-chef", name: "Kasbah of Chefchaouen", dest: "chefchaouen", kind: "kasbah", unesco: false, stars: 4, clicks30: 1840 },
  { id: "ras-el-maa", name: "Ras el-Maa waterfall", dest: "chefchaouen", kind: "nature", unesco: false, stars: 4, clicks30: 920 },
  { id: "skala-essaouira", name: "Skala de la Ville", dest: "essaouira", kind: "fort", unesco: false, stars: 4, clicks30: 1240 },
  { id: "erg-chebbi", name: "Erg Chebbi dunes", dest: "merzouga", kind: "desert", unesco: false, stars: 5, clicks30: 4210 },
  { id: "ait-ben", name: "Aït Benhaddou ksar", dest: "ait-benhaddou", kind: "ksar", unesco: true, stars: 5, clicks30: 3640 },
  { id: "hassan-ii", name: "Hassan II Mosque", dest: "casablanca", kind: "mosque", unesco: false, stars: 5, clicks30: 2840 },
  { id: "chellah", name: "Chellah", dest: "rabat", kind: "ruins", unesco: true, stars: 4, clicks30: 740 },
  { id: "toubkal", name: "Jbel Toubkal", dest: "atlas-mountains", kind: "peak", unesco: false, stars: 5, clicks30: 1640 },
  { id: "imlil", name: "Imlil village", dest: "atlas-mountains", kind: "village", unesco: false, stars: 4, clicks30: 940 },
  { id: "caves-hercules", name: "Caves of Hercules", dest: "tangier", kind: "cave", unesco: false, stars: 4, clicks30: 1140 },
  { id: "cap-spartel", name: "Cap Spartel", dest: "tangier", kind: "cape", unesco: false, stars: 4, clicks30: 540 },
  { id: "agadir-kasbah", name: "Agadir Oufella", dest: "agadir", kind: "kasbah", unesco: false, stars: 3, clicks30: 410 },
  { id: "tetouan-medina", name: "Tetouan medina", dest: "tetouan", kind: "medina", unesco: true, stars: 4, clicks30: 720 },
];

export const RESTAURANTS: Restaurant[] = [
  { id: "nomad", name: "Nomad", dest: "marrakech", kind: "rooftop", stars: 4, price: "€€€", status: "live", clicks30: 1240 },
  { id: "cafe-clock", name: "Café Clock", dest: "fes", kind: "cafe", stars: 4, price: "€€", status: "live", clicks30: 920 },
  { id: "limoni", name: "Limoni", dest: "chefchaouen", kind: "italian", stars: 4, price: "€€", status: "live", clicks30: 480 },
  { id: "taros", name: "Taros", dest: "essaouira", kind: "seafood", stars: 4, price: "€€€", status: "live", clicks30: 720 },
  { id: "la-sqala", name: "La Sqala", dest: "casablanca", stars: 4, kind: "moroccan", price: "€€€", status: "live", clicks30: 540 },
  { id: "le-jardin", name: "Le Jardin", dest: "marrakech", kind: "moroccan", stars: 5, price: "€€€", status: "live", clicks30: 1820 },
  { id: "al-fassia", name: "Al Fassia", dest: "marrakech", kind: "moroccan", stars: 5, price: "€€€€", status: "live", clicks30: 2410 },
  { id: "dar-roumana", name: "Dar Roumana", dest: "fes", kind: "fine-dining", stars: 5, price: "€€€€", status: "live", clicks30: 410 },
  { id: "snail-stall", name: "Jemaa el-Fna snail stall", dest: "marrakech", kind: "street", stars: 4, price: "€", status: "live", clicks30: 3240 },
];

export const LISTS: CuratedList[] = [
  { id: "top-100-morocco-places", title: "Top 100 places in Morocco", kind: "places", curator: "editorial", items: 100, hero: "morocco-places", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/morocco-places.webp", trending: true, description: "The definitive editorial ranking — cities, sights, regions, in one list." },
  { id: "top-50-imperial-cities", title: "Top 50 things in the Imperial Cities", kind: "places", curator: "editorial", items: 50, hero: "imperial", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/imperial.webp", trending: false, description: "Marrakech, Fes, Meknes, Rabat — the historic capitals ranked." },
  { id: "top-100-luxury-hotels", title: "Top 100 luxury hotels in Morocco", kind: "hotels", curator: "editorial", items: 100, hero: "luxury-hotels", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/luxury-hotels.webp", trending: true, description: "From the Royal Mansour to clifftop Atlas retreats." },
  { id: "top-50-riads", title: "Top 50 riads in Marrakech", kind: "hotels", curator: "editorial", items: 50, hero: "riads", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/riads.webp", trending: true, description: "Restored medina riads, ranked on courtyard, rooftop and breakfast." },
  { id: "top-25-desert-camps", title: "Top 25 desert camps", kind: "hotels", curator: "editorial", items: 25, hero: "desert-camps", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/desert-camps.webp", trending: false, description: "Erg Chebbi and Erg Chigaga, sorted on stars and silence." },
  { id: "top-100-restaurants", title: "Top 100 restaurants in Morocco", kind: "food", curator: "editorial", items: 100, hero: "restaurants", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/restaurants.webp", trending: false, description: "Tagine to tasting menu, with the snail stall at #3." },
  { id: "top-25-rooftops", title: "Top 25 medina rooftops", kind: "food", curator: "editorial", items: 25, hero: "rooftops", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/rooftops.webp", trending: true, description: "Sunset cocktails over Marrakech and Fes." },
  { id: "top-100-sights", title: "Top 100 sights in Morocco", kind: "sights", curator: "editorial", items: 100, hero: "sights", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/sights.webp", trending: false, description: "Mosques, ksars, dunes, medersas — the must-sees." },
  { id: "top-25-unesco", title: "Top 25 UNESCO sites & monuments", kind: "sights", curator: "editorial", items: 25, hero: "unesco", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/unesco.webp", trending: false, description: "All nine Moroccan UNESCO entries plus tentative-list highlights." },
  { id: "top-50-beaches", title: "Top 50 beaches", kind: "places", curator: "community", items: 50, hero: "beaches", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/beaches.webp", trending: false, description: "From Legzira arches to Taghazout surf." },
  { id: "top-50-souks", title: "Top 50 souks & markets", kind: "places", curator: "community", items: 50, hero: "souks", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/souks.webp", trending: true, description: "Spice, leather, copper, carpets." },
  { id: "top-50-hikes", title: "Top 50 hikes & treks", kind: "places", curator: "community", items: 50, hero: "hikes", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/hikes.webp", trending: false, description: "Atlas summits, Rif ridges, Sahara crossings." },
  { id: "top-50-films", title: "Top 50 films shot in Morocco", kind: "media", curator: "editorial", items: 50, hero: "films", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/films.webp", trending: false, description: "Casablanca, Lawrence of Arabia, Gladiator — the Hollywood of Africa." },
  { id: "top-100-books", title: "Top 100 books about Morocco", kind: "media", curator: "editorial", items: 100, hero: "books", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/books.webp", trending: false, description: "Guides, novels, travelogues. Affiliate links live on Amazon." },
  { id: "top-50-instagram", title: "Top 50 Instagram spots", kind: "media", curator: "community", items: 50, hero: "instagram", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/instagram.webp", trending: true, description: "Where to shoot the blue walls, the dunes, the rooftops." },
  { id: "top-25-festivals", title: "Top 25 festivals", kind: "places", curator: "community", items: 25, hero: "festivals", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/festivals.webp", trending: false, description: "Mawazine, Gnaoua, World Sacred Music in Fes." },
  { id: "top-50-day-trips-mrk", title: "Top 50 day trips from Marrakech", kind: "places", curator: "editorial", items: 50, hero: "daytrips-marrakech", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/daytrips-marrakech.webp", trending: false, description: "Ourika, Aït Benhaddou, Essaouira and the Atlas." },
  { id: "top-london-equiv", title: "Top 100 — like London, but Moroccan", kind: "places", curator: "community", items: 100, hero: "london", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/list/london.webp", trending: false, description: "A playful comparison index for first-time visitors." },
];

export const FEATURED_VIDEOS: Video[] = [
  { id: "v-001", videoId: "aqpdzId44GM", embedUrl: "https://www.youtube.com/embed/aqpdzId44GM", thumbUrl: "https://i.ytimg.com/vi/aqpdzId44GM/hqdefault.jpg",  title: "Marrakech medina at dawn — full walking tour", dest: "marrakech", duration: "47:12", views: "184k", date: "3 weeks ago", series: "Marrakech Walking Tour", real: true },
  { id: "v-002", videoId: "J4NNwH_qDwI", embedUrl: "https://www.youtube.com/embed/J4NNwH_qDwI", thumbUrl: "https://i.ytimg.com/vi/J4NNwH_qDwI/hqdefault.jpg",  title: "Chefchaouen blue alleys — drone + walk", dest: "chefchaouen", duration: "22:48", views: "410k", date: "2 months ago", series: "Chefchaouen Blue Hour", real: true },
  { id: "v-003", videoId: "t8ON7y_V5FQ", embedUrl: "https://www.youtube.com/embed/t8ON7y_V5FQ", thumbUrl: "https://i.ytimg.com/vi/t8ON7y_V5FQ/hqdefault.jpg",  title: "Erg Chebbi sunrise from the dunes", dest: "merzouga", duration: "12:04", views: "1.2M", date: "1 month ago", series: "Sahara Sunrise", real: true },
  { id: "v-004", videoId: "ejvfsCJ0bxU", embedUrl: "https://www.youtube.com/embed/ejvfsCJ0bxU", thumbUrl: "https://i.ytimg.com/vi/ejvfsCJ0bxU/hqdefault.jpg",  title: "Fes tannery — the real story (with sound)", dest: "fes", duration: "34:20", views: "720k", date: "5 weeks ago", series: "Fes Medina Stories", real: true },
  { id: "v-005", videoId: "Nz37VHXJ0M4", embedUrl: "https://www.youtube.com/embed/Nz37VHXJ0M4", thumbUrl: "https://i.ytimg.com/vi/Nz37VHXJ0M4/hqdefault.jpg",  title: "Aït Benhaddou — film locations tour", dest: "ait-benhaddou", duration: "28:11", views: "290k", date: "2 months ago", series: "Atlas Trekking Diaries", real: true },
  { id: "v-006", videoId: "DNZYmpCDl3k", embedUrl: "https://www.youtube.com/embed/DNZYmpCDl3k", thumbUrl: "https://i.ytimg.com/vi/DNZYmpCDl3k/hqdefault.jpg",  title: "How to bargain — Marrakech souk", dest: "marrakech", duration: "11:34", views: "880k", date: "4 weeks ago", series: "Marrakech Walking Tour", real: true },
  { id: "v-007", videoId: "PoZiv2H3YnE", embedUrl: "https://www.youtube.com/embed/PoZiv2H3YnE", thumbUrl: "https://i.ytimg.com/vi/PoZiv2H3YnE/hqdefault.jpg",  title: "Berber Friday couscous — Imlil", dest: "atlas-mountains", duration: "18:22", views: "210k", date: "3 months ago", series: "Tagine Stories", real: true },
  { id: "v-008", videoId: "3EUkmyDQCxM", embedUrl: "https://www.youtube.com/embed/3EUkmyDQCxM", thumbUrl: "https://i.ytimg.com/vi/3EUkmyDQCxM/hqdefault.jpg",  title: "Camel trek — Erg Chigaga end-to-end", dest: "merzouga", duration: "52:30", views: "440k", date: "6 weeks ago", series: "Sahara Sunrise", real: true },
  { id: "v-009", videoId: "3v23l1xACwk", embedUrl: "https://www.youtube.com/embed/3v23l1xACwk", thumbUrl: "https://i.ytimg.com/vi/3v23l1xACwk/hqdefault.jpg",  title: "Essaouira at low tide", dest: "essaouira", duration: "14:50", views: "320k", date: "1 month ago", series: "Coastal Drive", real: true },
  { id: "v-010", videoId: "rFm64-FFLfw", embedUrl: "https://www.youtube.com/embed/rFm64-FFLfw", thumbUrl: "https://i.ytimg.com/vi/rFm64-FFLfw/hqdefault.jpg",  title: "Tangier — the strait, the kasbah, the cafés", dest: "tangier", duration: "31:08", views: "180k", date: "2 weeks ago", series: "Coastal Drive", real: true },
  { id: "v-011", videoId: "wh4kw-7XcY4", embedUrl: "https://www.youtube.com/embed/wh4kw-7XcY4", thumbUrl: "https://i.ytimg.com/vi/wh4kw-7XcY4/hqdefault.jpg",  title: "Atlas Mountains crossing — Tizi n'Tichka", dest: "atlas-mountains", duration: "46:14", views: "160k", date: "3 weeks ago", series: "Atlas Trekking Diaries", real: true },
  { id: "v-012", videoId: "U8sAtIz-u6s", embedUrl: "https://www.youtube.com/embed/U8sAtIz-u6s", thumbUrl: "https://i.ytimg.com/vi/U8sAtIz-u6s/hqdefault.jpg",  title: "Casablanca to Rabat by train", dest: "casablanca", duration: "23:42", views: "92k", date: "5 weeks ago", series: "Casablanca Day in the Life", real: true },
];

export const GUIDES: Guide[] = [
  { id: "lp-morocco", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/book-lp.webp",  title: "Lonely Planet Morocco (15th ed.)", kind: "guidebook", price: "€24", asin: "B0B7Q3W4F2", rating: 4.7, reviews: 1842, hero: "book-lp" },
  { id: "rough-guide", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/book-rg.webp",  title: "Rough Guide to Morocco", kind: "guidebook", price: "€22", asin: "B09KJ2LM31", rating: 4.6, reviews: 940, hero: "book-rg" },
  { id: "cookbook-mourad", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/book-mourad.webp",  title: "Mourad — New Moroccan", kind: "cookbook", price: "€38", asin: "B005CRQ4DK", rating: 4.8, reviews: 1240, hero: "book-mourad" },
  { id: "cookbook-paula", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/book-paula.webp",  title: "Paula Wolfert — The Food of Morocco", kind: "cookbook", price: "€42", asin: "B0083DJWCS", rating: 4.9, reviews: 2180, hero: "book-paula" },
  { id: "argan-oil", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/argan.webp",  title: "Argan-oil hammam gift set", kind: "beauty", price: "€32", asin: "B08K2T9PXM", rating: 4.5, reviews: 410, hero: "argan" },
  { id: "tagine", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/tagine.webp",  title: "Moroccan tagine 30 cm", kind: "cooking", price: "€55", asin: "B07RZP5N6F", rating: 4.4, reviews: 320, hero: "tagine" },
  { id: "hiking-shoe", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/shoes.webp",  title: "Salomon X Ultra 4 GTX hiking shoe", kind: "gear", price: "€140", asin: "B09KK7HW2W", rating: 4.7, reviews: 1820, hero: "shoes" },
  { id: "sand-tent", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/tent.webp",  title: "Quechua 2-second pop-up sand tent", kind: "gear", price: "€95", asin: "B09XPF4LMD", rating: 4.3, reviews: 240, hero: "tent" },
  { id: "camera-om1", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/camera.webp",  title: "Olympus OM-1 mirrorless camera", kind: "gear", price: "€2400", asin: "B0BCDXLT4G", rating: 4.8, reviews: 460, hero: "camera" },
  { id: "phrasebook", image: "https://com27.s3.eu-west-2.amazonaws.com/mtd/images/guide/phrasebook.webp",  title: "Lonely Planet Moroccan Arabic phrasebook", kind: "guidebook", price: "€11", asin: "B07YT3FPN1", rating: 4.6, reviews: 720, hero: "phrasebook" },
];

export const WIKI_ARTICLES: WikiArticle[] = [
  { id: "wiki-morocco", title: "Morocco — overview", dest: "cross", length: "14,820 words", updated: "May 18 2026" },
  { id: "wiki-marrakech", title: "Marrakech", dest: "marrakech", length: "8,640 words", updated: "May 14 2026" },
  { id: "wiki-fes", title: "Fes", dest: "fes", length: "6,210 words", updated: "May 10 2026" },
  { id: "wiki-imperial", title: "The four Imperial Cities", dest: "cross", length: "4,120 words", updated: "May  2 2026" },
  { id: "wiki-berber", title: "Berber (Amazigh) people", dest: "cross", length: "12,140 words", updated: "Apr 28 2026" },
  { id: "wiki-sahara", title: "The Sahara in Morocco", dest: "merzouga", length: "5,820 words", updated: "May  6 2026" },
  { id: "wiki-atlas", title: "Atlas Mountains", dest: "atlas-mountains", length: "7,910 words", updated: "May  9 2026" },
  { id: "wiki-cuisine", title: "Cuisine of Morocco", dest: "cross", length: "9,820 words", updated: "May 17 2026" },
];

export function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const TINTS: Array<[string, string]> = [
  ["#c1272d", "#3a0506"],
  ["#3b6e8f", "#0c1924"],
  ["#c1272d", "#2a1a05"],
  ["#7a8c5c", "#101a0c"],
  ["#a3522c", "#1b0a04"],
  ["#5a7b8e", "#0a1218"],
  ["#9a4b3a", "#1a0807"],
  ["#b67c44", "#1d1108"],
];

export function tint(seed: string): [string, string] {
  return TINTS[hash(seed) % TINTS.length];
}

export function img(seed: string, w = 800, h = 600): string {
  const s = String(seed).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const lock = (hash(s) % 9999) + 1;
  return `https://loremflickr.com/${w}/${h}/morocco/all?lock=${lock}`;
}

export const TOTAL_RANKED = LISTS.reduce((s, l) => s + l.items, 0);

export function findRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export function findDestination(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}
