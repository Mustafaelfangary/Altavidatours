export interface Package {
  id: string;
  title: string;
  duration: string;
  days: number;
  type: 'classic' | 'luxury' | 'cruise' | 'adventure' | 'cultural' | 'family';
  destinations: string[];
  highlights: string[];
  price: {
    from: number;
    currency: 'USD' | 'EUR' | 'GBP';
  };
  includes: string[];
  image: string;
  gallery: string[];
  description: string;
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string[];
    accommodation?: string;
  }[];
}

export const packages: Package[] = [
  {
    id: 'egypt-classic-7days',
    title: '7 Days Egypt Classic',
    duration: '7 Days / 6 Nights',
    days: 7,
    type: 'classic',
    destinations: ['Cairo', 'Luxor', 'Aswan'],
    highlights: [
      'Great Pyramids of Giza & Sphinx',
      'Egyptian Museum',
      'Valley of the Kings',
      'Karnak & Luxor Temples',
      'Philae Temple',
      'High Dam'
    ],
    price: {
      from: 1299,
      currency: 'USD'
    },
    includes: [
      'Domestic flights',
      'All transfers',
      'Professional guide',
      'All entrance fees',
      'Hotels with breakfast',
      'All taxes and service charges'
    ],
    image: '/images/Royal Cleopatra/DSC_8502.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8502.jpg',
      '/images/Royal Cleopatra/DSC_8507.jpg',
      '/images/cultural-historical/DSC_8401.jpeg'
    ],
    description: 'Experience the best of ancient Egypt in this comprehensive 7-day journey through Cairo, Luxor, and Aswan. Visit iconic landmarks including the Pyramids of Giza, Valley of the Kings, and magnificent temples along the Nile.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Meet and assist at Cairo Airport, transfer to hotel. Evening at leisure.',
        meals: ['Breakfast'],
        accommodation: '5-star hotel in Cairo'
      },
      {
        day: 2,
        title: 'Pyramids & Egyptian Museum',
        description: 'Visit the Great Pyramids of Giza, Sphinx, and the Egyptian Museum.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '5-star hotel in Cairo'
      }
    ]
  },
  {
    id: 'nile-cruise-4days',
    title: '4 Days Nile Cruise Aswan-Luxor',
    duration: '4 Days / 3 Nights',
    days: 4,
    type: 'cruise',
    destinations: ['Aswan', 'Kom Ombo', 'Edfu', 'Luxor'],
    highlights: [
      'Philae Temple',
      'Kom Ombo Temple',
      'Edfu Temple',
      'Valley of the Kings',
      'Karnak Temple',
      'Luxor Temple'
    ],
    price: {
      from: 699,
      currency: 'USD'
    },
    includes: [
      'Full board cruise',
      'Professional guide',
      'All entrance fees',
      'All transfers',
      'All taxes and service charges'
    ],
    image: '/images/Royal Cleopatra/DSC_8582.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8582.jpg',
      '/images/Royal Cleopatra/DSC_8596.jpg',
      '/images/Royal Cleopatra/DSC_8608.jpg'
    ],
    description: 'Sail the legendary Nile River from Aswan to Luxor aboard a luxury cruise ship, visiting ancient temples and tombs while enjoying world-class amenities.',
    itinerary: [
      {
        day: 1,
        title: 'Embarkation in Aswan',
        description: 'Meet at Aswan Airport, transfer to cruise ship. Visit Philae Temple.',
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Luxury Nile Cruise'
      }
    ]
  },
  {
    id: 'cairo-alexandria-5days',
    title: '5 Days Cairo & Alexandria Express',
    duration: '5 Days / 4 Nights',
    days: 5,
    type: 'cultural',
    destinations: ['Cairo', 'Alexandria'],
    highlights: [
      'Pyramids of Giza',
      'Egyptian Museum',
      'Citadel of Saladin',
      'Alexandria Library',
      'Qaitbay Citadel',
      'Catacombs'
    ],
    price: {
      from: 899,
      currency: 'USD'
    },
    includes: [
      'All transfers',
      'Professional guide',
      'All entrance fees',
      'Hotels with breakfast',
      'All taxes and service charges'
    ],
    image: '/images/Alexandria/IMG_6334.JPG',
    gallery: [
      '/images/Alexandria/IMG_6334.JPG',
      '/images/Alexandria/IMG_6504.JPG'
    ],
    description: 'Explore the treasures of Cairo and the Mediterranean charm of Alexandria in this cultural journey through Egypt\'s most historic cities.',
    itinerary: []
  },
  {
    id: 'dahabiya-esna-aswan-5days',
    title: '5 Days Dahabiya Trip Esna-Aswan',
    duration: '5 Days / 4 Nights',
    days: 5,
    type: 'luxury',
    destinations: ['Esna', 'Edfu', 'Kom Ombo', 'Aswan'],
    highlights: [
      'Traditional Dahabiya sailing',
      'Esna Temple',
      'Edfu Temple',
      'Kom Ombo Temple',
      'Philae Temple',
      'Nubian villages'
    ],
    price: {
      from: 1599,
      currency: 'USD'
    },
    includes: [
      'Full board dahabiya',
      'Professional guide',
      'All entrance fees',
      'All transfers',
      'All taxes and service charges'
    ],
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8568.jpg',
      '/images/Royal Cleopatra/DSC_8582.jpg'
    ],
    description: 'Experience the Nile as pharaohs once did aboard a traditional dahabiya sailboat, offering an intimate and luxury sailing experience.',
    itinerary: []
  },
  {
    id: 'cairo-red-sea-8days',
    title: '8 Days Cairo, Luxor & Red Sea',
    duration: '8 Days / 7 Nights',
    days: 8,
    type: 'adventure',
    destinations: ['Cairo', 'Luxor', 'Hurghada'],
    highlights: [
      'Pyramids of Giza',
      'Valley of the Kings',
      'Karnak Temple',
      'Red Sea diving',
      'Beach relaxation',
      'Desert safari'
    ],
    price: {
      from: 1499,
      currency: 'USD'
    },
    includes: [
      'Domestic flights',
      'All transfers',
      'Professional guide',
      'All entrance fees',
      'Hotels with breakfast',
      'Water sports activities'
    ],
    image: '/images/desert&safary/DSC_9908.JPG',
    gallery: [
      '/images/desert&safary/DSC_9908.JPG',
      '/images/desert&safary/DSC_9912.JPG'
    ],
    description: 'Combine ancient wonders with Red Sea adventures in this exciting 8-day package featuring pyramids, temples, diving, and beach relaxation.',
    itinerary: []
  },
  {
    id: 'egypt-classic-10days',
    title: '10 Days Classical Egypt',
    duration: '10 Days / 9 Nights',
    days: 10,
    type: 'classic',
    destinations: ['Cairo', 'Luxor', 'Aswan', 'Abu Simbel'],
    highlights: [
      'Great Pyramids of Giza',
      'Egyptian Museum',
      'Valley of the Kings',
      'Karnak Temple',
      'Philae Temple',
      'Abu Simbel Temples',
      'Nubian culture'
    ],
    price: {
      from: 1899,
      currency: 'USD'
    },
    includes: [
      'Domestic flights',
      'All transfers',
      'Professional guide',
      'All entrance fees',
      'Hotels with breakfast',
      'Nile cruise full board'
    ],
    image: '/images/Royal Cleopatra/DSC_8559.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8559.jpg',
      '/images/Royal Cleopatra/DSC_8507.jpg'
    ],
    description: 'The ultimate Egyptian experience covering all major highlights from Cairo to Abu Simbel, including a Nile cruise and comprehensive cultural immersion.',
    itinerary: []
  },
  {
    id: 'egypt-under-sail-11days',
    title: '11 Days Egypt Under Sail',
    duration: '11 Days / 10 Nights',
    days: 11,
    type: 'luxury',
    destinations: ['Cairo', 'Luxor', 'Aswan', 'Abu Simbel'],
    highlights: [
      'Pyramids of Giza',
      'Valley of the Kings',
      'Dahabiya sailing experience',
      'Abu Simbel excursion',
      'Nubian villages',
      'Traditional felucca ride'
    ],
    price: {
      from: 2499,
      currency: 'USD'
    },
    includes: [
      'Luxury dahabiya full board',
      'Domestic flights',
      'Professional guide',
      'All entrance fees',
      'Luxury hotels',
      'All transfers'
    ],
    image: '/images/Royal Cleopatra/DSC_8608.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8608.jpg',
      '/images/Royal Cleopatra/DSC_8585.jpg'
    ],
    description: 'Experience Egypt in ultimate luxury aboard traditional sailing vessels, combining cultural discovery with premium accommodations and personalized service.',
    itinerary: []
  },
  {
    id: 'cairo-sinai-5days',
    title: '5 Days Cairo & Sinai',
    duration: '5 Days / 4 Nights',
    days: 5,
    type: 'adventure',
    destinations: ['Cairo', 'Sinai', 'Mount Sinai', 'St. Catherine'],
    highlights: [
      'Pyramids of Giza',
      'Egyptian Museum',
      'Mount Sinai climb',
      'St. Catherine Monastery',
      'Bedouin culture',
      'Desert landscapes'
    ],
    price: {
      from: 999,
      currency: 'USD'
    },
    includes: [
      'Domestic flights',
      'All transfers',
      'Professional guide',
      'All entrance fees',
      'Hotels with breakfast',
      'Bedouin camp experience'
    ],
    image: '/images/Royal Cleopatra/DSC_8534.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8534.jpg'
    ],
    description: 'Combine the wonders of ancient Egypt with the spiritual journey to Mount Sinai, experiencing both pharaonic heritage and biblical history.',
    itinerary: []
  },
  {
    id: 'family-egypt-7days',
    title: '7 Days Family Egypt Adventure',
    duration: '7 Days / 6 Nights',
    days: 7,
    type: 'family',
    destinations: ['Cairo', 'Luxor', 'Hurghada'],
    highlights: [
      'Pyramids of Giza',
      'Egyptian Museum',
      'Valley of the Kings',
      'Beach activities',
      'Family-friendly tours',
      'Camel rides'
    ],
    price: {
      from: 1199,
      currency: 'USD'
    },
    includes: [
      'Domestic flights',
      'All transfers',
      'Professional guide',
      'All entrance fees',
      'Hotels with breakfast',
      'Family activities'
    ],
    image: '/images/Alexandria/IMG_6504.JPG',
    gallery: [
      '/images/Alexandria/IMG_6504.JPG',
      '/images/Alexandria/IMG_6526.JPG'
    ],
    description: 'A perfect family getaway to explore Egypt\'s wonders with activities tailored for all ages, combining history, adventure, and relaxation.',
    itinerary: []
  }
];

export const getPackageById = (id: string): Package | undefined => {
  return packages.find(pkg => pkg.id === id);
};

export const getPackagesByType = (type: Package['type']): Package[] => {
  return packages.filter(pkg => pkg.type === type);
};

export const getPackagesByDuration = (minDays: number, maxDays: number): Package[] => {
  return packages.filter(pkg => pkg.days >= minDays && pkg.days <= maxDays);
};
