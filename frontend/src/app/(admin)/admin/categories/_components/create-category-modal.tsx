"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryActions } from "@/api-actions/category-actions";
import { CreateCategorySchema, ICreateCategorySchema } from "@/schema/category.schema";

interface CreateCategoryModalProps {
  children?: React.ReactNode;
  onSuccess: () => void;
}

export const CreateCategoryModal = ({
  children,
  onSuccess,
}: CreateCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ICreateCategorySchema>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ICreateCategorySchema) => {
      return CategoryActions.CreateCategoryAction(data);
    },
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<IGetCategoriesResponse>(["categories"]);

      // Optimistically update with temporary ID
      if (previousCategories?.categories) {
        const tempCategory: ICategory = {
          id: `temp-${Date.now()}`,
          name: newCategory.name,
          _count: { products: 0 },
        };

        queryClient.setQueryData<IGetCategoriesResponse>(["categories"], {
          ...previousCategories,
          categories: [...previousCategories.categories, tempCategory],
        });
      }

      return { previousCategories };
    },
    onSuccess: (response) => {
      // Update the query data to replace temp category with real one
      queryClient.setQueryData<IGetCategoriesResponse>(["categories"], (oldData: IGetCategoriesResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          categories: oldData.categories.map((cat: ICategory) => 
            cat.id.startsWith('temp-') ? response.category : cat
          ),
        };
      });

      toast.success(response.message || "Category created successfully");
      form.reset();
      setOpen(false);
      onSuccess();
    },
    onError: (error: any, _variables, context) => {
      const errorMessage = error?.message || error?.response?.data?.message || "Failed to create category";
      toast.error(errorMessage);
      
      // Roll back on error
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSettled: () => {
      // Always refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const onSubmit = (data: ICreateCategorySchema) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Create Category</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your products.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
