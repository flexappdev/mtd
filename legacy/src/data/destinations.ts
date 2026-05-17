import { Destination } from '@/types/destination';
import marrakechHero from '@/assets/marrakech-hero.jpg';
import chefchaouenHero from '@/assets/chefchaouen-hero.jpg';
import saharaHero from '@/assets/sahara-hero.jpg';
import essaouiraHero from '@/assets/essaouira-hero.jpg';
import fesHero from '@/assets/fes-hero.jpg';

export const destinations: Destination[] = [
  {
    id: '1',
    title: 'Marrakech',
    tagline: 'The Red City of Wonder',
    description: 'Experience the vibrant souks, stunning palaces, and magical atmosphere of Morocco\'s most famous imperial city.',
    type: 'city',
    category: ['cultural', 'shopping', 'historical'],
    tags: ['medina', 'souks', 'palaces', 'gardens', 'UNESCO'],
    images: [
      marrakechHero,
      marrakechHero,
      marrakechHero
    ],
    video: '/videos/marrakech.mp4',
    cta: {
      text: 'Explore Marrakech',
      link: '#marrakech'
    },
    aiContent: {
      overview: 'Marrakech, known as the "Red City" due to its distinctive red sandstone buildings, is a former imperial city and one of Morocco\'s major economic centers. Founded in 1062, it remains a symbol of Morocco\'s rich history.',
      history: 'Founded by the Almoravid dynasty, Marrakech served as the capital of the Almoravid and Almohad Caliphates. The city\'s iconic Koutoubia Mosque dates back to the 12th century.',
      culture: 'A melting pot of Berber, Arab, and French influences, Marrakech is famous for its bustling Jemaa el-Fnaa square, where snake charmers, musicians, and storytellers create an unforgettable atmosphere.',
      attractions: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Bahia Palace', 'Koutoubia Mosque', 'Saadian Tombs'],
      bestTimeToVisit: 'March to May and September to November',
      tips: ['Bargain in the souks', 'Stay in a traditional riad', 'Try street food at Jemaa el-Fnaa', 'Book desert tours in advance']
    },
    stats: {
      visitors: '3M+ yearly',
      rating: 4.8,
      temperature: '20-35°C'
    },
    quote: {
      text: 'Marrakech is a city that awakens all your senses.',
      author: 'Yves Saint Laurent'
    }
  },
  {
    id: '2',
    title: 'Chefchaouen',
    tagline: 'The Blue Pearl of Morocco',
    description: 'Discover the enchanting blue-washed mountain town nestled in the Rif Mountains.',
    type: 'mountain',
    category: ['cultural', 'photography', 'relaxation'],
    tags: ['blue city', 'mountains', 'photography', 'artisan', 'hiking'],
    images: [
      chefchaouenHero,
      chefchaouenHero,
      chefchaouenHero
    ],
    video: '/videos/chefchaouen.mp4',
    cta: {
      text: 'Visit Chefchaouen',
      link: '#chefchaouen'
    },
    aiContent: {
      overview: 'Chefchaouen, painted in brilliant shades of blue, is a small city in northwest Morocco famous for its striking blue-washed buildings and laid-back atmosphere.',
      history: 'Founded in 1471 as a fortress to fight Portuguese invasions, the city became a refuge for Jews and Muslims fleeing the Spanish Reconquista.',
      culture: 'The blue tradition is said to have been introduced by Jewish refugees. Today, it\'s a haven for artists and photographers from around the world.',
      attractions: ['Blue Medina', 'Ras El Maa Waterfall', 'Spanish Mosque', 'Kasbah Museum', 'Talassemtane National Park'],
      bestTimeToVisit: 'April to June and September to November',
      tips: ['Wake early for photos without crowds', 'Hike to the Spanish Mosque for sunset', 'Try local goat cheese', 'Explore nearby cannabis fields (legally)']
    },
    stats: {
      visitors: '500K+ yearly',
      rating: 4.9,
      temperature: '15-28°C'
    },
    quote: {
      text: 'In Chefchaouen, even the shadows are blue.',
      author: 'Local Proverb'
    }
  },
  {
    id: '3',
    title: 'Sahara Desert',
    tagline: 'Where Sand Meets Stars',
    description: 'Experience the magic of the world\'s largest hot desert with camel treks and nights under the stars.',
    type: 'desert',
    category: ['adventure', 'nature', 'camping'],
    tags: ['desert', 'camels', 'dunes', 'stars', 'berber'],
    images: [
      saharaHero,
      saharaHero,
      saharaHero
    ],
    video: '/videos/sahara.mp4',
    cta: {
      text: 'Book Desert Tour',
      link: '#sahara'
    },
    aiContent: {
      overview: 'The Moroccan Sahara offers an otherworldly experience with its endless golden dunes, traditional Berber camps, and some of the clearest night skies on Earth.',
      history: 'For millennia, the Sahara has been home to nomadic Berber tribes who have mastered life in this harsh but beautiful environment.',
      culture: 'Experience authentic Berber hospitality, traditional music around campfires, and ancient desert survival techniques passed down through generations.',
      attractions: ['Erg Chebbi Dunes', 'Erg Chigaga', 'Merzouga', 'Zagora', 'M\'hamid El Ghizlane'],
      bestTimeToVisit: 'October to April',
      tips: ['Book multi-day tours for full experience', 'Bring warm clothes for cold nights', 'Try sandboarding', 'Wake early for sunrise over dunes']
    },
    stats: {
      visitors: '1M+ yearly',
      rating: 4.9,
      temperature: '5-45°C'
    },
    quote: {
      text: 'The desert, when the sun comes up. I couldn\'t tell where heaven stopped and the Earth began.',
      author: 'Tom Hanks'
    }
  },
  {
    id: '4',
    title: 'Essaouira',
    tagline: 'Where Atlantic Winds Dance',
    description: 'A charming coastal fortress town known for its beaches, seafood, and artistic soul.',
    type: 'beach',
    category: ['beach', 'cultural', 'watersports'],
    tags: ['beach', 'windsurfing', 'seafood', 'medina', 'art'],
    images: [
      essaouiraHero,
      essaouiraHero,
      essaouiraHero
    ],
    video: '/videos/essaouira.mp4',
    cta: {
      text: 'Discover Essaouira',
      link: '#essaouira'
    },
    aiContent: {
      overview: 'Essaouira, formerly known as Mogador, is a port city on Morocco\'s Atlantic coast famous for its fortified medina, fresh seafood, and world-class windsurfing.',
      history: 'The current city was built in the 18th century by Sultan Mohammed ben Abdallah, who hired French architect Théodore Cornut to design the fortress and city.',
      culture: 'A bohemian atmosphere attracts artists and musicians. The annual Gnaoua World Music Festival celebrates African, Berber, and Arabic musical traditions.',
      attractions: ['Skala de la Ville', 'Essaouira Beach', 'Port and Fish Market', 'Sidi Mohammed Ben Abdallah Museum', 'Diabat Village'],
      bestTimeToVisit: 'April to November',
      tips: ['Try grilled sardines at the port', 'Visit during Gnaoua Festival', 'Take kitesurfing lessons', 'Explore the Jewish Quarter']
    },
    stats: {
      visitors: '800K+ yearly',
      rating: 4.7,
      temperature: '15-25°C'
    },
    quote: {
      text: 'Essaouira is not just a place, it\'s a state of mind.',
      author: 'Jimi Hendrix'
    }
  },
  {
    id: '5',
    title: 'Fes',
    tagline: 'Morocco\'s Spiritual Heart',
    description: 'Step back in time in the world\'s largest car-free urban area and Morocco\'s cultural capital.',
    type: 'historical',
    category: ['historical', 'cultural', 'crafts'],
    tags: ['medina', 'tanneries', 'university', 'crafts', 'UNESCO'],
    images: [
      fesHero,
      fesHero,
      fesHero
    ],
    video: '/videos/fes.mp4',
    cta: {
      text: 'Explore Fes',
      link: '#fes'
    },
    aiContent: {
      overview: 'Fes is Morocco\'s oldest imperial city, home to the world\'s oldest university and largest medieval medina, where time seems to have stopped centuries ago.',
      history: 'Founded in 789 AD by Idris I, Fes became a center of learning and culture. The University of Al-Qarawiyyin, founded in 859, is recognized as the oldest existing university.',
      culture: 'The medina is a living museum where traditional crafts like leather tanning, metalwork, and ceramics continue using centuries-old techniques.',
      attractions: ['Fes el-Bali Medina', 'Al-Qarawiyyin University', 'Chouara Tannery', 'Bou Inania Madrasa', 'Royal Palace'],
      bestTimeToVisit: 'March to May and September to November',
      tips: ['Hire a guide for the medina', 'Visit tanneries in morning', 'Try traditional pastilla', 'Shop for leather goods']
    },
    stats: {
      visitors: '2M+ yearly',
      rating: 4.6,
      temperature: '10-35°C'
    },
    quote: {
      text: 'Fes is to Morocco what Rome is to Italy.',
      author: 'Paul Bowles'
    }
  }
];