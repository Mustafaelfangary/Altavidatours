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
import { faq } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type FaqFormValues = z.infer<typeof formSchema>;

interface FaqFormProps {
  initialData?: faq;
}

export const FaqForm: React.FC<FaqFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit FAQ" : "Create FAQ";
  const description = initialData ? "Edit an existing FAQ." : "Add a new FAQ.";
  const toastMessage = initialData ? "FAQ updated." : "FAQ created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      question: "",
      answer: "",
    },
  });

  const onSubmit = async (data: FaqFormValues) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/dashboard/faqs/${initialData.id}`
        : "/api/dashboard/faqs";
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
      router.push("/dashboard/faqs");
      toast(toastMessage);
    } catch (error) {
      toast("Something went wrong.", {
        style: { backgroundColor: "red", color: "white" }
      });
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
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Enter the question"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Enter the answer"
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