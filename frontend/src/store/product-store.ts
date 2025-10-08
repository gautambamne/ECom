import { create } from 'zustand';
import { ProductActions } from '@/api-actions/product-actions';

interface IProductStore {
    // State
    products: IProduct[];
    product: IProduct | null;
    featuredProducts: IProduct[];
    saleProducts: IProduct[];
    vendorProducts: IProduct[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setProducts: (products: IProduct[], pagination?: any) => void;
    setProduct: (product: IProduct | null) => void;
    setFeaturedProducts: (products: IProduct[]) => void;
    setSaleProducts: (products: IProduct[]) => void;
    setVendorProducts: (products: IProduct[]) => void;

    // API Actions
    fetchProducts: (query?: any) => Promise<void>;
    fetchProductsByCategory: (categoryId: string, query?: any) => Promise<void>;
    fetchProduct: (productId: string) => Promise<void>;
    fetchFeaturedProducts: () => Promise<void>;
    fetchSaleProducts: () => Promise<void>;
    fetchVendorProducts: (vendorId?: string) => Promise<void>;
    createProduct: (data: any, image?: File) => Promise<IProduct | null>;
    updateProduct: (productId: string, data: any, image?: File) => Promise<IProduct | null>;
    deleteProduct: (productId: string) => Promise<boolean>;
}

export const useProductStore = create<IProductStore>((set, get) => ({
    // Initial State
    products: [],
    product: null,
    featuredProducts: [],
    saleProducts: [],
    vendorProducts: [],
    isLoading: false,
    error: null,
    pagination: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setProducts: (products: IProduct[], pagination?: any) => set({ products, pagination }),
    setProduct: (product: IProduct | null) => set({ product }),
    setFeaturedProducts: (products: IProduct[]) => set({ featuredProducts: products }),
    setSaleProducts: (products: IProduct[]) => set({ saleProducts: products }),
    setVendorProducts: (products: IProduct[]) => set({ vendorProducts: products }),

    // API Actions
    fetchProducts: async (query?: any) => {
        const { setLoading, setError, setProducts } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.GetProductsAction(query);
            setProducts(response.products, response.pagination);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    },

    fetchProductsByCategory: async (categoryId: string, query?: any) => {
        const { setLoading, setError, setProducts } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.GetProductsByCategoryAction(categoryId, query);
            setProducts(response.products, response.pagination);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch products by category');
        } finally {
            setLoading(false);
        }
    },

    fetchProduct: async (productId: string) => {
        const { setLoading, setError, setProduct } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.GetProductAction(productId);
            setProduct(response.product);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    },

    fetchFeaturedProducts: async () => {
        const { setLoading, setError, setFeaturedProducts } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.GetFeaturedProductsAction();
            setFeaturedProducts(response.products);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch featured products');
        } finally {
            setLoading(false);
        }
    },

    fetchSaleProducts: async () => {
        const { setLoading, setError, setSaleProducts } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.GetProductsOnSaleAction();
            setSaleProducts(response.products);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch sale products');
        } finally {
            setLoading(false);
        }
    },

    fetchVendorProducts: async (vendorId?: string) => {
        const { setLoading, setError, setVendorProducts } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.GetVendorProductsAction(vendorId);
            setVendorProducts(response.products);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch vendor products');
        } finally {
            setLoading(false);
        }
    },

    createProduct: async (data: any, image?: File) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.CreateProductAction(data, image);
            return response.product;
        } catch (error: any) {
            setError(error.message || 'Failed to create product');
            return null;
        } finally {
            setLoading(false);
        }
    },

    updateProduct: async (productId: string, data: any, image?: File) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await ProductActions.UpdateProductAction(productId, data, image);
            return response.product;
        } catch (error: any) {
            setError(error.message || 'Failed to update product');
            return null;
        } finally {
            setLoading(false);
        }
    },

    deleteProduct: async (productId: string) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            await ProductActions.DeleteProductAction(productId);
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to delete product');
            return false;
        } finally {
            setLoading(false);
        }
    },
}));