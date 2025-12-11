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
import { Switch } from "@/components/ui/switch";
import { Promotion } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  code: z.string().min(1, "Code is required"),
  discount: z.coerce.number().min(0, "Discount must be a positive number"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

type PromotionFormValues = z.infer<typeof formSchema>;

interface PromotionFormProps {
  initialData?: Promotion;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Promotion" : "Create Promotion";
  const description = initialData
    ? "Edit an existing promotion."
    : "Add a new promotion.";
  const toastMessage = initialData ? "Promotion updated." : "Promotion created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          description: initialData.description ?? "",
          code: initialData.code,
          discount: initialData.discountPercentage,
          startDate: initialData.startDate,
          endDate: initialData.endDate,
        }
      : {
          description: "",
          code: "",
          discount: 0,
          startDate: new Date(),
          endDate: new Date(),
        },
  });

  const onSubmit = async (data: PromotionFormValues) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/dashboard/promotions/${initialData.id}`
        : "/api/dashboard/promotions";
      const method = initialData ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          cruiseId: "clwailxre000008l7636g5k9y", // Hardcoded cruiseId
        }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      router.refresh();
      router.push("/dashboard/promotions");
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
            control={form.control as any}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Enter the promotion description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Enter the promotion code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={loading}
                    placeholder="Enter the discount percentage"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={loading}
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={loading}
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
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

