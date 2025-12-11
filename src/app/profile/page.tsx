"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsList } from '@/components/BookingsList';
import { WishlistGrid } from '@/components/WishlistGrid';
import { ReviewsList } from '@/components/ReviewsList';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Remove the useToast line since we're using sonner's toast directly

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success("You have been signed out");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <div className="flex gap-4">
          <ProfileImageUpload />
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>
                View and manage your cruise bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>
                Cruises and packages you&apos;ve saved for later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WishlistGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>
                Reviews you&apos;ve written for cruises and packages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

