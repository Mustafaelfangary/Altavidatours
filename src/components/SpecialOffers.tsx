import Link from 'next/link';
import Image from 'next/image';
import imageLoader from '../utils/imageLoader';

const offers = [
  {
    title: 'Luxury Dahabiya Experience',
    description: 'Intimate sailing experience with personalized service and gourmet dining',
    image: '/images/dahabyia suite2.jpg',
    price: 'From $299/night',
    link: '/cruises?type=dahabiya'
  },
  {
    title: '2 Nights Nile Adventure',
    description: 'Perfect short cruise between Luxor and Aswan with guided excursions',
    image: '/images/2nights nile cruise.jpg',
    price: 'From $199/night',
    link: '/cruises?duration=2'
  },
  {
    title: 'Ancient Egypt Discovery',
    description: 'Comprehensive tour including all major historical sites and monuments',
    image: '/images/ancient-egypt-monuments-visit-1.jpg',
    price: 'From $399/night',
    link: '/cruises?type=discovery'
  }
];

export function SpecialOffers() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Special Cruise Offers</h2>
          <p className="mt-4 text-lg text-gray-600">Discover our most popular Nile cruise packages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={300}
                  height={200}
                  loader={imageLoader}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">{offer.price}</span>
                  <Link 
                    href={offer.link}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/cruises"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Cruises
          </Link>
        </div>
      </div>
    </section>
  );
}