"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryActions } from "@/api-actions/category-actions";
import { UpdateCategorySchema } from "@/schema/category.schema";
import type { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>;

interface EditCategoryModalProps {
  category: ICategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditCategoryModal = ({
  category,
  open,
  onOpenChange,
}: EditCategoryModalProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: category.name,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryFormData) =>
      CategoryActions.UpdateCategoryAction(category.id, data),
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      await queryClient.cancelQueries({ queryKey: ["category", category.id] });

      // Snapshot the previous values
      const previousCategories = queryClient.getQueryData<IGetCategoriesResponse>(["categories"]);
      const previousCategory = queryClient.getQueryData<IGetCategoryResponse>(["category", category.id]);

      // Optimistically update categories list
      if (previousCategories?.categories) {
        queryClient.setQueryData<IGetCategoriesResponse>(["categories"], {
          ...previousCategories,
          categories: previousCategories.categories.map((cat) =>
            cat.id === category.id ? { ...cat, name: newData.name } : cat
          ),
        });
      }

      // Optimistically update single category
      if (previousCategory?.category) {
        queryClient.setQueryData<IGetCategoryResponse>(["category", category.id], {
          category: { ...previousCategory.category, name: newData.name },
        });
      }

      return { previousCategories, previousCategory };
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any, _variables, context) => {
      toast.error(error?.message || "Failed to update category");
      
      // Roll back on error
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
      if (context?.previousCategory) {
        queryClient.setQueryData(["category", category.id], context.previousCategory);
      }
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", category.id] });
    },
  });

  const onSubmit = async (data: UpdateCategoryFormData) => {
    if (data.name === category.name) {
      toast.info("No changes to save");
      onOpenChange(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      if (!newOpen) {
        form.reset();
      }
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category name. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
