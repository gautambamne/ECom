"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Package,
  AlertCircle,
  Loader2,
  Sparkles,
  Grid3x3,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon
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

  // Calculate quick stats
  const activeProducts = products.filter((p: IProduct) => p.is_active).length;
  const totalStock = products.reduce((sum: number, p: IProduct) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter((p: IProduct) => p.stock <= 10).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-black dark:to-black">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:bg-purple-700 dark:opacity-10" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:bg-yellow-700 dark:opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Card className="p-8 shadow-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border-0">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-violet-600 dark:text-violet-400 mx-auto animate-spin mb-4" />
                <p className="text-slate-700 dark:text-gray-300 font-medium">Loading your products...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-black dark:to-black">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:bg-purple-700 dark:opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Card className="p-8 shadow-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border-0">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2 text-lg">Failed to Load Products</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6">{error?.message || "Unable to load products"}</p>
                <Button onClick={() => refetch()} variant="default" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-black dark:to-black">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:bg-purple-700 dark:opacity-10" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:bg-yellow-700 dark:opacity-10" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:bg-pink-700 dark:opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm rounded-full border border-violet-200 dark:border-violet-700 mb-4">
              <Grid3x3 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-semibold text-violet-900 dark:text-violet-100">Product Management</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400">
              My Products
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage your sneaker inventory and listings</p>
          </div>
          
          <Button
            onClick={() => router.push('/vendor/products/new')}
            className="group bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-6 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Product
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-foreground">{products.length}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Products</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">{activeProducts}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Stock</p>
                  <p className="text-3xl font-bold text-foreground">{totalStock}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Grid3x3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{lowStockCount}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg animate-pulse">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-gray-500" />
                <Input
                  placeholder="Search products by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 border-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 rounded-2xl text-base"
                />
              </div>
              <Button 
                variant="outline" 
                className="h-14 px-8 rounded-2xl dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border-2 font-semibold"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl">
            <CardContent className="p-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 mb-6">
                  <Package className="h-12 w-12 text-slate-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {searchQuery ? 'No products found' : 'No products yet'}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 mb-8 text-lg">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start by adding your first sneaker product to your inventory'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push('/vendor/products/new')}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-6 text-base font-semibold shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Product
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: IProduct, idx: number) => (
              <Card 
                key={product.id} 
                className="group relative border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden rounded-3xl"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-20 w-20 text-slate-400 dark:text-gray-500" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className={`${
                        product.is_active 
                          ? 'bg-emerald-500/90 text-white border-0' 
                          : 'bg-gray-500/90 text-white border-0'
                      } backdrop-blur-sm px-4 py-1.5 text-sm font-bold shadow-lg`}
                    >
                      {product.is_active ? 'Active' : 'Draft'}
                    </Badge>
                  </div>

                  {/* Low Stock Badge */}
                  {product.stock <= 10 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500/90 text-white border-0 backdrop-blur-sm px-4 py-1.5 text-sm font-bold shadow-lg animate-pulse">
                        Low Stock
                      </Badge>
                    </div>
                  )}

                  {/* Quick View Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}`)}
                      className="bg-white/90 hover:bg-white text-slate-900 px-6 py-3 rounded-xl shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Quick View
                    </Button>
                  </div>
                </div>

                <CardContent className="relative p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400 transition-all duration-300">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 font-bold ${
                        product.stock <= 10 
                          ? 'border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-400' 
                          : 'border-gray-300 dark:border-gray-700 text-slate-600 dark:text-gray-400'
                      }`}
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>

                  {/* Variants Summary */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline" className="text-xs px-3 py-1 dark:border-gray-700 dark:text-gray-400 font-semibold">
                        {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                      </Badge>
                      <div className="flex gap-1.5">
                        {product.variants.slice(0, 3).map((variant: any, index: number) => (
                          <div key={index} className="w-3 h-3 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full shadow-sm"></div>
                        ))}
                        {product.variants.length > 3 && (
                          <span className="text-xs text-slate-500 dark:text-gray-500 ml-1 font-semibold">+{product.variants.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => router.push(`/vendor/products/${product.id}/edit`)}
                      variant="outline"
                      className="flex-1 h-11 text-sm font-semibold dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl border-2 group/btn"
                    >
                      <Edit className="w-4 h-4 mr-1.5 group-hover/btn:rotate-12 transition-transform" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={isDeleting}
                      variant="outline"
                      className="h-11 px-4 text-sm font-semibold text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border-2 group/btn"
                    >
                      <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
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
