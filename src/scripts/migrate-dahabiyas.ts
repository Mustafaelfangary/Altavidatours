import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dahabiyasData = [
  {
    name: 'Azhar Dahabiya',
    slug: 'azhar-dahabiya',
    type: 'STANDARD',
    category: 'DELUXE',
    shortDescription: 'Discover authentic Nile sailing aboard Azhar Dahabiya, where intimate charm meets traditional Egyptian hospitality.',
    description: 'Discover authentic Nile sailing aboard Azhar Dahabiya, where intimate charm meets traditional Egyptian hospitality in its purest form. This beautifully crafted dahabiya offers a more personal and authentic experience, perfect for travelers seeking genuine connections with Egypt\'s timeless culture. Azhar combines traditional sailing with comfortable accommodations, creating an atmosphere of warmth and authenticity that larger vessels simply cannot match.',
    advantages: 'Azhar Dahabiya offers the most intimate and authentic Nile experience with only 12 guests maximum, ensuring a family-like atmosphere and personalized attention from our dedicated crew. Our smaller size allows access to secluded spots larger boats cannot reach, while our traditional design and local crew provide genuine insights into Egyptian river life. The cozy accommodations and authentic dining experiences create lasting memories and friendships that extend far beyond your journey.',
    meaning: 'Dahabiya, meaning "the golden one" in Arabic, represents the traditional sailing vessels that have graced the Nile for millennia. Azhar, meaning "flowers" or "blossoms" in Arabic, embodies the natural beauty and authentic charm of these historic boats. This vessel maintains the original spirit of dahabiya travel, offering guests a genuine connection to Egypt\'s river heritage and the timeless rhythm of Nile life.',
    capacity: 12,
    pricePerDay: 1650,
    features: ['Intimate Setting', 'Authentic Experience', 'Traditional Sailing', 'Local Crew', 'Cozy Cabins', 'Genuine Hospitality', 'Secluded Access', 'Immersion Experience'],
    amenities: ['Cozy Cabins', 'Traditional Restaurant', 'Authentic Décor', 'Local Guides', 'Traditional Music', 'Intimate Deck', 'Activities', 'Genuine Hospitality', 'Traditional Sailing', 'Local Cuisine'],
    images: [
      { url: '/images/azhar-dahabiya.jpg', alt: 'Azhar Dahabiya Main', category: 'MAIN' },
      { url: '/images/azhar-indoor.jpg', alt: 'Cozy Traditional Lounge', category: 'INDOOR' },
      { url: '/images/azhar-outdoor.jpg', alt: 'Intimate Outdoor Deck', category: 'OUTDOOR' },
      { url: '/images/azhar-twin.jpg', alt: 'Cozy Twin Cabin', category: 'TWIN_CABIN' },
      { url: '/images/azhar-double.jpg', alt: 'Comfortable Double Cabin', category: 'DOUBLE_CABIN' },
      { url: '/images/azhar-suite.jpg', alt: 'Traditional Suite', category: 'SUITE_CABIN' },
      { url: '/images/azhar-bathroom.jpg', alt: 'Traditional Bathroom', category: 'BATHROOM' },
      { url: '/images/azhar-restaurant.jpg', alt: 'Authentic Dining Area', category: 'RESTAURANT_BAR' },
      { url: '/images/azhar-deck.jpg', alt: 'Traditional Sailing Deck', category: 'DECK' }
    ]
  },
  {
    name: 'Princess Cleopatra',
    slug: 'princess-cleopatra',
    type: 'LUXURY',
    category: 'PREMIUM',
    shortDescription: 'Experience royal elegance aboard Princess Cleopatra, where luxury meets the timeless beauty of the Nile.',
    description: 'Princess Cleopatra embodies the perfect fusion of royal elegance and modern luxury, offering an unparalleled Nile experience. This magnificent dahabiya features exquisite accommodations, world-class amenities, and impeccable service that befits its royal namesake. Every detail has been carefully crafted to provide guests with a truly regal journey through Egypt\'s most sacred waters.',
    advantages: 'Princess Cleopatra offers the ultimate in luxury Nile cruising with spacious suites, premium amenities, and personalized royal service. Our expert crew ensures every moment is memorable, while our exclusive itinerary includes private access to archaeological sites and VIP experiences unavailable to larger vessels.',
    meaning: 'Named after Egypt\'s legendary queen, Princess Cleopatra represents the pinnacle of royal luxury on the Nile. This dahabiya honors the legacy of ancient Egyptian royalty while providing modern travelers with an experience worthy of pharaohs.',
    capacity: 16,
    pricePerDay: 2800,
    features: ['Royal Suites', 'Premium Service', 'Luxury Amenities', 'Private Access', 'Gourmet Dining', 'Spa Services', 'Expert Guides', 'Exclusive Experiences'],
    amenities: ['Royal Suites', 'Fine Dining Restaurant', 'Spa & Wellness', 'Premium Bar', 'Luxury Lounge', 'Sun Deck', 'Library', 'Concierge Service', 'Private Balconies', 'Premium Linens'],
    images: [
      { url: '/images/princess-cleopatra.jpg', alt: 'Princess Cleopatra Main', category: 'MAIN' },
      { url: '/images/princess-indoor.jpg', alt: 'Royal Lounge', category: 'INDOOR' },
      { url: '/images/princess-outdoor.jpg', alt: 'Luxury Sun Deck', category: 'OUTDOOR' },
      { url: '/images/princess-suite.jpg', alt: 'Royal Suite', category: 'SUITE_CABIN' },
      { url: '/images/princess-bathroom.jpg', alt: 'Luxury Bathroom', category: 'BATHROOM' },
      { url: '/images/princess-restaurant.jpg', alt: 'Fine Dining Restaurant', category: 'RESTAURANT_BAR' },
      { url: '/images/princess-deck.jpg', alt: 'Premium Deck Area', category: 'DECK' }
    ]
  },
  {
    name: 'Queen Cleopatra',
    slug: 'queen-cleopatra',
    type: 'PREMIUM',
    category: 'LUXURY',
    shortDescription: 'Sail like royalty aboard Queen Cleopatra, the crown jewel of Nile dahabiyas with unmatched luxury and service.',
    description: 'Queen Cleopatra represents the absolute pinnacle of luxury Nile cruising, offering an experience that surpasses even the most discerning expectations. This extraordinary vessel combines opulent accommodations, world-renowned cuisine, and unparalleled service to create a journey worthy of ancient Egyptian royalty. Every aspect of Queen Cleopatra has been designed to provide the ultimate in comfort, elegance, and exclusivity.',
    advantages: 'Queen Cleopatra offers the most exclusive Nile experience available, with only 12 guests maximum ensuring ultimate privacy and personalized attention. Our master suites feature private terraces, butler service, and premium amenities, while our Michelin-trained chefs create culinary masterpieces using the finest ingredients.',
    meaning: 'Queen Cleopatra honors the most famous pharaoh in history, embodying her legendary beauty, intelligence, and power. This flagship dahabiya represents the ultimate expression of luxury travel on the Nile, offering guests a truly royal experience.',
    capacity: 12,
    pricePerDay: 3500,
    features: ['Master Suites', 'Butler Service', 'Private Terraces', 'Michelin Cuisine', 'Exclusive Access', 'Premium Spa', 'Personal Guides', 'Royal Treatment'],
    amenities: ['Master Suites', 'Michelin Restaurant', 'Full Spa', 'Premium Bar', 'Royal Lounge', 'Private Terraces', 'Butler Service', 'Concierge', 'Premium Amenities', 'Exclusive Access'],
    images: [
      { url: '/images/queen-cleopatra.jpg', alt: 'Queen Cleopatra Main', category: 'MAIN' },
      { url: '/images/queen-indoor.jpg', alt: 'Royal Palace Lounge', category: 'INDOOR' },
      { url: '/images/queen-outdoor.jpg', alt: 'Royal Sun Deck', category: 'OUTDOOR' },
      { url: '/images/queen-suite.jpg', alt: 'Master Royal Suite', category: 'SUITE_CABIN' },
      { url: '/images/queen-bathroom.jpg', alt: 'Royal Bathroom', category: 'BATHROOM' },
      { url: '/images/queen-restaurant.jpg', alt: 'Michelin Restaurant', category: 'RESTAURANT_BAR' },
      { url: '/images/queen-deck.jpg', alt: 'Royal Deck', category: 'DECK' }
    ]
  },
  {
    name: 'Royal Cleopatra',
    slug: 'royal-cleopatra',
    type: 'LUXURY',
    category: 'PREMIUM',
    shortDescription: 'Experience imperial grandeur aboard Royal Cleopatra, where every detail reflects the magnificence of ancient Egyptian royalty.',
    description: 'Royal Cleopatra stands as a testament to imperial grandeur, offering guests an extraordinary journey through Egypt\'s most sacred waters. This magnificent vessel combines traditional dahabiya charm with contemporary luxury, featuring palatial accommodations, exceptional cuisine, and service that befits true royalty. Every moment aboard Royal Cleopatra is designed to immerse guests in the splendor of ancient Egyptian civilization.',
    advantages: 'Royal Cleopatra provides an imperial experience with spacious royal suites, personalized service, and exclusive access to Egypt\'s most treasured sites. Our expert Egyptologists and premium amenities ensure a journey of discovery and luxury that exceeds all expectations.',
    meaning: 'Royal Cleopatra embodies the imperial majesty of ancient Egypt\'s greatest dynasty. This magnificent dahabiya carries forward the legacy of pharaonic grandeur, offering modern travelers a glimpse into the opulent world of Egyptian royalty.',
    capacity: 14,
    pricePerDay: 3200,
    features: ['Imperial Suites', 'Royal Service', 'Expert Egyptologists', 'Premium Amenities', 'Exclusive Tours', 'Gourmet Cuisine', 'Luxury Spa', 'Royal Treatment'],
    amenities: ['Imperial Suites', 'Royal Restaurant', 'Luxury Spa', 'Premium Lounge', 'Royal Bar', 'Sun Deck', 'Library', 'Royal Service', 'Premium Linens', 'Exclusive Access'],
    images: [
      { url: '/images/royal-cleopatra.jpg', alt: 'Royal Cleopatra Main', category: 'MAIN' },
      { url: '/images/royal-indoor.jpg', alt: 'Imperial Lounge', category: 'INDOOR' },
      { url: '/images/royal-outdoor.jpg', alt: 'Royal Deck', category: 'OUTDOOR' },
      { url: '/images/royal-suite.jpg', alt: 'Imperial Suite', category: 'SUITE_CABIN' },
      { url: '/images/royal-bathroom.jpg', alt: 'Imperial Bathroom', category: 'BATHROOM' },
      { url: '/images/royal-restaurant.jpg', alt: 'Royal Dining', category: 'RESTAURANT_BAR' },
      { url: '/images/royal-deck.jpg', alt: 'Imperial Deck', category: 'DECK' }
    ]
  }
];

