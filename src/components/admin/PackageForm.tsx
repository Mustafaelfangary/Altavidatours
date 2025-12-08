"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Ship, Calendar, Users, Star } from "lucide-react";

interface PackageFormProps {
  onSuccess?: () => void;
  initialData?: any;
  dahabiyas?: Array<{
    id: string;
    name: string;
    pricePerDay: number;
  }>;
  isEditing?: boolean;
}

interface Dahabiya {
  id: string;
  name: string;
  pricePerDay: number;
  capacity?: number;
}

export default function PackageForm({ onSuccess, initialData, dahabiyas: propDahabiyas, isEditing = false }: PackageFormProps) {
  const [loading, setLoading] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>(propDahabiyas || []);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price || 0,
    durationDays: initialData?.durationDays || 1,
    mainImageUrl: initialData?.mainImageUrl || "",
    packageType: initialData?.packageType || "CAIRO_DAHABIYA",
    selectedDahabiyaId: initialData?.selectedDahabiyaId || "",
    cairoNights: initialData?.cairoNights || 2,
    dahabiyaNights: initialData?.dahabiyaNights || 4,
    maxGuests: initialData?.maxGuests || 12,
    highlights: initialData?.highlights || [] as string[],
  });
  const [itineraryDays, setItineraryDays] = useState<{
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    images: { url: string; alt?: string }[];
    location: string;
    activities: string[];
  }[]>(
    initialData?.itineraryDays?.map((day: any) => ({
      id: day.id || Math.random().toString(36).substr(2, 9),
      dayNumber: day.dayNumber,
      title: day.title,
      description: day.description,
      location: day.location || '',
      activities: Array.isArray(day.activities) ? day.activities : [],
      images: day.images || []
    })) || []
  );
  const [newDay, setNewDay] = useState({ title: "", description: "", location: "", activities: "" });

  // Media Library State
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaTarget, setCurrentMediaTarget] = useState<{
    type: 'main' | 'itinerary';
    acceptedTypes: ('IMAGE' | 'VIDEO')[];
    dayId?: string;
    imageIndex?: number;
  } | null>(null);

  // Fetch dahabiyas on component mount
  useEffect(() => {
    const fetchDahabiyas = async () => {
      try {
        const response = await fetch('/api/dahabiyat');
        const data = await response.json();
        setDahabiyas(data.dahabiyat || []);
      } catch (error) {
        console.error('Failed to fetch dahabiyas:', error);
      }
    };
    fetchDahabiyas();
  }, []);

  // AI Content Generation
  const generatePackageContent = async () => {
    if (!form.name || !form.selectedDahabiyaId) {
      toast.error('Please enter package name and select a dahabiya first');
      return;
    }

    setGeneratingContent(true);
    try {
      const selectedDahabiya = dahabiyas.find(d => d.id === form.selectedDahabiyaId);
      const response = await fetch('/api/ai/generate-package-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: form.name,
          dahabiyaName: selectedDahabiya?.name,
          cairoNights: form.cairoNights,
          dahabiyaNights: form.dahabiyaNights,
          totalDays: form.durationDays,
          packageType: form.packageType
        })
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const aiContent = await response.json();

      // Update form with AI-generated content
      setForm(prev => ({
        ...prev,
        description: aiContent.description,
        shortDescription: aiContent.shortDescription,
        highlights: aiContent.highlights || []
      }));

      // Update itinerary with AI-generated days
      if (aiContent.itinerary) {
        setItineraryDays(aiContent.itinerary.map((day: any, index: number) => ({
          id: Date.now().toString() + index,
          dayNumber: index + 1,
          title: day.title,
          description: day.description,
          location: day.location,
          activities: day.activities || [],
          images: []
        })));
      }

      toast.success('AI content generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate AI content');
    } finally {
      setGeneratingContent(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const packageData = {
        ...form,
        itineraryDays: itineraryDays.map(day => ({
          ...day,
          activities: Array.isArray(day.activities) ? day.activities : (day.activities as string).split(',').map((a: string) => a.trim()).filter(Boolean)
        }))
      };

      const url = isEditing ? `/api/packages/${initialData.id}` : '/api/packages';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageData),
      });
      if (!res.ok) throw new Error(isEditing ? "Failed to update package" : "Failed to create package");
      toast.success(isEditing ? "Package updated successfully" : "Package created successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  const addItineraryDay = () => {
    if (newDay.title.trim()) {
      setItineraryDays((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          dayNumber: prev.length + 1,
          title: newDay.title,
          description: newDay.description,
          location: newDay.location,
          activities: newDay.activities.split(',').map(a => a.trim()).filter(Boolean),
          images: [],
        },
      ]);
      setNewDay({ title: "", description: "", location: "", activities: "" });
    }
  };

  const removeItineraryDay = (id: string) => {
    setItineraryDays((prev) => prev.filter((day) => day.id !== id).map((day, idx) => ({ ...day, dayNumber: idx + 1 })));
  };

  const handleDayChange = (id: string, field: string, value: string) => {
    setItineraryDays((prev) =>
      prev.map((day) => {
        if (day.id === id) {
          if (field === 'activities') {
            return { ...day, [field]: value.split(',').map(a => a.trim()).filter(Boolean) };
          }
          return { ...day, [field]: value };
        }
        return day;
      })
    );
  };





  const handleDeleteGalleryImage = (dayId: string, imgUrl: string) => {
    setItineraryDays((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? { ...day, images: day.images.filter((img) => img.url !== imgUrl) }
          : day
      )
    );
  };

  // Media Library Handlers
  const handleMediaLibrarySelect = async (asset: any) => {
    if (!currentMediaTarget) return;

    try {
      if (currentMediaTarget.type === 'main') {
        setForm(prev => ({ ...prev, mainImageUrl: asset.url }));
      } else if (currentMediaTarget.type === 'itinerary' && currentMediaTarget.dayId) {
        if (typeof currentMediaTarget.imageIndex === 'number') {
          // Replace existing image
          setItineraryDays(prev =>
            prev.map(day =>
              day.id === currentMediaTarget.dayId
                ? {
                    ...day,
                    images: day.images.map((img, idx) =>
                      idx === currentMediaTarget.imageIndex
                        ? { ...img, url: asset.url }
                        : img
                    )
                  }
                : day
            )
          );
        } else {
          // Add new image
          setItineraryDays(prev =>
            prev.map(day =>
              day.id === currentMediaTarget.dayId
                ? { ...day, images: [...day.images, { url: asset.url, alt: '' }] }
                : day
            )
          );
        }
      }

      setShowMediaLibrary(false);
      setCurrentMediaTarget(null);
      toast.success('Media selected successfully');
    } catch (error) {
      console.error('Error selecting media:', error);
      toast.error('Failed to select media');
    }
  };

  const openMediaLibrary = (type: 'main' | 'itinerary', dayId?: string) => {
    const acceptedTypes: ('IMAGE' | 'VIDEO')[] = ['IMAGE'];
    setCurrentMediaTarget({ type, acceptedTypes, dayId });
    setShowMediaLibrary(true);
  };

  return (
    <Card className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-emerald-50 via-amber-50 to-blue-50 shadow-2xl border-2 border-pharaoh-gold/30">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-nile-blue mb-2 font-serif">Create Premium Package</h2>
        <p className="text-ancient-stone">Combine Cairo/Giza exploration with luxury dahabiya cruising</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Package Type & AI Generation */}
        <Card className="p-6 bg-gradient-to-r from-pharaoh-gold/10 to-nile-blue/10 border-pharaoh-gold/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-nile-blue flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Package Configuration
            </h3>
            <Button
              type="button"
              onClick={generatePackageContent}
              disabled={generatingContent || !form.name || !form.selectedDahabiyaId}
              className="bg-gradient-to-r from-pharaoh-gold to-amber-600 hover:from-amber-600 hover:to-pharaoh-gold text-white font-bold"
            >
              {generatingContent ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating AI Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-nile-blue">Package Name</label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                placeholder="e.g., Cairo & Nile Luxury Experience"
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-nile-blue">Package Type</label>
              <Select value={form.packageType} onValueChange={(value) => setForm(f => ({ ...f, packageType: value }))}>
                <SelectTrigger className="border-pharaoh-gold/30 focus:border-pharaoh-gold">
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAIRO_DAHABIYA">Cairo + Dahabiya Cruise</SelectItem>
                  <SelectItem value="GIZA_DAHABIYA">Giza + Dahabiya Cruise</SelectItem>
                  <SelectItem value="CAIRO_GIZA_DAHABIYA">Cairo + Giza + Dahabiya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-nile-blue">Select Dahabiya</label>
              <Select value={form.selectedDahabiyaId} onValueChange={(value) => setForm(f => ({ ...f, selectedDahabiyaId: value }))}>
                <SelectTrigger className="border-pharaoh-gold/30 focus:border-pharaoh-gold">
                  <SelectValue placeholder="Choose dahabiya" />
                </SelectTrigger>
                <SelectContent>
                  {dahabiyas.map(dahabiya => (
                    <SelectItem key={dahabiya.id} value={dahabiya.id}>
                      {dahabiya.name} - ${dahabiya.pricePerDay}/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Duration & Pricing Configuration */}
        <Card className="p-6 bg-white/80 border-nile-blue/20">
          <h3 className="text-xl font-bold text-nile-blue mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Duration & Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-nile-blue">Cairo Nights</label>
              <Input
                type="number"
                value={form.cairoNights}
                onChange={e => setForm(f => ({ ...f, cairoNights: Number(e.target.value) }))}
                min={0}
                max={10}
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-nile-blue">Dahabiya Nights</label>
              <Input
                type="number"
                value={form.dahabiyaNights}
                onChange={e => setForm(f => ({ ...f, dahabiyaNights: Number(e.target.value) }))}
                min={1}
                max={14}
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-nile-blue">Total Days</label>
              <Input
                type="number"
                value={form.durationDays}
                onChange={e => setForm(f => ({ ...f, durationDays: Number(e.target.value) }))}
                min={1}
                required
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-nile-blue">Package Price ($)</label>
              <Input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                min={0}
                step="0.01"
                required
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
            </div>
          </div>
        </Card>

        {/* Main Image & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 border-nile-blue/20">
            <label className="block text-sm font-bold mb-2 text-nile-blue">Main Package Image</label>
            <div className="space-y-4">
              {form.mainImageUrl && (
                <div className="relative">
                  <img src={form.mainImageUrl} alt="Main" className="rounded-lg shadow-lg w-full h-48 object-cover border-2 border-pharaoh-gold/30" />
                  <Badge className="absolute top-2 right-2 bg-pharaoh-gold text-white">Main Image</Badge>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMediaLibrary('main')}
                  className="flex-1 border-pharaoh-gold/30 hover:bg-pharaoh-gold/10"
                >
                  {form.mainImageUrl ? 'Replace Image' : 'Choose from Library'}
                </Button>
                {form.mainImageUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setForm(f => ({ ...f, mainImageUrl: "" }))}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 border-nile-blue/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-nile-blue">Short Description</label>
                <textarea
                  value={form.shortDescription}
                  onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                  placeholder="A compelling short summary for the package..."
                  className="w-full rounded-md border border-pharaoh-gold/30 focus:border-pharaoh-gold p-3"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-nile-blue flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Max Guests
                </label>
                <Input
                  type="number"
                  value={form.maxGuests}
                  onChange={e => setForm(f => ({ ...f, maxGuests: Number(e.target.value) }))}
                  min={1}
                  max={50}
                  className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Full Description */}
        <Card className="p-6 bg-white/80 border-nile-blue/20">
          <label className="block text-sm font-bold mb-2 text-nile-blue">Full Package Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            required
            className="w-full rounded-md border border-pharaoh-gold/30 focus:border-pharaoh-gold p-4"
            rows={6}
            placeholder="Provide a detailed description of the complete package experience, including Cairo/Giza exploration and dahabiya cruise highlights..."
          />
        </Card>

        {/* Package Highlights */}
        <Card className="p-6 bg-gradient-to-r from-pharaoh-gold/5 to-nile-blue/5 border-pharaoh-gold/30">
          <h3 className="text-xl font-bold text-nile-blue mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Package Highlights
          </h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((highlight: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-pharaoh-gold/20 text-nile-blue border-pharaoh-gold/30">
                  {highlight}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, highlights: f.highlights.filter((_: string, i: number) => i !== index) }))}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a package highlight (e.g., Private Egyptologist Guide)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value && !form.highlights.includes(value)) {
                      setForm(f => ({ ...f, highlights: [...f.highlights, value] }));
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  const value = input.value.trim();
                  if (value && !form.highlights.includes(value)) {
                    setForm(f => ({ ...f, highlights: [...f.highlights, value] }));
                    input.value = '';
                  }
                }}
                className="border-pharaoh-gold/30 hover:bg-pharaoh-gold/10"
              >
                Add
              </Button>
            </div>
          </div>
        </Card>

        {/* Itinerary Days Section */}
        <Card className="p-6 bg-white/80 border-nile-blue/20">
          <h3 className="text-xl font-bold text-nile-blue mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Daily Itinerary
          </h3>

          {/* Add New Day Form */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-pharaoh-gold/5 to-nile-blue/5 border-pharaoh-gold/20">
            <h4 className="font-semibold text-nile-blue mb-3">Add New Day</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <Input
                value={newDay.title}
                onChange={e => setNewDay(d => ({ ...d, title: e.target.value }))}
                placeholder="Day Title (e.g., Cairo Arrival)"
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
              <Input
                value={newDay.location}
                onChange={e => setNewDay(d => ({ ...d, location: e.target.value }))}
                placeholder="Location (e.g., Cairo)"
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
              <Input
                value={newDay.activities}
                onChange={e => setNewDay(d => ({ ...d, activities: e.target.value }))}
                placeholder="Activities (comma-separated)"
                className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
              />
              <Button
                type="button"
                onClick={addItineraryDay}
                className="bg-pharaoh-gold hover:bg-amber-600 text-white"
              >
                Add Day
              </Button>
            </div>
            <textarea
              value={newDay.description}
              onChange={e => setNewDay(d => ({ ...d, description: e.target.value }))}
              placeholder="Detailed description of the day's activities..."
              className="w-full rounded-md border border-pharaoh-gold/30 focus:border-pharaoh-gold p-3"
              rows={2}
            />
          </Card>

          {/* Existing Days */}
          <div className="space-y-6">
            {itineraryDays.map((day) => (
              <Card key={day.id} className="p-6 bg-gradient-to-r from-white to-pharaoh-gold/5 border-pharaoh-gold/30">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-nile-blue text-white px-3 py-1">Day {day.dayNumber}</Badge>
                    <span className="font-bold text-nile-blue">{day.location}</span>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeItineraryDay(day.id)}>
                    Remove Day
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-nile-blue">Day Title</label>
                    <Input
                      value={day.title}
                      onChange={e => handleDayChange(day.id, "title", e.target.value)}
                      placeholder="Day Title"
                      className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-nile-blue">Location</label>
                    <Input
                      value={day.location}
                      onChange={e => handleDayChange(day.id, "location", e.target.value)}
                      placeholder="Location"
                      className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-1 text-nile-blue">Activities (comma-separated)</label>
                  <Input
                    value={Array.isArray(day.activities) ? day.activities.join(', ') : day.activities}
                    onChange={e => handleDayChange(day.id, "activities", e.target.value)}
                    placeholder="Activities"
                    className="border-pharaoh-gold/30 focus:border-pharaoh-gold"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(Array.isArray(day.activities) ? day.activities : []).map((activity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-pharaoh-gold/30 text-nile-blue">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-1 text-nile-blue">Description</label>
                  <textarea
                    className="w-full rounded border border-pharaoh-gold/30 focus:border-pharaoh-gold p-3"
                    value={day.description}
                    onChange={e => handleDayChange(day.id, "description", e.target.value)}
                    placeholder="Detailed description of the day's activities..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-nile-blue">Day Gallery</label>
                  <div className="flex gap-2 items-center mb-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openMediaLibrary('itinerary', day.id)}
                      className="border-pharaoh-gold/30 hover:bg-pharaoh-gold/10"
                    >
                      Add Image from Library
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {day.images.map((img, idx) => (
                      <div key={img.url} className="relative w-28 h-28 group rounded-lg overflow-hidden border-2 border-pharaoh-gold/30">
                        <img src={img.url} alt={img.alt || ""} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setCurrentMediaTarget({
                                type: 'itinerary',
                                acceptedTypes: ['IMAGE'],
                                dayId: day.id,
                                imageIndex: idx
                              });
                              setShowMediaLibrary(true);
                            }}
                            className="text-xs"
                          >
                            Replace
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteGalleryImage(day.id, img.url)}
                            className="text-xs"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            className="w-full max-w-md bg-gradient-to-r from-nile-blue to-pharaoh-gold hover:from-pharaoh-gold hover:to-nile-blue text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Premium Package...
              </>
            ) : (
              <>
                <Ship className="w-5 h-5" />
                Create Premium Package
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Media Library Selector */}
      <MediaLibrarySelector
        open={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          setCurrentMediaTarget(null);
        }}
        onSelect={handleMediaLibrarySelect}
        acceptedTypes={['IMAGE']}
        title={`Select Image for ${currentMediaTarget?.type === 'main' ? 'Main Image' : 'Itinerary Day'}`}
      />
    </Card>
  );
}
