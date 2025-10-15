"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface CategoryProductsTabProps {
  category: ICategory;
}

export const CategoryProductsTab = ({ category }: CategoryProductsTabProps) => {
  const productCount = category._count?.products || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total products in this category
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {productCount}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {productCount === 1 ? 'product' : 'products'}
                </span>
              </div>
            </div>
            {productCount > 0 && (
              <Button asChild variant="outline">
                <Link href={`/admin/products?category=${category.id}`} prefetch={false}>
                  View Products
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          
          {productCount === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No products in this category yet.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/admin/products/new" prefetch={false}>
                  Add your first product
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
