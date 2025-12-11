import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getDestinations() {
  return await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: { name: true, slug: true }
  });
}

export default async function DestinationDropdown() {
  const destinations = await getDestinations();
  
  return (
    <div className="dropdown">
      <button className="btn dropdown-toggle">
        Destinations
      </button>
      <ul className="dropdown-menu">
        {destinations.map((dest) => (
          <li key={dest.slug}>
            <Link href={`/destinations/${dest.slug}`}>
              {dest.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


