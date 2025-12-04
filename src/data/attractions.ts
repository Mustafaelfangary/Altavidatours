export enum AttractionCategory {
  NATURE = 'nature',
  FAMILY = 'family',
  HISTORY = 'history',
  ARTS = 'arts',
  NIGHTLIFE = 'nightlife',
  OUTDOOR = 'outdoor'
}

export interface Attraction {
  id: string;
  name: string;
  category: AttractionCategory;
  location: string;
  description: string;
  image: string;
  gallery: string[];
  highlights: string[];
  openingHours?: string;
  admissionFee?: string;
  duration?: string;
}

export const attractions: Attraction[] = [
  {
    id: 'pyramids-giza',
    name: 'Pyramids of Giza',
    category: AttractionCategory.HISTORY,
    location: 'Giza',
    description: 'The Great Pyramids of Giza are the most iconic monuments of ancient Egypt. Built over 4,500 years ago, these massive structures continue to amaze visitors with their architectural precision and historical significance.',
    image: '/images/Royal Cleopatra/DSC_8502.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8502.jpg',
      '/images/Royal Cleopatra/DSC_8534.jpg',
      '/images/Royal Cleopatra/DSC_8555.jpg'
    ],
    highlights: [
      'Great Pyramid of Khufu',
      'Pyramid of Khafre',
      'Pyramid of Menkaure',
      'The Great Sphinx',
      'Solar Boat Museum'
    ],
    openingHours: 'Daily 8:00 AM - 5:00 PM',
    admissionFee: '$15 per person',
    duration: '3-4 hours'
  },
  {
    id: 'karnak-temple',
    name: 'Karnak Temple',
    category: AttractionCategory.HISTORY,
    location: 'Luxor',
    description: 'The Karnak Temple Complex is the largest religious building ever constructed. This vast open-air museum features massive columns, towering obelisks, and intricate hieroglyphics.',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8568.jpg',
      '/images/Royal Cleopatra/DSC_8568.jpg'
    ],
    highlights: [
      'Great Hypostyle Hall',
      'Sacred Lake',
      'Avenue of Sphinxes',
      'Obelisks of Hatshepsut',
      'Temple of Amun-Ra'
    ],
    openingHours: 'Daily 6:00 AM - 5:30 PM',
    admissionFee: '$12 per person',
    duration: '2-3 hours'
  },
  {
    id: 'valley-kings',
    name: 'Valley of the Kings',
    category: AttractionCategory.HISTORY,
    location: 'Luxor',
    description: 'The Valley of the Kings is the burial ground of Egypt\'s greatest pharaohs. Explore the elaborately decorated tombs including the famous tomb of Tutankhamun.',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8568.jpg',
      '/images/Royal Cleopatra/DSC_8582.jpg'
    ],
    highlights: [
      'Tomb of Tutankhamun',
      'Tomb of Ramses VI',
      'Tomb of Seti I',
      'Colorful wall paintings',
      'Ancient hieroglyphics'
    ],
    openingHours: 'Daily 6:00 AM - 5:00 PM',
    admissionFee: '$13 per person',
    duration: '2-3 hours'
  },
  {
    id: 'abu-simbel',
    name: 'Abu Simbel Temples',
    category: AttractionCategory.HISTORY,
    location: 'Aswan',
    description: 'The twin temples of Abu Simbel are among Egypt\'s most magnificent monuments. Carved into a mountainside, these temples feature colossal statues of Ramses II.',
    image: '/images/Royal Cleopatra/DSC_8559.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8559.jpg',
      '/images/Royal Cleopatra/DSC_8593.jpg'
    ],
    highlights: [
      'Four colossal statues of Ramses II',
      'Temple of Nefertari',
      'Sun Festival alignment',
      'Relocated temple complex',
      'Lake Nasser views'
    ],
    openingHours: 'Daily 5:00 AM - 6:00 PM',
    admissionFee: '$20 per person',
    duration: '2 hours'
  },
  {
    id: 'philae-temple',
    name: 'Philae Temple',
    category: AttractionCategory.HISTORY,
    location: 'Aswan',
    description: 'The Temple of Philae is dedicated to the goddess Isis. Located on an island in the Nile, this beautiful temple complex is accessible by boat.',
    image: '/images/Royal Cleopatra/DSC_8596.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8596.jpg',
      '/images/Royal Cleopatra/DSC_8608.jpg'
    ],
    highlights: [
      'Temple of Isis',
      'Trajan\'s Kiosk',
      'Island setting',
      'Sound and light show',
      'Ancient reliefs'
    ],
    openingHours: 'Daily 7:00 AM - 5:00 PM',
    admissionFee: '$10 per person',
    duration: '1-2 hours'
  },
  {
    id: 'nile-cruise',
    name: 'Nile River Cruise',
    category: AttractionCategory.OUTDOOR,
    location: 'Luxor to Aswan',
    description: 'Experience the timeless beauty of Egypt on a Nile River cruise. Sail past ancient temples, lush farmland, and traditional villages.',
    image: '/images/Royal Cleopatra/DSC_8582.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8582.jpg',
      '/images/Royal Cleopatra/DSC_8596.jpg'
    ],
    highlights: [
      'Luxury cruise ships',
      'Temple visits along the way',
      'Sunset sailing',
      'Traditional felucca rides',
      'Onboard entertainment'
    ],
    openingHours: 'Various departure times',
    admissionFee: 'From $699 per person',
    duration: '3-7 days'
  },
  {
    id: 'khan-khalili',
    name: 'Khan el-Khalili Bazaar',
    category: AttractionCategory.ARTS,
    location: 'Cairo',
    description: 'Khan el-Khalili is Cairo\'s famous bazaar, a labyrinth of narrow streets filled with shops selling everything from spices to jewelry.',
    image: '/images/Royal Cleopatra/DSC_8534.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8534.jpg',
      '/images/Royal Cleopatra/DSC_8555.jpg'
    ],
    highlights: [
      'Traditional crafts',
      'Spice markets',
      'Jewelry shops',
      'Historic cafes',
      'Local artisans'
    ],
    openingHours: 'Daily 9:00 AM - 11:00 PM',
    admissionFee: 'Free entry',
    duration: '2-3 hours'
  },
  {
    id: 'red-sea-diving',
    name: 'Red Sea Diving',
    category: AttractionCategory.OUTDOOR,
    location: 'Hurghada & Sharm El Sheikh',
    description: 'The Red Sea offers world-class diving and snorkeling with crystal-clear waters, vibrant coral reefs, and diverse marine life.',
    image: '/images/Royal Cleopatra/DSC_8593.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8593.jpg',
      '/images/experiences/sunset-sailing.jpg'
    ],
    highlights: [
      'Coral reef diving',
      'Shipwreck exploration',
      'Dolphin encounters',
      'Snorkeling tours',
      'Beach resorts'
    ],
    openingHours: 'Daily diving trips',
    admissionFee: 'From $50 per dive',
    duration: 'Half day to full day'
  }
];

export const getAttractionById = (id: string): Attraction | undefined => {
  return attractions.find(attr => attr.id === id);
};

export const getAttractionsByCategory = (category: AttractionCategory): Attraction[] => {
  return attractions.filter(attr => attr.category === category);
};

export const getAttractionsByLocation = (location: string): Attraction[] => {
  return attractions.filter(attr => attr.location.toLowerCase().includes(location.toLowerCase()));
};