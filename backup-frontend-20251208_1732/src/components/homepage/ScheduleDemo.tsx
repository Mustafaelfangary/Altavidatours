'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ship, Calendar, MapPin, Crown, Star, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface ScheduleEntry {
  id: string;
  month?: string;
  year?: string;
  startDate: string;
  endDate: string;
  nights: number;
  startPoint?: string;
  endPoint?: string;
  route?: string;
  doublePrice: string;
  singleSupplement: string;
  detailedItinerary?: string;
  notes?: string;
  isActive: boolean;
  sortOrder: number;
}

interface ScheduleDemoProps {
  dahabiyaName?: string;
  category?: string;
  className?: string;
}

export default function ScheduleDemo({ dahabiyaName, category = 'Premium', className = '' }: ScheduleDemoProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleData();
  }, [dahabiyaName]);

  const fetchScheduleData = async () => {
    try {
      // Fetch real schedule data from schedule-entries API
      const response = await fetch('/api/schedule-entries');
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('API returned non-JSON response, using category-based sample data');
        setScheduleData(getSampleData());
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        if (data.entries && Array.isArray(data.entries)) {
          // Filter active entries and get next 4 upcoming dates
          const activeEntries = data.entries.filter((entry: ScheduleEntry) => entry.isActive);
          const upcomingEntries = getUpcomingEntries(activeEntries);
          
          // If we have real data, update pricing based on category
          if (upcomingEntries.length > 0) {
            const updatedEntries = updatePricingByCategory(upcomingEntries);
            setScheduleData(updatedEntries);
          } else {
            setScheduleData(getSampleData());
          }
        } else {
          setScheduleData(getSampleData());
        }
      } else {
        console.warn('API response not OK, using category-based sample data');
        setScheduleData(getSampleData());
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setScheduleData(getSampleData());
    } finally {
      setLoading(false);
    }
  };
  
  const updatePricingByCategory = (entries: ScheduleEntry[]): ScheduleEntry[] => {
    return entries.map(entry => {
      const categoryData = getCategorySpecificData();
      
      // Update pricing based on nights and category
      if (entry.nights === 4) {
        return {
          ...entry,
          doublePrice: categoryData.pricing.first,
          singleSupplement: categoryData.pricing.firstSupplement
        };
      } else if (entry.nights === 3) {
        return {
          ...entry,
          doublePrice: categoryData.pricing.second,
          singleSupplement: categoryData.pricing.secondSupplement
        };
      }
      
      return entry;
    });
  };
  
  const getCategorySpecificData = () => {
    switch (category?.toUpperCase()) {
      case 'LUXURY':
        return {
          pricing: { first: '$2,800', firstSupplement: '$4,200', second: '$2,100', secondSupplement: '$3,100' },
          routes: [
            { start: 'Luxor', end: 'Aswan', firstDay: 20, secondDay: 12 },
            { start: 'Aswan', end: 'Luxor', firstDay: 25, secondDay: 18 }
          ],
          nights: [4, 3],
          itineraries: ['Luxury 4 Nights Nile Journey', 'Luxury 3 Nights Heritage Tour']
        };
      case 'PREMIUM':
        return {
          pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
          routes: [
            { start: 'Luxor', end: 'Aswan', firstDay: 15, secondDay: 8 },
            { start: 'Aswan', end: 'Luxor', firstDay: 22, secondDay: 14 }
          ],
          nights: [4, 3],
          itineraries: ['Premium 4 Nights Classic Journey', 'Premium 3 Nights Nile Discovery']
        };
      case 'DELUXE':
        return {
          pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
          routes: [
            { start: 'Luxor', end: 'Aswan', firstDay: 12, secondDay: 5 },
            { start: 'Aswan', end: 'Luxor', firstDay: 18, secondDay: 10 }
          ],
          nights: [4, 3],
          itineraries: ['Deluxe 4 Nights Nile Explorer', 'Deluxe 3 Nights Heritage Valley Tour']
        };
      case 'BOUTIQUE':
        return {
          pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
          routes: [
            { start: 'Luxor', end: 'Aswan', firstDay: 10, secondDay: 3 },
            { start: 'Aswan', end: 'Luxor', firstDay: 16, secondDay: 8 }
          ],
          nights: [4, 3],
          itineraries: ['Boutique 4 Nights Intimate Journey', 'Boutique 3 Nights River Experience']
        };
      default:
        return {
          pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
          routes: [
            { start: 'Luxor', end: 'Aswan', firstDay: 15, secondDay: 8 },
            { start: 'Aswan', end: 'Luxor', firstDay: 20, secondDay: 12 }
          ],
          nights: [4, 3],
          itineraries: ['4 Nights Pharaonic Journey through Ancient Egypt', '3 Nights Heritage Tour of the Nile']
        };
    }
  };
  
  const getUpcomingEntries = (entries: ScheduleEntry[]): ScheduleEntry[] => {
    const currentDate = new Date();
    
    // Filter entries that are in the future
    const futureEntries = entries.filter(entry => {
      // Parse the start date string (format: "DD Month YYYY")
      const startDate = parseStartDate(entry.startDate);
      if (!startDate) return false;
      
      // Check if the entry start date is in the future (today or later)
      return startDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    });
    
    // Sort by actual start date
    const sortedEntries = futureEntries.sort((a, b) => {
      const dateA = parseStartDate(a.startDate || '');
      const dateB = parseStartDate(b.startDate || '');
      
      if (!dateA || !dateB) return 0;
      
      const timeDiff = dateA.getTime() - dateB.getTime();
      if (timeDiff !== 0) return timeDiff;
      
      return a.sortOrder - b.sortOrder;
    });
    
    // Return the next 4 entries
    return sortedEntries.slice(0, 4);
  };
  
  const parseStartDate = (startDateStr: string): Date | null => {
    try {
      if (!startDateStr || startDateStr.trim() === '') return null;
      
      // Parse date format: "DD Month YYYY" (e.g., "15 December 2024")
      const parts = startDateStr.trim().split(' ');
      if (parts.length !== 3) return null;
      
      const day = parseInt(parts[0], 10);
      const monthName = parts[1];
      const year = parseInt(parts[2], 10);
      
      if (isNaN(day) || isNaN(year)) return null;
      
      const monthIndex = getMonthIndex(monthName);
      if (monthIndex === -1) return null;
      
      return new Date(year, monthIndex, day);
    } catch (error) {
      console.warn('Error parsing date:', startDateStr, error);
      return null;
    }
  };

  const parseEndDate = (endDateStr: string): Date | null => {
    try {
      if (!endDateStr || endDateStr.trim() === '') return null;
      
      // Parse date format: "DD Month YYYY" (e.g., "15 December 2024")
      const parts = endDateStr.trim().split(' ');
      if (parts.length !== 3) return null;
      
      const day = parseInt(parts[0], 10);
      const monthName = parts[1];
      const year = parseInt(parts[2], 10);
      
      if (isNaN(day) || isNaN(year)) return null;
      
      const monthIndex = getMonthIndex(monthName);
      if (monthIndex === -1) return null;
      
      return new Date(year, monthIndex, day);
    } catch (error) {
      console.warn('Error parsing date:', endDateStr, error);
      return null;
    }
  };

  const parseRoute = (routeStr: string): string | null => {
    try {
      // Parse route format: "Start - End" (e.g., "Luxor - Aswan")
      const parts = routeStr.trim().split(' - ');
      if (parts.length !== 2) return null;
      
      return parts.join(' - ');
    } catch (error) {
      console.warn('Error parsing route:', routeStr, error);
      return null;
    }
  };
  
  const getMonthIndex = (monthName: string): number => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(monthName);
  };

  const getSampleData = (): ScheduleEntry[] => {
    // Generate dynamic sample data with future dates
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Get next month and year for first entry
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear = currentYear + 1;
    }
    
    // Get month after next for second entry
    let secondMonth = nextMonth + 1;
    let secondYear = nextYear;
    if (secondMonth > 11) {
      secondMonth = 0;
      secondYear = nextYear + 1;
    }
    
    // Get third month for third entry
    let thirdMonth = secondMonth + 1;
    let thirdYear = secondYear;
    if (thirdMonth > 11) {
      thirdMonth = 0;
      thirdYear = secondYear + 1;
    }
    
    // Get fourth month for fourth entry
    let fourthMonth = thirdMonth + 1;
    let fourthYear = thirdYear;
    if (fourthMonth > 11) {
      fourthMonth = 0;
      fourthYear = thirdYear + 1;
    }
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Category-specific sample data with updated pricing
    const getCategorySpecificData = () => {
      switch (category?.toUpperCase()) {
        case 'LUXURY':
          return {
            pricing: { first: '$2,800', firstSupplement: '$4,200', second: '$2,100', secondSupplement: '$3,100' },
            routes: [
              { start: 'Luxor', end: 'Aswan', firstDay: 20, secondDay: 12 },
              { start: 'Aswan', end: 'Luxor', firstDay: 25, secondDay: 18 }
            ],
            nights: [4, 3],
            itineraries: ['Luxury 4 Nights Nile Journey', 'Luxury 3 Nights Heritage Tour']
          };
        case 'PREMIUM':
          return {
            pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
            routes: [
              { start: 'Luxor', end: 'Aswan', firstDay: 15, secondDay: 8 },
              { start: 'Aswan', end: 'Luxor', firstDay: 22, secondDay: 14 }
            ],
            nights: [4, 3],
            itineraries: ['Premium 4 Nights Classic Journey', 'Premium 3 Nights Nile Discovery']
          };
        case 'DELUXE':
          return {
            pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
            routes: [
              { start: 'Luxor', end: 'Aswan', firstDay: 12, secondDay: 5 },
              { start: 'Aswan', end: 'Luxor', firstDay: 18, secondDay: 10 }
            ],
            nights: [4, 3],
            itineraries: ['Deluxe 4 Nights Nile Explorer', 'Deluxe 3 Nights Heritage Valley Tour']
          };
        case 'BOUTIQUE':
          return {
            pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
            routes: [
              { start: 'Luxor', end: 'Aswan', firstDay: 10, secondDay: 3 },
              { start: 'Aswan', end: 'Luxor', firstDay: 16, secondDay: 8 }
            ],
            nights: [4, 3],
            itineraries: ['Boutique 4 Nights Intimate Journey', 'Boutique 3 Nights River Experience']
          };
        default:
          return {
            pricing: { first: '$1,900', firstSupplement: '$2,800', second: '$1,425', secondSupplement: '$2,100' },
            routes: [
              { start: 'Luxor', end: 'Aswan', firstDay: 15, secondDay: 8 },
              { start: 'Aswan', end: 'Luxor', firstDay: 20, secondDay: 12 }
            ],
            nights: [4, 3],
            itineraries: ['4 Nights Pharaonic Journey through Ancient Egypt', '3 Nights Heritage Tour of the Nile']
          };
      }
    };
    
    const categoryData = getCategorySpecificData();
    const route1 = categoryData.routes[0];
    const route2 = categoryData.routes[1];
    
    return [
      {
        id: categoryData.itineraries[0] || 'default-itinerary-1',
        startDate: `${route1?.firstDay || 15} ${months[nextMonth]} ${nextYear}`,
        nights: categoryData.nights[0] || 4,
        route: `${route1?.start || 'Luxor'} - ${route1?.end || 'Aswan'}`,
        startPoint: route1?.start || 'Luxor',
        endPoint: route1?.end || 'Aswan',
        endDate: `${route1?.end || 'Aswan'}`,
        doublePrice: categoryData.pricing.first,
        singleSupplement: categoryData.pricing.firstSupplement,
        detailedItinerary: categoryData.itineraries[0] || 'Default Itinerary 1',
        month: months[nextMonth] || 'January',
        year: nextYear.toString(),
        isActive: true,
        sortOrder: 1
      },
      {
        id: categoryData.itineraries[1] || 'default-itinerary-2',
        startDate: `${route2?.secondDay || 8} ${months[secondMonth]} ${secondYear}`,
        nights: categoryData.nights[1] || 3,
        route: `${route2?.start || 'Aswan'} - ${route2?.end || 'Luxor'}`,
        startPoint: route2?.start || 'Aswan',
        endPoint: route2?.end || 'Luxor',
        endDate: `${route2?.end || 'Luxor'}`,
        doublePrice: categoryData.pricing.second,
        singleSupplement: categoryData.pricing.secondSupplement,
        detailedItinerary: categoryData.itineraries[1] || 'Default Itinerary 2',
        month: months[secondMonth] || 'February',
        year: secondYear.toString(),
        isActive: true,
        sortOrder: 2
      },
      {
        id: categoryData.itineraries[0] || 'default-itinerary-3',
        startDate: `${route1?.firstDay || 15} ${months[thirdMonth]} ${thirdYear}`,
        nights: categoryData.nights[0] || 4,
        route: `${route1?.start || 'Luxor'} - ${route1?.end || 'Aswan'}`,
        startPoint: route1?.start || 'Luxor',
        endPoint: route1?.end || 'Aswan',
        endDate: `${route1?.end || 'Aswan'}`,
        doublePrice: categoryData.pricing.first,
        singleSupplement: categoryData.pricing.firstSupplement,
        detailedItinerary: categoryData.itineraries[0] || 'Default Itinerary 3',
        month: months[thirdMonth] || 'March',
        year: thirdYear.toString(),
        isActive: true,
        sortOrder: 3
      },
      {
        id: categoryData.itineraries[1] || 'default-itinerary-4',
        startDate: `${route2?.secondDay || 8} ${months[fourthMonth]} ${fourthYear}`,
        nights: categoryData.nights[1] || 3,
        route: `${route2?.start || 'Aswan'} - ${route2?.end || 'Luxor'}`,
        startPoint: route2?.start || 'Aswan',
        endPoint: route2?.end || 'Luxor',
        endDate: `${route2?.end || 'Luxor'}`,
        doublePrice: categoryData.pricing.second,
        singleSupplement: categoryData.pricing.secondSupplement,
        detailedItinerary: categoryData.itineraries[1] || 'Default Itinerary 4',
        month: months[fourthMonth] || 'April',
        year: fourthYear.toString(),
        isActive: true,
        sortOrder: 4
      }
    ];
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6 h-64"></div>
      </div>
    );
  }

  if (scheduleData.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Compact Embarkation Table */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl border-2 border-blue-200 shadow-lg w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 px-6 py-4 border-b border-blue-200">
          <div className="flex items-center justify-center">
            <Ship className="w-5 h-5 mr-2 text-blue-700 flex-shrink-0" />
            <span className="text-lg font-bold text-blue-900 flex items-center flex-shrink-0">
              <span className="mr-2 text-xl">𓊪𓄿</span>
              <span className="whitespace-nowrap">{category} Departures</span>
              <span className="ml-2 text-xl">𓊪𓄿</span>
            </span>
            <Crown className="w-5 h-5 ml-2 text-blue-700 flex-shrink-0" />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {scheduleData.slice(0, 4).map((entry, index) => (
              <div
                key={entry.id || index}
                className="bg-white rounded-xl p-6 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 w-full"
              >
                {/* Mobile and Small Screen Layout */}
                <div className="block lg:hidden space-y-3 w-full">
                  {/* Row 1: Route and Departure */}
                  <div className="flex flex-col gap-3 w-full">
                    {/* Route */}
                    <div className="flex items-start space-x-3 w-full">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">ROUTE</div>
                        <div className="font-semibold text-gray-800 text-sm leading-tight">
                          <span className="text-emerald-600 mr-1">𓄖</span>
                          {entry.startPoint} → {entry.endPoint}
                        </div>
                      </div>
                    </div>

                    {/* Departure */}
                    <div className="flex items-start space-x-3 w-full">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">DEPARTURE</div>
                        <div className="font-semibold text-gray-800 text-sm leading-tight">
                          <span className="text-blue-600 mr-1">𓊨</span>
                          {entry.startDate}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{entry.month} {entry.year}</div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Duration and Price */}
                  <div className="flex flex-col gap-3 w-full">
                    {/* Duration */}
                    <div className="flex items-start space-x-3 w-full">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">DURATION</div>
                        <div className="font-semibold text-gray-800 text-sm leading-tight">
                          <span className="text-purple-600 mr-1">𓊣</span>
                          {entry.nights} Nights
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Until {entry.endDate}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-start space-x-3 w-full">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">FROM</div>
                        <div className="font-bold text-blue-600 text-lg leading-tight">
                          <span className="text-blue-600 mr-1">𓎚</span>
                          {entry.doublePrice.replace('$', '$')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Book Button */}
                  <div className="pt-3 border-t border-gray-100">
                    <Link href={`/booking?startDate=${encodeURIComponent(entry.startDate)}&nights=${entry.nights}&route=${encodeURIComponent(entry.startPoint + '-' + entry.endPoint)}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-sm">
                        <span className="mr-1">𓇳</span>
                        Book This Journey
                        <span className="ml-1">𓊪</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Large Screen Layout */}
                <div className="hidden lg:flex lg:items-center lg:justify-between w-full">
                  {/* Route */}
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">ROUTE</div>
                      <div className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                        <span className="text-emerald-600 mr-1">𓄖</span>
                        {entry.startPoint} → {entry.endPoint}
                      </div>
                    </div>
                  </div>

                  {/* Departure */}
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">DEPARTURE</div>
                      <div className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                        <span className="text-blue-600 mr-1">𓊨</span>
                        {entry.startDate}
                      </div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">{entry.month} {entry.year}</div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">DURATION</div>
                      <div className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                        <span className="text-purple-600 mr-1">𓊣</span>
                        {entry.nights} Nights
                      </div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">Until {entry.endDate}</div>
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="flex items-center space-x-3 flex-1 justify-end">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">FROM</div>
                        <div className="font-bold text-blue-600 text-lg whitespace-nowrap">
                          <span className="text-blue-600 mr-1">𓎚</span>
                          {entry.doublePrice.replace('$', '$')}
                        </div>
                      </div>
                    </div>
                    <Link href={`/booking?startDate=${encodeURIComponent(entry.startDate)}&nights=${entry.nights}&route=${encodeURIComponent(entry.startPoint + '-' + entry.endPoint)}`}>
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap text-sm">
                        <span className="mr-1">𓇳</span>
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-4 flex items-center justify-center">
            <Link href="/schedule-and-rates">
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs px-4 py-2 rounded-full font-medium transition-all duration-200"
              >
                <Calendar className="w-3 h-3 mr-1" />
                <span className="mr-1">𓊪𓄿</span>
                View Full Schedule
                <span className="ml-1">𓊪𓄿</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
