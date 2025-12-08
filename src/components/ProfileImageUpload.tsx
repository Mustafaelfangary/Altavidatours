"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CameraIcon } from "lucide-react";

export function ProfileImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image || !session?.user?.id) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('userId', session.user.id);

      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      toast.success("Profile image updated successfully");

      // Refresh the page to see the new image
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Profile Image</Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <CameraIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => document.getElementById('image')?.click()}
              variant="outline"
            >
              Choose Photo
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!image || isLoading}
              className="ml-2"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
