import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Sun, Cloud, Thermometer, Droplets, Wind } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Time to Travel | Egypt Weather Guide | AltaVida Tours',
  description: 'Discover the best time to visit Egypt and cruise the Nile. Weather guide, seasonal information, and travel tips for your perfect Egypt vacation.',
  keywords: 'best time to visit Egypt, Egypt weather, Nile cruise weather, Egypt seasons, travel seasons',
};

export default function BestTimeToTravelPage() {
  const seasons = [
    {
      name: 'Winter',
      months: 'Dec - Feb',
      temperature: '15°C - 25°C',
      description: 'Perfect weather for sightseeing and outdoor activities',
      highlights: ['Cool and comfortable', 'Clear skies', 'Perfect for temples', 'Peak tourist season'],
      color: 'blue',
      recommendation: 'Excellent'
    },
    {
      name: 'Spring',
      months: 'Mar - May',
      temperature: '20°C - 30°C',
      description: 'Pleasant weather with blooming landscapes',
      highlights: ['Mild temperatures', 'Beautiful landscapes', 'Fewer crowds', 'Great for photography'],
      color: 'green',
      recommendation: 'Excellent'
    },
    {
      name: 'Summer',
      months: 'Jun - Aug',
      temperature: '25°C - 40°C',
      description: 'Hot weather but great for Red Sea extensions',
      highlights: ['Hot but dry', 'Perfect for Red Sea', 'Lower prices', 'Indoor activities'],
      color: 'orange',
      recommendation: 'Good'
    },
    {
      name: 'Autumn',
      months: 'Sep - Nov',
      temperature: '20°C - 35°C',
      description: 'Warm weather with comfortable evenings',
      highlights: ['Warm days', 'Cool evenings', 'Good visibility', 'Shoulder season'],
      color: 'amber',
      recommendation: 'Very Good'
    }
  ];

  const monthlyWeather = [
    { month: 'Jan', temp: '14-22°C', weather: 'Cool, clear', recommendation: 'Excellent' },
    { month: 'Feb', temp: '15-24°C', weather: 'Pleasant, sunny', recommendation: 'Excellent' },
    { month: 'Mar', temp: '18-28°C', weather: 'Warm, clear', recommendation: 'Excellent' },
    { month: 'Apr', temp: '22-32°C', weather: 'Hot, dry', recommendation: 'Very Good' },
    { month: 'May', temp: '25-35°C', weather: 'Hot, sunny', recommendation: 'Good' },
    { month: 'Jun', temp: '27-38°C', weather: 'Very hot', recommendation: 'Fair' },
    { month: 'Jul', temp: '28-40°C', weather: 'Extremely hot', recommendation: 'Fair' },
    { month: 'Aug', temp: '28-39°C', weather: 'Very hot', recommendation: 'Fair' },
    { month: 'Sep', temp: '26-37°C', weather: 'Hot, dry', recommendation: 'Good' },
    { month: 'Oct', temp: '23-33°C', weather: 'Warm, pleasant', recommendation: 'Very Good' },
    { month: 'Nov', temp: '19-28°C', weather: 'Cool, clear', recommendation: 'Excellent' },
    { month: 'Dec', temp: '15-24°C', weather: 'Cool, sunny', recommendation: 'Excellent' }
  ];

  const travelTips = [
    {
      icon: Sun,
      title: 'Sun Protection',
      description: 'Always wear sunscreen, hats, and sunglasses during outdoor activities'
    },
    {
      icon: Droplets,
      title: 'Stay Hydrated',
      description: 'Drink plenty of water, especially during hot months'
    },
    {
      icon: Wind,
      title: 'Dress Appropriately',
      description: 'Wear light, breathable clothing and comfortable walking shoes'
    },
    {
      icon: Calendar,
      title: 'Plan Ahead',
      description: 'Book early for peak season (Dec-Feb) to secure best rates'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Best Time to Travel</h1>
              <p className="text-gray-600 mt-2">Weather guide and seasonal information for Egypt</p>
            </div>
            <Link 
              href="/itineraries" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Itineraries</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-r from-sky-900 to-blue-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Egypt Weather Guide</h2>
            <p className="text-xl mb-6 max-w-2xl">
              Plan your perfect Egypt vacation with our comprehensive weather guide. 
              Discover the best times to visit and what to expect each season.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Sun size={20} />
                <span>Year-Round Sunshine</span>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer size={20} />
                <span>Mild Winters</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets size={20} />
                <span>Low Humidity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-8">
        {/* Seasons Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Seasons in Egypt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasons.map((season, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{season.name}</h3>
                  <p className="text-sm text-gray-600">{season.months}</p>
                  <p className="text-lg font-semibold text-gray-700">{season.temperature}</p>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{season.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                  <ul className="space-y-1">
                    {season.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-gray-700 flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          season.color === 'blue' ? 'bg-blue-500' :
                          season.color === 'green' ? 'bg-green-500' :
                          season.color === 'orange' ? 'bg-orange-500' :
                          'bg-amber-500'
                        }`}></div>
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`text-center py-2 px-4 rounded-lg text-sm font-semibold ${
                  season.recommendation === 'Excellent' ? 'bg-green-100 text-green-800' :
                  season.recommendation === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                  season.recommendation === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {season.recommendation}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Weather Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Monthly Weather Guide</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {monthlyWeather.map((month, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">{month.month}</h3>
                  <p className="text-sm text-gray-600 mb-2">{month.temp}</p>
                  <p className="text-xs text-gray-500 mb-2">{month.weather}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    month.recommendation === 'Excellent' ? 'bg-green-100 text-green-800' :
                    month.recommendation === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                    month.recommendation === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {month.recommendation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Travel Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Travel Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <tip.icon size={32} className="text-sky-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Time Recommendations */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Best Time Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Nile Cruises</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Best:</strong> October to April (cool, comfortable weather)</li>
                  <li>• <strong>Peak:</strong> December to February (perfect weather, higher prices)</li>
                  <li>• <strong>Shoulder:</strong> March-May, September-November (good weather, better prices)</li>
                  <li>• <strong>Avoid:</strong> June to August (very hot, but lower prices)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Red Sea Extensions</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Best:</strong> Year-round (warm water, sunny weather)</li>
                  <li>• <strong>Peak:</strong> December to March (perfect beach weather)</li>
                  <li>• <strong>Summer:</strong> June to August (hot but great for water activities)</li>
                  <li>• <strong>Diving:</strong> March to May, September to November (best visibility)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 bg-sky-600 rounded-lg p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Plan Your Perfect Trip?</h2>
          <p className="text-xl mb-6">Choose the best time for your Egypt adventure and book your Nile cruise</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Plan Your Trip
            </Link>
            <Link 
              href="/itineraries" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sky-600 transition-colors"
            >
              View All Itineraries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
