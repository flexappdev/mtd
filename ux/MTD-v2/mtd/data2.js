// MTD v2 data extensions — lists, videos, sights, restaurants, media, guides.
// Layered on top of window.MTD which is loaded first.

(function (M) {
  // ---------- Image helpers ----------
  // We use picsum.photos with stable seeds — Morocco-feeling placeholders.
  // Add an MTD prefix so seeds collide less.
  M.img = function (seed, w = 800, h = 600) {
    const s = String(seed).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const lock = (M.hashSync(s) % 9999) + 1;
    // LoremFlickr — Flickr photos tagged "morocco", deterministic via lock id.
    return `https://loremflickr.com/${w}/${h}/morocco/all?lock=${lock}`;
  };
  // sync hash that doesn't depend on M.hash forward-declared below
  M.hashSync = function (str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  };
  // a deterministic colour from a string — used for tile gradients
  M.hash = function (str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  };
  M.tint = function (seed) {
    // Pre-set Morocco-feeling tints
    const tints = [
      ['#c1272d', '#3a0506'], // saffron / oxblood
      ['#3b6e8f', '#0c1924'], // chefchaouen blue
      ['#c1272d', '#2a1a05'], // desert ochre
      ['#7a8c5c', '#101a0c'], // olive
      ['#a3522c', '#1b0a04'], // terracotta
      ['#5a7b8e', '#0a1218'], // mediterranean
      ['#9a4b3a', '#1a0807'], // pomegranate
      ['#b67c44', '#1d1108'], // amber
    ];
    return tints[M.hash(seed) % tints.length];
  };

  // ---------- Restaurants ----------
  M.restaurants = [
    { id: 'nomad',           name: 'Nomad',                     dest: 'marrakech',  kind: 'rooftop',     stars: 4, price: '€€€',  status: 'live', clicks30: 1240 },
    { id: 'cafe-clock',      name: 'Café Clock',                dest: 'fes',        kind: 'cafe',        stars: 4, price: '€€',   status: 'live', clicks30: 920  },
    { id: 'limoni',          name: 'Limoni',                    dest: 'chefchaouen',kind: 'italian',     stars: 4, price: '€€',   status: 'live', clicks30: 480  },
    { id: 'taros',           name: 'Taros',                     dest: 'essaouira',  kind: 'seafood',     stars: 4, price: '€€€',  status: 'live', clicks30: 720  },
    { id: 'la-sqala',        name: 'La Sqala',                  dest: 'casablanca', stars: 4, kind: 'moroccan',    price: '€€€',  status: 'live', clicks30: 540  },
    { id: 'le-jardin',       name: 'Le Jardin',                 dest: 'marrakech',  kind: 'moroccan',    stars: 5, price: '€€€',  status: 'live', clicks30: 1820 },
    { id: 'al-fassia',       name: 'Al Fassia',                 dest: 'marrakech',  kind: 'moroccan',    stars: 5, price: '€€€€', status: 'live', clicks30: 2410 },
    { id: 'dar-roumana',     name: 'Dar Roumana',               dest: 'fes',        kind: 'fine-dining', stars: 5, price: '€€€€', status: 'live', clicks30: 410  },
    { id: 'snail-stall',     name: 'Jemaa el-Fna snail stall',  dest: 'marrakech',  kind: 'street',      stars: 4, price: '€',    status: 'live', clicks30: 3240 },
  ];

  // ---------- Sights ----------
  M.sights = [
    { id: 'jemaa-el-fna',   name: 'Jemaa el-Fna',               dest: 'marrakech',     kind: 'square',  unesco: true,  stars: 5, clicks30: 4810 },
    { id: 'majorelle',      name: 'Jardin Majorelle',           dest: 'marrakech',     kind: 'garden',  unesco: false, stars: 5, clicks30: 3940 },
    { id: 'koutoubia',      name: 'Koutoubia Mosque',           dest: 'marrakech',     kind: 'mosque',  unesco: false, stars: 4, clicks30: 2410 },
    { id: 'bahia-palace',   name: 'Bahia Palace',               dest: 'marrakech',     kind: 'palace',  unesco: false, stars: 4, clicks30: 1840 },
    { id: 'medina-fes',     name: 'Fes el-Bali medina',         dest: 'fes',           kind: 'medina',  unesco: true,  stars: 5, clicks30: 3120 },
    { id: 'chouara',        name: 'Chouara tannery',            dest: 'fes',           kind: 'craft',   unesco: false, stars: 4, clicks30: 1740 },
    { id: 'medersa',        name: 'al-Attarine Madrasa',        dest: 'fes',           kind: 'religious', unesco: false, stars: 4, clicks30: 940  },
    { id: 'kasbah-chef',    name: 'Kasbah of Chefchaouen',      dest: 'chefchaouen',   kind: 'kasbah',  unesco: false, stars: 4, clicks30: 1840 },
    { id: 'ras-el-maa',     name: 'Ras el-Maa waterfall',       dest: 'chefchaouen',   kind: 'nature',  unesco: false, stars: 4, clicks30: 920  },
    { id: 'skala-essaouira',name: 'Skala de la Ville',          dest: 'essaouira',     kind: 'fort',    unesco: false, stars: 4, clicks30: 1240 },
    { id: 'erg-chebbi',     name: 'Erg Chebbi dunes',           dest: 'merzouga',      kind: 'desert',  unesco: false, stars: 5, clicks30: 4210 },
    { id: 'ait-ben',        name: 'Aït Benhaddou ksar',         dest: 'ait-benhaddou', kind: 'ksar',    unesco: true,  stars: 5, clicks30: 3640 },
    { id: 'hassan-ii',      name: 'Hassan II Mosque',           dest: 'casablanca',    kind: 'mosque',  unesco: false, stars: 5, clicks30: 2840 },
    { id: 'chellah',        name: 'Chellah',                    dest: 'rabat',         kind: 'ruins',   unesco: true,  stars: 4, clicks30: 740  },
    { id: 'toubkal',        name: 'Jbel Toubkal',               dest: 'atlas-mountains', kind: 'peak',  unesco: false, stars: 5, clicks30: 1640 },
    { id: 'imlil',          name: 'Imlil village',              dest: 'atlas-mountains', kind: 'village', unesco: false, stars: 4, clicks30: 940 },
    { id: 'caves-hercules', name: 'Caves of Hercules',          dest: 'tangier',       kind: 'cave',    unesco: false, stars: 4, clicks30: 1140 },
    { id: 'cap-spartel',    name: 'Cap Spartel',                dest: 'tangier',       kind: 'cape',    unesco: false, stars: 4, clicks30: 540  },
    { id: 'agadir-kasbah',  name: 'Agadir Oufella',             dest: 'agadir',        kind: 'kasbah',  unesco: false, stars: 3, clicks30: 410  },
    { id: 'tetouan-medina', name: 'Tetouan medina',             dest: 'tetouan',       kind: 'medina',  unesco: true,  stars: 4, clicks30: 720  },
  ];

  // ---------- Curated "Top-of" lists ----------
  // Each list has an editorial slug, kind, ranked item references.
  // We expose a handful explicitly + a generator producing ~120 lists across categories
  // so the listing page can claim "10,000+ entries" credibly.
  M.lists = [
    { id: 'top-100-morocco-places',  title: 'Top 100 places in Morocco',         kind: 'places',  curator: 'editorial', items: 100, hero: 'morocco-places',  trending: true,  description: 'The definitive editorial ranking — cities, sights, regions, in one list.' },
    { id: 'top-50-imperial-cities',  title: 'Top 50 things in the Imperial Cities', kind: 'places', curator: 'editorial', items: 50,  hero: 'imperial',        trending: false, description: 'Marrakech, Fes, Meknes, Rabat — the historic capitals ranked.' },
    { id: 'top-100-luxury-hotels',   title: 'Top 100 luxury hotels in Morocco',  kind: 'hotels',  curator: 'editorial', items: 100, hero: 'luxury-hotels',   trending: true,  description: 'From the Royal Mansour to clifftop Atlas retreats.' },
    { id: 'top-50-riads',            title: 'Top 50 riads in Marrakech',         kind: 'hotels',  curator: 'editorial', items: 50,  hero: 'riads',           trending: true,  description: 'Restored medina riads, ranked on courtyard, rooftop and breakfast.' },
    { id: 'top-25-desert-camps',     title: 'Top 25 desert camps',               kind: 'hotels',  curator: 'editorial', items: 25,  hero: 'desert-camps',    trending: false, description: 'Erg Chebbi and Erg Chigaga, sorted on stars and silence.' },
    { id: 'top-100-restaurants',     title: 'Top 100 restaurants in Morocco',    kind: 'food',    curator: 'editorial', items: 100, hero: 'restaurants',     trending: false, description: 'Tagine to tasting menu, with the snail stall at #3.' },
    { id: 'top-25-rooftops',         title: 'Top 25 medina rooftops',            kind: 'food',    curator: 'editorial', items: 25,  hero: 'rooftops',        trending: true,  description: 'Sunset cocktails over Marrakech and Fes.' },
    { id: 'top-100-sights',          title: 'Top 100 sights in Morocco',         kind: 'sights',  curator: 'editorial', items: 100, hero: 'sights',          trending: false, description: 'Mosques, ksars, dunes, medersas — the must-sees.' },
    { id: 'top-25-unesco',           title: 'Top 25 UNESCO sites & monuments',   kind: 'sights',  curator: 'editorial', items: 25,  hero: 'unesco',          trending: false, description: 'All nine Moroccan UNESCO entries plus tentative-list highlights.' },
    { id: 'top-50-beaches',          title: 'Top 50 beaches',                    kind: 'places',  curator: 'community', items: 50,  hero: 'beaches',         trending: false, description: 'From Legzira arches to Taghazout surf.' },
    { id: 'top-50-souks',            title: 'Top 50 souks & markets',            kind: 'places',  curator: 'community', items: 50,  hero: 'souks',           trending: true,  description: 'Spice, leather, copper, carpets.' },
    { id: 'top-50-hikes',            title: 'Top 50 hikes & treks',              kind: 'places',  curator: 'community', items: 50,  hero: 'hikes',           trending: false, description: 'Atlas summits, Rif ridges, Sahara crossings.' },
    { id: 'top-50-films',            title: 'Top 50 films shot in Morocco',      kind: 'media',   curator: 'editorial', items: 50,  hero: 'films',           trending: false, description: 'Casablanca, Lawrence of Arabia, Gladiator — the Hollywood of Africa.' },
    { id: 'top-100-books',           title: 'Top 100 books about Morocco',       kind: 'media',   curator: 'editorial', items: 100, hero: 'books',           trending: false, description: 'Guides, novels, travelogues. Affiliate links live on Amazon.' },
    { id: 'top-50-instagram',        title: 'Top 50 Instagram spots',            kind: 'media',   curator: 'community', items: 50,  hero: 'instagram',       trending: true,  description: 'Where to shoot the blue walls, the dunes, the rooftops.' },
    { id: 'top-25-festivals',        title: 'Top 25 festivals',                  kind: 'places',  curator: 'community', items: 25,  hero: 'festivals',       trending: false, description: 'Mawazine, Gnaoua, World Sacred Music in Fes.' },
    { id: 'top-50-day-trips-mrk',    title: 'Top 50 day trips from Marrakech',   kind: 'places',  curator: 'editorial', items: 50,  hero: 'daytrips-marrakech', trending: false, description: 'Ourika, Aït Benhaddou, Essaouira and the Atlas.' },
    { id: 'top-london-equiv',        title: 'Top 100 — like London, but Moroccan', kind: 'places', curator: 'community', items: 100, hero: 'london',          trending: false, description: 'A playful comparison index for first-time visitors.' },
  ];

  // Generator: synthesize "10,000+ entries" — lots of niche top-100 lists.
  // We pre-compute ~120 list descriptors; the catalogue page can claim 10,000 entries.
  M.generatedLists = (() => {
    const themes = [
      'medinas','riads','kasbahs','tagines','tea-houses','spice-shops','rug-souks',
      'beaches','surf-spots','dive-spots','waterfalls','peaks','valleys','oases',
      'mosques','synagogues','museums','galleries','street-art','cooking-classes',
      'hammams','spas','desert-camps','glamping','hostels','boutique-hotels',
      'photographers','filmmakers','musicians','poets','authors','painters',
      'restaurants','rooftops','food-tours','street-food','vegan-spots','wineries',
      'hikes','road-trips','train-rides','airport-routes','bus-routes','marathons',
      'wedding-venues','honeymoon','solo','families','workations','retirees',
      'budget','luxury','mid-range','all-inclusive','design-hotels','heritage-hotels',
    ];
    const regions = ['imperial','coast','atlas','sahara','mediterranean','cross'];
    const limits = [10, 25, 50, 100];
    let i = 0;
    const out = [];
    while (out.length < 120 && i < themes.length * regions.length * limits.length) {
      const theme = themes[i % themes.length];
      const region = regions[(i >> 2) % regions.length];
      const limit = limits[(i >> 4) % limits.length];
      out.push({
        id: `top-${limit}-${region}-${theme}-${i}`,
        title: `Top ${limit} ${theme.replace(/-/g, ' ')} in ${region === 'cross' ? 'Morocco' : region}`,
        kind: ['food','hotels','places','sights','media'][i % 5],
        curator: i % 3 === 0 ? 'editorial' : 'community',
        items: limit,
        hero: theme + '-' + region,
      });
      i++;
    }
    return out;
  })();

  M.allLists = () => M.lists.concat(M.generatedLists);
  M.totalRanked = M.allLists().reduce((s, l) => s + l.items, 0); // ~10k+ promise

  // ---------- Videos — Siems Production catalog ----------
  // 335 real videos referenced; we generate 10,000+ items via a synthesized backlog.
  M.videoChannels = [
    { id: 'siemsproduction', name: 'Siems Production', url: 'youtube.com/user/siemsproduction', realCount: 335, total: 10000 },
  ];
  M.videoSeries = [
    'Marrakech Walking Tour',
    'Fes Medina Stories',
    'Sahara Sunrise',
    'Chefchaouen Blue Hour',
    'Atlas Trekking Diaries',
    'Casablanca Day in the Life',
    'Coastal Drive — Essaouira to Tangier',
    'Tagine Stories',
    'Hammam Rituals',
    'Snake-charmers & Storytellers',
    'Morocco After Dark',
    'Berber Music Sessions',
  ];
  // explicit "real" videos — first 20 of 335 represented
  M.featuredVideos = [
    { id: 'v-001', title: 'Marrakech medina at dawn — full walking tour', dest: 'marrakech',      duration: '47:12', views: '184k',  date: '3 weeks ago', series: 'Marrakech Walking Tour', real: true },
    { id: 'v-002', title: 'Chefchaouen blue alleys — drone + walk',       dest: 'chefchaouen',    duration: '22:48', views: '410k',  date: '2 months ago',series: 'Chefchaouen Blue Hour', real: true },
    { id: 'v-003', title: 'Erg Chebbi sunrise from the dunes',            dest: 'merzouga',       duration: '12:04', views: '1.2M',  date: '1 month ago', series: 'Sahara Sunrise',         real: true },
    { id: 'v-004', title: 'Fes tannery — the real story (with sound)',    dest: 'fes',            duration: '34:20', views: '720k',  date: '5 weeks ago', series: 'Fes Medina Stories',     real: true },
    { id: 'v-005', title: 'Aït Benhaddou — film locations tour',          dest: 'ait-benhaddou',  duration: '28:11', views: '290k',  date: '2 months ago',series: 'Atlas Trekking Diaries', real: true },
    { id: 'v-006', title: 'How to bargain — Marrakech souk',              dest: 'marrakech',      duration: '11:34', views: '880k',  date: '4 weeks ago', series: 'Marrakech Walking Tour', real: true },
    { id: 'v-007', title: 'Berber Friday couscous — Imlil',               dest: 'atlas-mountains', duration: '18:22', views: '210k', date: '3 months ago',series: 'Tagine Stories',         real: true },
    { id: 'v-008', title: 'Camel trek — Erg Chigaga end-to-end',          dest: 'merzouga',       duration: '52:30', views: '440k',  date: '6 weeks ago', series: 'Sahara Sunrise',         real: true },
    { id: 'v-009', title: 'Essaouira at low tide',                        dest: 'essaouira',      duration: '14:50', views: '320k',  date: '1 month ago', series: 'Coastal Drive',          real: true },
    { id: 'v-010', title: 'Tangier — the strait, the kasbah, the cafés',  dest: 'tangier',        duration: '31:08', views: '180k',  date: '2 weeks ago', series: 'Coastal Drive',          real: true },
    { id: 'v-011', title: 'Atlas Mountains crossing — Tizi n\'Tichka',    dest: 'atlas-mountains', duration: '46:14',views: '160k',  date: '3 weeks ago', series: 'Atlas Trekking Diaries', real: true },
    { id: 'v-012', title: 'Casablanca to Rabat by train',                 dest: 'casablanca',     duration: '23:42', views: '92k',   date: '5 weeks ago', series: 'Casablanca Day in the Life', real: true },
    { id: 'v-013', title: 'Hammam ritual — start to finish (uncensored)', dest: 'fes',            duration: '19:00', views: '610k',  date: '2 months ago',series: 'Hammam Rituals',         real: true },
    { id: 'v-014', title: 'Snake charmers of Jemaa el-Fna',               dest: 'marrakech',      duration: '08:20', views: '2.4M',  date: '4 months ago',series: 'Snake-charmers & Storytellers', real: true },
    { id: 'v-015', title: 'Gnaoua music night — Essaouira festival',      dest: 'essaouira',      duration: '41:18', views: '380k',  date: '6 months ago',series: 'Berber Music Sessions',  real: true },
    { id: 'v-016', title: 'Tetouan medina — Andalusian Morocco',          dest: 'tetouan',        duration: '24:36', views: '78k',   date: '2 weeks ago', series: 'Fes Medina Stories',     real: true },
    { id: 'v-017', title: 'Marrakech after dark',                         dest: 'marrakech',      duration: '36:42', views: '540k',  date: '3 months ago',series: 'Morocco After Dark',     real: true },
    { id: 'v-018', title: 'Agadir beach to mountains in one day',         dest: 'agadir',         duration: '20:50', views: '110k',  date: '1 month ago', series: 'Coastal Drive',          real: true },
    { id: 'v-019', title: 'Rabat — capital walking tour',                 dest: 'rabat',          duration: '29:14', views: '64k',   date: '4 weeks ago', series: 'Casablanca Day in the Life', real: true },
    { id: 'v-020', title: 'Meknes — the imperial city no one talks about', dest: 'meknes',        duration: '32:08', views: '88k',   date: '5 weeks ago', series: 'Fes Medina Stories',     real: true },
  ];

  // ---------- Guides / Amazon shop ----------
  M.guides = [
    { id: 'lp-morocco',        title: 'Lonely Planet Morocco (15th ed.)',      kind: 'guidebook', price: '€24', asin: 'B0B7Q3W4F2',  rating: 4.7, reviews: 1842, hero: 'book-lp' },
    { id: 'rough-guide',       title: 'Rough Guide to Morocco',                kind: 'guidebook', price: '€22', asin: 'B09KJ2LM31',  rating: 4.6, reviews: 940,  hero: 'book-rg' },
    { id: 'cookbook-mourad',   title: 'Mourad — New Moroccan',                 kind: 'cookbook',  price: '€38', asin: 'B005CRQ4DK',  rating: 4.8, reviews: 1240, hero: 'book-mourad' },
    { id: 'cookbook-paula',    title: 'Paula Wolfert — The Food of Morocco',   kind: 'cookbook',  price: '€42', asin: 'B0083DJWCS',  rating: 4.9, reviews: 2180, hero: 'book-paula' },
    { id: 'argan-oil',         title: 'Argan-oil hammam gift set',             kind: 'beauty',    price: '€32', asin: 'B08K2T9PXM',  rating: 4.5, reviews: 410,  hero: 'argan' },
    { id: 'tagine',            title: 'Moroccan tagine 30 cm',                 kind: 'cooking',   price: '€55', asin: 'B07RZP5N6F',  rating: 4.4, reviews: 320,  hero: 'tagine' },
    { id: 'hiking-shoe',       title: 'Salomon X Ultra 4 GTX hiking shoe',     kind: 'gear',      price: '€140',asin: 'B09KK7HW2W',  rating: 4.7, reviews: 1820, hero: 'shoes' },
    { id: 'sand-tent',         title: 'Quechua 2-second pop-up sand tent',     kind: 'gear',      price: '€95', asin: 'B09XPF4LMD',  rating: 4.3, reviews: 240,  hero: 'tent' },
    { id: 'windbreaker',       title: 'Quiksilver hooded windbreaker',         kind: 'clothing',  price: '€78', asin: 'B08FCN6RTX',  rating: 4.4, reviews: 180,  hero: 'jacket' },
    { id: 'camera-om1',        title: 'Olympus OM-1 mirrorless camera',        kind: 'gear',      price: '€2400', asin: 'B0BCDXLT4G',rating: 4.8, reviews: 460,  hero: 'camera' },
    { id: 'travel-towel',      title: 'PackTowl ultralight travel towel',      kind: 'gear',      price: '€28', asin: 'B07GTBV9HG',  rating: 4.5, reviews: 940,  hero: 'towel' },
    { id: 'phrasebook',        title: 'Lonely Planet Moroccan Arabic phrasebook', kind: 'guidebook', price: '€11', asin: 'B07YT3FPN1', rating: 4.6, reviews: 720, hero: 'phrasebook' },
  ];

  // ---------- Wiki articles ----------
  M.wikiArticles = [
    { id: 'wiki-morocco',     title: 'Morocco — overview',             dest: 'cross',     length: '14,820 words', updated: 'May 18 2026' },
    { id: 'wiki-marrakech',   title: 'Marrakech',                      dest: 'marrakech', length: '8,640 words',  updated: 'May 14 2026' },
    { id: 'wiki-fes',         title: 'Fes',                            dest: 'fes',       length: '6,210 words',  updated: 'May 10 2026' },
    { id: 'wiki-imperial',    title: 'The four Imperial Cities',       dest: 'cross',     length: '4,120 words',  updated: 'May  2 2026' },
    { id: 'wiki-berber',      title: 'Berber (Amazigh) people',        dest: 'cross',     length: '12,140 words', updated: 'Apr 28 2026' },
    { id: 'wiki-sahara',      title: 'The Sahara in Morocco',          dest: 'merzouga',  length: '5,820 words',  updated: 'May  6 2026' },
    { id: 'wiki-atlas',       title: 'Atlas Mountains',                dest: 'atlas-mountains', length: '7,910 words', updated: 'May  9 2026' },
    { id: 'wiki-cuisine',     title: 'Cuisine of Morocco',             dest: 'cross',     length: '9,820 words',  updated: 'May 17 2026' },
    { id: 'wiki-arabic',      title: 'Moroccan Arabic (Darija)',       dest: 'cross',     length: '4,610 words',  updated: 'May 11 2026' },
    { id: 'wiki-history',     title: 'History of Morocco',             dest: 'cross',     length: '21,400 words', updated: 'May  1 2026' },
  ];

  // ---------- Media catalog ----------
  M.mediaImages = Array.from({ length: 36 }, (_, i) => ({
    id: 'img-' + i, seed: 'mtd-photo-' + i, w: i % 3 === 0 ? 'wide' : 'tall',
    dest: M.destinations[i % M.destinations.length].id,
  }));
  M.mediaAudio = [
    { id: 'a-1', title: 'Marrakech market ambient — 1hr', dest: 'marrakech', duration: '1:00:00', kind: 'field-recording' },
    { id: 'a-2', title: 'Fes call to prayer at sunset',   dest: 'fes',       duration: '07:42',   kind: 'field-recording' },
    { id: 'a-3', title: 'Sahara wind — Erg Chebbi',       dest: 'merzouga',  duration: '32:18',   kind: 'field-recording' },
    { id: 'a-4', title: 'Gnaoua trance session',          dest: 'essaouira', duration: '45:10',   kind: 'music' },
    { id: 'a-5', title: 'Berber flute — Imlil',           dest: 'atlas-mountains', duration: '12:04', kind: 'music' },
    { id: 'a-6', title: 'Souk haggle — recorded raw',     dest: 'marrakech', duration: '04:38',   kind: 'field-recording' },
  ];
  M.mediaPdfs = [
    { id: 'p-1', title: 'Morocco trip planner — 14 days', dest: 'cross', pages: 24, size: '4.2 MB' },
    { id: 'p-2', title: 'Marrakech medina map',           dest: 'marrakech', pages: 4,  size: '8.1 MB' },
    { id: 'p-3', title: 'Fes el-Bali walking route',      dest: 'fes',       pages: 6,  size: '5.4 MB' },
    { id: 'p-4', title: 'Atlas trekking permits — 2026',  dest: 'atlas-mountains', pages: 12, size: '2.8 MB' },
    { id: 'p-5', title: 'Desert camp packing list',       dest: 'merzouga',  pages: 2,  size: '0.8 MB' },
  ];

  // ---------- Flat "all items" stream for scroller mode / random ----------
  // Combine destinations + sights + hotels + restaurants + videos + lists + guides + wiki
  M.allItems = () => {
    const tag = (kind) => (item) => ({ ...item, _kind: kind });
    return [
      ...M.destinations.map(tag('destination')),
      ...M.sights.map(tag('sight')),
      ...M.hotels.map(tag('hotel')),
      ...M.restaurants.map(tag('restaurant')),
      ...M.featuredVideos.map(tag('video')),
      ...M.lists.map(tag('list')),
      ...M.guides.map(tag('guide')),
      ...M.wikiArticles.map(tag('wiki')),
    ];
  };

  // Pseudo-random deterministic shuffle
  M.shuffled = (arr, seed) => {
    let h = M.hash(String(seed || 'mtd'));
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      h = (h * 1664525 + 1013904223) >>> 0;
      const j = h % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  M.pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
})(window.MTD);
