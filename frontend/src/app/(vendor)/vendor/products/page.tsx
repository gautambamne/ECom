"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  Package,
  AlertCircle,
  Loader2,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "@/api-actions/product-actions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function VendorProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch vendor products
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: () => ProductActions.GetVendorProductsAction(),
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Delete product mutation
  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (productId: string) => ProductActions.DeleteProductAction(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['vendor-products'] });

      const previousProducts = queryClient.getQueryData<IGetProductsVendorResponse>(['vendor-products']);

      if (previousProducts?.data?.products) {
        queryClient.setQueryData(['vendor-products'], {
          ...previousProducts,
          data: {
            ...previousProducts.data,
            products: previousProducts.data.products.filter((product) => product.id !== productId)
          }
        });
      }

      return { previousProducts };
    },
    onSuccess: (_, productId) => {
      toast.success("Product deleted successfully!");
      queryClient.removeQueries({ queryKey: ['product', productId] });
    },
    onError: (error: any, _productId, context) => {
      toast.error(error.message || "Failed to delete product");

      if (context?.previousProducts) {
        queryClient.setQueryData(['vendor-products'], context.previousProducts);
      }
    }
  });

  const handleDeleteProduct = (productId: string, productName: string) => {
    console.log('🎯 handleDeleteProduct called with:', { productId, productName });
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      console.log('✅ User confirmed deletion');
      deleteProduct(productId);
    } else {
      console.log('❌ User cancelled deletion');
    }
  };

  const products = productsResponse?.data?.products || [];

  console.log('📦 Products data:', {
    productsResponse,
    products,
    count: products.length
  });

  // Filter products based on search query
  const filteredProducts = products.filter((product: IProduct) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8">
            <div className="text-center">
              <Loader2 className="h-12 w-12 mx-auto animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your products...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to Load Products</h3>
              <p className="text-muted-foreground mb-6">{error?.message || "Unable to load products"}</p>
              <Button onClick={() => refetch()}>
                <Loader2 className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8" />
              My Products
              <Badge variant="secondary">
                {products.length}
              </Badge>
            </h2>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <Button
            onClick={() => router.push('/vendor/products/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? 'No products found' : 'No products yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start by adding your first product'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push('/vendor/products/new')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product: IProduct) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant={product.is_active ? "default" : "secondary"}
                    >
                      {product.is_active ? 'Active' : 'Draft'}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3">
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}`)}
                      size="sm"
                      variant="secondary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge variant="outline">
                      Stock: {product.stock}
                    </Badge>
                  </div>

                  {/* Variants Summary */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {product.variants.length} variants
                      </Badge>
                      <div className="flex gap-1">
                        {product.variants.slice(0, 3).map((variant: any, index: number) => (
                          <div key={index} className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        ))}
                        {product.variants.length > 3 && (
                          <span className="text-xs text-muted-foreground ml-1">+{product.variants.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}/edit`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={isDeleting}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}