"use client"

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  ImageIcon
} from "lucide-react";
import { CreateProductSchema, type ICreateProductSchema } from "@/schema/product.schema";
import { ProductActions } from "@/api-actions/product-actions";
import { SHOE_SIZES, SHOE_COLORS, ShoeSize, ShoeColor } from "@/types/prisma-enums";

interface ProductCreateProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function ProductCreate({ onBack, onSuccess }: ProductCreateProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      price: 0,
      stock: 0,
      categories: [],
      variants: [
        {
          size: ShoeSize.UK8,
          color: ShoeColor.BLACK,
          stock: 0
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants"
  });

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: (data: { formData: ICreateProductSchema; images: File[] }) =>
      ProductActions.CreateProductAction(data.formData, data.images),
    onSuccess: (data) => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      form.reset();
      setSelectedImages([]);
      setImagePreview([]);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create product");
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

  const onSubmit = (data: ICreateProductSchema) => {
    createProduct({
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

  // Use size and color options from Prisma enums
  const sizeOptions = SHOE_SIZES;
  const colorOptions = SHOE_COLORS;

  return (
    <div className="bg-background pb-8">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
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
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Package className="w-8 h-8 text-primary" />
                Create New Product
              </h1>
              <p className="text-muted-foreground mt-1">Add a new sneaker to your inventory</p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Package2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Air Jordan 1 Retro High"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {form.formState.errors.name.message}
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
                      {form.formState.errors.price.message}
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
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm font-medium">
                  Upload Images
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
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
                    className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                  >
                    Click to upload images or drag and drop
                  </Label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader className="bg-muted/50">
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
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
