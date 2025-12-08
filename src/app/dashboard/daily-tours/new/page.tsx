import DailyTourForm from "@/components/admin/DailyTourForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewDailyTourPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/daily-tours">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Daily Tour</h1>
          <p className="text-muted-foreground">Add a new tour to your offerings</p>
        </div>
      </div>
      <DailyTourForm />
    </div>
  );
}
