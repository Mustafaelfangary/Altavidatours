export enum MuseumType {
  ARCHAEOLOGICAL = 'archaeological',
  ART = 'art',
  HISTORY = 'history',
  SCIENCE = 'science',
  CULTURAL = 'cultural'
}

export interface Museum {
  id: string;
  name: string;
  type: MuseumType;
  location: string;
  description: string;
  image: string;
  gallery: string[];
  highlights: string[];
  openingHours: string;
  admissionFee: string;
  collections: string[];
}

export const museums: Museum[] = [
  {
    id: 'egyptian-museum',
    name: 'Egyptian Museum',
    type: MuseumType.ARCHAEOLOGICAL,
    location: 'Cairo',
    description: 'The Egyptian Museum in Cairo houses the world\'s largest collection of ancient Egyptian artifacts. With over 120,000 items on display, including the treasures of Tutankhamun, this museum is a must-visit for anyone interested in ancient Egypt.',
    image: '/images/Royal Cleopatra/DSC_8534.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8534.jpg',
      '/images/Royal Cleopatra/DSC_8555.jpg',
      '/images/Royal Cleopatra/DSC_8502.jpg'
    ],
    highlights: [
      'Tutankhamun\'s treasures',
      'Royal mummies',
      'Ancient jewelry',
      'Papyrus scrolls',
      'Statues and sarcophagi'
    ],
    openingHours: 'Daily 9:00 AM - 5:00 PM',
    admissionFee: '$12 per person',
    collections: [
      'Old Kingdom artifacts',
      'Middle Kingdom collection',
      'New Kingdom treasures',
      'Greco-Roman period',
      'Coptic art'
    ]
  },
  {
    id: 'grand-egyptian-museum',
    name: 'Grand Egyptian Museum',
    type: MuseumType.ARCHAEOLOGICAL,
    location: 'Giza',
    description: 'The Grand Egyptian Museum (GEM) is the largest archaeological museum in the world. Located near the Pyramids of Giza, it showcases Egypt\'s rich history with state-of-the-art displays.',
    image: '/images/Royal Cleopatra/DSC_8502.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8502.jpg',
      '/images/Royal Cleopatra/DSC_8568.jpg'
    ],
    highlights: [
      'Complete Tutankhamun collection',
      'Solar boat of Khufu',
      'Colossal statues',
      'Interactive displays',
      'Pyramid views'
    ],
    openingHours: 'Daily 9:00 AM - 6:00 PM',
    admissionFee: '$15 per person',
    collections: [
      'Pharaonic collection',
      'Royal treasures',
      'Daily life artifacts',
      'Religious objects',
      'Architectural elements'
    ]
  },
  {
    id: 'luxor-museum',
    name: 'Luxor Museum',
    type: MuseumType.ARCHAEOLOGICAL,
    location: 'Luxor',
    description: 'The Luxor Museum houses a carefully selected collection of artifacts from the Theban temples and necropolis. The museum\'s modern design and excellent lighting make it one of Egypt\'s finest.',
    image: '/images/Royal Cleopatra/DSC_8555.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8555.jpg',
      '/images/Royal Cleopatra/DSC_8568.jpg'
    ],
    highlights: [
      'Statues from Karnak',
      'New Kingdom artifacts',
      'Mummification exhibits',
      'Royal cache discoveries',
      'Akhenaten collection'
    ],
    openingHours: 'Daily 9:00 AM - 4:00 PM',
    admissionFee: '$10 per person',
    collections: [
      'Theban artifacts',
      'Royal statuary',
      'Temple reliefs',
      'Funerary objects',
      'Ancient jewelry'
    ]
  },
  {
    id: 'nubian-museum',
    name: 'Nubian Museum',
    type: MuseumType.CULTURAL,
    location: 'Aswan',
    description: 'The Nubian Museum showcases the rich history and culture of Nubia. The museum\'s beautiful architecture and gardens complement its extensive collection of Nubian artifacts.',
    image: '/images/Royal Cleopatra/DSC_8596.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8596.jpg',
      '/images/Royal Cleopatra/DSC_8608.jpg'
    ],
    highlights: [
      'Nubian culture displays',
      'Prehistoric artifacts',
      'Islamic period items',
      'Traditional crafts',
      'Architectural models'
    ],
    openingHours: 'Daily 9:00 AM - 5:00 PM',
    admissionFee: '$8 per person',
    collections: [
      'Nubian civilization',
      'Pottery and ceramics',
      'Traditional costumes',
      'Musical instruments',
      'Archaeological finds'
    ]
  },
  {
    id: 'coptic-museum',
    name: 'Coptic Museum',
    type: MuseumType.CULTURAL,
    location: 'Cairo',
    description: 'The Coptic Museum houses the world\'s largest collection of Coptic Christian artifacts. Located in Old Cairo, it preserves Egypt\'s Christian heritage.',
    image: '/images/Royal Cleopatra/DSC_8534.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8534.jpg',
      '/images/Royal Cleopatra/DSC_8555.jpg'
    ],
    highlights: [
      'Early Christian art',
      'Coptic textiles',
      'Illuminated manuscripts',
      'Religious icons',
      'Ancient frescoes'
    ],
    openingHours: 'Daily 9:00 AM - 5:00 PM',
    admissionFee: '$6 per person',
    collections: [
      'Coptic art',
      'Religious artifacts',
      'Manuscripts',
      'Woodwork',
      'Metalwork'
    ]
  },
  {
    id: 'islamic-art-museum',
    name: 'Museum of Islamic Art',
    type: MuseumType.ART,
    location: 'Cairo',
    description: 'The Museum of Islamic Art houses one of the world\'s finest collections of Islamic artifacts. The collection spans from the 7th to the 19th century.',
    image: '/images/Royal Cleopatra/DSC_8559.jpg',
    gallery: [
      '/images/Royal Cleopatra/DSC_8559.jpg',
      '/images/Royal Cleopatra/DSC_8593.jpg'
    ],
    highlights: [
      'Islamic calligraphy',
      'Ceramic masterpieces',
      'Metalwork collection',
      'Textiles and carpets',
      'Architectural elements'
    ],
    openingHours: 'Daily 9:00 AM - 5:00 PM',
    admissionFee: '$8 per person',
    collections: [
      'Mamluk period art',
      'Ottoman artifacts',
      'Persian ceramics',
      'Islamic manuscripts',
      'Decorative arts'
    ]
  }
];

export const getMuseumById = (id: string): Museum | undefined => {
  return museums.find(museum => museum.id === id);
};

export const getMuseumsByType = (type: MuseumType): Museum[] => {
  return museums.filter(museum => museum.type === type);
};

export const getMuseumsByLocation = (location: string): Museum[] => {
  return museums.filter(museum => museum.location.toLowerCase().includes(location.toLowerCase()));
};