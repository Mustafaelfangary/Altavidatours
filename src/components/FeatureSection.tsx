import Image from 'next/image';

const features = [
  {
    title: '100% Tailor Made',
    description: 'Your entire vacation is designed around your requirements. Explore your interests at your own speed.',
    icon: '/globe.svg'
  },
  {
    title: 'Expert Knowledge',
    description: 'Our specialists have traveled extensively in Egypt. We\'re with you every step of the way.',
    icon: '/file.svg'
  },
  {
    title: 'The Best Guides',
    description: 'Make the difference between a good trip and an outstanding one with our experienced local guides.',
    icon: '/window.svg'
  },
  {
    title: 'Fully Protected',
    description: '24/7 emergency support while abroad. Secure payments protected by advanced encryption.',
    icon: '/window.svg'
  }
];

export function FeatureSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Nile Cruises</h2>
          <p className="mt-4 text-lg text-gray-600">Experience the timeless beauty of Egypt with our premium services</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className="text-blue-600"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}