"use client";

import { useState, useMemo } from "react";
import { CategoryActions } from "@/api-actions/category-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryFilters } from "./category-filter";
import { CreateCategoryModal } from "./create-category-modal";
import { CategoryActions as CategoryActionsButtons } from "./category-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const CategoriesClient = () => {
  const [search, setSearch] = useState("");

  // Use TanStack Query to get all categories
  const queryClient = useQueryClient();
  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await CategoryActions.GetCategoriesAction();
      return response;
    },
    // Optimistic updates handle immediate UI changes, so we can be less aggressive
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });

  const categories = useMemo(() => {
    const cats = categoriesData?.categories || [];
    return cats;
  }, [categoriesData]);

  // Apply client-side filtering for search
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [categories, search]);

  // Updated handleCreateSuccess - optimistic updates handle the UI
  const handleCreateSuccess = () => {
    // Invalidate to ensure server state is synced
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Error loading categories</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["categories"] })} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage your store categories</p>
          </div>
          <CreateCategoryModal onSuccess={handleCreateSuccess}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </CreateCategoryModal>
        </div>

        <CategoryFilters
          search={search}
          setSearch={setSearch}
        />

        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {search ? 'No categories match your search.' : 'No categories found. Create your first category to get started.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category: ICategory) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant="secondary" className="w-fit">
                          {category._count?.products || 0} {category._count?.products === 1 ? 'product' : 'products'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        ID: {category.id.slice(0, 8)}...
                      </p>
                      <CategoryActionsButtons category={category} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