async function migrateDahabiyas() {
  console.log('Starting dahabiya migration...');

  try {
    // First, let's create a default ship and itinerary if they don't exist
    let defaultShip = await prisma.ship.findFirst();
    if (!defaultShip) {
      defaultShip = await prisma.ship.create({
        data: {
          name: 'Default Ship',
          capacity: 20
        }
      });
    }

    let defaultItinerary = await prisma.itinerary.findFirst();
    if (!defaultItinerary) {
      defaultItinerary = await prisma.itinerary.create({
        data: {
          name: 'Classic Nile Journey',
          description: '4-day classic Nile journey from Luxor to Aswan',
          durationDays: 4
        }
      });
    }

    for (const dahabiyaData of dahabiyasData) {
      console.log(`Processing ${dahabiyaData.name}...`);

      // Check if dahabiya already exists
      const existingDahabiya = await prisma.dahabiya.findFirst({
        where: { name: dahabiyaData.name }
      });

      if (existingDahabiya) {
        console.log(`${dahabiyaData.name} already exists, skipping...`);
        continue;
      }

      // Create the dahabiya
      const dahabiya = await prisma.dahabiya.create({
        data: {
          name: dahabiyaData.name,
          description: dahabiyaData.description,
          shortDescription: dahabiyaData.shortDescription,
          pricePerDay: dahabiyaData.pricePerDay,
          capacity: dahabiyaData.capacity,
          features: dahabiyaData.features,
          type: dahabiyaData.type as any,
          category: dahabiyaData.category as any,
          amenities: dahabiyaData.amenities,
          advantages: dahabiyaData.advantages,
          meaning: dahabiyaData.meaning,
          shipId: defaultShip.id,
          itineraryId: defaultItinerary.id,
        }
      });

      // Create images for the dahabiya
      for (const imageData of dahabiyaData.images) {
        await prisma.dahabiyaImage.create({
          data: {
            url: imageData.url,
            alt: imageData.alt,
            category: imageData.category as any,
            dahabiyaId: dahabiya.id
          }
        });
      }

      console.log(`✅ Created ${dahabiyaData.name} with ${dahabiyaData.images.length} images`);
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateDahabiyas();
