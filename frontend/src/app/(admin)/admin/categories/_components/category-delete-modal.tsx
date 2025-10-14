"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CategoryActions } from "@/api-actions/category-actions";

interface CategoryDeleteDialogProps {
  category: ICategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

export function CategoryDeleteDialog({ category, open, onOpenChange, onDeleteSuccess }: CategoryDeleteDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return CategoryActions.DeleteCategoryAction(category.id)
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<IGetCategoriesResponse>(["categories"]);

      // Optimistically update to the new value
      if (previousCategories?.categories) {
        queryClient.setQueryData<IGetCategoriesResponse>(["categories"], {
          ...previousCategories,
          categories: previousCategories.categories.filter((cat) => cat.id !== category.id),
        });
      }

      // Return a context object with the snapshotted value
      return { previousCategories };
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      onOpenChange(false);
      // Invalidate the specific category cache so detail page knows it's deleted
      queryClient.invalidateQueries({ queryKey: ["category", category.id] });
      // Call the callback if provided (for redirecting from detail page)
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: (error: any, _variables, context) => {
      toast.error(error?.message || "Failed to delete category");
      
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSettled: () => {
      // Only refetch on error to ensure consistency, not on success since optimistic update is correct
      if (deleteMutation.isError) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category &quot;{category.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
