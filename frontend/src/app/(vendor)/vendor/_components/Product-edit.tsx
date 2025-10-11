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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
            <p className="text-muted-foreground">
              Update product information and details
            </p>
          </div>
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Air Jordan 1 Retro High"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {String(form.formState.errors.name.message || 'Invalid name')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Nike, Adidas, Jordan"
                    {...form.register("brand")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product features, materials, and unique selling points..."
                  className="min-h-[100px]"
                  {...form.register("description")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("price", { valueAsNumber: true })}
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {String(form.formState.errors.price.message || 'Invalid price')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    Total Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...form.register("stock", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-20 w-full rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="images">
                  {existingImages.length > 0 ? "Replace Images (optional)" : "Upload Images"}
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 10MB)</p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="space-y-2">
                    <Label>New Images Preview</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`New Preview ${index + 1}`}
                            className="h-20 w-full rounded-lg object-cover"
                          />
                          <Badge className="absolute top-1 right-1">New</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Product Variants
                </CardTitle>
                <Button
                  type="button"
                  onClick={addVariant}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Badge variant="secondary">Variant {index + 1}</Badge>
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeVariant(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        Size
                      </Label>
                      <Select
                        value={form.watch(`variants.${index}.size` as any) || ""}
                        onValueChange={(value) => form.setValue(`variants.${index}.size` as any, value as any)}
                      >
                        <SelectTrigger>
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
                      <Label className="flex items-center gap-1">
                        <Palette className="h-4 w-4" />
                        Color
                      </Label>
                      <Select
                        value={form.watch(`variants.${index}.color` as any) || ""}
                        onValueChange={(value) => form.setValue(`variants.${index}.color` as any, value as any)}
                      >
                        <SelectTrigger>
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
                      <Label className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        Stock
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...form.register(`variants.${index}.stock` as any, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {form.formState.errors.variants && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
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
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
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
