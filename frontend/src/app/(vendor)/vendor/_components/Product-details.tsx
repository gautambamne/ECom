"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw, Edit, AlertCircle, Loader2, Star, Minus, Plus } from "lucide-react";
import { ProductActions } from "@/api-actions/product-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    staleTime: 5 * 60 * 1000,
  });

  const product = productResponse?.data;

  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

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
            products: previousProducts.data.products.filter((item) => item.id !== productId)
          }
        });
      }
      return { previousProducts };
    },
    onSuccess: (_, productId) => {
      toast.success("Product deleted successfully!");
      queryClient.removeQueries({ queryKey: ['product', productId] });
      setTimeout(() => {
        onBack?.();
      }, 300);
    },
    onError: (error: any, _productId, context) => {
      toast.error(error.message || "Failed to delete product");
      if (context?.previousProducts) {
        queryClient.setQueryData(['vendor-products'], context.previousProducts);
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8">
            <div className="text-center">
              <Loader2 className="h-12 w-12 mx-auto animate-spin mb-4" />
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
              <p className="text-muted-foreground mb-6">{error?.message || "Unable to load product"}</p>
              <div className="flex gap-3 justify-center">
                {onBack && (
                  <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                )}
                <Button onClick={() => refetch()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
  };

  const handleDeleteProduct = () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProduct(productId);
    }
  };

  const currentStock = selectedVariant?.stock || 0;
  const isOutOfStock = currentStock === 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="flex items-center justify-between py-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {isVendorView && onEdit && (
              <Button
                onClick={() => onEdit(product)}
                size="sm"
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}

            {isVendorView && (
              <Button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                size="sm"
                variant="destructive"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Section */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative bg-muted rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center">
                    <Star className="h-20 w-20 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  onClick={() => setIsFavorite(!isFavorite)}
                  size="sm"
                  className="rounded-full h-11 w-11 p-0 bg-background hover:bg-muted shadow-lg"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                  />
                </Button>

                <Button
                  size="sm"
                  className="rounded-full h-11 w-11 p-0 bg-background hover:bg-muted shadow-lg"
                >
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/70 text-white backdrop-blur-sm">
                    {selectedImage + 1} / {product.images.length}
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary ring-2 ring-primary/50'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {product.brand && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="w-3 h-3" />
                    {product.brand}
                  </Badge>
                )}
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? 'Active' : 'Draft'}
                </Badge>
                <Badge variant={!isOutOfStock ? "default" : "destructive"}>
                  {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                {product.name}
              </h1>
              
              {product.product_code && (
                <p className="text-sm text-muted-foreground">SKU: {product.product_code}</p>
              )}
            </div>

            {/* Price Section */}
            <div className="bg-muted rounded-xl p-6 border">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl lg:text-5xl font-bold">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">✓ Best Price Guarantee</p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-muted rounded-lg p-4 border">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold">
                  Color: <span className="text-primary">{selectedVariant?.color}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        selectedVariant?.color === color
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted hover:bg-muted/80 border border-border'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold">
                  Size: <span className="text-primary">{selectedVariant?.size}</span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size: string) => {
                    const sizeVariant = product.variants?.find((v: any) => 
                      v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)
                    );
                    const isAvailable = sizeVariant && sizeVariant.stock > 0;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        disabled={!isAvailable}
                        className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                          selectedVariant?.size === size
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : isAvailable
                            ? 'bg-muted hover:bg-muted/80 border border-border'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            {!isVendorView && (
              <div className="space-y-3">
                <label className="text-sm font-semibold">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-muted rounded-lg border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="px-4 py-3 hover:bg-muted/80 disabled:opacity-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-6 py-3 min-w-[60px] text-center font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                      disabled={isOutOfStock}
                      className="px-4 py-3 hover:bg-muted/80 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Badge variant={currentStock > 0 ? "default" : "destructive"} className="text-xs">
                    {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isVendorView && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || !selectedVariant}
                  size="lg"
                  className="flex-1 gap-2 text-base font-bold rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 rounded-lg"
                >
                  Buy Now
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted rounded-lg p-3 text-center border hover:shadow-md transition-shadow">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-semibold">Free Shipping</p>
                <p className="text-xs text-muted-foreground mt-1">Over ₹2000</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center border hover:shadow-md transition-shadow">
                <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-semibold">Authentic</p>
                <p className="text-xs text-muted-foreground mt-1">100% Original</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center border hover:shadow-md transition-shadow">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-semibold">Easy Returns</p>
                <p className="text-xs text-muted-foreground mt-1">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="variants" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="info">Information</TabsTrigger>
            </TabsList>

            <TabsContent value="variants" className="mt-6">
              {product.variants && product.variants.length > 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-3 px-4 font-semibold">Size</th>
                            <th className="text-left py-3 px-4 font-semibold">Color</th>
                            <th className="text-right py-3 px-4 font-semibold">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.variants.map((variant: any, index: number) => (
                            <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="py-3 px-4 font-medium">{variant.size}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">
                                  {variant.color}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Badge variant={variant.stock > 0 ? "default" : "destructive"}>
                                  {variant.stock}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </TabsContent>

            <TabsContent value="info" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 px-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Total Stock</span>
                      <Badge>{product.stock}</Badge>
                    </div>
                    {product.brand && (
                      <div className="flex justify-between items-center py-3 px-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Brand</span>
                        <Badge variant="outline">{product.brand}</Badge>
                      </div>
                    )}
                    {product.product_code && (
                      <div className="flex justify-between items-center py-3 px-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Product Code</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {product.product_code}
                        </Badge>
                      </div>
                    )}
                    {product.createdAt && (
                      <div className="flex justify-between items-center py-3 px-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Created</span>
                        <Badge variant="outline" className="text-xs">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}