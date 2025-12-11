"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';
import { Plus, X, Upload, Star, MapPin, Clock, Users, DollarSign } from "lucide-react";

interface DailyTourImage {
  id?: string;
  url: string;
  alt?: string;
  category?: ImageCategory;
}

interface DailyTourFormProps {
  initialData?: {
    id: string;
    slug?: string;
    name: string;
    description: string;
    shortDescription?: string;
    pricePerDay: number;
    capacity: number;
    features: string[];
    rating: number;
    type: string;
    category: string;
    amenities: string[];
    images: DailyTourImage[];
    mainImageUrl: string;
    videoUrl?: string;
    duration?: string;
    location?: string;
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    meetingPoint?: string;
    cancellationPolicy?: string;
  };
}

export default function DailyTourForm({ initialData }: DailyTourFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaTarget, setCurrentMediaTarget] = useState<{
    type: 'main' | 'gallery' | 'video';
    imageId?: string;
  } | null>(null);

  const [form, setForm] = useState({
    slug: initialData?.slug || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    pricePerDay: initialData?.pricePerDay || 0,
    capacity: initialData?.capacity || 15,
    features: initialData?.features || [],
    rating: initialData?.rating || 4.5,
    type: initialData?.type || "STANDARD",
    category: initialData?.category || "DELUXE",
    amenities: initialData?.amenities || [],
    images: initialData?.images || [],
    mainImageUrl: initialData?.mainImageUrl || "",
    videoUrl: initialData?.videoUrl || "",
    duration: initialData?.duration || "Full Day",
    location: initialData?.location || "Cairo, Egypt",
    highlights: initialData?.highlights || [],
    inclusions: initialData?.inclusions || [],
    exclusions: initialData?.exclusions || [],
    meetingPoint: initialData?.meetingPoint || "",
    cancellationPolicy: initialData?.cancellationPolicy || "Free cancellation up to 24 hours before tour",
  });

  // Input states for array fields
  const [newFeature, setNewFeature] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newImage, setNewImage] = useState<DailyTourImage>({ url: "", alt: "", category: "OUTDOOR" });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        initialData ? `/api/dashboard/tours/${initialData.id}` : "/api/dashboard/tours",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save tour");
      }
      toast.success(initialData ? "Tour updated successfully!" : "Tour created successfully!");
      router.refresh();
      router.push("/dashboard/daily-tours");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Media Library Handler
  const handleMediaSelect = (asset: { url: string }) => {
    if (!currentMediaTarget) return;
    switch (currentMediaTarget.type) {
      case 'main':
        setForm(prev => ({ ...prev, mainImageUrl: asset.url }));
        break;
      case 'video':
        setForm(prev => ({ ...prev, videoUrl: asset.url }));
        break;
      case 'gallery':
        if (currentMediaTarget.imageId) {
          setForm(prev => ({
            ...prev,
            images: prev.images.map(img => img.id === currentMediaTarget.imageId ? { ...img, url: asset.url } : img)
          }));
        } else {
          setNewImage(prev => ({ ...prev, url: asset.url }));
        }
        break;
    }
    setShowMediaLibrary(false);
    setCurrentMediaTarget(null);
  };

  // Array field helpers
  const addArrayItem = (field: 'features' | 'amenities' | 'highlights' | 'inclusions' | 'exclusions', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter("");
    }
  };

  const removeArrayItem = (field: 'features' | 'amenities' | 'highlights' | 'inclusions' | 'exclusions', index: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addImage = () => {
    if (newImage.url.trim()) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, { ...newImage, id: Date.now().toString() }]
      }));
      setNewImage({ url: "", alt: "", category: "OUTDOOR" });
    }
  };

  const removeImage = (id: string) => {
    setForm(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="inclusions">What&apos;s Included</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Tour Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Tour Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g., Pyramids of Giza & Sphinx Tour" required />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/daily-tours/</span>
                    <Input id="slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="pyramids-giza-sphinx" required />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">This will be the URL path for this tour</p>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="Cairo, Egypt" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea id="shortDescription" value={form.shortDescription} onChange={(e) => setForm({...form, shortDescription: e.target.value})} rows={2} placeholder="A brief overview shown in tour cards..." />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea id="description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={6} placeholder="Detailed tour description..." required />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Pricing & Capacity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label htmlFor="pricePerDay">Price per Person ($) *</Label>
                  <Input id="pricePerDay" type="number" step="0.01" value={form.pricePerDay} onChange={(e) => setForm({...form, pricePerDay: parseFloat(e.target.value) || 0})} required />
                </div>
                <div>
                  <Label htmlFor="capacity">Max Group Size *</Label>
                  <Input id="capacity" type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: parseInt(e.target.value) || 0})} required />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} placeholder="Full Day / Half Day" />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input id="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({...form, rating: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Type & Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({...form, type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="LUXURY">Luxury</SelectItem>
                      <SelectItem value="BUDGET">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="DELUXE">Deluxe</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="LUXURY">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Details Tab - Highlights */}
          <TabsContent value="details" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" /> Tour Highlights
              </h3>
              <div className="flex gap-2 mb-4">
                <Input value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} placeholder="Add a highlight..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('highlights', newHighlight, setNewHighlight))} />
                <Button type="button" onClick={() => addArrayItem('highlights', newHighlight, setNewHighlight)}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.highlights.map((item, i) => (
                  <span key={i} className="bg-pharaoh-gold/10 text-pharaoh-gold px-3 py-1 rounded-full flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeArrayItem('highlights', i)} className="hover:text-red-500"><X className="w-4 h-4" /></button>
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="flex gap-2 mb-4">
                <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="e.g., Professional Egyptologist Guide" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('features', newFeature, setNewFeature))} />
                <Button type="button" onClick={() => addArrayItem('features', newFeature, setNewFeature)}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {form.features.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>{item}</span>
                    <button type="button" onClick={() => removeArrayItem('features', i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Amenities</h3>
              <div className="flex gap-2 mb-4">
                <Input value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} placeholder="e.g., Air-conditioned Vehicle" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('amenities', newAmenity, setNewAmenity))} />
                <Button type="button" onClick={() => addArrayItem('amenities', newAmenity, setNewAmenity)}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {form.amenities.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>{item}</span>
                    <button type="button" onClick={() => removeArrayItem('amenities', i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" /> Main Image
              </h3>
              <div className="space-y-4">
                {form.mainImageUrl && (
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden">
                    <Image src={form.mainImageUrl} alt="Main tour image" fill className="object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => { setCurrentMediaTarget({ type: 'main' }); setShowMediaLibrary(true); }}>
                    {form.mainImageUrl ? 'Replace Image' : 'Choose Main Image'}
                  </Button>
                  {form.mainImageUrl && (
                    <Button type="button" variant="destructive" onClick={() => setForm({...form, mainImageUrl: ""})}>Remove</Button>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Video (Optional)</h3>
              <div className="space-y-4">
                {form.videoUrl && (
                  <video src={form.videoUrl} controls className="w-full max-w-md rounded-lg" />
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => { setCurrentMediaTarget({ type: 'video' }); setShowMediaLibrary(true); }}>
                    {form.videoUrl ? 'Replace Video' : 'Choose Video'}
                  </Button>
                  {form.videoUrl && (
                    <Button type="button" variant="destructive" onClick={() => setForm({...form, videoUrl: ""})}>Remove</Button>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Image Gallery</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => { setCurrentMediaTarget({ type: 'gallery' }); setShowMediaLibrary(true); }}>
                    Add Image from Library
                  </Button>
                </div>
                {newImage.url && (
                  <div className="flex gap-4 items-end">
                    <div className="relative w-32 h-24 rounded overflow-hidden">
                      <Image src={newImage.url} alt="" fill className="object-cover" />
                    </div>
                    <Input placeholder="Alt text" value={newImage.alt || ""} onChange={(e) => setNewImage({...newImage, alt: e.target.value})} className="flex-1" />
                    <Button type="button" onClick={addImage}>Add to Gallery</Button>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {form.images.map((img) => (
                    <Card key={img.id} className="relative group overflow-hidden">
                      <div className="aspect-square relative">
                        <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                      </div>
                      <div className="p-2 text-sm truncate">{img.alt || "No description"}</div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button size="sm" variant="destructive" onClick={() => removeImage(img.id!)}><X className="w-3 h-3" /></Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Inclusions Tab */}
          <TabsContent value="inclusions" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">✓ What&apos;s Included</h3>
              <div className="flex gap-2 mb-4">
                <Input value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)} placeholder="e.g., Entrance fees to all sites" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('inclusions', newInclusion, setNewInclusion))} />
                <Button type="button" onClick={() => addArrayItem('inclusions', newInclusion, setNewInclusion)}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="space-y-2">
                {form.inclusions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-200">
                    <span className="flex items-center gap-2"><span className="text-green-600">✓</span> {item}</span>
                    <button type="button" onClick={() => removeArrayItem('inclusions', i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">✗ What&apos;s Not Included</h3>
              <div className="flex gap-2 mb-4">
                <Input value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)} placeholder="e.g., Personal expenses" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('exclusions', newExclusion, setNewExclusion))} />
                <Button type="button" onClick={() => addArrayItem('exclusions', newExclusion, setNewExclusion)}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="space-y-2">
                {form.exclusions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-red-50 p-3 rounded border border-red-200">
                    <span className="flex items-center gap-2"><span className="text-red-600">✗</span> {item}</span>
                    <button type="button" onClick={() => removeArrayItem('exclusions', i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Meeting Point</h3>
              <Textarea value={form.meetingPoint} onChange={(e) => setForm({...form, meetingPoint: e.target.value})} placeholder="Where guests will be picked up..." rows={3} />
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cancellation Policy</h3>
              <Textarea value={form.cancellationPolicy} onChange={(e) => setForm({...form, cancellationPolicy: e.target.value})} placeholder="Free cancellation up to 24 hours before..." rows={3} />
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/daily-tours")}>Cancel</Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? "Saving..." : initialData ? "Update Tour" : "Create Tour"}
          </Button>
        </div>
      </form>

      <MediaLibrarySelector
        open={showMediaLibrary}
        onClose={() => { setShowMediaLibrary(false); setCurrentMediaTarget(null); }}
        onSelect={handleMediaSelect}
        acceptedTypes={currentMediaTarget?.type === 'video' ? ['VIDEO'] : ['IMAGE']}
        title={`Select ${currentMediaTarget?.type === 'video' ? 'Video' : 'Image'}`}
      />
    </>
  );
}



