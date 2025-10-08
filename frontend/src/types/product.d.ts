interface IProduct {
  id: string;
  name: string;
  product_code: string;
  description: string;
  price: number;
  sale_price?: number;
  images: string[];
  brand: string;
  sizes: string[];
  colors: string[];
  material: string;
  category_id: string;
  vendor_id: string;
  stock_quantity: number;
  min_stock_level: number;
  rating: number;
  reviews_count: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_active: boolean;
  weight?: number;
  dimensions?: string;
  care_instructions?: string;
  created_at: string;
  updated_at: string;
}

interface ICreateProductRequest {
  name: string;
  product_code: string;
  description: string;
  price: number;
  sale_price?: number;
  brand: string;
  sizes: string[];
  colors: string[];
  material: string;
  category_id: string;
  stock_quantity: number;
  min_stock_level: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_active: boolean;
  weight?: number;
  dimensions?: string;
  care_instructions?: string;
}

interface IUpdateProductRequest extends Partial<ICreateProductRequest> {}

interface IGetProductsResponse {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface IGetProductResponse {
  product: IProduct;
}

interface ICreateProductResponse {
  product: IProduct;
  message: string;
}

interface IUpdateProductResponse {
  product: IProduct;
  message: string;
}

interface IProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  onSale?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}