import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function ItineraryDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!slug) return notFound();

  // Resolve itinerary by id first, then by slug
  let itinerary = await prisma.itinerary.findUnique({ where: { id: slug } });
  if (!itinerary) {
    itinerary = await prisma.itinerary.findUnique({ where: { slug } });
  }
  if (!itinerary) return notFound();

  const days = Array.isArray(itinerary.days) ? (itinerary.days as any[]) : [];

  return (
    <main style={{ paddingTop: '6rem' }}>
      <section style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', padding: '3rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e40af', marginBottom: '0.5rem' }}>
            {itinerary.title}
          </h1>
          <p style={{ color: '#334155' }}>{itinerary.description || 'Journey details and highlights.'}</p>
          <p style={{ color: '#334155', marginTop: 8 }}>Duration: {itinerary.duration} days</p>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {days.map((d, idx) => (
            <div key={idx} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', padding: 16 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Day {d?.dayNumber ?? idx + 1}: {d?.title || `Day ${idx + 1}`}</h3>
              <p style={{ color: '#334155' }}>{d?.description || ''}</p>
              {Array.isArray(d?.activities) && d.activities.length > 0 && (
                <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                  {d.activities.map((a: any, i: number) => (
                    <li key={i} style={{ color: '#334155' }}>{typeof a === 'string' ? a : (a?.description || '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  // Avoid DB dependency during build; render on demand
  return [];
}
