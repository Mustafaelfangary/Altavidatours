// Mock data for packages - matches scope from planning stage
import type { Package } from './packages';

export const mockRootProps = {
  // Hero section data
  heroTitle: 'Discover the Wonders of Egypt' as const,
  heroSubtitle: 'Experience ancient history, stunning landscapes, and unforgettable adventures' as const,
  heroImage: '/images/Royal Cleopatra/DSC_8502.jpg' as const,
  heroCta: 'Explore Packages' as const,
  
  // Featured packages
  featuredPackages: [
    {
      id: 'egypt-classic-7days' as const,
      title: '7 Days Egypt Classic' as const,
      duration: 7,
      type: 'classic' as const,
      price: 1299,
      currency: 'USD' as const,
      image: '/images/Royal Cleopatra/DSC_8502.jpg' as const
    },
    {
      id: 'nile-cruise-4days' as const,
      title: '4 Days Nile Cruise' as const,
      duration: 4,
      type: 'cruise' as const,
      price: 699,
      currency: 'USD' as const,
      image: '/images/Royal Cleopatra/DSC_8582.jpg' as const
    },
    {
      id: 'dahabiya-esna-aswan-5days' as const,
      title: '5 Days Dahabiya Trip' as const,
      duration: 5,
      type: 'luxury' as const,
      price: 1599,
      currency: 'USD' as const,
      image: '/images/Royal Cleopatra/DSC_8568.jpg' as const
    }
  ],
  
  // Featured attractions
  featuredAttractions: [
    {
      id: 'pyramids-giza' as const,
      name: 'Pyramids of Giza' as const,
      category: 'history' as const,
      location: 'Giza' as const,
      image: '/images/Royal Cleopatra/DSC_8502.jpg' as const
    },
    {
      id: 'karnak-temple' as const,
      name: 'Karnak Temple' as const,
      category: 'history' as const,
      location: 'Luxor' as const,
      image: '/images/Royal Cleopatra/DSC_8568.jpg' as const
    },
    {
      id: 'valley-kings' as const,
      name: 'Valley of the Kings' as const,
      category: 'history' as const,
      location: 'Luxor' as const,
      image: '/images/Royal Cleopatra/DSC_8568.jpg' as const
    }
  ],
  
  // Featured museums
  featuredMuseums: [
    {
      id: 'egyptian-museum' as const,
      name: 'Egyptian Museum' as const,
      type: 'archaeological' as const,
      location: 'Cairo' as const,
      image: '/images/Royal Cleopatra/DSC_8534.jpg' as const
    },
    {
      id: 'luxor-museum' as const,
      name: 'Luxor Museum' as const,
      type: 'archaeological' as const,
      location: 'Luxor' as const,
      image: '/images/Royal Cleopatra/DSC_8555.jpg' as const
    }
  ]
};