import { useState } from "react";
import { UploadDropzone } from "@/components/ui/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onChange: (urls: { url: string; alt: string }[]) => void;
  value?: { url: string; alt: string }[];
}

export default function ImageUpload({ onChange, value = [] }: ImageUploadProps) {
  const [images, setImages] = useState<{ url: string; alt: string }[]>(value);

  const onUploadComplete = (res: { url: string }[]) => {
    const newImages = res.map(file => ({
      url: file.url,
      alt: "",
    }));
    
    setImages(prev => {
      const updated = [...prev, ...newImages];
      onChange(updated);
      return updated;
    });
  };

  const onRemove = (url: string) => {
    setImages(prev => {
      const updated = prev.filter(image => image.url !== url);
      onChange(updated);
      return updated;
    });
  };

  const updateAlt = (url: string, alt: string) => {
    setImages(prev => {
      const updated = prev.map(image => 
        image.url === url ? { ...image, alt } : image
      );
      onChange(updated);
      return updated;
    });
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.url} className="relative group">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => onRemove(image.url)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            <input
              type="text"
              placeholder="Add alt text"
              value={image.alt}
              onChange={(e) => updateAlt(image.url, e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        ))}
      </div>

      {images.length < 8 && (
        <UploadDropzone
          endpoint="cruiseImage"
          onClientUploadComplete={(res) => {
            if (res) {
              onUploadComplete(res);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error);
          }}
        />
      )}
    </div>
  );
}


