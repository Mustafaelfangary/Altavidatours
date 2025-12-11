"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "react-hot-toast";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["ADMIN", "USER"]),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    role: "ADMIN" | "USER";
  };
}

export function UserForm({ user }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "USER",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      const url = user
        ? `/api/users/${user.id}`
        : "/api/users";
      const method = user ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Something went wrong");
      }

      toast.success(user ? "User updated successfully" : "User created successfully");
      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Something went wrong");
      }

      toast.success("User deleted successfully");
      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password {user && "(leave blank to keep current password)"}
        </label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="mt-1"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <Select
          value={watch("role")}
          onValueChange={(value) => setValue("role", value as "USER" | "ADMIN")}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : user ? "Update User" : "Create User"}
        </Button>
        {user && (
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete User
          </Button>
        )}
      </div>
    </form>
  );
}


