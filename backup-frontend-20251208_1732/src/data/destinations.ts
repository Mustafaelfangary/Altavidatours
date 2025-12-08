export interface Destination {
  id: string;
  name: string;
  region: 'Upper Egypt' | 'Lower Egypt' | 'Red Sea' | 'Sinai' | 'Western Desert';
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  image: string;
  gallery: string[];
  attractions: {
    id: string;
    name: string;
    type: 'temple' | 'monument' | 'museum' | 'natural' | 'cultural';
    description: string;
    image: string;
  }[];
  climate: {
    temperature: string;
    weather: string;
  };
  howToGetThere: string;
}

export const destinations: Destination[] = [
  {
    id: 'cairo',
    name: 'Cairo',
    region: 'Lower Egypt',
    description: 'The capital of Egypt and the largest city in the Arab world, Cairo is a fascinating blend of ancient and modern. Home to the famous Pyramids of Giza and countless Islamic monuments.',
    highlights: [
      'Great Pyramids of Giza',
      'Egyptian Museum',
      'Khan El Khalili Bazaar',
      'Citadel of Saladin',
      'Coptic Cairo',
      'Islamic Cairo'
    ],
    bestTimeToVisit: 'October to April',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8568.jpg',
      '/images/Royal Cleopatra/DSC_8534.jpg'
    ],
    attractions: [
      {
        id: 'pyramids-giza',
        name: 'Great Pyramids of Giza',
        type: 'monument',
        description: 'The last remaining wonder of the ancient world, these magnificent pyramids have stood for over 4,500 years.',
        image: '/images/Royal Cleopatra/DSC_8568.jpg'
      },
      {
        id: 'egyptian-museum',
        name: 'Egyptian Museum',
        type: 'museum',
        description: 'Houses the world\'s most extensive collection of ancient Egyptian artifacts, including treasures from Tutankhamun\'s tomb.',
        image: '/images/Royal Cleopatra/DSC_8559.jpg'
      },
      {
        id: 'khan-el-khalili',
        name: 'Khan El Khalili Bazaar',
        type: 'cultural',
        description: 'A historic bazaar dating back to the 14th century, perfect for shopping for souvenirs and experiencing local culture.',
        image: '/images/Royal Cleopatra/DSC_8596.jpg'
      }
    ],
    climate: {
      temperature: '15-30°C (59-86°F)',
      weather: 'Hot desert climate with mild winters'
    },
    howToGetThere: 'Cairo International Airport with connections worldwide'
  },
  {
    id: 'luxor',
    name: 'Luxor',
    region: 'Upper Egypt',
    description: 'Known as the world\'s greatest open-air museum, Luxor was the ancient city of Thebes and capital of the New Kingdom. It\'s home to magnificent temples and royal tombs.',
    highlights: [
      'Valley of the Kings',
      'Karnak Temple Complex',
      'Luxor Temple',
      'Valley of the Queens',
      'Deir el-Bahari',
      'Colossi of Memnon'
    ],
    bestTimeToVisit: 'October to April',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8568.jpg',
      '/images/experiences/sunset-sailing.jpg'
    ],
    attractions: [
      {
        id: 'valley-of-kings',
        name: 'Valley of the Kings',
        type: 'monument',
        description: 'The burial ground of pharaohs for over 500 years, containing 63 tombs including that of Tutankhamun.',
        image: '/images/Royal Cleopatra/DSC_8568.jpg'
      },
      {
        id: 'karnak-temple',
        name: 'Karnak Temple Complex',
        type: 'temple',
        description: 'The largest temple complex ever built, dedicated primarily to the god Amun-Ra.',
        image: '/images/Royal Cleopatra/DSC_8568.jpg'
      }
    ],
    climate: {
      temperature: '20-40°C (68-104°F)',
      weather: 'Very hot summers, warm winters'
    },
    howToGetThere: 'Luxor International Airport or by cruise from Aswan'
  },
  {
    id: 'aswan',
    name: 'Aswan',
    region: 'Upper Egypt',
    description: 'Egypt\'s southernmost city, Aswan is famous for its beautiful Nile setting, Nubian culture, and ancient monuments. It\'s the starting point for many Nile cruises.',
    highlights: [
      'Philae Temple',
      'High Dam',
      'Nubian Villages',
      'Elephantine Island',
      'Unfinished Obelisk',
      'Abu Simbel (nearby)'
    ],
    bestTimeToVisit: 'October to April',
    image: '/images/Royal Cleopatra/DSC_8582.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8582.jpg',
      '/images/Royal Cleopatra/DSC_8608.jpg'
    ],
    attractions: [
      {
        id: 'philae-temple',
        name: 'Philae Temple',
        type: 'temple',
        description: 'Dedicated to the goddess Isis, this beautiful temple was relocated to save it from flooding.',
        image: '/images/Royal Cleopatra/DSC_8582.jpg'
      },
      {
        id: 'abu-simbel',
        name: 'Abu Simbel Temples',
        type: 'temple',
        description: 'Magnificent rock-cut temples built by Ramesses II, relocated in an amazing UNESCO operation.',
        image: '/images/Royal Cleopatra/DSC_8608.jpg'
      }
    ],
    climate: {
      temperature: '25-45°C (77-113°F)',
      weather: 'Very hot and dry, cooler winters'
    },
    howToGetThere: 'Aswan International Airport or by cruise from Luxor'
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    region: 'Lower Egypt',
    description: 'Founded by Alexander the Great, Alexandria was once the intellectual center of the ancient world. Today it\'s Egypt\'s second-largest city and main port.',
    highlights: [
      'Bibliotheca Alexandrina',
      'Qaitbay Citadel',
      'Catacombs of Kom El Shoqafa',
      'Pompey\'s Pillar',
      'Alexandria National Museum',
      'Montaza Palace'
    ],
    bestTimeToVisit: 'April to June, September to November',
    image: '/images/Royal Cleopatra/DSC_8555.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8555.jpg'
    ],
    attractions: [
      {
        id: 'bibliotheca-alexandrina',
        name: 'Bibliotheca Alexandrina',
        type: 'cultural',
        description: 'A modern tribute to the ancient Library of Alexandria, featuring museums and cultural centers.',
        image: '/images/Royal Cleopatra/DSC_8555.jpg'
      },
      {
        id: 'qaitbay-citadel',
        name: 'Qaitbay Citadel',
        type: 'monument',
        description: 'A 15th-century fortress built on the site of the ancient Lighthouse of Alexandria.',
        image: '/images/Royal Cleopatra/DSC_8596.jpg'
      }
    ],
    climate: {
      temperature: '18-30°C (64-86°F)',
      weather: 'Mediterranean climate with mild winters'
    },
    howToGetThere: 'Alexandria International Airport or 3-hour drive from Cairo'
  },
  {
    id: 'hurghada',
    name: 'Hurghada',
    region: 'Red Sea',
    description: 'Egypt\'s premier Red Sea resort destination, famous for its pristine coral reefs, world-class diving, and beautiful beaches.',
    highlights: [
      'Red Sea Coral Reefs',
      'Giftun Islands',
      'Desert Safari',
      'Marina Boulevard',
      'Diving and Snorkeling',
      'Water Sports'
    ],
    bestTimeToVisit: 'March to May, September to November',
    image: '/images/Royal Cleopatra/DSC_8593.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8593.jpg'
    ],
    attractions: [
      {
        id: 'giftun-islands',
        name: 'Giftun Islands',
        type: 'natural',
        description: 'Protected islands with pristine beaches and excellent snorkeling opportunities.',
        image: '/images/Royal Cleopatra/DSC_8593.jpg'
      }
    ],
    climate: {
      temperature: '20-35°C (68-95°F)',
      weather: 'Hot desert climate with sea breeze'
    },
    howToGetThere: 'Hurghada International Airport with international connections'
  },
  {
    id: 'sharm-el-sheikh',
    name: 'Sharm El Sheikh',
    region: 'Sinai',
    description: 'Located at the southern tip of the Sinai Peninsula, Sharm El Sheikh is renowned for its exceptional diving sites and luxury resorts.',
    highlights: [
      'Ras Mohammed National Park',
      'Naama Bay',
      'Tiran Island',
      'Blue Hole (Dahab)',
      'St. Catherine\'s Monastery',
      'Mount Sinai'
    ],
    bestTimeToVisit: 'March to May, September to November',
    image: '/images/Royal Cleopatra/DSC_8534.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8534.jpg'
    ],
    attractions: [
      {
        id: 'ras-mohammed',
        name: 'Ras Mohammed National Park',
        type: 'natural',
        description: 'Egypt\'s first national park, featuring some of the world\'s most spectacular coral reefs.',
        image: '/images/Royal Cleopatra/DSC_8534.jpg'
      },
      {
        id: 'mount-sinai',
        name: 'Mount Sinai',
        type: 'natural',
        description: 'The sacred mountain where Moses is believed to have received the Ten Commandments.',
        image: '/images/Royal Cleopatra/DSC_8568.jpg'
      }
    ],
    climate: {
      temperature: '18-32°C (64-90°F)',
      weather: 'Desert climate with mild winters'
    },
    howToGetThere: 'Sharm El Sheikh International Airport'
  },
  {
    id: 'siwa-oasis',
    name: 'Siwa Oasis',
    region: 'Western Desert',
    description: 'A remote desert oasis near the Libyan border, famous for its unique culture, natural springs, and the ancient Oracle of Amun.',
    highlights: [
      'Temple of the Oracle',
      'Cleopatra\'s Pool',
      'Great Sand Sea',
      'Siwa Traditional Houses',
      'Date Palm Groves',
      'Salt Lakes'
    ],
    bestTimeToVisit: 'October to April',
    image: '/images/Royal Cleopatra/DSC_8534.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8534.jpg'
    ],
    attractions: [
      {
        id: 'oracle-temple',
        name: 'Temple of the Oracle',
        type: 'temple',
        description: 'Ancient temple where Alexander the Great consulted the Oracle of Amun.',
        image: '/images/Royal Cleopatra/DSC_8534.jpg'
      }
    ],
    climate: {
      temperature: '15-35°C (59-95°F)',
      weather: 'Desert climate with cool nights'
    },
    howToGetThere: 'By car from Cairo (8-hour drive) or organized tours'
  }
];

export const getDestinationById = (id: string): Destination | undefined => {
  return destinations.find(dest => dest.id === id);
};

export const getDestinationsByRegion = (region: Destination['region']): Destination[] => {
  return destinations.filter(dest => dest.region === region);
};
