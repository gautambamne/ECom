"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { EditCategoryModal } from "./edit-category-modal";
import { CategoryDeleteDialog } from "./category-delete-modal";

interface CategoryActionsProps {
  category: ICategory;
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href={`/admin/categories/${category.id}`} passHref>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEditModal(true)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      <EditCategoryModal
        category={category}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />

      <CategoryDeleteDialog
        category={category}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
