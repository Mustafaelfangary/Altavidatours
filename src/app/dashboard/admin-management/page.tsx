"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminManagementPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch existing admins
  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      setAdmins(data.filter((user: AdminUser) => user.role === "ADMIN"));
    } catch (error) {
      toast.error("Failed to fetch admin users");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Create new admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "ADMIN",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create admin");
      }

      toast.success("Admin account created successfully");
      setFormData({ name: "", email: "", password: "" });
      fetchAdmins(); // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create admin account");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin account?")) return;

    try {
      const response = await fetch(`/api/admin/users/${adminId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete admin");

      toast.success("Admin account deleted successfully");
      fetchAdmins(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete admin account");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Management</h1>

      <div className="grid gap-8">
        {/* Create Admin Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Admin</CardTitle>
            <CardDescription>
              Create a new administrator account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Admin List */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Accounts</CardTitle>
            <CardDescription>
              List of all administrator accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        disabled={admin.id === session?.user?.id}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 

