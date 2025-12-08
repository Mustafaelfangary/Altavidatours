'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useContent } from '@/hooks/useContent';
import { AnimatedSection } from '@/components/ui/animated-section';
import {
  EgyptianPatternBackground,
  FloatingEgyptianElements,
  PharaohCard,
  PharaohButton,
  HieroglyphicDivider,
  EgyptHieroglyphic,
  RoyalCrown,
} from '@/components/ui/pharaonic-elements';
import { Calendar, Clock, Ship, Crown, MapPin, Users, Phone, Mail, Plus } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';

// Types matching the table structure
interface ScheduleEntry {
  id: string;
  month: string;
  year: string;
  startDate: string; // e.g., "01 August 2025"
  endDate: string;   // e.g., "04 August 2025"
  nights: number;    // 3 or 4
  startPoint: string; // Luxor | Aswan
  endPoint: string;   // Luxor | Aswan
  doublePrice: string; // e.g., "$940"
  singleSupplement: string; // e.g., "$720"
  detailedItinerary: string;
  notes: string;
  isActive: boolean;
  sortOrder: number;
}

type WeekdayName = 'Monday' | 'Wednesday' | 'Friday' | 'Saturday';

// Default mapping for automatically generated rows
// Premium = doublePrice, Luxury = singleSupplement
// New default rates:
// - 3 nights (Aswan → Esna): Premium $675, Luxury $1,260
// - 4 nights (Luxor → Aswan): Premium $910, Luxury $1,680
const weekdayConfig: Record<WeekdayName, { nights: number; startPoint: 'Luxor' | 'Aswan'; endPoint: 'Luxor' | 'Aswan' | 'Esna'; doublePrice: string; singleSupplement: string }> = {
  Monday: { nights: 4, startPoint: 'Luxor', endPoint: 'Aswan', doublePrice: '$910', singleSupplement: '$1,680' },
  Wednesday: { nights: 4, startPoint: 'Luxor', endPoint: 'Aswan', doublePrice: '$910', singleSupplement: '$1,680' },
  Friday: { nights: 3, startPoint: 'Aswan', endPoint: 'Esna', doublePrice: '$675', singleSupplement: '$1,260' },
  Saturday: { nights: 3, startPoint: 'Aswan', endPoint: 'Esna', doublePrice: '$675', singleSupplement: '$1,260' },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const YEARS = [2025, 2026];

// Utility helpers
function monthIndexFromName(name: string): number {
  return MONTHS.indexOf(name as (typeof MONTHS)[number]);
}

function formatDateHuman(d: Date): string {
  const day = d.getDate().toString().padStart(2, '0');
  const monthName = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

function addDays(d: Date, days: number): Date {
  const c = new Date(d.getTime());
  c.setDate(c.getDate() + days);
  return c;
}

function getWeekdayDatesInMonth(year: number, monthIndex: number, weekdays: number[]): Date[] {
  const dates: Date[] = [];
  const date = new Date(year, monthIndex, 1);
  while (date.getMonth() === monthIndex) {
    if (weekdays.includes(date.getDay())) {
      dates.push(new Date(date.getTime()));
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

// Weekday mapping: JS getDay(): 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
const WEEKDAY_NAME_TO_DAYNUM: Record<WeekdayName, number> = {
  Monday: 1,
  Wednesday: 3,
  Friday: 5,
  Saturday: 6,
};

// Default schedule entries kept for reference and sample editing
const defaultScheduleEntries: ScheduleEntry[] = [
  {
    id: '1',
    month: 'August',
    year: '2025',
    startDate: '01 August 2025',
    endDate: '04 August 2025',
    nights: 3,
    startPoint: 'Aswan',
    endPoint: 'Esna',
    doublePrice: '$675',
    singleSupplement: '$1,260',
    detailedItinerary: 'Detailed Itinerary for this Tour',
    notes: 'Minimum 2 cabins',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '2',
    month: 'August',
    year: '2025',
    startDate: '04 August 2025',
    endDate: '08 August 2025',
    nights: 4,
    startPoint: 'Luxor',
    endPoint: 'Aswan',
    doublePrice: '$910',
    singleSupplement: '$1,680',
    detailedItinerary: 'Detailed Itinerary for this Tour',
    notes: 'Minimum 2 cabins',
    isActive: true,
    sortOrder: 2,
  },
];

export default function ScheduleAndRatesPage() {
  const { data: session } = useSession();
  const { getContent, loading } = useContent({ page: 'schedule-and-rates' });

  // Admin check
  const isAdmin = !!(session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role));

  // Intro editable content
  const [introText, setIntroText] = useState<string>('');
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  // Persisted entries from API (manual entries)
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>(defaultScheduleEntries);

  // Year -> Selected Month mapping
  const initialSelectedMonths = useMemo(() => {
    const now = new Date();
    const m = MONTHS[now.getMonth()];
    const map: Record<string, string> = {};
    YEARS.forEach((y) => (map[String(y)] = m || 'January'));
    return map;
  }, []);
  const [selectedMonthByYear, setSelectedMonthByYear] = useState<Record<string, string>>(initialSelectedMonths);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScheduleEntry>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load intro and persisted entries
  useEffect(() => {
    const initialIntro = getContent('schedule_intro_text', '');
    if (initialIntro) setIntroText(initialIntro);

    const fetchScheduleData = async () => {
      try {
        const response = await fetch('/api/schedule-entries');
        if (response.ok) {
          const data = await response.json();
          if (data.entries && data.entries.length > 0) {
            setScheduleEntries(data.entries);
          }
        }
      } catch (err) {
        console.error('Failed to fetch schedule data:', err);
      }
    };

    fetchScheduleData();
  }, [getContent]);

  // Ensure month selection starts at the nearest upcoming departure per year
  useEffect(() => {
    // Helper to find first month from current month with any upcoming entries
    const now = new Date();
    const currentMonthIdx = now.getMonth();
    const updated: Record<string, string> = { ...selectedMonthByYear };
    for (const y of YEARS) {
      const yearStr = String(y);
      let pickedMonth = selectedMonthByYear[yearStr];
      // Scan from current month to December to find a month with future entries
      for (let mi = currentMonthIdx; mi < MONTHS.length; mi++) {
        const mName = MONTHS[mi] as (typeof MONTHS)[number] | undefined;
        if (!mName) continue;
        const list = generateMonthEntries(y, mName as string);
        if (list.length > 0) {
          pickedMonth = mName;
          break;
        }
      }
      // Fallback to January if none found (e.g., all months in this year are past)
      if (!pickedMonth) pickedMonth = 'January';
      updated[yearStr] = pickedMonth;
    }
    setSelectedMonthByYear(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate automatic entries for a given year+month
  const generateMonthEntries = (year: number, monthName: string): ScheduleEntry[] => {
    const monthIdx = monthIndexFromName(monthName);
    if (monthIdx < 0) return [];

    const allowedDayNums = Object.values(WEEKDAY_NAME_TO_DAYNUM);
    const dates = getWeekdayDatesInMonth(year, monthIdx, allowedDayNums);

    const result: ScheduleEntry[] = [];
    for (const date of dates) {
      const jsDay = date.getDay();
      // Map day num -> WeekdayName
      const weekdayName = (Object.keys(WEEKDAY_NAME_TO_DAYNUM) as WeekdayName[])
        .find((k) => WEEKDAY_NAME_TO_DAYNUM[k] === jsDay) as WeekdayName | undefined;
      if (!weekdayName) continue;

      const cfg = weekdayConfig[weekdayName];
      const startDateStr = formatDateHuman(date);
      const endDateStr = formatDateHuman(addDays(date, cfg.nights));

      const genId = `gen-${year}-${monthName}-${startDateStr.replace(/\s+/g, '-')}`;

      result.push({
        id: genId,
        month: monthName,
        year: String(year),
        startDate: startDateStr,
        endDate: endDateStr,
        nights: cfg.nights,
        startPoint: cfg.startPoint,
        endPoint: cfg.endPoint,
        doublePrice: cfg.doublePrice,
        singleSupplement: cfg.singleSupplement,
        detailedItinerary: 'Detailed Itinerary for this Tour',
        notes: '',
        isActive: true,
        sortOrder: 999,
      });
    }

    // Merge with any persisted custom entries for same year+month
    const persistedForMonth = scheduleEntries.filter(
      (e) => e.year === String(year) && e.month === monthName
    );

    // Prefer persisted entries where dates match generated
    const mergedByKey = new Map<string, ScheduleEntry>();
    for (const g of result) mergedByKey.set(`${g.startDate}-${g.endDate}`, g);
    for (const p of persistedForMonth) mergedByKey.set(`${p.startDate}-${p.endDate}`, p);

    const merged = Array.from(mergedByKey.values()).sort((a, b) => {
      const aDate = new Date(a.startDate);
      const bDate = new Date(b.startDate);
      return aDate.getTime() - bDate.getTime();
    });

    // Filter out past departures so we start at the nearest upcoming date
    const today = new Date();
    const upcoming = merged.filter((e) => new Date(e.startDate).getTime() >= new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime());

    return upcoming;
  };


  // Editing handlers
  const handleEdit = (entry: ScheduleEntry) => {
    setEditingId(entry.id);
    setEditForm({ ...entry });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;

    setIsLoading(true);
    try {
      // If generated entry id starts with gen-, treat as new (POST) instead of PUT
      const isGenerated = editingId.startsWith('gen-');
      const method = isGenerated ? 'POST' : 'PUT';

      const response = await fetch('/api/schedule-entries', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...editForm }),
      });

      if (response.ok) {
        const json = await response.json();
        const saved = json.entry as ScheduleEntry;
        let updated = scheduleEntries.slice();
        if (isGenerated) {
          updated.push(saved);
        } else {
          updated = updated.map((e) => (e.id === editingId ? { ...e, ...editForm } as ScheduleEntry : e));
        }
        setScheduleEntries(updated);
        setEditingId(null);
        setEditForm({});
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/schedule-entries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const updatedEntries = scheduleEntries.filter((entry) => entry.id !== id);
        setScheduleEntries(updatedEntries);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const exportViewToCSV = () => {
    const parts: string[] = [];
    const headers = [
      'Year', 'Month', 'Start Date', 'End Date', 'Nights', 'From', 'To', 'Double Price', 'Single Supplement', 'Notes',
    ];
    parts.push(headers.join(','));

    for (const y of YEARS) {
      const month = selectedMonthByYear[String(y)] || 'January';
      const rows = generateMonthEntries(y, month);
      for (const e of rows) {
        parts.push([
          e.year,
          e.month,
          e.startDate,
          e.endDate,
          String(e.nights),
          e.startPoint,
          e.endPoint,
          e.doublePrice,
          e.singleSupplement,
          e.notes || '',
        ].join(','));
      }
    }

    const blob = new Blob([parts.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dahabiya-schedule-view-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportViewToJSON = () => {
    const data: Record<string, ScheduleEntry[]> = {};
    for (const y of YEARS) {
      const month = selectedMonthByYear[String(y)] || 'January';
      data[String(y)] = generateMonthEntries(y, month);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dahabiya-schedule-view-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="text-center">
          <RoyalCrown className="w-16 h-16 text-blue-600 mx-auto mb-6 animate-pulse" />
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
          <p className="text-blue-800 font-bold text-xl">Loading Schedule & Rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 on-light">
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Unified Hero Section */}
      <UnifiedHero
        videoSrc={getContent('hero_background_video', getContent('schedule_hero_video'))}
        posterSrc={getContent('hero_background_image', '/images/dahabiya-sunset.jpg')}
        imageSrc={getContent('hero_background_image', '/images/dahabiya-sunset.jpg')}
        title={getContent('page_title', 'Dahabiya Schedule & Rates')}
        subtitle={getContent('page_subtitle', 'Discover our sailing schedules and transparent pricing for luxury dahabiya cruises along the magnificent Nile River')}
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="light"
        minHeight="80vh"
        mediaFit="contain"
      />

      {/* Editable Introduction Section */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white relative z-10 on-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">𓄿</div>
                      <h3 className="text-xl font-bold">
                        {getContent('intro_section_title', 'Important Information')}
                      </h3>
                      <div className="text-2xl ml-3">𓄿</div>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center space-x-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            isEditingIntro
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-white/20 text-white border border-white/30'
                          }`}
                        >
                          {isEditingIntro ? '🔍 Editing' : '✏️ Editable'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="max-w-none text-gray-700 leading-relaxed">
                    <div
                      className={`min-h-[120px] p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                        isEditingIntro
                          ? 'border-blue-500 bg-blue-50/50 shadow-md'
                          : 'border-dashed border-gray-200 hover:border-blue-300'
                      }`}
                      style={{ fontSize: '16px', lineHeight: '1.6', fontFamily: 'inherit' }}
                      contentEditable={isAdmin}
                      suppressContentEditableWarning
                      onFocus={() => isAdmin && setIsEditingIntro(true)}
                      onBlur={async (e) => {
                        setIsEditingIntro(false);
                        const content = e.currentTarget.innerHTML;
                        setIntroText(content);
                        try {
                          const response = await fetch('/api/website-content', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ page: 'schedule-and-rates', key: 'schedule_intro_text', content }),
                          });
                          if (!response.ok) console.error('Failed to save introduction text');
                        } catch (error) {
                          console.error('Error saving introduction text:', error);
                        }
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          introText ||
                          getContent(
                            'schedule_intro_text',
                            `<p>Welcome to our <strong>dahabiya schedule and rates</strong> section. Here you'll find all current departure dates, pricing, and availability for our luxury Nile river cruises.</p>
                             <p>Our dahabiyas offer an intimate and authentic way to explore Egypt's ancient wonders. Each vessel accommodates a small number of guests, ensuring personalized service and exclusive access to sites that larger vessels cannot reach.</p>
                             <p><em>All prices are per person and include full board, guided excursions, and entrance fees to monuments. Special rates may apply during peak seasons.</em></p>
                             <p>📞 For bookings and inquiries, please contact us directly or use the booking form below each schedule entry.</p>`
                          ),
                      }}
                    />
                    <div className={`mt-4 text-sm italic border-t pt-3 transition-colors duration-200 ${
                      isEditingIntro ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {isEditingIntro ? (
                        <div>
                          <div className="mb-2">
                            <span>✏️ <strong>Editing Mode:</strong> Click outside to save your changes.</span>
                          </div>
                          <div className="text-xs text-blue-500">
                            🎨 <strong>Formatting tips:</strong> Select text to <strong>bold</strong>, <em>italicize</em>, or create lists. Press Enter twice for new paragraphs.
                          </div>
                        </div>
                      ) : isAdmin ? (
                        <span>💡 <strong>Admin Note:</strong> Click in the text area above to edit this introduction. Changes are saved automatically.</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Schedule Section - One table per year with month dropdown */}
      <section className="py-16 relative z-10 on-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in" className="opacity-100">
            <div className="text-center mb-10">
              <div className="text-6xl mb-4">𓈖𓍃𓇳</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 underline-accent">
                {getContent('schedule_title', 'Departure Schedule & Pricing')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {getContent('schedule_subtitle', 'Select month in each year to view all Monday, Wednesday, Friday and Saturday departures')}
              </p>
              {isAdmin && (
                <div className="mt-6 flex gap-2 justify-center">
                  <button onClick={exportViewToCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">Export View CSV</button>
                  <button onClick={exportViewToJSON} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Export View JSON</button>
                </div>
              )}
            </div>

            {YEARS.map((year, yi) => {
              const selectedMonth = selectedMonthByYear[String(year)] || 'January';
              const entries = generateMonthEntries(year, selectedMonth);
              const hasAdminActions = isAdmin;

              return (
                <AnimatedSection key={year} animation="fade-in" delay={yi * 100} className="mb-12 opacity-100">
                  <PharaohCard className="overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
                    {/* Year header with Month dropdown */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4 text-emerald-accent">𓊍</div>
                          <h3 className="text-2xl font-bold tracking-wide">{year}</h3>
                          <div className="text-3xl ml-4 text-emerald-accent">𓊍</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm opacity-90">Select Month:</span>
                          <select
                            value={selectedMonth}
                            onChange={(e) =>
                              setSelectedMonthByYear((s) => ({ ...s, [String(year)]: e.target.value }))
                            }
                            className="bg-white text-gray-800 px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300"
                          >
                            {MONTHS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Table Header - Desktop */}
                    <div className="hidden lg:block bg-gradient-to-r from-amber-100 to-amber-200 border-b-2 border-amber-300">
                      <div className={`grid gap-4 px-6 py-4 text-sm font-semibold text-gray-700 ${
                        hasAdminActions ? 'grid-cols-9' : 'grid-cols-8'
                      }`}>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                          Start Date
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                          End Date
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-amber-600" />
                          Nights
                        </div>
                        <div className="flex items-center">
                          <Ship className="w-4 h-4 mr-2 text-green-600" />
                          From
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-red-600" />
                          To
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-600" />
                          <div className="leading-tight">
                            <span className="block">Premium</span>
                            <span className="block text-xs text-gray-500">Per Person</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Crown className="w-4 h-4 mr-2 text-purple-600" />
                          <div className="leading-tight">
                            <span className="block">Luxury</span>
                            <span className="block text-xs text-gray-500">Per Person</span>
                          </div>
                        </div>
                        <div className="text-center">Book</div>
                        {hasAdminActions && <div className="text-center">Actions</div>}
                      </div>
                    </div>

                    {/* Rows - Desktop */}
                    <div className="bg-white hidden lg:block">
                      {entries.map((entry, idx) => (
                        <div
                          key={entry.id}
                          className={`grid gap-4 px-6 py-4 border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                            hasAdminActions ? 'grid-cols-9' : 'grid-cols-8'
                          } ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          {/* Start Date */}
                          <div className="flex items-center">
                            {editingId === entry.id ? (
                              <input
                                type="text"
                                value={editForm.startDate || ''}
                                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-800">{entry.startDate}</span>
                            )}
                          </div>

                          {/* End Date */}
                          <div className="flex items-center">
                            {editingId === entry.id ? (
                              <input
                                type="text"
                                value={editForm.endDate || ''}
                                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-800">{entry.endDate}</span>
                            )}
                          </div>

                          {/* Nights */}
                          <div className="flex items-center">
                            {editingId === entry.id ? (
                              <input
                                type="number"
                                value={editForm.nights || ''}
                                onChange={(e) => setEditForm({ ...editForm, nights: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              <span className="text-sm font-medium text-blue-600">{entry.nights}</span>
                            )}
                          </div>

                          {/* From */}
                          <div className="flex items-center">
                            {editingId === entry.id ? (
                              <select
                                value={editForm.startPoint || ''}
                                onChange={(e) => setEditForm({ ...editForm, startPoint: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="Luxor">Luxor</option>
                                <option value="Aswan">Aswan</option>
                                <option value="Esna">Esna</option>
                              </select>
                            ) : (
                              <span className="text-sm font-medium text-green-600">{entry.startPoint}</span>
                            )}
                          </div>

                          {/* To */}
                          <div className="flex items-center">
                            {editingId === entry.id ? (
                              <select
                                value={editForm.endPoint || ''}
                                onChange={(e) => setEditForm({ ...editForm, endPoint: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="Luxor">Luxor</option>
                                <option value="Aswan">Aswan</option>
                                <option value="Esna">Esna</option>
                              </select>
                            ) : (
                              <span className="text-sm font-medium text-red-600">{entry.endPoint}</span>
                            )}
                          </div>

                          {/* Double Price */}
                          <div className="flex items-center">
                            {editingId === entry.id ? (
                              <input
                                type="text"
                                value={editForm.doublePrice || ''}
                                onChange={(e) => setEditForm({ ...editForm, doublePrice: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              <span className="text-sm font-bold text-blue-700">{entry.doublePrice}</span>
                            )}
                          </div>

                          {/* Single Supplement */}
                          <div className="flex items-center">
                            {editingId === entry.id ? (
                              <input
                                type="text"
                                value={editForm.singleSupplement || ''}
                                onChange={(e) => setEditForm({ ...editForm, singleSupplement: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              <span className="text-sm font-bold text-purple-700">{entry.singleSupplement}</span>
                            )}
                          </div>

                          {/* Book */}
                          <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                              <Link
                                href={`/booking?startDate=${encodeURIComponent(entry.startDate)}&endDate=${encodeURIComponent(entry.endDate)}&from=${encodeURIComponent(entry.startPoint)}&to=${encodeURIComponent(entry.endPoint)}&nights=${entry.nights}`}
                              >
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm border-2 border-emerald-400 hover:border-emerald-500">
                                  Book Now
                                </button>
                              </Link>
                              <Link
                                href={`/itineraries?from=${encodeURIComponent(entry.startPoint)}&to=${encodeURIComponent(entry.endPoint)}&nights=${entry.nights}&startDate=${encodeURIComponent(entry.startDate)}`}
                              >
                                <button className="bg-white hover:bg-gray-50 text-blue-700 border border-blue-600 px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm">
                                  View Details
                                </button>
                              </Link>
                            </div>
                          </div>

                          {/* Actions */}
                          {hasAdminActions && (
                            <div className="flex items-center justify-center space-x-2">
                              {editingId === entry.id ? (
                                <>
                                  <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isLoading ? 'Saving...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEdit(entry)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  {/* Allow delete only for persisted entries (id not starting with gen-) */}
                                  {!entry.id.startsWith('gen-') && (
                                    <button
                                      onClick={() => handleDelete(entry.id)}
                                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                    >
                                      ×
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="lg:hidden bg-white relative z-10 text-black schedule-mobile-cards">
                      {entries.map((entry) => (
                        <div key={entry.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors bg-white text-gray-900">
                          {editingId === entry.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                                  <input
                                    type="text"
                                    value={editForm.startDate || ''}
                                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                                  <input
                                    type="text"
                                    value={editForm.endDate || ''}
                                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nights</label>
                                  <input
                                    type="number"
                                    value={editForm.nights || ''}
                                    onChange={(e) => setEditForm({ ...editForm, nights: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">From</label>
                                  <select
                                    value={editForm.startPoint || ''}
                                    onChange={(e) => setEditForm({ ...editForm, startPoint: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  >
                                    <option value="Luxor">Luxor</option>
                                    <option value="Aswan">Aswan</option>
                                    <option value="Esna">Esna</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">To</label>
                                  <select
                                    value={editForm.endPoint || ''}
                                    onChange={(e) => setEditForm({ ...editForm, endPoint: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  >
                                    <option value="Luxor">Luxor</option>
                                    <option value="Aswan">Aswan</option>
                                    <option value="Esna">Esna</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Double Price</label>
                                  <input
                                    type="text"
                                    value={editForm.doublePrice || ''}
                                    onChange={(e) => setEditForm({ ...editForm, doublePrice: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Single Supplement</label>
                                  <input
                                    type="text"
                                    value={editForm.singleSupplement || ''}
                                    onChange={(e) => setEditForm({ ...editForm, singleSupplement: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                  />
                                </div>
                              </div>
                              <div className="flex space-x-3 pt-2">
                                <button
                                  onClick={handleSave}
                                  className="flex-1 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="flex-1 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 text-gray-900">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center text-lg font-bold text-gray-900 mb-1">
                                    <Calendar className="w-4 h-4 mr-2 text-blue-700" />
                                    <span className="text-gray-900">{entry.startDate} - {entry.endDate}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-800 mb-2 flex-wrap">
                                    <Clock className="w-4 h-4 mr-1 text-amber-600" />
                                    <span className="font-medium text-gray-900">{entry.nights} nights</span>
                                    <span className="mx-2 text-gray-600">•</span>
                                    <Ship className="w-4 h-4 mr-1 text-green-700" />
                                    <span className="text-gray-900">{entry.startPoint}</span>
                                    <span className="mx-1 text-gray-600">→</span>
                                    <MapPin className="w-4 h-4 mr-1 text-red-700" />
                                    <span className="text-gray-900">{entry.endPoint}</span>
                                  </div>
                                </div>
                                {isAdmin && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEdit(entry)}
                                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                    >
                                      Edit
                                    </button>
                                    {!entry.id.startsWith('gen-') && (
                                      <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                                  <div className="flex items-center text-blue-800 font-semibold mb-1">
                                    <Users className="w-4 h-4 mr-1 text-blue-700" />
                                    <span className="leading-tight">
                                      <span className="block text-blue-900">Premium</span>
                                      <span className="block text-xs text-blue-700">Per Person</span>
                                    </span>
                                  </div>
                                  <div className="text-xl font-bold text-blue-900">{entry.doublePrice}</div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded border border-purple-100">
                                  <div className="flex items-center text-purple-800 font-semibold mb-1">
                                    <Crown className="w-4 h-4 mr-1 text-purple-700" />
                                    <span className="leading-tight">
                                      <span className="block text-purple-900">Luxury</span>
                                      <span className="block text-xs text-purple-700">Per Person</span>
                                    </span>
                                  </div>
                                  <div className="text-xl font-bold text-purple-900">{entry.singleSupplement}</div>
                                </div>
                              </div>
                              {entry.notes && (
                                <div className="bg-amber-50 p-2 rounded text-xs text-amber-800">
                                  <strong>Note:</strong> {entry.notes}
                                </div>
                              )}
                              <div className="pt-2 space-y-2">
                                <Link
                                  href={`/booking?startDate=${encodeURIComponent(entry.startDate)}&endDate=${encodeURIComponent(entry.endDate)}&from=${encodeURIComponent(entry.startPoint)}&to=${encodeURIComponent(entry.endPoint)}&nights=${entry.nights}`}
                                >
                                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm">
                                    Book Now
                                  </button>
                                </Link>
                                <Link
                                  href={`/itineraries?from=${encodeURIComponent(entry.startPoint)}&to=${encodeURIComponent(entry.endPoint)}&nights=${entry.nights}&startDate=${encodeURIComponent(entry.startDate)}`}
                                >
                                  <button className="w-full bg-white hover:bg-gray-50 text-blue-700 border border-blue-600 px-4 py-2 rounded-md text-sm font-semibold shadow-sm">
                                    View Details
                                  </button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    <div className="bg-amber-50 px-6 py-4 border-t border-amber-200">
                      <div className="flex items-start">
                        <div className="text-2xl text-amber-600 mr-3">𓀀</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-amber-800 mb-2">Important Notes:</h4>
                          <ul className="text-sm text-amber-700 space-y-1">
                            <li>• All prices are per person and subject to change</li>
                            <li>• Detailed itinerary available for each tour</li>
                            <li>• Special notes may apply to specific dates</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </PharaohCard>
                </AnimatedSection>
              );
            })}

            {/* Contact Section */}
            <PharaohCard className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800 overflow-hidden border-2 border-blue-300">
              <div className="px-8 py-12 text-center">
                <div className="text-5xl mb-6 text-blue-600">𓊨𓊽</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready to Book Your Dahabiya Adventure?</h3>
                <p className="text-lg mb-8 text-gray-700">Contact us to reserve your dates or customize your itinerary</p>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-2 text-blue-600" />
                    <span>+20 123 456 789</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    <span>info@dahabiya-nile.com</span>
                  </div>
                </div>
                <div className="mt-8">
                  <PharaohButton className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                    Contact Us Now
                  </PharaohButton>
                </div>
              </div>
            </PharaohCard>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
