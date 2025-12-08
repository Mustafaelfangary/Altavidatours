"use client";

import { Review, User } from "@prisma/client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import Image from 'next/image';

type ReviewWithUser = Review & {
  user: Pick<User, "name" | "image">;
};

interface ReviewListProps {
  reviews: ReviewWithUser[];
  dahabiyaId: string;
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ReviewList({ reviews, dahabiyaId }: ReviewListProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dahabiyaId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      setShowForm(false);
      reset();
      // Refresh the page to show the new review
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {session && !showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="mb-8"
        >
          Write a Review
        </Button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <select
              {...register("rating", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} star{num !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              {...register("comment")}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-8">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                {review.user.image ? (
                  <div className="relative h-12 w-12">
                    <Image
                      src={review.user.image}
                      alt={review.user.name || "User"}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl text-gray-500">
                      {(review.user.name || "U")[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold">{review.user.name}</h4>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
