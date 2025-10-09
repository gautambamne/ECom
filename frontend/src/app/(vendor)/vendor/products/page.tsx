"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = productsResponse?.data?.products || [];

  // Filter products based on search query
  const filteredProducts = products.filter((product: IProduct) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur-sm border-0">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin mb-4" />
                <p className="text-slate-700 font-medium">Loading your products...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur-sm border-0">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-slate-900 font-semibold mb-2 text-lg">Failed to Load Products</h3>
                <p className="text-slate-600 mb-6">{error?.message || "Unable to load products"}</p>
                <Button onClick={() => refetch()} variant="default">
                  <Loader2 className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Package className="w-6 h-6" />
                  </div>
                  My Products
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {products.length}
                  </Badge>
                </CardTitle>
                <p className="text-slate-200 mt-2">Manage your sneaker inventory</p>
              </div>
              <Button
                onClick={() => router.push('/vendor/products/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2 rounded-xl shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card className="shadow-xl bg-white/60 backdrop-blur-sm border-0 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="shadow-xl bg-white/60 backdrop-blur-sm border-0 rounded-2xl p-12">
            <div className="text-center">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchQuery ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start by adding your first sneaker product'
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => router.push('/vendor/products/new')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: IProduct) => (
              <Card key={product.id} className="shadow-xl bg-white/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-slate-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant="secondary" 
                      className={`${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} border-0`}
                    >
                      {product.is_active ? 'Active' : 'Draft'}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}`)}
                      size="sm"
                      variant="secondary"
                      className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
                    {product.brand && (
                      <p className="text-sm text-slate-600">{product.brand}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge variant="outline" className="text-slate-600">
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
                          <div key={index} className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        ))}
                        {product.variants.length > 3 && (
                          <span className="text-xs text-slate-500 ml-1">+{product.variants.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}/edit`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
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