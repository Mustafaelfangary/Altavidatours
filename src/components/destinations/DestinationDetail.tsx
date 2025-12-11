import Image from 'next/image';
import Link from 'next/link';

interface DestinationDetailProps {
  destination: any;
}

export default function DestinationDetail({ destination }: DestinationDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{destination.name}</h1>
        <p className="text-lg text-gray-600 mb-4">{destination.description}</p>
        <div className="flex gap-4 mb-6">
          <span className="badge">{destination.country}</span>
          {destination.region && <span className="badge">{destination.region}</span>}
        </div>
      </div>

      {destination.imageCover && (
        <div className="mb-8">
          <Image
            src={destination.imageCover}
            alt={destination.name}
            width={1200}
            height={600}
            className="rounded-lg"
          />
        </div>
      )}

      {destination.highlights && destination.highlights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
          <ul className="list-disc list-inside">
            {destination.highlights.map((highlight: string, index: number) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


