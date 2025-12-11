// Centralized Image Constants for AltaVida Tours
// All images from the public folder organized by category

export const IMAGES = {
  // Logo
  logo: '/icons/altavida-logo-1.svg',
  
  // Recent Photos (WhatsApp Images)
  recent: [
    '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.18.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.18 (1).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.19.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.20 (1).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.21 (1).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.21 (2).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.22.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.22 (1).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.22 (2).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.23 (1).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.23 (2).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.24 (1).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.24 (2).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.24 (3).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.35.jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.35 (1).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.35 (2).jpeg',
    '/WhatsApp Image 2025-11-22 at 00.51.36.jpeg',
  ],

  // Cultural & Historical Sites
  cultural: [
    '/cultural&historical/Saqqara pyramid.jpg',
    '/cultural&historical/IMG_2798.JPG',
    '/cultural&historical/IMG_2970.JPG',
    '/cultural&historical/IMG_6316.JPG',
    '/cultural&historical/IMG_6901.JPG',
    '/cultural&historical/IMG_6974.JPG',
    '/cultural&historical/IMG_0456.JPG',
    '/cultural&historical/IMG_0514.JPG',
    '/cultural&historical/IMG_0515.JPG',
    '/cultural&historical/IMG_6828.JPG',
    '/cultural&historical/IMG_6857.JPG',
    '/cultural&historical/DSC_8652.JPG',
    '/cultural&historical/DSCF1165.JPG',
  ],

  // Alexandria
  alexandria: [
    '/Alexandria/IMG_6198.JPG',
    '/Alexandria/IMG_6201.JPG',
    '/Alexandria/IMG_6274.JPG',
    '/Alexandria/IMG_6334.JPG',
    '/Alexandria/IMG_6485.JPG',
    '/Alexandria/IMG_6489.JPG',
    '/Alexandria/IMG_6504.JPG',
    '/Alexandria/IMG_6526.JPG',
  ],

  // Adventure
  adventure: [
    '/adventure/adventure.jpg',
    '/adventure/adventure2.jpg',
    '/adventure/IMG-20170613-WA0106.jpg',
    '/adventure/IMG-20170613-WA0109.jpg',
  ],

  // Desert & Safari
  desert: [
    '/desert&safary/DSC_9166.JPG',
    '/desert&safary/DSC_9167.JPG',
    '/desert&safary/DSC_9814.JPG',
    '/desert&safary/DSC_9826.JPG',
    '/desert&safary/DSC_9895.JPG',
    '/desert&safary/DSC_9907.JPG',
    '/desert&safary/DSC_9908.JPG',
    '/desert&safary/DSC_9912.JPG',
  ],

  // Red Sea
  redSea: [
    '/RedSea/1659705495000.jpg',
    '/RedSea/FB_IMG_1468343472163.jpg',
    '/RedSea/FB_IMG_1474204861825.jpg',
    '/RedSea/FB_IMG_1503932804009.jpg',
    '/RedSea/FB_IMG_1503932816796.jpg',
  ],

  // Religious Sites
  religious: [
    '/religious/20180517_104948.jpg',
  ],

  // Azhar Dahabiya
  azhar: [
    '/images/Azhar/ADahabiyaDouble room5.png',
    '/images/Azhar/ADahabiyaDouble room7.png',
    '/images/Azhar/ADahabiyaDouble room8.png',
    '/images/Azhar/ADahabiyaDoubleroom.png',
    '/images/Azhar/ADahabiyaDoubleroom2.png',
    '/images/Azhar/ADahabiyaDoubleroom3.png',
    '/images/Azhar/ADahabiyaDoubleroom4.png',
    '/images/Azhar/ADahabiyaTwinroom.png',
    '/images/Azhar/ADahabiyadeck.png',
    '/images/Azhar/ADahabiyadeck2.png',
  ],
} as const;

// Helper function to get all images
export const getAllImages = () => {
  return [
    ...IMAGES.recent,
    ...IMAGES.cultural,
    ...IMAGES.alexandria,
    ...IMAGES.adventure,
    ...IMAGES.desert,
    ...IMAGES.redSea,
    ...IMAGES.religious,
  ];
};

// Helper function to get hero slideshow images
export const getHeroImages = () => {
  return [
    ...IMAGES.recent.slice(0, 10),
    ...IMAGES.cultural.slice(0, 5),
    ...IMAGES.alexandria.slice(0, 3),
  ];
};

// Helper function to get gallery images with metadata
export const getGalleryImages = () => {
  return [
    ...IMAGES.recent.map((url, i) => ({ url, alt: `Egypt Travel Experience ${i + 1}`, category: 'recent' })),
    ...IMAGES.cultural.map((url, i) => ({ url, alt: `Cultural & Historical Site ${i + 1}`, category: 'cultural' })),
    ...IMAGES.alexandria.map((url, i) => ({ url, alt: `Alexandria ${i + 1}`, category: 'alexandria' })),
    ...IMAGES.adventure.map((url, i) => ({ url, alt: `Adventure Tour ${i + 1}`, category: 'adventure' })),
    ...IMAGES.desert.map((url, i) => ({ url, alt: `Desert Safari ${i + 1}`, category: 'desert' })),
    ...IMAGES.redSea.map((url, i) => ({ url, alt: `Red Sea ${i + 1}`, category: 'redSea' })),
    ...IMAGES.religious.map((url, i) => ({ url, alt: `Religious Site ${i + 1}`, category: 'religious' })),
  ];
};

// Featured tours images
export const FEATURED_TOURS = {
  pyramids: IMAGES.cultural[0] || IMAGES.recent[0],
  museum: IMAGES.cultural[1] || IMAGES.recent[1],
  alexandria: IMAGES.alexandria[0] || IMAGES.recent[2],
  desert: IMAGES.desert[0] || IMAGES.recent[3],
  nile: IMAGES.recent[4],
  redSea: IMAGES.redSea[0] || IMAGES.recent[5],
};

export default IMAGES;


