"use client";

import { useState } from "react";
import Image from "next/image";
import imageLoader from '../../utils/imageLoader';

// Define ImageCategory enum locally
export type ImageCategory =
  | "INDOOR"
  | "OUTDOOR"
  | "TWIN_CABIN"
  | "DOUBLE_CABIN"
  | "SUITE_CABIN"
  | "BATHROOM"
  | "RESTAURANT_BAR"
  | "DECK";

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  category: ImageCategory;
}

interface CategorizedGalleryProps {
  images: GalleryImage[];
}

const categoryLabels: Record<ImageCategory, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  TWIN_CABIN: "Twin Cabin",
  DOUBLE_CABIN: "Double Cabin",
  SUITE_CABIN: "Suite Cabin",
  BATHROOM: "Bathroom",
  RESTAURANT_BAR: "Restaurant & Bar",
  DECK: "Deck",
};

export default function CategorizedGallery({ images }: CategorizedGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | "ALL">("ALL");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = selectedCategory === "ALL" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const imageCategoryValues: ImageCategory[] = [
    "INDOOR",
    "OUTDOOR",
    "TWIN_CABIN",
    "DOUBLE_CABIN",
    "SUITE_CABIN",
    "BATHROOM",
    "RESTAURANT_BAR",
    "DECK"
  ];
  const categories = ["ALL", ...imageCategoryValues] as (ImageCategory | "ALL")[];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            {category === "ALL" ? "All" : categoryLabels[category as ImageCategory]}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.url}
              alt={image.alt || ""}
              fill
              className="object-cover rounded-lg transition-transform group-hover:scale-105"
              loader={imageLoader}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || ""}
              fill
              className="object-contain"
              loader={imageLoader}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}