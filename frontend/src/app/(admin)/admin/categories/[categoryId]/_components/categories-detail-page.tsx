"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CategoryActions } from "@/api-actions/category-actions";
import { CategoryDetailClient } from "../../_components/category-detail-client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CategoryDetailPageProps {
  categoryId: string;
}

export function CategoryDetailPage({ categoryId }: CategoryDetailPageProps) {
  const router = useRouter();

  const { 
    data: categoryData, 
    isLoading, 
    error,
    isError 
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const response = await CategoryActions.GetCategoryByIdAction(categoryId);
      return response.category;
    },
    enabled: !!categoryId,
    retry: 1, // Only retry once
    staleTime: 30000, // 30 seconds
  });

  // Redirect if category not found or error
  useEffect(() => {
    if (isError || (error && !isLoading)) {
      router.push('/admin/categories');
    }
  }, [isError, error, isLoading, router]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError || !categoryData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Category not found</p>
          <Button onClick={() => router.push('/admin/categories')}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  // If we have the category data, render the client component
  return <CategoryDetailClient category={categoryData} />;
}
