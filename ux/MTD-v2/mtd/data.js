// MTD seed data — Morocco Top Destinations back office.
// Regions reuse Siems workspace accents (core/lists/travel/bo/context).
window.MTD = {
  regions: [
    { id: 'imperial',      name: 'Imperial Cities',  letter: 'I', accent: 'imperial',     thumb: ['#2a3a5a','#0d1422'] },
    { id: 'coast',         name: 'Atlantic Coast',   letter: 'A', accent: 'coast',        thumb: ['#5a2a2a','#2a1414'] },
    { id: 'atlas',         name: 'Atlas & Mountains',letter: 'M', accent: 'atlas',        thumb: ['#2a4a32','#0e1a13'] },
    { id: 'sahara',        name: 'Sahara & Desert',  letter: 'S', accent: 'sahara',       thumb: ['#3a3a5a','#101728'] },
    { id: 'mediterranean', name: 'Mediterranean',    letter: 'N', accent: 'mediterranean',thumb: ['#2a3a44','#10171c'] },
  ],

  destinations: [
    { id: 'marrakech',      name: 'Marrakech',       region: 'imperial',      kind: 'city',    status: 'live',    hotels: 47, sights: 18, facts: 24, rev30: 8420, clicks30: 12840, updated: '2h ago',  initial: 'M',  position: 'Top destination' },
    { id: 'fes',            name: 'Fes',             region: 'imperial',      kind: 'city',    status: 'live',    hotels: 28, sights: 14, facts: 19, rev30: 4180, clicks30: 6420,  updated: '5h ago',  initial: 'F',  position: 'Cultural capital' },
    { id: 'chefchaouen',    name: 'Chefchaouen',     region: 'mediterranean', kind: 'city',    status: 'live',    hotels: 14, sights: 9,  facts: 12, rev30: 3960, clicks30: 9180,  updated: '1d ago',  initial: 'C',  position: 'Blue city' },
    { id: 'essaouira',      name: 'Essaouira',       region: 'coast',         kind: 'city',    status: 'live',    hotels: 18, sights: 11, facts: 14, rev30: 2840, clicks30: 5210,  updated: '4h ago',  initial: 'E',  position: 'Windy port' },
    { id: 'merzouga',       name: 'Merzouga',        region: 'sahara',        kind: 'city',    status: 'live',    hotels: 9,  sights: 6,  facts: 11, rev30: 5210, clicks30: 4180,  updated: '6h ago',  initial: 'M',  position: 'Erg Chebbi gateway' },
    { id: 'casablanca',     name: 'Casablanca',      region: 'coast',         kind: 'city',    status: 'live',    hotels: 32, sights: 9,  facts: 17, rev30: 3120, clicks30: 7240,  updated: '3h ago',  initial: 'C',  position: 'Economic capital' },
    { id: 'rabat',          name: 'Rabat',           region: 'imperial',      kind: 'city',    status: 'live',    hotels: 21, sights: 13, facts: 18, rev30: 1840, clicks30: 3120,  updated: '12h ago', initial: 'R',  position: 'Capital' },
    { id: 'ouarzazate',     name: 'Ouarzazate',      region: 'atlas',         kind: 'city',    status: 'preview', hotels: 7,  sights: 8,  facts: 13, rev30: 920,  clicks30: 2410,  updated: '2d ago',  initial: 'O',  position: 'Hollywood of Africa' },
    { id: 'ait-benhaddou',  name: 'Aït Benhaddou',   region: 'atlas',         kind: 'sight',   status: 'draft',   hotels: 3,  sights: 1,  facts: 9,  rev30: 0,    clicks30: 0,     updated: '8h ago',  initial: 'A',  position: 'UNESCO ksar' },
    { id: 'atlas-mountains',name: 'Atlas Mountains', region: 'atlas',         kind: 'region',  status: 'live',    hotels: 11, sights: 16, facts: 21, rev30: 2140, clicks30: 4820,  updated: '1d ago',  initial: 'A',  position: 'Trekking & Berber villages' },
    { id: 'meknes',         name: 'Meknes',          region: 'imperial',      kind: 'city',    status: 'qa',      hotels: 12, sights: 11, facts: 16, rev30: 880,  clicks30: 1620,  updated: '4d ago',  initial: 'M',  position: 'Imperial old town' },
    { id: 'tangier',        name: 'Tangier',         region: 'mediterranean', kind: 'city',    status: 'live',    hotels: 24, sights: 10, facts: 15, rev30: 2410, clicks30: 4180,  updated: '6h ago',  initial: 'T',  position: 'Strait gateway' },
    { id: 'agadir',         name: 'Agadir',          region: 'coast',         kind: 'city',    status: 'live',    hotels: 38, sights: 7,  facts: 12, rev30: 3640, clicks30: 6840,  updated: '5h ago',  initial: 'A',  position: 'Beach resort' },
    { id: 'tetouan',        name: 'Tetouan',         region: 'mediterranean', kind: 'city',    status: 'preview', hotels: 8,  sights: 7,  facts: 13, rev30: 410,  clicks30: 920,   updated: '3d ago',  initial: 'T',  position: 'Andalusian medina' },
  ],

  // Hotels with multi-vendor pricing. rate = nightly EUR.
  hotels: [
    { id: 'la-mamounia',         name: 'La Mamounia',                  dest: 'marrakech',  stars: 5, rates: { booking: 640,  expedia: 655,  agoda: 635,  awin: null }, clicks30: 1840, rev30: 1240, updated: '12m ago' },
    { id: 'royal-mansour',       name: 'Royal Mansour',                dest: 'marrakech',  stars: 5, rates: { booking: 2400, expedia: 2450, agoda: null, awin: null }, clicks30: 410,  rev30: 980,  updated: '32m ago' },
    { id: 'riad-yasmine',        name: 'Riad Yasmine',                 dest: 'marrakech',  stars: 4, rates: { booking: 110,  expedia: null, agoda: 105,  awin: 108  }, clicks30: 2840, rev30: 720,  updated: '8m ago'  },
    { id: 'el-fenn',             name: 'El Fenn',                      dest: 'marrakech',  stars: 5, rates: { booking: 480,  expedia: 495,  agoda: 475,  awin: null }, clicks30: 1280, rev30: 840,  updated: '24m ago' },
    { id: 'palais-amani',        name: 'Palais Amani',                 dest: 'fes',        stars: 5, rates: { booking: 185,  expedia: null, agoda: 180,  awin: 175  }, clicks30: 920,  rev30: 410,  updated: '1h ago'  },
    { id: 'riad-fes',            name: 'Riad Fes',                     dest: 'fes',        stars: 5, rates: { booking: 240,  expedia: 250,  agoda: 235,  awin: null }, clicks30: 640,  rev30: 380,  updated: '46m ago' },
    { id: 'dar-bensouda',        name: 'Dar Bensouda',                 dest: 'fes',        stars: 4, rates: { booking: 95,   expedia: null, agoda: 92,   awin: 89   }, clicks30: 1140, rev30: 290,  updated: '2h ago'  },
    { id: 'lina-ryad',           name: 'Lina Ryad & Spa',              dest: 'chefchaouen',stars: 4, rates: { booking: 145,  expedia: 150,  agoda: null, awin: null }, clicks30: 1620, rev30: 480,  updated: '18m ago' },
    { id: 'casa-hassan',         name: 'Casa Hassan',                  dest: 'chefchaouen',stars: 3, rates: { booking: 78,   expedia: null, agoda: 75,   awin: null }, clicks30: 2410, rev30: 420,  updated: '8m ago'  },
    { id: 'heure-bleue',         name: 'Heure Bleue Palais',           dest: 'essaouira',  stars: 5, rates: { booking: 230,  expedia: 240,  agoda: 225,  awin: 218  }, clicks30: 740,  rev30: 410,  updated: '54m ago' },
    { id: 'villa-maroc',         name: 'Villa Maroc',                  dest: 'essaouira',  stars: 4, rates: { booking: 165,  expedia: 170,  agoda: null, awin: null }, clicks30: 580,  rev30: 290,  updated: '1h ago'  },
    { id: 'erg-chebbi-camp',     name: 'Erg Chebbi Luxury Camp',       dest: 'merzouga',   stars: 4, rates: { booking: 280,  expedia: null, agoda: 270,  awin: 265  }, clicks30: 1840, rev30: 920,  updated: '24m ago' },
    { id: 'sahara-stars-camp',   name: 'Sahara Stars Desert Camp',     dest: 'merzouga',   stars: 4, rates: { booking: 195,  expedia: null, agoda: 190,  awin: null }, clicks30: 1240, rev30: 540,  updated: '3h ago'  },
    { id: 'four-seasons-cas',    name: 'Four Seasons Casablanca',      dest: 'casablanca', stars: 5, rates: { booking: 420,  expedia: 430,  agoda: 415,  awin: null }, clicks30: 480,  rev30: 480,  updated: '2h ago'  },
    { id: 'sofitel-cas',         name: 'Sofitel Casablanca Tour Blanche', dest: 'casablanca', stars: 5, rates: { booking: 240, expedia: 250, agoda: 235, awin: null }, clicks30: 620,  rev30: 310,  updated: '1h ago'  },
    { id: 'sofitel-rabat',       name: 'Sofitel Rabat Jardin des Roses', dest: 'rabat',    stars: 5, rates: { booking: 220,  expedia: 225,  agoda: 218,  awin: null }, clicks30: 410,  rev30: 240,  updated: '3h ago'  },
    { id: 'kasbah-tamadot',      name: 'Kasbah Tamadot',               dest: 'atlas-mountains', stars: 5, rates: { booking: 540, expedia: 555, agoda: null, awin: null }, clicks30: 720, rev30: 480,  updated: '5h ago'  },
    { id: 'el-minzah',           name: 'El Minzah Hotel',              dest: 'tangier',    stars: 5, rates: { booking: 180,  expedia: 185,  agoda: 178,  awin: 172  }, clicks30: 540,  rev30: 220,  updated: '2h ago'  },
    { id: 'riad-arabesque',      name: 'Dar Arabesque',                dest: 'tangier',    stars: 4, rates: { booking: 95,   expedia: null, agoda: 92,   awin: null }, clicks30: 820,  rev30: 180,  updated: '4h ago'  },
    { id: 'sofitel-agadir',      name: 'Sofitel Agadir Royal Bay',     dest: 'agadir',     stars: 5, rates: { booking: 195,  expedia: 200,  agoda: 192,  awin: null }, clicks30: 1240, rev30: 480,  updated: '1h ago'  },
  ],

  // Top facts (Wikipedia-sourced highlights per destination)
  facts: [
    { dest: 'marrakech',   text: 'Founded in 1062 by the Almoravid dynasty; nicknamed the “Red City” for its pink-ochre walls.', src: 'wikipedia', updated: '6d ago' },
    { dest: 'marrakech',   text: 'Jemaa el-Fna square is a UNESCO-listed Masterpiece of Oral and Intangible Heritage.',          src: 'wikipedia', updated: '6d ago' },
    { dest: 'fes',         text: 'Home to al-Qarawiyyin, founded in 859 — among the oldest continuously operating universities.', src: 'wikipedia', updated: '4d ago' },
    { dest: 'chefchaouen', text: 'Walls and stairways were painted blue in the 1930s; theories range from cooling to spiritual.',  src: 'wikivoyage',updated: '2d ago' },
    { dest: 'merzouga',    text: 'Erg Chebbi dunes rise up to 150 m on the western edge of the Sahara.',                            src: 'wikipedia', updated: '8d ago' },
  ],

  // Amazon affiliate CTAs (products linked from destination pages)
  amazon: [
    { dest: 'marrakech',   product: 'Lonely Planet Morocco (15th ed.)',     asin: 'B0B7Q3W4F2', clicks30: 840, rev30: 84,  status: 'live'  },
    { dest: 'marrakech',   product: 'Argan-oil hammam gift set',            asin: 'B08K2T9PXM', clicks30: 1240,rev30: 187, status: 'live'  },
    { dest: 'fes',         product: 'Moroccan tagine cooking pot 30 cm',    asin: 'B07RZP5N6F', clicks30: 480, rev30: 64,  status: 'live'  },
    { dest: 'sahara',      product: 'Quechua 2-second pop-up sand tent',    asin: 'B09XPF4LMD', clicks30: 320, rev30: 38,  status: 'live'  },
    { dest: 'atlas-mountains', product: 'Salomon X Ultra 4 GTX hiking shoe',asin: 'B09KK7HW2W', clicks30: 610, rev30: 121, status: 'live'  },
    { dest: 'essaouira',   product: 'Quiksilver hooded windbreaker',        asin: 'B08FCN6RTX', clicks30: 290, rev30: 41,  status: 'preview' },
    { dest: 'chefchaouen', product: 'Olympus OM-1 mirrorless camera',       asin: 'B0BCDXLT4G', clicks30: 410, rev30: 920, status: 'live'  },
  ],

  // Content agents — automated scrapers & sync workers
  agents: [
    { id: 'wikivoyage-importer', vendor: 'wikivoyage', kind: 'importer', domain: 'Sights & itineraries',         status: 'live', schedule: 'daily 04:00 UTC',  last: '6h ago',  runs7: 7,  errors7: 0, covered: '14 / 14' },
    { id: 'wikipedia-facts',     vendor: 'wikipedia',  kind: 'importer', domain: 'Top facts & infobox extraction', status: 'live', schedule: 'weekly Sun',     last: '2d ago',  runs7: 1,  errors7: 0, covered: '14 / 14' },
    { id: 'booking-prices',      vendor: 'booking',    kind: 'sync',     domain: 'Hotel rate cache',              status: 'live', schedule: 'hourly',           last: '12m ago', runs7: 168,errors7: 2, covered: '20 / 20' },
    { id: 'expedia-prices',      vendor: 'expedia',    kind: 'sync',     domain: 'Hotel rate cache',              status: 'live', schedule: 'hourly',           last: '24m ago', runs7: 168,errors7: 1, covered: '14 / 20' },
    { id: 'agoda-prices',        vendor: 'agoda',      kind: 'sync',     domain: 'Hotel rate cache',              status: 'warn', schedule: 'hourly',           last: '2h ago',  runs7: 142,errors7: 14,covered: '13 / 20' },
    { id: 'awin-deals',          vendor: 'awin',       kind: 'sync',     domain: 'Affiliate deal feed',           status: 'live', schedule: 'daily 02:00 UTC',  last: '14h ago', runs7: 7,  errors7: 0, covered: '6 / 20'  },
    { id: 'amazon-asin',         vendor: 'amazon',     kind: 'enricher', domain: 'Product CTA matcher',           status: 'live', schedule: 'weekly Wed',       last: '4d ago',  runs7: 1,  errors7: 0, covered: '7 destinations' },
    { id: 'image-cache',         vendor: 'wikipedia',  kind: 'sync',     domain: 'CDN warm + alt-text generator', status: 'live', schedule: 'on-publish',       last: '38m ago', runs7: 22, errors7: 0, covered: '212 images' },
  ],

  // Ideas / content backlog
  ideas: [
    { id: 'idea-2901', title: 'Promote Aït Benhaddou page to live',       dest: 'ait-benhaddou',  src: 'editor',     status: 'in-review', date: '2h ago',  priority: 'high' },
    { id: 'idea-2898', title: 'Refresh Marrakech hotel rates — Agoda lag', dest: 'marrakech',     src: 'auto-flag',  status: 'pending',   date: '4h ago',  priority: 'high' },
    { id: 'idea-2891', title: 'Add Erg Chebbi sights — dunes, kasbah',     dest: 'merzouga',      src: 'wikivoyage', status: 'queued',    date: '8h ago',  priority: 'med'  },
    { id: 'idea-2887', title: 'Best riads listicle (Amazon: travel guides)',dest: 'cross',        src: 'editor',     status: 'queued',    date: '1d ago',  priority: 'med'  },
    { id: 'idea-2882', title: 'Refresh top facts — Atlas Mountains',       dest: 'atlas-mountains', src: 'wikipedia',status: 'queued',    date: '1d ago',  priority: 'low'  },
    { id: 'idea-2876', title: 'Hotel hero images missing — Tetouan',       dest: 'tetouan',       src: 'auto-flag',  status: 'pending',   date: '2d ago',  priority: 'med'  },
    { id: 'idea-2868', title: 'Expand Chefchaouen photo essay',            dest: 'chefchaouen',   src: 'editor',     status: 'queued',    date: '3d ago',  priority: 'low'  },
  ],

  // Recent activity events
  activity: [
    { kind: 'publish',  text: 'Published <strong>Chefchaouen</strong> v0.6.1',                    time: '14m ago' },
    { kind: 'sync',     text: '<strong>booking-prices</strong> refreshed 47 Marrakech rates',     time: '18m ago' },
    { kind: 'click',    text: '<strong>+€42</strong> revenue · La Mamounia · Booking',            time: '24m ago' },
    { kind: 'flag',     text: '<strong>agoda-prices</strong> rate-limited on 7 calls',            time: '52m ago' },
    { kind: 'import',   text: 'Imported 3 facts for <strong>Fes</strong> from Wikipedia',         time: '1h ago' },
    { kind: 'publish',  text: 'Pushed <strong>Marrakech</strong> hero image v3',                  time: '2h ago' },
    { kind: 'click',    text: '<strong>+€18</strong> revenue · Riad Yasmine · Agoda',             time: '2h ago' },
    { kind: 'idea',     text: 'New idea queued — refresh Atlas Mountains facts',                  time: '3h ago' },
    { kind: 'import',   text: '<strong>wikivoyage-importer</strong> updated Essaouira sights',    time: '4h ago' },
  ],

  // Sources per destination (for Sources tab)
  sources: [
    { dest: 'marrakech', kind: 'wikivoyage', title: 'Marrakech',                  url: 'wikivoyage.org/wiki/Marrakech',         pulled: '6h ago', items: 18, status: 'fresh' },
    { dest: 'marrakech', kind: 'wikipedia',  title: 'Marrakesh',                  url: 'en.wikipedia.org/wiki/Marrakesh',       pulled: '2d ago', items: 24, status: 'fresh' },
    { dest: 'marrakech', kind: 'booking',    title: '47 hotels indexed',          url: 'booking.com/city/ma/marrakech',         pulled: '12m ago',items: 47, status: 'fresh' },
    { dest: 'marrakech', kind: 'expedia',    title: '38 hotels indexed',          url: 'expedia.com/Marrakech-Hotels',          pulled: '24m ago',items: 38, status: 'fresh' },
    { dest: 'marrakech', kind: 'agoda',      title: '31 hotels indexed',          url: 'agoda.com/city/marrakech-ma.html',      pulled: '2h ago', items: 31, status: 'stale' },
    { dest: 'marrakech', kind: 'awin',       title: 'Awin affiliate program',     url: 'awin.com/merchant/booking',             pulled: '14h ago',items: 6,  status: 'fresh' },
    { dest: 'marrakech', kind: 'amazon',     title: '2 ASINs linked',             url: 'amazon.com/associates',                 pulled: '4d ago', items: 2,  status: 'fresh' },
  ],
};

// Helper
window.MTD.findRegion = (id) => window.MTD.regions.find(r => r.id === id);
window.MTD.findDest   = (id) => window.MTD.destinations.find(d => d.id === id);
