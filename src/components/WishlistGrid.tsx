'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import imageLoader from '../utils/imageLoader';

type WishlistItem = {
  id: string;
  name: string;
  shortDescription: string;
  pricePerDay: number;
  images: {
    url: string;
    alt?: string;
  }[];
  rating: number;
  type: string;
};

export function WishlistGrid() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/users/wishlist');
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      toast('Failed to load wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (cruiseId: string) => {
    try {
      const response = await fetch(`/api/users/wishlist/${cruiseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove from wishlist');

      setWishlist((prev) => prev.filter((item) => item.id !== cruiseId));
      
      toast('Removed from wishlist.');
    } catch (error) {
      toast('Failed to remove from wishlist. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-48 w-full rounded-t-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
          <Button onClick={() => router.push('/cruises')}>Browse Cruises</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map((cruise) => (
        <Card key={cruise.id} className="group relative">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={cruise.images[0]?.url || '/images/placeholder.jpg'}
                alt={cruise.images[0]?.alt || cruise.name}
                fill
                loader={imageLoader}
                className="object-cover rounded-t-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{cruise.name}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {cruise.shortDescription}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                From ${cruise.pricePerDay.toLocaleString()} per day
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{cruise.rating}</span>
                <span className="text-yellow-400">★</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/cruises/${cruise.id}`)}
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFromWishlist(cruise.id)}
            >
              Remove
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

