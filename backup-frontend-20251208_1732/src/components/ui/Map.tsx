'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    position: {
      lat: number;
      lng: number;
    };
    title?: string;
    draggable?: boolean;
  }>;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onMarkerDragEnd?: (e: google.maps.MapMouseEvent, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Map({
  center = { lat: 30.0444, lng: 31.2357 }, // Default to Cairo
  zoom = 12,
  markers = [],
  onClick,
  onMarkerDragEnd,
  className = '',
  style = {},
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();

        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        setMap(mapInstance);

        // Add click event listener
        if (onClick) {
          mapInstance.addListener('click', (e) => {
            if (e.placeId) {
              e.stop();
            }
            onClick(e);
          });
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    initMap();

    return () => {
      // Clean up event listeners
      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      if (zoom !== undefined) {
        map.setZoom(zoom);
      }
    }
  }, [map, center, zoom]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add new markers
    markers.forEach((marker, index) => {
      const mapMarker = new google.maps.Marker({
        position: marker.position,
        map,
        title: marker.title,
        draggable: marker.draggable,
        animation: google.maps.Animation.DROP,
      });

      if (marker.draggable && onMarkerDragEnd) {
        mapMarker.addListener('dragend', (e) => {
          if (onMarkerDragEnd && e.latLng) {
            onMarkerDragEnd(
              {
                latLng: e.latLng,
                stop: () => {},
                // Add other required properties
              } as google.maps.MapMouseEvent,
              index
            );
          }
        });
      }

      newMarkers.push(mapMarker);
    });

    setMapMarkers(newMarkers);

    // Fit bounds to show all markers if there are any
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(marker.position);
      });
      map.fitBounds(bounds);
    }

    return () => {
      // Clean up markers
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, markers, onMarkerDragEnd]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full min-h-[300px] rounded-md overflow-hidden ${className}`}
      style={style}
    />
  );
}
