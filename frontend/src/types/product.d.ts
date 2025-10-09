interface IProduct {
    name: string
    price: number
    stock: number
    variants: {
        size: string;
        color: string;
        stock: number
    }[];
    description?: string | undefined
    brand?: string | undefined
    categories?: string[] | undefined
    image?: any | undefined
    images?: string[] | undefined
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

