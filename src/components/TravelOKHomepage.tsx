"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packages } from '@/data/packages';
import { destinations } from '@/data/destinations';
import { useContent } from '@/hooks/useContent';

export default function TravelOKHomepage() {
  const [heroReady, setHeroReady] = useState(false);
  const { getContent } = useContent({ page: 'homepage' });
  const router = useRouter();
  const [query, setQuery] = useState("");
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
 
  // Animated package card with slideshow and 3D hover
  function AnimatedPackageCard({ pkg, images, index }: { pkg: any; images: string[]; index: number }) {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
      if (!images || images.length <= 1) return;
      const timer = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
      return () => clearInterval(timer);
    }, [images]);

    const current = images && images[idx] ? images[idx] : (images?.[0] || pkg.image);

    return (
      <div className={`group relative bg-white rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(11,46,79,0.08)] hover:shadow-[0_26px_70px_rgba(11,46,79,0.16)] transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-10px)_rotateX(2deg)] ${index % 2 === 1 ? 'md:mt-10 lg:mt-16' : ''}`}>
        <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{boxShadow:'inset 0 1px 0 rgba(255,255,255,.6), 0 30px 80px rgba(11,46,79,.15)', filter:'saturate(110%)'}}></div>
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          <Image
            key={current}
            src={current || pkg.image}
            alt={pkg.title}
            fill
            className="object-cover scale-[1.02] transition-all duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35"></div>
          <div className="absolute top-4 right-4 bg-white/95 text-[#0b2e4f] px-3 py-1 rounded-full text-sm font-bold shadow">
            {pkg.duration}
          </div>
        </div>
        <div className="p-6 md:p-7">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0b2e4f] mb-2 animate-[slideUp_0.6s_ease-out]">{pkg.title}</h3>
          <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3 animate-[fadeIn_0.8s_ease-out]">{pkg.description}</p>

          <div className="mb-5">
            <div className="text-sm text-gray-700 mb-2 font-semibold">Highlights:</div>
            <div className="flex flex-wrap gap-2">
              {pkg.highlights.slice(0, 3).map((highlight: string, i: number) => (
                <span key={i} className="pale-chip px-2.5 py-1 rounded text-xs">{highlight}</span>
              ))}
              {pkg.highlights.length > 3 && (
                <span className="pale-chip px-2 py-1 rounded text-xs">+{pkg.highlights.length - 3} more</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href={`/packages/${pkg.id}`}
              className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-[#0b2e4f] text-white font-semibold hover:bg-[#09304e] transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-white">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0b2e4f]">
              {getContent('homepage_hero_title', 'Discover Egypt This Season')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              {getContent('homepage_hero_subtitle', 'From ancient wonders to Nile cruises, plan unforgettable experiences with Altavida.')}
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); const q = query.trim(); if (q) router.push(`/search?q=${encodeURIComponent(q)}`); }}
              className="mt-8 flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder={getContent('homepage_search_placeholder', 'Search experiences, destinations, cruises...')}
                className="flex-1 px-4 py-3 outline-none text-gray-800"
              />
              <button type="submit" className="px-5 py-3 bg-[#0b2e4f] text-white font-semibold">
                {getContent('homepage_search_cta', 'Search')}
              </button>
            </form>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/packages" className="px-3 py-2 rounded-full border border-gray-200 text-sm text-[#0b2e4f]">Things To Do</Link>
              <Link href="/destinations" className="px-3 py-2 rounded-full border border-gray-200 text-sm text-[#0b2e4f]">Cities & Regions</Link>
              <Link href="/dahabiyas" className="px-3 py-2 rounded-full border border-gray-200 text-sm text-[#0b2e4f]">Places To Stay</Link>
              <Link href="/blog" className="px-3 py-2 rounded-full border border-gray-200 text-sm text-[#0b2e4f]">Festivals & Events</Link>
              <Link href="/destinations" className="px-3 py-2 rounded-full border border-gray-200 text-sm text-[#0b2e4f]">State Parks</Link>
              <Link href="/blog" className="px-3 py-2 rounded-full border border-gray-200 text-sm text-[#0b2e4f]">Dining</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section className="bg-papyrus section-separator">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <div className="text-center mb-8">
            <h2 className="heading-animated text-3xl md:text-4xl font-extrabold text-[#0b2e4f]">Top Destinations</h2>
            <p className="subheading-animated text-gray-600 max-w-2xl mx-auto">Explore Egypt's most iconic regions handpicked for this season.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {destinations.slice(0,4).map((d, i) => {
              const fallbackImages = [
                '/cultural&historical/Saqqara pyramid.jpg',
                '/Alexandria/IMG_6334.JPG',
                '/desert&safary/DSC_9166.JPG',
                '/Royal Cleopatra/DSC_8628.jpg'
              ];
              const img = d.image || fallbackImages[i % fallbackImages.length];
              const title = d.name || `Destination ${i+1}`;
              const region = d.region || 'Egypt';
              const slug = (d as any).slug ? `/destinations/${(d as any).slug}` : '/destinations';
              return (
                <Link key={d.id || i} href={slug} className="card-3d block overflow-hidden">
                  <div className="card-media relative h-44 md:h-56">
                    <Image src={img} alt={title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-extrabold text-[#0b2e4f] tracking-tight heading-animated">{title}</h3>
                    <div className="text-[13px] text-slate-600 mt-1 subheading-animated">{region}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* International/Nearby Destinations Section */}
      <section className="bg-pale-blue">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <div className="text-center mb-8">
            <h2 className="heading-animated text-3xl md:text-4xl font-extrabold text-[#0b2e4f]">Explore The Region</h2>
            <p className="subheading-animated text-gray-600 max-w-2xl mx-auto">Add a regional touch to your itinerary with these remarkable nearby destinations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              { name: 'Jordan', image: 'https://images.pexels.com/photos/11195793/pexels-photo-11195793.jpeg', href: '/destinations/jordan', photographer: 'Yasir Gürbüz on Pexels' },
              { name: 'Dubai', image: 'https://images.pexels.com/photos/3611545/pexels-photo-3611545.jpeg', href: '/destinations/dubai', photographer: 'Abbas Mohammed on Pexels' },
              { name: 'Turkey', image: 'https://images.pexels.com/photos/28966539/pexels-photo-28966539.jpeg', href: '/destinations/turkey', photographer: 'Julien Goettelmann on Pexels' },
              { name: 'Morocco', image: 'https://images.pexels.com/photos/22711558/pexels-photo-22711558.jpeg', href: '/destinations/morocco', photographer: 'Uiliam Nörnberg on Pexels' },
            ].map((d, i) => (
              <Link key={d.name} href={d.href} className="card-3d block overflow-hidden">
                <div className="card-media relative h-44 md:h-56">
                  <Image src={d.image} alt={`${d.name} - Photo by ${d.photographer}`} fill className="object-cover" unoptimized />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-extrabold text-[#0b2e4f] tracking-tight heading-animated">{d.name}</h3>
                  <div className="text-[13px] text-slate-600 mt-1 subheading-animated">Regional Destination</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gray-50 text-[#0b2e4f] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <h2 className="text-2xl font-bold tracking-wider">{getContent('homepage_things_to_do_title', 'THINGS TO DO')}</h2>
          </div>
        </div>
      </div>

      <div className="bg-white text-[#0b2e4f] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 py-6">
            {/* Pyramids & Sphinx */}
            <Link href={getContent('category_1_link', '/attractions/pyramids')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_1_image','/cultural&historical/Saqqara pyramid.jpg')} alt="Pyramids & Sphinx" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">PYRAMIDS & SPHINX</div>
              </div>
            </Link>

            {/* Ancient Temples */}
            <Link href={getContent('category_2_link', '/attractions/temples')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_2_image','/cultural&historical/DSCF1165.JPG')} alt="Ancient Temples" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">ANCIENT TEMPLES</div>
              </div>
            </Link>

            {/* Museums & Artifacts */}
            <Link href={getContent('category_3_link', '/attractions/museums')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_3_image','/cultural&historical/DSC_8401.JPG')} alt="Museums & Artifacts" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">MUSEUMS & ARTIFACTS</div>
              </div>
            </Link>

            {/* Desert Safari */}
            <Link href={getContent('category_4_link', '/services/adventure-tours')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_4_image','/desert&safary/DSC_9895.JPG')} alt="Desert Safari" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">DESERT SAFARI</div>
              </div>
            </Link>

            {/* Red Sea Diving */}
            <Link href={getContent('category_5_link', '/experiences/diving')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_5_image','/RedSea/DSCF1998.JPG')} alt="Red Sea Diving" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">RED SEA DIVING</div>
              </div>
            </Link>

            {/* Nile Cruises */}
            <Link href={getContent('category_6_link', '/hotels/nile-cruises')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_6_image','/Royal Cleopatra/DSC_8628.jpg')} alt="Nile Cruises" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">NILE CRUISES</div>
              </div>
            </Link>

            {/* Cultural Tours */}
            <Link href={getContent('category_7_link', '/experiences/cultural')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_7_image','/cultural&historical/IMG_3143.JPG')} alt="Cultural Tours" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">CULTURAL TOURS</div>
              </div>
            </Link>

            {/* Egyptian Cuisine */}
            <Link href={getContent('category_8_link', '/experiences/food')} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 sm:h-36">
                <Image src={getContent('category_8_image','/Alexandria/IMG_6504.JPG')} alt="Egyptian Cuisine" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[11px] font-extrabold tracking-wider text-[#0b2e4f] uppercase">EGYPTIAN CUISINE</div>
              </div>
            </Link>
          </div>

          {/* Our Top Picks Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2e4f] mb-4">Our Top Picks</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">Handpicked experiences for an unforgettable journey through Egypt</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {[
                { 
                  name: 'Alexandria', 
                  image: '/Alexandria/IMG_6198.JPG', 
                  href: '/destinations/alexandria',
                  description: 'Mediterranean Pearl of Egypt'
                },
                { 
                  name: 'Luxor', 
                  image: '/Alexandria/IMG_6201.JPG', 
                  href: '/destinations/luxor',
                  description: 'World\'s Greatest Open-Air Museum'
                },
                { 
                  name: 'Aswan', 
                  image: '/Alexandria/IMG_6274.JPG', 
                  href: '/destinations/aswan',
                  description: 'Nile Valley Beauty'
                },
                { 
                  name: 'Cairo', 
                  image: '/Alexandria/IMG_6282.JPG', 
                  href: '/destinations/cairo',
                  description: 'City of a Thousand Minarets'
                },
              ].map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href}
                  className="group relative overflow-hidden rounded-xl aspect-square md:aspect-[3/4]"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                      <h3 className="font-bold text-lg md:text-xl mb-1">{item.name}</h3>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0b2e4f] mb-4">
              {getContent('homepage_featured_packages_title', 'Featured Experiences')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {getContent('homepage_featured_packages_subtitle', 'Discover our most popular Egypt tour packages, carefully crafted to give you the best experience of this magnificent country.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            {packages.slice(0, 6).map((pkg, index) => {
              const royal = [
                '/images/Royal Cleopatra/DSC_8627.jpg',
                '/images/Royal Cleopatra/DSC_8733.jpg',
                '/images/Royal Cleopatra/DSC_8848.jpg',
                '/images/Royal Cleopatra/DSC_8653.jpg',
                '/images/Royal Cleopatra/DSC_8666.jpg',
                '/images/Royal Cleopatra/DSC_8675.jpg'
              ];
              const desert = [
                '/images/desert&safary/DSC_9908.JPG',
                '/images/desert&safary/DSC_9912.JPG',
                '/images/desert&safary/DSC_9895.JPG',
                '/images/desert&safary/DSC_9826.JPG'
              ];
              const cultural = [
                '/images/cultural&historical/Saqqara pyramid.jpg',
                '/images/cultural&historical/DSC_8401.JPG',
                '/images/cultural&historical/DSCF1165.JPG',
                '/images/cultural&historical/IMG_3143.JPG'
              ];
              const images = (pkg.type === 'luxury' || pkg.type === 'cruise') ? royal : (pkg.type === 'adventure') ? desert : cultural;
              return (
                <AnimatedPackageCard key={pkg.id} pkg={pkg} images={images} index={index} />
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/packages"
              className="bg-[#0b2e4f] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block hover:bg-[#09304e]"
            >
              {getContent('homepage_view_all_packages_text', 'View All Packages')}
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Article Section */}
      <div className="bg-gray-50 text-[#073b5a] py-8">
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
                      <span className="text-xs bg-[#1193b1]/10 text-[#073b5a] px-2 py-1 rounded-full font-semibold">{type}</span>
                    )}
                  </div>
                  {summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{summary}</p>
                  )}
                  <div className="flex items-center justify-end">
                    <Link href={`/services/${svc.slug || svc.id}`} className="bg-white border border-gray-200 hover:bg-[#f1fcfe] text-[#073b5a] hover:text-[#073b5a] px-4 py-2 rounded text-sm font-semibold">
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
                className="inline-block bg-gradient-to-r from-[#1193b1] to-[#0b79a0] text-white px-6 py-3 rounded hover:opacity-95 transition-colors font-semibold"
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
                  <div className="absolute top-4 left-4 bg-[#1193b1]/10 text-[#073b5a] px-3 py-1 rounded-full text-sm font-semibold">
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
              className="inline-block bg-gradient-to-r from-[#1193b1] to-[#0b79a0] text-white px-8 py-4 text-lg font-semibold rounded hover:opacity-95 transition-colors"
            >
              {getContent('homepage_view_all_articles_text', 'View All Articles')}
            </Link>
          </div>
        </div>
      </div>

      {/* State Parks Section */}
      <div className="bg-gray-50 text-[#073b5a] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-3">
            <h2 className="text-xl font-bold tracking-wider">{getContent('destinations_section_title', 'DESTINATIONS')}</h2>
          </div>
        </div>
      </div>

      <div className="bg-deep-blue py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <Link href={getContent('dest_link_1_url', '/find-destination')} className="bg-white border border-gray-200 hover:bg-[#f1fcfe] transition-colors text-[#073b5a] hover:text-[#073b5a] p-3 sm:p-4 text-center rounded min-h-[80px] flex flex-col items-center justify-center">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{getContent('dest_link_1_icon', '📍')}</div>
              <div className="text-xs font-bold leading-tight">{getContent('dest_link_1_title', 'FIND A')}</div>
              <div className="text-xs font-bold leading-tight">{getContent('dest_link_1_subtitle', 'DESTINATION')}</div>
            </Link>

            <Link href={getContent('dest_link_2_url', '/book-hotel')} className="bg-white border border-gray-200 hover:bg-[#f1fcfe] transition-colors text-[#073b5a] hover:text-[#073b5a] p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_2_icon', '🏨')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_2_title', 'BOOK A HOTEL')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_2_subtitle', 'OR LODGE')}</div>
            </Link>

            <Link href={getContent('dest_link_3_url', '/book-event')} className="bg-white border border-gray-200 hover:bg-[#f1fcfe] transition-colors text-[#073b5a] hover:text-[#073b5a] p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_3_icon', '🎪')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_3_title', 'BOOK AN')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_3_subtitle', 'EVENT')}</div>
            </Link>

            <Link href={getContent('dest_link_4_url', '/book-cruise')} className="bg-white border border-gray-200 hover:bg-[#f1fcfe] transition-colors text-[#073b5a] hover:text-[#073b5a] p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_4_icon', '🚢')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_4_title', 'BOOK A')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_4_subtitle', 'CRUISE')}</div>
            </Link>

            <Link href={getContent('dest_link_5_url', '/events')} className="bg-white border border-gray-200 hover:bg-[#f1fcfe] transition-colors text-[#073b5a] hover:text-[#073b5a] p-4 text-center rounded">
              <div className="text-2xl mb-2">{getContent('dest_link_5_icon', '📅')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_5_title', 'DESTINATION')}</div>
              <div className="text-xs font-bold">{getContent('dest_link_5_subtitle', 'EVENTS')}</div>
            </Link>

            <Link href={getContent('dest_link_6_url', '/app')} className="bg-white border border-gray-200 hover:bg-[#f1fcfe] transition-colors text-[#073b5a] hover:text-[#073b5a] p-4 text-center rounded">
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
              <div className="mt-4 font-bold text-[#073b5a]">— Sarah M., UK</div>
            </div>
            <div className="testimonial-card">
              <p>“Altavida Tours made Egypt magical. The guides, the food, the boat—unforgettable!”</p>
              <div className="mt-4 font-bold text-[#073b5a]">— Ahmed F., UAE</div>
            </div>
            <div className="testimonial-card">
              <p>“We felt like royalty. The gold touches and service were beyond five stars.”</p>
              <div className="mt-4 font-bold text-[#073b5a]">— Julia R., Germany</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
