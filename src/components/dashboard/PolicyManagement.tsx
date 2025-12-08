"use client";

import { Policy } from "@prisma/client";
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

interface PolicyManagementProps {
  policies: Policy[];
}

export const PolicyManagement: React.FC<PolicyManagementProps> = ({
  policies,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/policies/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      router.refresh();
      toast.success("Policy deleted.");
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
          <h2 className="text-3xl font-bold tracking-tight">Policies</h2>
          <p className="text-sm text-muted-foreground">
            Manage your policies.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/policies/new")}>
          Create New
        </Button>
      </div>
      <hr className="my-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell>{policy.title}</TableCell>
              <TableCell>{policy.description}</TableCell>
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
                        router.push(`/dashboard/policies/${policy.id}/edit`)
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(policy.id)}>
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