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

export default function EditExcursionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "OTHER",
  });

  useEffect(() => {
    fetch(`/api/dashboard/excursions/${id}`)
      .then(r => r.json())
      .then(data => {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: String(data.price || ""),
          type: data.type || "OTHER",
        });
        setFetching(false);
      })
      .catch(e => { console.error(e); setFetching(false); });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/dashboard/excursions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        router.push("/dashboard/excursions");
      } else {
        alert("Failed to update excursion");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update excursion");
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
        <Link href="/dashboard/excursions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Excursion</h1>
          <p className="text-muted-foreground">Update excursion details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Excursion Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Excursion Name *</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <select id="type" className="w-full border rounded-md p-2 h-10" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="HISTORICAL">Historical</option>
                  <option value="DESERT">Desert Adventure</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="BEACH">Beach</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/dashboard/excursions"><Button type="button" variant="outline">Cancel</Button></Link>
              <Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? "Saving..." : "Save Changes"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

