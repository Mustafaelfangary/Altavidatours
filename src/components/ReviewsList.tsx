'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Star, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

type Review = {
  id: string;
  title: string;
  comment: string;
  rating: number;
  helpful: number;
  verified: boolean;
  createdAt: string;
  dahabiya: {
    id: string;
    name: string;
  };
  photos: string[];
  response?: string;
};

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/user/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/user/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });

      if (response.status === 404) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        toast.success("Review deleted successfully.");
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      
      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven&apos;t written any reviews yet.</p>
          <Button onClick={() => router.push('/dahabiyat')}>Browse Dahabiyas</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{review.title || 'Untitled Review'}</CardTitle>
                <CardDescription>
                  {review.dahabiya.name} • {format(new Date(review.createdAt), 'PP')}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{review.comment}</p>
            {review.photos && review.photos.length > 0 && (
              <div className="flex gap-2 mb-4">
                {review.photos.map((photo, index) => (
                  <div key={index} className="relative h-12 w-12">
                    <Image
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ))}
              </div>
            )}
            {review.response && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-sm font-medium mb-2">Response from Cruise Team:</p>
                <p className="text-sm text-gray-600">{review.response}</p>
              </div>
            )}
            <div className="flex items-center space-x-2 mt-4">
              <ThumbsUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">{review.helpful} people found this helpful</span>
              {review.verified && (
                <span className="text-sm text-green-600 font-medium ml-2">
                  Verified Purchase
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dahabiyat/${review.dahabiya.id}`)}
            >
              View Dahabiya
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteReview(review.id)}
            >
              Delete Review
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}