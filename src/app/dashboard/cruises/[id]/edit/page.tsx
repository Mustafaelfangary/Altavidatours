"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditCruisePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    capacity: "",
    itinerary: "",
  });

  useEffect(() => {
    fetch(`/api/dashboard/cruises/${id}`)
      .then(r => r.json())
      .then(data => {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: String(data.price || ""),
          duration: String(data.duration || ""),
          capacity: String(data.capacity || ""),
          itinerary: data.itinerary || "",
        });
        setFetching(false);
      })
      .catch(e => { console.error(e); setFetching(false); });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/dashboard/cruises/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          capacity: parseInt(formData.capacity),
        }),
      });

      if (response.ok) {
        router.push("/dashboard/cruises");
      } else {
        alert("Failed to update cruise");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update cruise");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/cruises"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
        <div><h1 className="text-3xl font-bold">Edit Cruise</h1><p className="text-muted-foreground">Update cruise details</p></div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Cruise Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="name">Cruise Name *</Label><Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
            <div><Label htmlFor="description">Description *</Label><Textarea id="description" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label htmlFor="price">Price ($) *</Label><Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required /></div>
              <div><Label htmlFor="duration">Duration (days) *</Label><Input id="duration" type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required /></div>
              <div><Label htmlFor="capacity">Capacity *</Label><Input id="capacity" type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required /></div>
            </div>
            <div><Label htmlFor="itinerary">Itinerary</Label><Textarea id="itinerary" rows={6} value={formData.itinerary} onChange={e => setFormData({...formData, itinerary: e.target.value})} /></div>
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/dashboard/cruises"><Button type="button" variant="outline">Cancel</Button></Link>
              <Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? "Saving..." : "Save Changes"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

