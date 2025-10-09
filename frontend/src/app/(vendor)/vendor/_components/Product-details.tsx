"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw, Edit, AlertCircle, Loader2, Star, Badge as BadgeIcon } from "lucide-react";
import { ProductActions } from "@/api-actions/product-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

interface ProductDetailsProps {
  productId: string;
  onBack?: () => void;
  onEdit?: (product: IProduct) => void;
  isVendorView?: boolean;
}

export default function SneakerProductDetail({ 
  productId,
  onBack,
  onEdit,
  isVendorView = false
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();

  // Fetch product data using React Query
  const { 
    data: productResponse, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductActions.GetProductByIdAction(productId),
    enabled: !!productId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const product = productResponse?.product;

  // Set first variant as default when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  // Delete product mutation (vendor only)
  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (productId: string) => ProductActions.DeleteProductAction(productId),
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      onBack?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete product");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur-sm border-0">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin mb-4" />
            <p className="text-slate-700 font-medium">Loading product details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur-sm border-0">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">Product Not Found</h3>
            <p className="text-slate-600 mb-6">{error?.message || "Unable to load product"}</p>
            <div className="flex gap-3 justify-center">
              {onBack && (
                <Button onClick={onBack} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
              <Button onClick={() => refetch()} variant="default">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Group variants by size and color
  const sizes = [...new Set(product.variants?.map((v: any) => v.size) || [])];
  const availableColors = selectedVariant 
    ? [...new Set(product.variants?.filter((v: any) => v.size === selectedVariant.size).map((v: any) => v.color) || [])]
    : [...new Set(product.variants?.map((v: any) => v.color) || [])];

  const handleSizeChange = (size: string) => {
    const variant = product.variants?.find((v: any) => 
      v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)
    );
    if (variant) {
      setSelectedVariant(variant);
      setQuantity(1);
    }
  };

  const handleColorChange = (color: string) => {
    const variant = product.variants?.find((v: any) => 
      v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size)
    );
    if (variant) {
      setSelectedVariant(variant);
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a size and color");
      return;
    }
    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock available");
      return;
    }
    toast.success(`Added ${quantity} x ${product.name} to cart!`);
    // Add your cart logic here
  };

  const handleDeleteProduct = () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProduct(productId);
    }
  };

  const currentStock = selectedVariant?.stock || 0;
  const isOutOfStock = currentStock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Products</span>
            </Button>
            
            <div className="flex items-center gap-2">
              {isVendorView && onEdit && (
                <Button
                  onClick={() => onEdit(product)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit Product</span>
                </Button>
              )}
              
              {isVendorView && (
                <Button
                  onClick={handleDeleteProduct}
                  disabled={isDeleting}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Enhanced Image Gallery */}
          <div className="space-y-6">
            <Card className="p-6 shadow-2xl bg-white/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden">
              <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <BadgeIcon className="h-16 w-16 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No image available</p>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    onClick={() => setIsFavorite(!isFavorite)}
                    size="sm"
                    variant="secondary"
                    className="rounded-full bg-white/90 hover:bg-white shadow-lg hover:scale-110 transition-all duration-200"
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
                    />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full bg-white/90 hover:bg-white shadow-lg hover:scale-110 transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>

                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-black/20 text-white border-0 backdrop-blur-sm">
                      {selectedImage + 1} / {product.images.length}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    variant="outline"
                    className={`aspect-square p-2 h-auto transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-4 ring-blue-500 shadow-lg border-blue-300'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Product Info */}
          <div className="space-y-8">
            {/* Header Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {product.brand && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    <Star className="w-3 h-3 mr-1" />
                    {product.brand}
                  </Badge>
                )}
                {product.is_active ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Draft
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`${!isOutOfStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                {product.name}
              </h1>
              
              {product.product_code && (
                <p className="text-slate-600 font-medium">SKU: {product.product_code}</p>
              )}
            </div>

            {/* Price Section */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </span>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  Best Price
                </Badge>
              </div>
            </Card>

            {/* Description */}
            {product.description && (
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <BadgeIcon className="w-4 h-4" />
                  Description
                </h3>
                <p className="text-slate-700 leading-relaxed">{product.description}</p>
              </Card>
            )}

            {/* Enhanced Color Selection */}
            {availableColors.length > 0 && (
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
                <label className="block text-lg font-semibold text-slate-900 mb-4">
                  Color: {selectedVariant?.color && (
                    <span className="font-normal text-blue-600">{selectedVariant.color}</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color: string) => (
                    <Button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      variant={selectedVariant?.color === color ? "default" : "outline"}
                      className={`px-6 py-3 font-medium transition-all duration-200 ${
                        selectedVariant?.color === color
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                          : 'hover:border-slate-400 hover:shadow-md'
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Enhanced Size Selection */}
            {sizes.length > 0 && (
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
                <label className="block text-lg font-semibold text-slate-900 mb-4">
                  Size: {selectedVariant?.size && (
                    <span className="font-normal text-blue-600">{selectedVariant.size}</span>
                  )}
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {sizes.map((size: string) => {
                    const sizeVariant = product.variants?.find((v: any) => 
                      v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)
                    );
                    const isAvailable = sizeVariant && sizeVariant.stock > 0;
                    
                    return (
                      <Button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        disabled={!isAvailable}
                        variant={selectedVariant?.size === size ? "default" : "outline"}
                        className={`aspect-square h-12 font-semibold transition-all duration-200 ${
                          selectedVariant?.size === size
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                            : isAvailable
                            ? 'hover:border-slate-400 hover:shadow-md'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Enhanced Quantity Selection */}
            {!isVendorView && (
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
                <label className="block text-lg font-semibold text-slate-900 mb-4">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white rounded-xl border-2 border-slate-200 shadow-sm">
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 font-bold hover:bg-slate-50"
                    >
                      -
                    </Button>
                    <span className="px-6 py-2 font-semibold text-slate-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <Button
                      onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                      disabled={isOutOfStock}
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 font-bold hover:bg-slate-50"
                    >
                      +
                    </Button>
                  </div>
                  <Badge variant="outline" className={currentStock > 0 ? 'text-green-600 border-green-300' : 'text-red-600 border-red-300'}>
                    {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                  </Badge>
                </div>
              </Card>
            )}

            {/* Enhanced Action Buttons */}
            {!isVendorView && (
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || !selectedVariant}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 rounded-2xl shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            )}

            {/* Enhanced Features */}
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Product Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Truck className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <p className="font-semibold text-slate-900 mb-1">Free Shipping</p>
                  <p className="text-sm text-slate-600">On orders over ₹2000</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <Shield className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <p className="font-semibold text-slate-900 mb-1">100% Authentic</p>
                  <p className="text-sm text-slate-600">Original products</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <RefreshCw className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <p className="font-semibold text-slate-900 mb-1">Easy Returns</p>
                  <p className="text-sm text-slate-600">30-day policy</p>
                </div>
              </div>
            </Card>

            {/* Enhanced Product Variants Table */}
            {product.variants && product.variants.length > 0 && (
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BadgeIcon className="w-5 h-5 text-blue-600" />
                  Available Variants
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 rounded-l-lg">Size</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Color</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700 rounded-r-lg">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant: any, index: number) => (
                        <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-slate-700 font-medium">{variant.size}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-slate-700">
                              {variant.color}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Badge 
                              variant="outline" 
                              className={`${variant.stock > 0 ? 'text-green-600 border-green-300' : 'text-red-600 border-red-300'}`}
                            >
                              {variant.stock}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Enhanced Additional Product Details */}
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BadgeIcon className="w-5 h-5 text-blue-600" />
                Product Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                  <span className="text-slate-600 font-medium">Total Stock</span>
                  <Badge variant="outline" className="text-slate-900 font-semibold">
                    {product.stock}
                  </Badge>
                </div>
                {product.brand && (
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-slate-600 font-medium">Brand</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 font-semibold">
                      {product.brand}
                    </Badge>
                  </div>
                )}
                {product.product_code && (
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="text-slate-600 font-medium">Product Code</span>
                    <Badge variant="outline" className="text-purple-600 border-purple-300 font-mono text-xs">
                      {product.product_code}
                    </Badge>
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-slate-600 font-medium">Created</span>
                    <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}