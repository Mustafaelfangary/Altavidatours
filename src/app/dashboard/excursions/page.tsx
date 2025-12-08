"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, MapPin, Compass } from "lucide-react";

interface Excursion {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  _count?: { bookedExcursions: number };
}

export default function ExcursionsPage() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExcursions();
  }, []);

  const fetchExcursions = async () => {
    try {
      const response = await fetch("/api/dashboard/excursions");
      if (response.ok) {
        const data = await response.json();
        setExcursions(data);
      }
    } catch (error) {
      console.error("Failed to fetch excursions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this excursion?")) return;
    
    try {
      const response = await fetch(`/api/dashboard/excursions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setExcursions(excursions.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete excursion:", error);
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      HISTORICAL: "Historical",
      DESERT: "Desert Adventure",
      CULTURAL: "Cultural",
      BEACH: "Beach",
      OTHER: "Other",
    };
    return types[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      HISTORICAL: "bg-red-100 text-red-800",
      DESERT: "bg-orange-100 text-orange-800",
      CULTURAL: "bg-purple-100 text-purple-800",
      BEACH: "bg-blue-100 text-blue-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
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
          <h1 className="text-3xl font-bold">Excursions</h1>
          <p className="text-muted-foreground">Manage your excursion offerings</p>
        </div>
        <Link href="/dashboard/excursions/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Excursion
          </Button>
        </Link>
      </div>

      {excursions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Compass className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No excursions yet</h3>
            <p className="text-muted-foreground mb-4">Create your first excursion to get started</p>
            <Link href="/dashboard/excursions/new">
              <Button><Plus className="w-4 h-4 mr-2" />Add Excursion</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>All Excursions ({excursions.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Bookings</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {excursions.map((excursion) => (
                    <tr key={excursion.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{excursion.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(excursion.type)}`}>
                          {getTypeLabel(excursion.type)}
                        </span>
                      </td>
                      <td className="py-3 px-4">${Number(excursion.price).toFixed(0)}</td>
                      <td className="py-3 px-4">{excursion._count?.bookedExcursions || 0}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/excursions/${excursion.id}`}><Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button></Link>
                          <Link href={`/dashboard/excursions/${excursion.id}/edit`}><Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button></Link>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(excursion.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

