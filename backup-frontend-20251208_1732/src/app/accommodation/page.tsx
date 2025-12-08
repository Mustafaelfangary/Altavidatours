import Link from 'next/link';

export default function AccommodationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-travelok-blue mb-4">Accommodation</h1>
      <p className="text-travelok-gray mb-6">
        Explore our recommended stays and trip extensions to pair with your Nile cruise. For hotel-inclusive options, see our curated packages below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/packages/luxury" className="card-travelok p-6 hover:no-underline">
          <h2 className="text-xl font-semibold text-travelok-blue mb-2">Luxury Stays</h2>
          <p className="text-travelok-gray">Five-star hotels and premium cruise extensions.</p>
        </Link>
        <Link href="/packages/family" className="card-travelok p-6 hover:no-underline">
          <h2 className="text-xl font-semibold text-travelok-blue mb-2">Family-Friendly</h2>
          <p className="text-travelok-gray">Comfortable options perfect for families.</p>
        </Link>
      </div>
    </div>
  );
}
