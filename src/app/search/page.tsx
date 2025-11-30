"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { hardcodedItineraries } from '@/data/hardcodedItineraries';
import { useSearchParams } from 'next/navigation';

type Item = { id?: string; slug?: string; name: string; description?: string };

export default function SearchPage() {
  const sp = useSearchParams();
  const q = (sp.get('q') || '').trim();

  const [loading, setLoading] = useState(false);
  const [dahabiyas, setDahabiyas] = useState<Item[]>([]);
  const [itineraries, setItineraries] = useState<Item[]>([]);
  const [packages, setPackages] = useState<Item[]>([]);
  const [tab, setTab] = useState<'all' | 'dahabiyas' | 'itineraries' | 'packages'>('all');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!q) return;
      setLoading(true);
      try {
        const [dRes, iRes, pRes] = await Promise.all([
          fetch('/api/dahabiyas?limit=50&active=true', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/itineraries?limit=50', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/packages?limit=50', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
        ]);

        if (cancelled) return;

        const ql = q.toLowerCase();

        const dList: Item[] = Array.isArray(dRes?.dahabiyas)
          ? dRes.dahabiyas.filter((x: any) =>
              (x?.name || '').toLowerCase().includes(ql) || (x?.description || '').toLowerCase().includes(ql)
            )
          : [];
        const iRaw = Array.isArray(iRes) ? iRes : hardcodedItineraries;
        const iList: Item[] = Array.isArray(iRaw)
          ? iRaw
              .map((x: any) => ({ id: x.id, slug: x.slug, name: x.name || x.title || '', description: x.description || x.shortDescription || '' }))
              .filter((x: any) => (x?.name || '').toLowerCase().includes(ql) || (x?.description || '').toLowerCase().includes(ql))
          : [];
        const pList: Item[] = Array.isArray(pRes?.packages)
          ? pRes.packages.filter((x: any) =>
              (x?.name || '').toLowerCase().includes(ql) || (x?.description || '').toLowerCase().includes(ql)
            )
          : [];

        setDahabiyas(dList);
        setItineraries(iList);
        setPackages(pList);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [q]);

  const all = useMemo(() => (
    [
      ...dahabiyas.map(d => ({
        href: `/dahabiyas/${d.slug || d.id}`,
        title: d.name,
        desc: d.description || 'Dahabiya',
        tag: 'Dahabiya',
      })),
      ...itineraries.map(i => ({
        href: `/itineraries/${i.slug || i.id}`,
        title: i.name,
        desc: i.description || 'Itinerary',
        tag: 'Itinerary',
      })),
      ...packages.map(p => ({
        href: `/packages/${p.slug || p.id}`,
        title: p.name,
        desc: p.description || 'Package',
        tag: 'Package',
      })),
    ]
  ), [dahabiyas, itineraries, packages]);

  const counts = { all: all.length, dahabiyas: dahabiyas.length, itineraries: itineraries.length, packages: packages.length };

  const items = tab === 'all' ? all
    : tab === 'dahabiyas' ? dahabiyas.map(d => ({ href: `/dahabiyas/${d.slug || d.id}`, title: d.name, desc: d.description || '', tag: 'Dahabiya' }))
    : tab === 'itineraries' ? itineraries.map(i => ({ href: `/itineraries/${i.slug || i.id}`, title: i.name, desc: i.description || '', tag: 'Itinerary' }))
    : packages.map(p => ({ href: `/packages/${p.slug || p.id}`, title: p.name, desc: p.description || '', tag: 'Package' }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-travelok-blue mb-1">Search</h1>
      <p className="text-travelok-gray mb-6">{q ? `Results for: "${q}"` : 'Type a query in the search bar to begin.'}</p>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6">
        {([
          { id: 'all', label: 'All' },
          { id: 'dahabiyas', label: 'Dahabiyas' },
          { id: 'itineraries', label: 'Itineraries' },
          { id: 'packages', label: 'Packages' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-sm font-medium rounded-t ${tab === t.id ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]' : 'text-gray-600 hover:text-blue-600'}`}
          >
            {t.label} <span className="ml-1 text-xs text-gray-400">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {/* States */}
      {!q && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dahabiyas" className="card-travelok p-6 hover:no-underline">
            <h2 className="text-lg font-semibold text-travelok-blue">Dahabiyas</h2>
            <p className="text-travelok-gray">Explore our luxury vessels on the Nile.</p>
          </Link>
          <Link href="/itineraries" className="card-travelok p-6 hover:no-underline">
            <h2 className="text-lg font-semibold text-travelok-blue">Itineraries</h2>
            <p className="text-travelok-gray">Classic routes like Luxor–Aswan and more.</p>
          </Link>
        </div>
      )}

      {q && (
        <>
          {loading && <div className="text-sm text-gray-500">Loading results…</div>}
          {!loading && items.length === 0 && (
            <div className="text-sm text-gray-500">No results found. Try a different term.</div>
          )}
          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it, idx) => (
                <Link key={idx} href={it.href} className="card-travelok p-5 hover:no-underline">
                  <div className="text-xs font-semibold text-orange-600 mb-1">{it.tag}</div>
                  <h3 className="text-base font-semibold text-travelok-blue">{it.title}</h3>
                  {it.desc && <p className="text-sm text-travelok-gray mt-1 line-clamp-2">{it.desc}</p>}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

