interface IProduct {
    id: string; // UUID from backend
    product_id?: number; // Hashed numeric ID
    name: string;
    price: number;
    discount_price?: number | null;
    stock: number;
    variants: {
        size: string;
        color: string;
        stock: number;
        available: boolean;
    }[];
    description?: string;
    brand?: string;
    category?: string; // Single category name
    categories?: string[]; // Array of category IDs
    image?: any;
    images?: string[];
    is_active?: boolean;
    in_stock?: boolean;
    currency?: string;
    vendor?: {
        id: string;
        name: string;
        email: string;
    };
    summary?: {
        total_stock: number;
        available_variants: number;
        discount_percentage?: number;
        is_on_sale: boolean;
        currency: string;
    };
    created_at?: string;
    updated_at?: string;
    // Legacy fields for backwards compatibility
    product_code?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ICreateProductResponse {
    product: IProduct[]
    message: string
}

interface IUpdateProductResponse {
  product: IProduct
  message: string
}

interface IGetProductByIdResponse {
  success: boolean;
  message: string;
  data: IProduct;
}

interface IGetProductsResponse {
  products: IProduct[];
  message: string
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
interface IGetProductsVendorResponse {
  success: boolean;
  message: string;
  data: {
    products: IProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

