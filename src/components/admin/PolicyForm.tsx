"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Policy } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ControllerRenderProps } from "react-hook-form";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type PolicyFormValues = z.infer<typeof formSchema>;

interface PolicyFormProps {
  initialData?: Policy;
}

export const PolicyForm: React.FC<PolicyFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Policy" : "Create Policy";
  const description = initialData
    ? "Edit an existing policy."
    : "Add a new policy.";
  const toastMessage = initialData ? "Policy updated." : "Policy created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: PolicyFormValues) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/dashboard/policies/${initialData.id}`
        : "/api/dashboard/policies";
      const method = initialData ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      router.refresh();
      router.push("/dashboard/policies");
      toast.success(toastMessage);
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
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <hr className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }: { field: ControllerRenderProps<PolicyFormValues, "title"> }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Enter the title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }: { field: ControllerRenderProps<PolicyFormValues, "content"> }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Enter the content"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

