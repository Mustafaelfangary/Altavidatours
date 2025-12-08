"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Star, Users, MapPin } from "lucide-react";
import Image from "next/image";

interface DailyTour {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  rating: number;
  type: string;
  category: string;
  mainImageUrl?: string;
  features: string[];
  amenities: string[];
  itinerary?: { name: string };
  _count?: { bookings: number; reviews: number };
}

export default function DailyToursPage() {
  const [tours, setTours] = useState<DailyTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/dashboard/daily-tours");
      if (response.ok) {
        const data = await response.json();
        setTours(data);
      }
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;
    
    try {
      const response = await fetch(`/api/dashboard/daily-tours/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTours(tours.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete tour:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Tours</h1>
          <p className="text-muted-foreground">Manage your daily tour offerings</p>
        </div>
        <Link href="/dashboard/daily-tours/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Tour
          </Button>
        </Link>
      </div>

      {tours.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tours yet</h3>
            <p className="text-muted-foreground mb-4">Create your first daily tour to get started</p>
            <Link href="/dashboard/daily-tours/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Tour
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden">
              <div className="relative h-48">
                {tour.mainImageUrl ? (
                  <Image
                    src={tour.mainImageUrl}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-medium">
                  ${Number(tour.pricePerDay).toFixed(0)}/day
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{tour.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tour.shortDescription || tour.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {tour.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {tour.capacity}
                  </span>
                  <span className="capitalize">{tour.type.toLowerCase()}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/daily-tours/${tour.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/daily-tours/${tour.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(tour.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

