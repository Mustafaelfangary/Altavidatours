"use client";

import { Promotion } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PromotionManagementProps {
  promotions: Promotion[];
}

export const PromotionManagement: React.FC<PromotionManagementProps> = ({ promotions }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/promotions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      router.refresh();
      toast.success("Promotion deleted.");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
          <p className="text-sm text-muted-foreground">Manage your promotions.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/promotions/new")}>
          Create New
        </Button>
      </div>
      <hr className="my-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.id}>
              <TableCell>{promotion.description || 'No description'}</TableCell>
              <TableCell>{promotion.code}</TableCell>
              <TableCell>{promotion.discountPercentage}%</TableCell>
              <TableCell>
                {new Date() >= new Date(promotion.startDate) && new Date() <= new Date(promotion.endDate) ? "Yes" : "No"}
              </TableCell>
              <TableCell>{new Date(promotion.endDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/promotions/${promotion.id}/edit`)
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(promotion.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};