"use client";

import { faq } from "@prisma/client";
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
import { toast } from "@/components/ui/use-toast";

interface FaqManagementProps {
  faqs: faq[];
}

export const FaqManagement: React.FC<FaqManagementProps> = ({ faqs }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/faqs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      router.refresh();
      toast('FAQ deleted.');
    } catch (error) {
      toast('Something went wrong.', {
        style: { backgroundColor: 'red', color: 'white' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: faq) => {
    router.push(`/dashboard/faqs/${faq.id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast('Failed to load FAQs. Please try again.', {
      style: { backgroundColor: 'red', color: 'white' }
    });
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FAQs</h2>
          <p className="text-sm text-muted-foreground">Manage your FAQs.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/faqs/new")}>
          Create New
        </Button>
      </div>
      <hr className="my-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>{faq.question}</TableCell>
              <TableCell>{faq.answer}</TableCell>
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
                        router.push(`/dashboard/faqs/${faq.id}/edit`)
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(faq.id)}>
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