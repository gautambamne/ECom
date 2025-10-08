import { create } from 'zustand';
import { CategoryActions } from '@/api-actions/category-actions';

interface ICategoryStore {
    // State
    categories: ICategory[];
    category: ICategory | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCategories: (categories: ICategory[]) => void;
    setCategory: (category: ICategory | null) => void;

    // API Actions
    fetchCategories: () => Promise<void>;
    fetchCategory: (categoryId: string) => Promise<void>;
    createCategory: (data: any, image?: File) => Promise<ICategory | null>;
    updateCategory: (categoryId: string, data: any, image?: File) => Promise<ICategory | null>;
    deleteCategory: (categoryId: string) => Promise<boolean>;
}

export const useCategoryStore = create<ICategoryStore>((set, get) => ({
    // Initial State
    categories: [],
    category: null,
    isLoading: false,
    error: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setCategories: (categories: ICategory[]) => set({ categories }),
    setCategory: (category: ICategory | null) => set({ category }),

    // API Actions
    fetchCategories: async () => {
        const { setLoading, setError, setCategories } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await CategoryActions.GetCategoriesAction();
            setCategories(response.categories);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    },

    fetchCategory: async (categoryId: string) => {
        const { setLoading, setError, setCategory } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await CategoryActions.GetCategoryAction(categoryId);
            setCategory(response.category);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch category');
        } finally {
            setLoading(false);
        }
    },

    createCategory: async (data: any, image?: File) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await CategoryActions.CreateCategoryAction(data, image);
            return response.category;
        } catch (error: any) {
            setError(error.message || 'Failed to create category');
            return null;
        } finally {
            setLoading(false);
        }
    },

    updateCategory: async (categoryId: string, data: any, image?: File) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await CategoryActions.UpdateCategoryAction(categoryId, data, image);
            return response.category;
        } catch (error: any) {
            setError(error.message || 'Failed to update category');
            return null;
        } finally {
            setLoading(false);
        }
    },

    deleteCategory: async (categoryId: string) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            await CategoryActions.DeleteCategoryAction(categoryId);
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to delete category');
            return false;
        } finally {
            setLoading(false);
        }
    },
}));