interface IProduct {
    name: string
    price: number
    stock: number
    variants: {
        size: string;
        color: string;
        stock: number
    }[];
    description?: string
    brand?: string
    categories?: string[]
    image?: any
    images?: string[]
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
  product: IProduct;
  message: string
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
  products: IProduct[];
  message: string
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

