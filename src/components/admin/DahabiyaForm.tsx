"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

interface DahabiyaFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    advantages: string;
    meaning: string;
    pricePerDay: number;
    capacity: number;
    features: string[];
    type: string;
    category: string;
    amenities: string[];
    images: { id: string; url: string; alt?: string; category: ImageCategory }[];
    mainImageUrl: string;
    videoUrl: string;
  };
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export default function DahabiyaForm({ initialData }: DahabiyaFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    advantages: initialData?.advantages || "",
    meaning: initialData?.meaning || "",
    pricePerDay: initialData?.pricePerDay || 0,
    capacity: initialData?.capacity || 0,
    features: initialData?.features || [],
    type: initialData?.type || "STANDARD",
    category: initialData?.category || "DELUXE",
    amenities: initialData?.amenities || [],
    images: initialData?.images || [],
    mainImageUrl: initialData?.mainImageUrl || "",
    videoUrl: initialData?.videoUrl || "",
  });

  const [newFeature, setNewFeature] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState({ url: "", alt: "", category: "INDOOR" as ImageCategory });

  // Itinerary Days State
  const [itineraryDays, setItineraryDays] = useState<{
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    images: { url: string; alt?: string }[];
  }[]>([]);
  const [newDay, setNewDay] = useState({ title: "", description: "" });




  // Media Library State
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaTarget, setCurrentMediaTarget] = useState<{
    type: 'main' | 'video' | 'gallery' | 'itinerary';
    acceptedTypes: ('IMAGE' | 'VIDEO')[];
    imageId?: string;
    dayId?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        initialData
          ? `/api/dashboard/dahabiyat/${initialData.id}`
          : "/api/dashboard/dahabiyat",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Failed to save dahabiya");

      toast.success(
        initialData ? "Dahabiya updated successfully!" : "Dahabiya created successfully!"
      );
      router.refresh();
      router.push("/dashboard/dahabiyat");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Media Library Handlers
  const handleMediaLibrarySelect = async (asset: any) => {
    if (!currentMediaTarget) return;

    try {
      switch (currentMediaTarget.type) {
        case 'main':
          setForm({ ...form, mainImageUrl: asset.url });
          break;
        case 'video':
          setForm({ ...form, videoUrl: asset.url });
          break;
        case 'gallery':
          if (currentMediaTarget.imageId) {
            // Replace existing gallery image
            setForm(prev => ({
              ...prev,
              images: prev.images.map(img =>
                img.id === currentMediaTarget.imageId
                  ? { ...img, url: asset.url }
                  : img
              )
            }));
          } else {
            // Add new gallery image
            setNewImage({ ...newImage, url: asset.url });
          }
          break;
        case 'itinerary':
          if (currentMediaTarget.dayId) {
            setItineraryDays(prev =>
              prev.map(day =>
                day.id === currentMediaTarget.dayId
                  ? { ...day, images: [...day.images, { url: asset.url }] }
                  : day
              )
            );
          }
          break;
      }

      setShowMediaLibrary(false);
      setCurrentMediaTarget(null);
      toast.success('Media selected successfully');
    } catch (error) {
      console.error('Error selecting media:', error);
      toast.error('Failed to select media');
    }
  };

  const openMediaLibrary = (type: 'main' | 'video' | 'gallery' | 'itinerary', dayId?: string) => {
    const acceptedTypes: ('IMAGE' | 'VIDEO')[] = type === 'video' ? ['VIDEO'] : ['IMAGE'];
    setCurrentMediaTarget({ type, acceptedTypes, dayId });
    setShowMediaLibrary(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage.url.trim()) {
      // Clean up the image URL
      let cleanUrl = newImage.url.trim();
      
      // If it's a local path, ensure it starts with /images/
      if (!cleanUrl.startsWith('http')) {
        // Remove any leading slashes
        cleanUrl = cleanUrl.replace(/^\/+/, '');
        
        // If it doesn't start with images/, add it
        if (!cleanUrl.startsWith('images/')) {
          cleanUrl = `images/${cleanUrl}`;
        }
        
        // Add leading slash for absolute path
        cleanUrl = `/${cleanUrl}`;
        
        // Ensure it has a valid image extension
        if (!cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          cleanUrl = `${cleanUrl}.jpg`;
        }
      }
      
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, { 
          ...newImage, 
          id: Date.now().toString(),
          url: cleanUrl
        }],
      }));
      setNewImage({ url: "", alt: "", category: "INDOOR" });
    }
  };

  const removeImage = (id: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
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
          images: [],
        },
      ]);
      setNewDay({ title: "", description: "" });
    }
  };

  const removeItineraryDay = (id: string) => {
    setItineraryDays((prev) => prev.filter((day) => day.id !== id).map((day, idx) => ({ ...day, dayNumber: idx + 1 })));
  };

  const handleDayChange = (id: string, field: string, value: string) => {
    setItineraryDays((prev) =>
      prev.map((day) =>
        day.id === id ? { ...day, [field]: value } : day
      )
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, dayId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    formData.append("file", files[0]);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setItineraryDays((prev) =>
        prev.map((day) =>
          day.id === dayId
            ? { ...day, images: [...day.images, { url: data.url }] }
            : day
        )
      );
    }

  };

  const removeDayImage = (dayId: string, imgUrl: string) => {
    setItineraryDays((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? { ...day, images: day.images.filter((img) => img.url !== imgUrl) }
          : day
      )
    );
  };

  const validateImage = (file: File) => {
    if (!file.type.startsWith("image/")) return "Only image files are allowed.";
    if (file.size > MAX_IMAGE_SIZE) return "Image must be less than 5MB.";
    return null;
  };
  const validateVideo = (file: File) => {
    if (!file.type.startsWith("video/")) return "Only video files are allowed.";
    if (file.size > MAX_VIDEO_SIZE) return "Video must be less than 100MB.";
    return null;
  };


  const handleDeleteGalleryImage = (id: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img.id !== id) }));
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={form.type}
            onValueChange={(value) => setForm({ ...form, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="LUXURY">Luxury</SelectItem>
              <SelectItem value="PREMIUM">Premium</SelectItem>
              <SelectItem value="BUDGET">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DELUXE">Deluxe</SelectItem>
              <SelectItem value="PREMIUM">Premium</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="LUXURY">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pricePerDay">Price per Day</Label>
          <Input
            id="pricePerDay"
            type="number"
            value={form.pricePerDay}
            onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })}
            required
          />
        </div>

        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            required
          />
        </div>

        {/* Main Image Field */}
        <div>
          <Label>Main (Top) Image</Label>
          <div className="space-y-2">
            {form.mainImageUrl && (
              <div className="mt-2">
                <Image src={form.mainImageUrl} alt="Main Dahabiya" width={300} height={120} className="rounded shadow" />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => openMediaLibrary('main')}
                className="flex-1"
              >
                {form.mainImageUrl ? 'Replace Image' : 'Choose Image from Library'}
              </Button>
              {form.mainImageUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setForm({ ...form, mainImageUrl: "" })}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Video Field */}
        <div>
          <Label>Video</Label>
          <div className="space-y-2">
            {form.videoUrl && (
              <div className="mt-2 aspect-video rounded overflow-hidden shadow">
                <video src={form.videoUrl} controls className="w-full h-full" poster={form.mainImageUrl || undefined} />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => openMediaLibrary('video')}
                className="flex-1"
              >
                {form.videoUrl ? 'Replace Video' : 'Choose Video from Library'}
              </Button>
              {form.videoUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setForm({ ...form, videoUrl: "" })}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={6}
          required
        />
      </div>

      <div>
        <Label>Features</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature"
          />
          <Button type="button" onClick={addFeature}>
            Add
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {form.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span>{feature}</span>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Amenities</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Add an amenity"
          />
          <Button type="button" onClick={addAmenity}>
            Add
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {form.amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span>{amenity}</span>
              <button
                type="button"
                onClick={() => removeAmenity(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Images</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => openMediaLibrary('gallery')}
              className="w-full"
            >
              {newImage.url ? 'Replace Image' : 'Choose Image from Library'}
            </Button>
            {newImage.url && (
              <div className="relative w-full h-24 border rounded overflow-hidden">
                <Image
                  src={newImage.url}
                  alt="Selected image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <Input
            value={newImage.alt}
            onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
            placeholder="Image Alt Text"
          />
          <Select
            value={newImage.category}
            onValueChange={(value) =>
              setNewImage({ ...newImage, category: value as ImageCategory })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INDOOR">Indoor</SelectItem>
              <SelectItem value="OUTDOOR">Outdoor</SelectItem>
              <SelectItem value="TWIN_CABIN">Twin Cabin</SelectItem>
              <SelectItem value="DOUBLE_CABIN">Double Cabin</SelectItem>
              <SelectItem value="SUITE_CABIN">Suite Cabin</SelectItem>
              <SelectItem value="BATHROOM">Bathroom</SelectItem>
              <SelectItem value="RESTAURANT_BAR">Restaurant & Bar</SelectItem>
              <SelectItem value="DECK">Deck</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" onClick={addImage}>
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {form.images.map((image, index) => (
            <Card key={image.id || `image-${index}`} className="relative group">
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.alt || ""}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-2">
                <p className="text-sm font-medium truncate">{image.alt}</p>
                <p className="text-xs text-gray-500">{image.category}</p>
              </div>
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setCurrentMediaTarget({ type: 'gallery', acceptedTypes: ['IMAGE'], imageId: image.id });
                    setShowMediaLibrary(true);
                  }}
                >
                  Replace
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteGalleryImage(image.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="advantages">Why Choose This Dahabiya?</Label>
        <Textarea
          id="advantages"
          value={form.advantages}
          onChange={(e) => setForm({ ...form, advantages: e.target.value })}
          rows={6}
          placeholder="Why is this Dahabiya different from regular Nile Cruises?"
          className="font-serif"
          required
        />
      </div>

      <div>
        <Label htmlFor="meaning">The Meaning of Dahabiya</Label>
        <Textarea
          id="meaning"
          value={form.meaning}
          onChange={(e) => setForm({ ...form, meaning: e.target.value })}
          rows={4}
          placeholder="Explain the meaning and history of the word 'dahabiya'..."
          className="font-serif"
          required
        />
      </div>

      {/* Itinerary Days Section */}
      <div>
        <Label>Itinerary Days</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newDay.title}
            onChange={(e) => setNewDay((d) => ({ ...d, title: e.target.value }))}
            placeholder="Day Title (e.g. Day 1: Luxor)"
          />
          <Input
            value={newDay.description}
            onChange={(e) => setNewDay((d) => ({ ...d, description: e.target.value }))}
            placeholder="Description"
          />
          <Button type="button" onClick={addItineraryDay}>Add Day</Button>
        </div>
        <div className="space-y-6">
          {itineraryDays.map((day) => (
            <Card key={day.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold">Day {day.dayNumber}: </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeItineraryDay(day.id)}>
                  Remove Day
                </Button>
              </div>
              <Input
                className="mb-2"
                value={day.title}
                onChange={(e) => handleDayChange(day.id, "title", e.target.value)}
                placeholder="Day Title"
              />
              <Textarea
                className="mb-2"
                value={day.description}
                onChange={(e) => handleDayChange(day.id, "description", e.target.value)}
                placeholder="Description"
                rows={3}
              />
              <div className="mb-2">
                <Label>Gallery</Label>
                <div className="flex gap-2 items-center mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMediaLibrary('itinerary', day.id)}
                  >
                    Add Image from Library
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {day.images.map((img, idx) => (
                    <div key={img.url} className="relative w-24 h-24">
                      <Image src={img.url} alt={img.alt || ""} fill className="object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeDayImage(day.id, img.url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update Dahabiya" : "Create Dahabiya"}
      </Button>
    </form>

    {/* Media Library Selector */}
    <MediaLibrarySelector
      open={showMediaLibrary}
      onClose={() => {
        setShowMediaLibrary(false);
        setCurrentMediaTarget(null);
      }}
      onSelect={handleMediaLibrarySelect}
      acceptedTypes={currentMediaTarget?.acceptedTypes || ['IMAGE']}
      title={`Select ${currentMediaTarget?.type === 'video' ? 'Video' : 'Image'} for ${currentMediaTarget?.type === 'main' ? 'Main Image' : currentMediaTarget?.type === 'video' ? 'Video' : 'Gallery'}`}
    />
    </>
  );
}

