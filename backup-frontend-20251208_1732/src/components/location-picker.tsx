'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: string;
  description: string;
}

interface LocationPickerProps {
  value: Location;
  onChange: (location: Location) => void;
  className?: string;
}

export function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Initialize the Google Maps API loader
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geocoding'],
        });

        await loader.load();

        // Initialize geocoder
        const geocoderInstance = new google.maps.Geocoder();
        setGeocoder(geocoderInstance);

        // Create map instance
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: {
            lat: value?.coordinates?.[1] || 30.0444,
            lng: value?.coordinates?.[0] || 31.2357,
          },
          zoom: value?.coordinates ? 12 : 8,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          clickableIcons: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        setMap(mapInstance);

        // Add click listener to the map
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          
          updateLocation(lat, lng, geocoderInstance);
        });

        // Add marker if coordinates exist
        if (value?.coordinates) {
          const markerInstance = new google.maps.Marker({
            position: {
              lat: value.coordinates[1],
              lng: value.coordinates[0],
            },
            map: mapInstance,
            draggable: true,
            title: 'Selected Location',
          });

          markerInstance.addListener('dragend', () => {
            const position = markerInstance.getPosition();
            if (position) {
              updateLocation(position.lat(), position.lng(), geocoderInstance);
            }
          });

          setMarker(markerInstance);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please check your internet connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, []);

  // Update marker position when value changes
  useEffect(() => {
    if (!map || !marker || !value?.coordinates) return;

    const newPosition = {
      lat: value.coordinates[1],
      lng: value.coordinates[0],
    };

    marker.setPosition(newPosition);
    map.panTo(newPosition);
  }, [value?.coordinates]);

  const updateLocation = async (
    lat: number,
    lng: number,
    geocoderInstance = geocoder
  ) => {
    if (!geocoderInstance) return;

    try {
      setIsLoading(true);
      setError(null);

      // Reverse geocode to get address
      const response = await geocoderInstance.geocode({
        location: { lat, lng },
      });

      const result = response.results[0];
      if (!result) throw new Error('No address found for this location');

      const address = result.formatted_address;
      const description = [
        result.address_components[0]?.long_name,
        result.address_components[1]?.long_name,
      ]
        .filter(Boolean)
        .join(', ');

      const newLocation: Location = {
        type: 'Point',
        coordinates: [lng, lat],
        address,
        description: description || address,
      };

      onChange(newLocation);
      setSearchQuery(address);
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to get address for this location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!geocoder || !map || !searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await geocoder.geocode({
        address: searchQuery,
        componentRestrictions: { country: 'EG' }, // Focus on Egypt
      });

      const result = response.results[0];
      if (!result) throw new Error('Location not found');

      const { lat, lng } = result.geometry.location;
      
      // Update the map view
      map.panTo({ lat: lat(), lng: lng() });
      map.setZoom(15);

      // Update the location
      updateLocation(lat(), lng());
    } catch (err) {
      console.error('Error searching location:', err);
      setError('Location not found. Please try a different search term.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a location..."
            className="pr-10"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <div
        ref={mapRef}
        className="h-64 w-full rounded-md border bg-muted/50"
      />

      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-sm text-muted-foreground">
            {searchQuery ? 'Searching...' : 'Loading map...'}
          </span>
        </div>
      )}

      {value?.address && (
        <div className="flex items-start gap-2 rounded-md border p-3 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">{value.description}</p>
            <p className="text-muted-foreground">{value.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
