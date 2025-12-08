"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Ship, Users, Clock } from "lucide-react";
import Image from "next/image";
import imageLoader from '@/utils/imageLoader';

interface Cruise {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  capacity: number;
  itinerary: string;
  images: { id: string; url: string }[];
}

export default function CruisesPage() {
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCruises();
  }, []);

  const fetchCruises = async () => {
    try {
      const response = await fetch("/api/dashboard/cruises");
      if (response.ok) {
        const data = await response.json();
        setCruises(data);
      }
    } catch (error) {
      console.error("Failed to fetch cruises:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cruise?")) return;
    
    try {
      const response = await fetch(`/api/dashboard/cruises/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCruises(cruises.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete cruise:", error);
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
          <h1 className="text-3xl font-bold">Cruises</h1>
          <p className="text-muted-foreground">Manage your cruise offerings</p>
        </div>
        <Link href="/dashboard/cruises/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Cruise
          </Button>
        </Link>
      </div>

      {cruises.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Ship className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cruises yet</h3>
            <p className="text-muted-foreground mb-4">Create your first cruise to get started</p>
            <Link href="/dashboard/cruises/new">
              <Button><Plus className="w-4 h-4 mr-2" />Add Cruise</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cruises.map((cruise) => (
            <Card key={cruise.id} className="overflow-hidden">
              <div className="relative h-48">
                {cruise.images?.[0]?.url ? (
                  <Image src={cruise.images[0].url} alt={cruise.name} fill className="object-cover" loader={imageLoader} />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Ship className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-medium">
                  ${cruise.price}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{cruise.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{cruise.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{cruise.duration} days</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{cruise.capacity}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/cruises/${cruise.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full"><Eye className="w-4 h-4 mr-1" /> View</Button>
                  </Link>
                  <Link href={`/dashboard/cruises/${cruise.id}/edit`}>
                    <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(cruise.id)}>
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

