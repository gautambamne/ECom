"use client"

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Upload, 
  Plus, 
  Minus, 
  Save, 
  ArrowLeft,
  Palette,
  Ruler,
  DollarSign,
  Package2,
  AlertCircle,
  ImageIcon,
  Loader2
} from "lucide-react";
import { UpdateProductSchema, type IUpdateProductSchema } from "@/schema/product.schema";
import { ProductActions } from "@/api-actions/product-actions";
import { SHOE_SIZES, SHOE_COLORS, ShoeSize, ShoeColor } from "@/types/prisma-enums";

interface ProductEditProps {
  productId: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function ProductEdit({ productId, onBack, onSuccess }: ProductEditProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Fetch existing product data
  const { data: productResponse, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductActions.GetProductByIdAction(productId),
    enabled: !!productId,
  });

  const product = productResponse?.data;

  const form = useForm<any>({
    resolver: zodResolver(UpdateProductSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      price: 0,
      stock: 0,
      categories: [],
      variants: [{
        size: ShoeSize.UK8,
        color: ShoeColor.BLACK,
        stock: 0
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants"
  });

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || "",
        brand: product.brand || "",
        price: product.price,
        stock: product.stock,
        categories: product.categories || [],
        variants: product.variants?.length > 0 ? product.variants.map(v => ({
          size: v.size as ShoeSize,
          color: v.color as ShoeColor,
          stock: v.stock
        })) : [{
          size: ShoeSize.UK8,
          color: ShoeColor.BLACK,
          stock: 0
        }]
      });
      
      // Set existing images
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images);
      }
    }
  }, [product, form]);

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: (data: { formData: IUpdateProductSchema; images: File[] }) =>
      ProductActions.UpdateProductAction(productId, data.formData, data.images),
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    }
  };

  const onSubmit = (data: IUpdateProductSchema) => {
    updateProduct({
      formData: data,
      images: selectedImages
    });
  };

  const addVariant = () => {
    append({
      size: ShoeSize.UK8,
      color: ShoeColor.BLACK,
      stock: 0
    } as any);
  };

  const removeVariant = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const sizeOptions = SHOE_SIZES;
  const colorOptions = SHOE_COLORS;

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur-sm border-0">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin mb-4" />
            <p className="text-slate-700 font-medium">Loading product details...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-8 h-8 text-slate-700" />
                Edit Product
              </h1>
              <p className="text-slate-600 mt-1">Update product information</p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Package2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Air Jordan 1 Retro High"
                    {...form.register("name")}
                    className="border-slate-300 focus:border-slate-500"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {String(form.formState.errors.name.message || 'Invalid name')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium text-slate-700">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Nike, Adidas, Jordan"
                    {...form.register("brand")}
                    className="border-slate-300 focus:border-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product features, materials, and unique selling points..."
                  rows={4}
                  {...form.register("description")}
                  className="border-slate-300 focus:border-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("price", { valueAsNumber: true })}
                    className="border-slate-300 focus:border-slate-500"
                  />
                  {form.formState.errors.price && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {String(form.formState.errors.price.message || 'Invalid price')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    Total Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...form.register("stock", { valueAsNumber: true })}
                    className="border-slate-300 focus:border-slate-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Current Images
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm font-medium text-slate-700">
                  {existingImages.length > 0 ? "Replace Images (optional)" : "Upload New Images"}
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label
                    htmlFor="images"
                    className="text-sm text-slate-600 cursor-pointer hover:text-slate-800"
                  >
                    Click to upload new images or drag and drop
                  </Label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`New Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-blue-500"
                        />
                        <Badge className="absolute top-1 right-1 bg-blue-600">New</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-900 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Product Variants
                </div>
                <Button
                  type="button"
                  onClick={addVariant}
                  size="sm"
                  variant="secondary"
                  className="bg-white text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variant
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-700 flex items-center gap-2">
                      <Badge variant="outline">Variant {index + 1}</Badge>
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeVariant(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        Size
                      </Label>
                      <Select
                        value={form.watch(`variants.${index}.size` as any) || ""}
                        onValueChange={(value) => form.setValue(`variants.${index}.size` as any, value as any)}
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizeOptions.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Palette className="w-4 h-4" />
                        Color
                      </Label>
                      <Select
                        value={form.watch(`variants.${index}.color` as any) || ""}
                        onValueChange={(value) => form.setValue(`variants.${index}.color` as any, value as any)}
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Stock
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...form.register(`variants.${index}.stock` as any, { valueAsNumber: true })}
                        className="border-slate-300 focus:border-slate-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {form.formState.errors.variants && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  At least one variant is required
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
