"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { packages } from '@/data/packages';
import { destinations } from '@/data/destinations';
import { useContent } from '@/hooks/useContent';

export default function TravelOKHomepage() {
  const [heroReady, setHeroReady] = useState(false);
  const { getContent } = useContent({ page: 'homepage' });
  // Services state
  interface ServiceData { id: string; slug?: string; title: string; serviceType?: string; summary?: string; price?: number }
  const [services, setServices] = useState<ServiceData[]>([]);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Fetch featured services for homepage grid
  useEffect(() => {
    fetch('/api/travel-services?limit=8&featured=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.services)) {
          const items = data.services.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            serviceType: s.serviceType,
            summary: s.summary,
            price: s.price,
          }));
          setServices(items);
        }
      })
      .catch(() => setServices([]));
  }, []);

  return (
    <div className="min-h-screen luxury-homepage">
      {/* Luxury Hero Section */}
      <div className="hero-section parallax-bg relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/Royal Cleopatra/DSC_8627.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,35,66,0.85)] via-[rgba(10,35,66,0.7)] to-[rgba(212,175,55,0.25)] z-0" />
        <div className="hero-container relative z-10 flex flex-col items-center justify-center text-center px-4 fade-in">
          <h1 className="section-heading luxury-hero-title mb-4 animate-pulse drop-shadow-lg">
            {getContent('hero_video_title', 'EXPERIENCE EGYPT IN LUXURY')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-6 max-w-2xl mx-auto">
            {getContent('hero_video_subtitle', 'Bespoke journeys, timeless wonders, and golden memories await.')}
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            {getContent('homepage_hero_description', 'Sail the Nile, explore ancient temples, and indulge in world-class hospitality with Altavida Tours.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/tours" className="btn-gold text-lg px-8 py-4 shadow-xl">Book Your Journey</a>
            <a href="/destinations" className="btn-gold text-lg px-8 py-4 shadow-xl opacity-80 hover:opacity-100">View Destinations</a>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <span className="text-gold text-lg font-bold mb-2">{getContent('hero_scroll_text', 'Scroll to Discover')}</span>
            <span className="w-8 h-8 border-2 border-gold rounded-full flex items-center justify-center animate-bounce">
              <span className="w-2 h-2 bg-gold rounded-full" />
            </span>
          </div>
        </div>
      </div>

      {/* Things To Do Section */}
      <div className="bg-gold text-deep-blue py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <h2 className="text-2xl font-bold tracking-wider">{getContent('homepage_things_to_do_title', 'THINGS TO DO')}</h2>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white text-deep-blue py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 py-6">
            <Link
              href={getContent('category_1_link', '/attractions/pyramids')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-4 sm:p-6 text-center rounded-lg min-h-[100px] flex flex-col items-center justify-center"
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{getContent('category_1_icon', '🔺')}</div>
              <div className="font-bold text-xs sm:text-sm">{getContent('category_1_title', 'PYRAMIDS')}</div>
              <div className="font-bold text-xs sm:text-sm">{getContent('category_1_subtitle', '& SPHINX')}</div>
            </Link>

            <Link
              href={getContent('category_2_link', '/attractions/temples')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">{getContent('category_2_icon', '🏛️')}</div>
              <div className="font-bold text-sm">{getContent('category_2_title', 'ANCIENT')}</div>
              <div className="font-bold text-sm">{getContent('category_2_subtitle', 'TEMPLES')}</div>
            </Link>

            <Link
              href={getContent('category_3_link', '/attractions/museums')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">{getContent('category_3_icon', '🏺')}</div>
              <div className="font-bold text-sm">{getContent('category_3_title', 'MUSEUMS')}</div>
              <div className="font-bold text-sm">{getContent('category_3_subtitle', '& ARTIFACTS')}</div>
            </Link>

            <Link
              href={getContent('category_4_link', '/services/adventure-tours')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">{getContent('category_4_icon', '🐪')}</div>
              <div className="font-bold text-sm">{getContent('category_4_title', 'DESERT')}</div>
              <div className="font-bold text-sm">{getContent('category_4_subtitle', 'SAFARI')}</div>
            </Link>

            <Link
              href={getContent('category_5_link', '/experiences/diving')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">{getContent('category_5_icon', '🤿')}</div>
              <div className="font-bold text-sm">{getContent('category_5_title', 'RED SEA')}</div>
              <div className="font-bold text-sm">{getContent('category_5_subtitle', 'DIVING')}</div>
            </Link>

            <Link
              href={getContent('category_6_link', '/hotels/nile-cruises')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">{getContent('category_6_icon', '⛵')}</div>
              <div className="font-bold text-sm">{getContent('category_6_title', 'NILE')}</div>
              <div className="font-bold text-sm">{getContent('category_6_subtitle', 'CRUISES')}</div>
            </Link>

            <Link
              href={getContent('category_7_link', '/experiences/cultural')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">{getContent('category_7_icon', '🎭')}</div>
              <div className="font-bold text-sm">{getContent('category_7_title', 'CULTURAL')}</div>
              <div className="font-bold text-sm">{getContent('category_7_subtitle', 'TOURS')}</div>
            </Link>

            <Link
              href={getContent('category_8_link', '/experiences/food')}
              className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">{getContent('category_8_icon', '🍽️')}</div>
              <div className="font-bold text-sm">{getContent('category_8_title', 'EGYPTIAN')}</div>
              <div className="font-bold text-sm">{getContent('category_8_subtitle', 'CUISINE')}</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Packages Section */}
      <div className="bg-deep-blue py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gold mb-4">
              {getContent('homepage_featured_packages_title', 'FEATURED ')}
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              {getContent('homepage_featured_packages_subtitle', 'Discover our most popular Egypt tour packages, carefully crafted to give you the best experience of this magnificent country.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {packages.slice(0, 6).map((pkg, index) => {
              // Choose image based on package type to reflect categories
              const getImageForPackage = () => {
                if (pkg.type === 'luxury' || pkg.type === 'cruise') {
                  const royal = [
                    '/images/Royal Cleopatra/DSC_8627.jpg',
                    '/images/Royal Cleopatra/DSC_8733.jpg',
                    '/images/Royal Cleopatra/DSC_8848.jpg',
                    '/images/Royal Cleopatra/DSC_8653.jpg',
                    '/images/Royal Cleopatra/DSC_8666.jpg',
                    '/images/Royal Cleopatra/DSC_8675.jpg'
                  ];
                  return royal[index % royal.length];
                }
                if (pkg.type === 'adventure') {
                  const desert = [
                    '/images/desert&safary/DSC_9908.JPG',
                    '/images/desert&safary/DSC_9912.JPG',
                    '/images/desert&safary/DSC_9895.JPG',
                    '/images/desert&safary/DSC_9826.JPG'
                  ];
                  return desert[index % desert.length];
                }
                // classic, cultural, or others
                const cultural = [
                  '/images/cultural&historical/Saqqara pyramid.jpg',
                  '/images/cultural&historical/DSC_8401.JPG',
                  '/images/cultural&historical/DSCF1165.JPG',
                  '/images/cultural&historical/IMG_3143.JPG'
                ];
                return cultural[index % cultural.length];
              };
              return (
              <div key={pkg.id} className="card-travelok group cursor-pointer relative transition-shadow hover:shadow-xl">
                <div className="relative h-48">
                  <Image
                    src={getImageForPackage() || pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = pkg.image;
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-gold text-deep-blue px-3 py-1 rounded-full text-sm font-bold">
                    {pkg.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gold mb-2">{pkg.title}</h3>
                  <p className="text-white text-sm mb-4 line-clamp-3">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-sm text-white mb-2">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <span key={index} className="bg-gold text-deep-blue px-2 py-1 rounded text-xs">
                          {highlight}
                        </span>
                      ))}
                      {pkg.highlights.length > 3 && (
                        <span className="bg-white text-deep-blue px-2 py-1 rounded text-xs">
                          +{pkg.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gold">
                      From ${pkg.price.from}
                    </div>
                    <Link 
                      href={`/packages/${pkg.id}`}
                      className="bg-gold hover:bg-deep-blue text-deep-blue hover:text-white px-4 py-2 rounded transition-colors text-sm font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/packages"
              className="bg-gold hover:bg-deep-blue text-deep-blue hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
            >
              {getContent('homepage_view_all_packages_text', 'View All Packages')}
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Article Section */}
      <div className="bg-gold text-deep-blue py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <h2 className="text-2xl font-bold tracking-wider">{getContent('homepage_featured_experience_title', 'FEATURED EXPERIENCE')}</h2>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-deep-blue mb-2">
              {getContent('services_section_title', 'Popular Services')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {getContent('services_section_subtitle', 'Private guides, transfers, tickets, and curated experiences across Egypt.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.slice(0, 6).map((svc, idx) => {
              const svcId = svc.slug || svc.id;
              const base = `homepage_service_${svcId}`;
              const title = getContent(`${base}_title`, svc.title);
              const type = getContent(`${base}_type`, svc.serviceType || '');
              const summary = getContent(`${base}_summary`, svc.summary || '');
              const price = getContent(`${base}_price`, svc.price != null ? String(svc.price) : '');
              const image = getContent(`${base}_image`, ['/images/cultural&historical/DSC_8401.JPG','/images/Alexandria/IMG_6504.JPG','/images/desert&safary/DSC_9166.JPG'][idx % 3]);
              return (
                <div key={svc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
                  <div className="relative h-40">
                    <Image src={image} alt={title} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-deep-blue">{title}</h3>
                    {type && (
                      <span className="text-xs bg-gold text-deep-blue px-2 py-1 rounded-full font-semibold">{type}</span>
                    )}
                  </div>
                  {summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{summary}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-gold font-bold">
                      {price ? <>From ${price}</> : <span className="text-gray-400">Contact for price</span>}
                    </div>
                    <Link href={`/services/${svc.slug || svc.id}`} className="bg-gold hover:bg-deep-blue text-deep-blue hover:text-white px-4 py-2 rounded text-sm font-semibold">
                      View Details
                    </Link>
                  </div>
                  </div>
                </div>
              );
            })}
            {services.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No services available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src={getContent('featured_article_image', '/images/Royal Cleopatra/DSC_8568.jpg')}
                alt={getContent('featured_article_title', 'Luxury Dahabiya Cruise')}
                width={600}
                height={400}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold text-deep-blue mb-4">
                {getContent('featured_article_title', 'Egypt: The Ultimate Travel Destination')}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {getContent('featured_article_content', 'From the iconic Pyramids of Giza to the vibrant coral reefs of the Red Sea, Egypt offers an incredible diversity of experiences. Explore ancient pharaonic treasures, dive into crystal-clear waters, and immerse yourself in a culture that spans millennia.')}
              </p>
              <Link
                href={getContent('featured_article_cta_link', '/tours/classic')}
                className="inline-block bg-gold text-deep-blue px-6 py-3 rounded hover:bg-deep-blue hover:text-white transition-colors font-semibold"
              >
                {getContent('featured_article_cta_text', 'Explore Tours')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Discover Egypt Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-deep-blue mb-4">
              {getContent('homepage_discover_egypt_title', 'DISCOVER ANCIENT EGYPT')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {destinations.slice(0, 8).map((destination, index) => {
              // Use available destination images
              const destinationImages = [
                '/images/cultural&historical/Saqqara pyramid.jpg',
                '/images/Alexandria/IMG_6334.JPG',
                '/images/desert&safary/DSC_9166.JPG',
                '/images/desert&safary/DSC_9826.JPG',
                '/images/Alexandria/IMG_6504.JPG',
                '/images/cultural&historical/DSC_8401.JPG',
                '/images/cultural&historical/DSCF1165.JPG',
                '/images/desert&safary/DSC_9912.JPG'
              ];
              // Pull granular content keys when available
              const destTitle = getContent(`homepage_destination_${destination.id}_title`, destination.name);
              const destRegion = getContent(`homepage_destination_${destination.id}_region`, destination.region);
              const destHighlight1 = getContent(`homepage_destination_${destination.id}_highlight_1`, destination.highlights[0] || '');
              const destSummary = getContent(`homepage_destination_${destination.id}_summary`, destination.description || '');

              const destImage = getContent(`homepage_destination_${destination.id}_image`, destinationImages[index] || destination.image);

              return (
              <div key={destination.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <Image
                    src={destImage}
                    alt={destTitle}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = destination.image || '/images/Royal Cleopatra/DSC_8507.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-gold text-deep-blue px-3 py-1 rounded-full text-sm font-semibold">
                    {destRegion}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded">
                    <div className="text-sm font-semibold">{destTitle}</div>
                    <div className="text-xs opacity-90 flex items-center gap-1">
                      📍 {destHighlight1}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/articles" 
              className="inline-block bg-gold text-deep-blue px-8 py-4 text-lg font-semibold rounded hover:bg-deep-blue hover:text-white transition-colors"
            >
              {getContent('homepage_view_all_articles_text', 'View All Articles')}
            </Link>
          </div>
        </div>
      </div>

      {/* State Parks Section */}
      <div className="bg-gold text-deep-blue py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-3">
            <h2 className="text-xl font-bold tracking-wider">{getContent('destinations_section_title', 'DESTINATIONS')}</h2>
          </div>
        </div>
      </div>

      <div className="bg-deep-blue py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <Link href={getContent('dest_link_1_url', '/find-destination')} className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-3 sm:p-4 text-center rounded min-h-[80px] flex flex-col items-center justify-center">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{getContent('dest_link_1_icon', '📍')}</div>
              <div className="text-xs font-bold leading-tight">{getContent('dest_link_1_title', 'FIND A')}</div>
              <div className="text-xs font-bold leading-tight">{getContent('dest_link_1_subtitle', 'DESTINATION')}</div>
            </Link>

            <Link href={getContent('dest_link_2_url', '/book-hotel')} className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_2_icon', '🏨')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_2_title', 'BOOK A HOTEL')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_2_subtitle', 'OR LODGE')}</div>
            </Link>

            <Link href={getContent('dest_link_3_url', '/book-event')} className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_3_icon', '🎪')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_3_title', 'BOOK AN')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_3_subtitle', 'EVENT')}</div>
            </Link>

            <Link href={getContent('dest_link_4_url', '/book-cruise')} className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_4_icon', '🚢')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_4_title', 'BOOK A')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_4_subtitle', 'CRUISE')}</div>
            </Link>

            <Link href={getContent('dest_link_5_url', '/events')} className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_5_icon', '📅')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_5_title', 'DESTINATION')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_5_subtitle', 'EVENTS')}</div>
            </Link>

            <Link href={getContent('dest_link_6_url', '/app')} className="bg-gold hover:bg-deep-blue transition-colors text-deep-blue hover:text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_6_icon', '📱')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_6_title', 'ALTAVIDA APP')}</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-2xl font-bold text-deep-blue mb-6">
              {getContent('heritage_sites_title', 'Ancient Egyptian Heritage Sites')}
            </h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={getContent('heritage_sites_image', '/images/Royal Cleopatra/DSC_8507.jpg')}
                alt={getContent('heritage_sites_title', 'Ancient Egyptian Heritage Sites')}
                width={600}
                height={300}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/Royal Cleopatra/DSC_8507.jpg';
                }}
              />
              <div className="p-6">
                <div className="text-sm text-gray-600 mb-2">{getContent('heritage_sites_location', '📍 Karnak Temple Complex, Luxor')}</div>
                <p className="text-gray-700">
                  {getContent('heritage_sites_description', 'Explore the magnificent ancient Egyptian temple complex, one of the largest religious buildings ever constructed.')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-deep-blue mb-6">
              {getContent('nile_experiences_title', 'Nile River Experiences')}
            </h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={getContent('nile_experiences_image', '/images/Royal Cleopatra/DSC_8628.jpg')}
                alt={getContent('nile_experiences_title', 'Nile River Experiences')}
                width={600}
                height={300}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/Royal Cleopatra/DSC_8628.jpg';
                }}
              />
              <div className="p-6">
                <p className="text-gray-700">
                  {getContent('nile_experiences_description', 'Experience the magic of the Nile River with sunset sailing, traditional felucca rides, and luxury dahabiya cruises.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add a luxury testimonials section */}
      <div className="bg-white/10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-heading text-center mb-10">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <p>“A once-in-a-lifetime experience! The dahabiya cruise was pure luxury, and every detail was perfect.”</p>
              <div className="mt-4 font-bold text-gold">— Sarah M., UK</div>
            </div>
            <div className="testimonial-card">
              <p>“Altavida Tours made Egypt magical. The guides, the food, the boat—unforgettable!”</p>
              <div className="mt-4 font-bold text-gold">— Ahmed F., UAE</div>
            </div>
            <div className="testimonial-card">
              <p>“We felt like royalty. The gold touches and service were beyond five stars.”</p>
              <div className="mt-4 font-bold text-gold">— Julia R., Germany</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section - Luxury, white text on dark blue */}
      <div className="bg-[rgba(10,35,66,0.98)] py-12 px-4 mt-16 rounded-xl text-white max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 section-heading">Contact Us</h2>
        <div className="mb-2 flex items-center"><span className="font-bold mr-2">Address:</span> Egypt, Giza &lt;haram, Mashaal Station, pyramids view Tower 2, No 312</div>
        <div className="mb-2 flex items-center"><span className="font-bold mr-2">Phone:</span> +20 10 02588564</div>
        <div className="mb-2 flex items-center"><span className="font-bold mr-2">WhatsApp:</span> +20 10 02588564</div>
        <div className="mb-2 flex items-center"><span className="font-bold mr-2">Email:</span> bookings@altavidatours.com</div>
      </div>
    </div>
  );
}
