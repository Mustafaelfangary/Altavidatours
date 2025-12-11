import Image from 'next/image';

interface TourDetailProps {
  tour: any;
}

export default function TourDetail({ tour }: TourDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{tour.description}</p>
        <div className="flex gap-4 mb-6">
          <span className="badge">{tour.duration} days</span>
          <span className="badge">{tour.difficulty}</span>
          <span className="badge">${tour.price}</span>
        </div>
      </div>

      {tour.imageCover && (
        <div className="mb-8">
          <Image
            src={tour.imageCover}
            alt={tour.title}
            width={1200}
            height={600}
            className="rounded-lg"
          />
        </div>
      )}

      {tour.highlights && tour.highlights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tour Highlights</h2>
          <ul className="list-disc list-inside">
            {tour.highlights.map((highlight: string, index: number) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tour.includes && tour.includes.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">What's Included</h3>
            <ul className="list-disc list-inside">
              {tour.includes.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {tour.excludes && tour.excludes.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">What's Not Included</h3>
            <ul className="list-disc list-inside">
              {tour.excludes.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}


