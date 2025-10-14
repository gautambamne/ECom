"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { EditCategoryModal } from "./edit-category-modal";
import { CategoryDeleteDialog } from "./category-delete-modal";
import { CategoryProductsTab } from "./category-products-tab";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryDetailClientProps {
  category: ICategory;
}

export const CategoryDetailClient = ({ category }: CategoryDetailClientProps) => {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteSuccess = () => {
    // Redirect to categories list after successful deletion
    router.push('/admin/categories');
  };

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{category.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                Category Details
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category ID</label>
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {category.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <p className="text-lg">{category.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Products Count</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {category._count?.products || 0}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {(category._count?.products || 0) === 1 ? 'product' : 'products'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Tab */}
      <CategoryProductsTab category={category} />

      {/* Modals */}
      <EditCategoryModal
        category={category}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />

      <CategoryDeleteDialog
        category={category}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
};
