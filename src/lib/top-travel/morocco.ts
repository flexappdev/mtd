// Morocco Top 100 — editorial ranking for /lists/top100.
//
// All copy below is original, written for mtd (no Wikipedia/Wikivoyage text).
// Ranked for a first or second trip to Morocco: icon value × uniqueness ×
// ease of access. `base` is the town a visitor sleeps in to see the place;
// it drives the Booking.com "stay nearby" search. `dest` links to an existing
// /morocco/[slug] page when there is one.

export type TopCategory =
  | "City"
  | "Medina"
  | "Landmark"
  | "Ruins"
  | "Museum"
  | "Garden"
  | "Nature"
  | "Mountains"
  | "Desert"
  | "Coast"
  | "Food & Drink"
  | "Experience";

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** [name, category, base town, one-line why, bookable as a tour, /morocco slug] */
export type TopRow = [string, TopCategory, string, string, boolean, string?];

export const MOROCCO_TOP100: TopRow[] = [
  ["Jemaa el-Fna", "Landmark", "Marrakech", "Marrakech's main square turns from orange-juice stands by day into a smoky open-air supper club by night.", true, "marrakech"],
  ["Fes el-Bali medina", "Medina", "Fes", "Some 9,000 lanes with no cars at all: the largest living medieval city you can still get lost in.", true, "fes"],
  ["Erg Chebbi dunes", "Desert", "Merzouga", "Apricot-coloured dunes up to 150 m high, best seen from a camel at sunrise or a camp at night.", true, "merzouga"],
  ["Chefchaouen", "City", "Chefchaouen", "A Rif mountain town washed in every shade of blue, made for slow wandering and too many photos.", true, "chefchaouen"],
  ["Aït Benhaddou ksar", "Landmark", "Aït Benhaddou", "A mud-brick fortified village climbing a hillside, familiar from dozens of films and still lived in.", true, "ait-benhaddou"],
  ["Hassan II Mosque", "Landmark", "Casablanca", "A vast mosque built partly over the Atlantic, and one of the few in Morocco non-Muslims can tour.", true, "casablanca"],
  ["Jardin Majorelle", "Garden", "Marrakech", "Electric-blue walls, cactus beds and bamboo groves: a cool hour of calm in the middle of the city.", true, "marrakech"],
  ["Marrakech", "City", "Marrakech", "The country's showstopper: riads, rooftops, souks and the High Atlas an hour's drive away.", true, "marrakech"],
  ["Fes", "City", "Fes", "Morocco's spiritual and craft capital, where the medieval trades still run on donkeys and handcarts.", true, "fes"],
  ["Essaouira", "City", "Essaouira", "A breezy, whitewashed port with ramparts, gulls and a far gentler pace than Marrakech.", true, "essaouira"],
  ["Jbel Toubkal", "Mountains", "Imlil", "North Africa's highest peak at 4,167 m, climbable in two days with no technical gear in summer.", true, "atlas-mountains"],
  ["Todra Gorge", "Nature", "Tinghir", "Sheer orange cliffs squeeze to a few metres apart, with a river path and some of Morocco's best climbing.", true],
  ["Dades Valley", "Nature", "Boumalne Dades", "Kasbahs, fig trees and a switchback road that has become one of the most photographed drives in Africa.", true],
  ["Volubilis", "Ruins", "Meknes", "Mosaic floors still in place on a Roman town at the empire's far edge, with olive groves all round.", true],
  ["Ouzoud Falls", "Nature", "Ouzoud", "A 110 m cascade with rainbows, barbary macaques and boatmen who row you right under the spray.", true],
  ["Bahia Palace", "Landmark", "Marrakech", "Room after room of painted cedar ceilings and tiled courtyards, built to impress a 19th-century court.", true, "marrakech"],
  ["Chouara tannery", "Experience", "Fes", "Honeycomb dye pits worked the same way for centuries; take the mint sprig you are offered at the door.", true, "fes"],
  ["Rabat", "City", "Rabat", "The tidy, underrated capital: walkable, green and full of monuments without the hustle.", false, "rabat"],
  ["Kasbah of the Udayas", "Landmark", "Rabat", "Blue-and-white lanes inside a clifftop fort, with an Andalusian garden and views over the river mouth.", true, "rabat"],
  ["Koutoubia Mosque", "Landmark", "Marrakech", "The 12th-century minaret that every other tower in the city has to stay shorter than.", false, "marrakech"],
  ["Ben Youssef Madrasa", "Landmark", "Marrakech", "A former Koranic school whose courtyard of stucco, cedar and zellige is among the finest in the country.", true, "marrakech"],
  ["al-Attarine Madrasa", "Landmark", "Fes", "A small Merinid college with carving so dense it reads like lace, right beside the spice market.", true, "fes"],
  ["High Atlas Mountains", "Mountains", "Imlil", "Berber villages, walnut terraces and mule tracks: the best escape from city heat in the country.", true, "atlas-mountains"],
  ["Imlil village", "Mountains", "Imlil", "The trailhead for Toubkal and a good base for gentle valley walks with lunch in a village house.", true, "atlas-mountains"],
  ["Ourika Valley", "Nature", "Ourika", "A river valley of cafés on stilts and waterfalls, the classic easy day out from Marrakech.", true],
  ["Agafay Desert", "Desert", "Marrakech", "A stony moonscape 40 minutes from the city, for a desert-camp dinner without the long drive.", true, "marrakech"],
  ["Skala de la Ville", "Landmark", "Essaouira", "Sea ramparts lined with old bronze cannon, with the Atlantic crashing just below.", false, "essaouira"],
  ["Tangier", "City", "Tangier", "A port with a literary past, a revived medina and Spain visible across the strait.", true, "tangier"],
  ["Caves of Hercules", "Nature", "Tangier", "A sea cave whose opening is shaped, so the story goes, like a map of Africa.", true, "tangier"],
  ["Cap Spartel", "Coast", "Tangier", "A lighthouse headland where the Mediterranean meets the Atlantic, best at sunset.", false, "tangier"],
  ["Meknes", "City", "Meknes", "A quieter imperial city of monumental gates and granaries, and the base for Volubilis.", true, "meknes"],
  ["Bab Mansour", "Landmark", "Meknes", "The grandest gateway in Morocco, faced in green tile and carved stone.", false, "meknes"],
  ["Moulay Idriss Zerhoun", "City", "Moulay Idriss", "A holy hill town spilling over two slopes, with rooftop views and a sweet-pastry tradition.", true],
  ["Kasbah of Chefchaouen", "Landmark", "Chefchaouen", "A red-walled fort and garden on the main square, with a tower view over the blue rooftops.", false, "chefchaouen"],
  ["Ras el-Maa waterfall", "Nature", "Chefchaouen", "The spring at the top of town where locals still wash clothes, and the start of the Spanish Mosque walk.", false, "chefchaouen"],
  ["Akchour waterfalls & God's Bridge", "Nature", "Akchour", "A Rif river hike to emerald pools and a natural rock arch high above the gorge.", true],
  ["Tetouan medina", "Medina", "Tetouan", "A white Andalusian old town, UNESCO-listed and far less visited than its neighbours.", true, "tetouan"],
  ["Chellah", "Ruins", "Rabat", "Roman and Merinid ruins taken over by storks, cats and flowering gardens.", false, "rabat"],
  ["Hassan Tower", "Landmark", "Rabat", "The stump of an unfinished 12th-century minaret, standing in a forest of broken columns.", false, "rabat"],
  ["Ouarzazate", "City", "Ouarzazate", "The gateway to the south, where the road over the Atlas meets the desert valleys.", true, "ouarzazate"],
  ["Atlas Film Studios", "Experience", "Ouarzazate", "Walk through film sets from Roman to Egyptian on one of the largest studio lots in the world.", true, "ouarzazate"],
  ["Taourirt Kasbah", "Landmark", "Ouarzazate", "A sprawling earthen palace of the Glaoui clan, with painted rooms and a maze of courtyards.", false, "ouarzazate"],
  ["Merzouga", "City", "Merzouga", "A small desert village at the foot of the dunes, where most camel treks and camps begin.", true, "merzouga"],
  ["Agadir", "City", "Agadir", "A long sandy bay, a modern seafront promenade and reliable sunshine almost all year.", true, "agadir"],
  ["Agadir Oufella", "Landmark", "Agadir", "The hilltop fort above the bay, reached by cable car, with the best view over the city.", false, "agadir"],
  ["Taghazout", "Coast", "Taghazout", "Morocco's surf village: point breaks, yoga terraces and fresh fish on the beach.", true],
  ["Paradise Valley", "Nature", "Agadir", "Palm-lined rock pools in the foothills behind Agadir, perfect for a swim on a hot day.", true, "agadir"],
  ["Legzira beach", "Coast", "Sidi Ifni", "Red cliffs and a sweeping arch over a wild Atlantic beach, best at low tide.", false],
  ["Sidi Ifni", "Coast", "Sidi Ifni", "A sleepy former Spanish town of art deco buildings, paragliders and big surf.", false],
  ["Dakhla lagoon", "Coast", "Dakhla", "A flat, windy lagoon on the edge of the Sahara that is one of the world's great kitesurf spots.", true],
  ["Casablanca", "City", "Casablanca", "Morocco's business city, with Art Deco boulevards, good food and a buzzing seafront.", true, "casablanca"],
  ["Ain Diab Corniche", "Coast", "Casablanca", "Casablanca's ocean promenade of beach clubs, cafés and evening strollers.", false, "casablanca"],
  ["Asilah", "City", "Asilah", "A white seaside town with murals painted fresh every summer and ramparts on the waves.", true],
  ["Lixus", "Ruins", "Larache", "Overgrown Phoenician and Roman ruins above a river estuary, often with nobody else there.", false],
  ["Oualidia lagoon", "Coast", "Oualidia", "A calm, sheltered lagoon famous for its oysters and safe swimming.", false],
  ["Portuguese Cistern, El Jadida", "Landmark", "El Jadida", "A vaulted underground cistern where a thin layer of water mirrors the columns and the light.", true],
  ["Safi pottery hill", "Experience", "Safi", "Kilns and workshops on a hillside where much of Morocco's glazed pottery is still thrown.", false],
  ["Erg Chigaga", "Desert", "M'hamid", "Morocco's biggest and wildest dune field, reached only by 4x4 across open desert.", true],
  ["Draa Valley", "Nature", "Zagora", "A long ribbon of palm groves and crumbling kasbahs following the river to the desert.", true],
  ["Tizi n'Tichka pass", "Mountains", "Taddert", "The high road over the Atlas, with hairpins, mineral stalls and huge views on both sides.", true],
  ["Telouet Kasbah", "Landmark", "Telouet", "A crumbling mountain palace whose plain walls hide astonishingly ornate reception rooms.", true],
  ["Kasbah Amridil", "Landmark", "Skoura", "A beautifully kept family kasbah in a palm oasis, with its old olive press still inside.", false],
  ["Valley of Roses", "Nature", "Kelaat M'Gouna", "A valley hedged with Damask roses, at its best during the harvest and festival each May.", true],
  ["Aït Bouguemez valley", "Mountains", "Aït Bouguemez", "The 'Happy Valley': green fields, adobe villages and some of the gentlest trekking in the Atlas.", true],
  ["Ifrane", "City", "Ifrane", "An Alpine-style resort town of pitched roofs and lawns, nicknamed Morocco's Switzerland.", false],
  ["Cedar forest of Azrou", "Nature", "Azrou", "Ancient Atlas cedars and wild barbary macaques, a short drive from Ifrane.", true],
  ["Ameln Valley", "Nature", "Tafraoute", "Pink granite boulders and almond orchards in the Anti-Atlas, glorious in February bloom.", false],
  ["Painted Rocks of Tafraoute", "Experience", "Tafraoute", "Boulders painted blue by a Belgian artist in the 1980s, now a surreal desert gallery.", false],
  ["Taroudant", "City", "Taroudant", "A walled market town nicknamed 'little Marrakech', with lively souks and few tourists.", false],
  ["Tiznit silver souk", "Experience", "Tiznit", "The place to buy traditional Berber silver jewellery, sold by weight inside the ramparts.", false],
  ["Souss-Massa National Park", "Nature", "Massa", "Coastal wetlands and dunes, home to one of the last wild colonies of northern bald ibis.", true],
  ["Saadian Tombs", "Landmark", "Marrakech", "A royal burial chamber sealed off for centuries, with marble and carved plaster in perfect shape.", true, "marrakech"],
  ["El Badi Palace", "Ruins", "Marrakech", "The vast shell of a 16th-century palace, with sunken orange gardens and storks on the walls.", true, "marrakech"],
  ["Le Jardin Secret", "Garden", "Marrakech", "A restored riad garden in the medina, with a tower view over the rooftops.", true, "marrakech"],
  ["Menara Gardens", "Garden", "Marrakech", "An olive grove and reflecting pool with a pavilion framed by the snowy Atlas in winter.", false, "marrakech"],
  ["Musée Yves Saint Laurent", "Museum", "Marrakech", "A striking brick building next to Majorelle telling the designer's story with original pieces.", true, "marrakech"],
  ["Souks of Marrakech", "Experience", "Marrakech", "Lanes of lamps, leather, spices and carpets: haggle with a smile and walk away if it stops being fun.", true, "marrakech"],
  ["Hammam ritual", "Experience", "Marrakech", "Steam, black soap and a vigorous scrub: the most Moroccan way to recover from a day of sightseeing.", true, "marrakech"],
  ["Hot-air balloon at dawn", "Experience", "Marrakech", "Float over Berber villages and palm groves as the sun rises over the Atlas.", true, "marrakech"],
  ["Moroccan cooking class", "Food & Drink", "Marrakech", "Shop the market with a cook, then make tagine, bread and salads in a riad kitchen.", true, "marrakech"],
  ["Jemaa el-Fna food stalls", "Food & Drink", "Marrakech", "Grilled meats, harira and snails at numbered stalls; go where the locals are queuing.", true, "marrakech"],
  ["Al Fassia", "Food & Drink", "Marrakech", "A much-loved restaurant run by women, famous for slow-cooked lamb shoulder and salads.", false, "marrakech"],
  ["Nomad", "Food & Drink", "Marrakech", "Modern Moroccan cooking on a rooftop above the spice square.", false, "marrakech"],
  ["Café Clock", "Food & Drink", "Fes", "A medina café known for its camel burger, storytelling nights and cultural events.", false, "fes"],
  ["Bou Inania Madrasa", "Landmark", "Fes", "A Merinid college with a working minaret and some of the finest woodwork in the medina.", true, "fes"],
  ["Merinid Tombs viewpoint", "Landmark", "Fes", "Ruined tombs on the hill above Fes, where the whole medina spreads out below at sunset.", true, "fes"],
  ["Mellah of Fes", "Medina", "Fes", "The old Jewish quarter, with wooden balconies, a restored synagogue and a quiet cemetery.", true, "fes"],
  ["Royal Palace gates, Fes", "Landmark", "Fes", "Seven huge brass doors framed in tile and carved cedar, the most photographed gates in the city.", false, "fes"],
  ["Essaouira port fish grills", "Food & Drink", "Essaouira", "Pick a fish straight off the boats and have it grilled on the quayside a few metres away.", true, "essaouira"],
  ["Mohammed VI Museum of Modern Art", "Museum", "Rabat", "Morocco's national gallery of modern and contemporary art, with strong temporary shows.", false, "rabat"],
  ["Habous quarter", "Medina", "Casablanca", "A 1930s 'new medina' of arcades, olive stalls and pastry shops, calm and easy to explore.", true, "casablanca"],
  ["Rick's Café", "Food & Drink", "Casablanca", "A piano bar in an old courtyard mansion that leans happily into the film legend.", false, "casablanca"],
  ["Kasbah Museum, Tangier", "Museum", "Tangier", "The former sultan's palace at the top of the kasbah, with views across the strait to Spain.", true, "tangier"],
  ["Al Hoceima National Park", "Coast", "Al Hoceima", "Limestone cliffs plunging into clear Mediterranean coves, best explored by boat.", true],
  ["Fint Oasis", "Nature", "Ouarzazate", "A hidden green oasis below black hills, a short 4x4 trip from Ouarzazate.", true, "ouarzazate"],
  ["Gnaoua World Music Festival", "Experience", "Essaouira", "Every June the town fills with trance rhythms, free stages and late-night jam sessions.", false, "essaouira"],
  ["Bin el Ouidane lake", "Nature", "Bin el Ouidane", "A turquoise reservoir among the mountains, good for kayaking and lakeside lodges.", false],
  ["Khamlia village", "Experience", "Merzouga", "A desert village where Gnawa musicians welcome visitors with drums, iron castanets and tea.", true, "merzouga"],
  ["Rissani market", "Experience", "Rissani", "A big rural market with a 'donkey car park', dates of every kind and few tourists.", true],
  ["Tamegroute", "Experience", "Tamegroute", "A Draa Valley village known for green-glazed pottery and an old library of manuscripts.", true],
];
