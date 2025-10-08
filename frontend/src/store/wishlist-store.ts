import { create } from 'zustand';
import { WishlistActions } from '@/api-actions/wishlist-action';

interface IWishlistStore {
    // State
    wishlistData: any | null;
    wishlistItemCount: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setWishlistData: (wishlistData: any | null) => void;
    setWishlistItemCount: (count: number) => void;

    // API Actions
    fetchWishlist: () => Promise<void>;
    addToWishlist: (data: any) => Promise<boolean>;
    removeFromWishlist: (productId: string) => Promise<boolean>;
    clearWishlist: () => Promise<boolean>;
    fetchWishlistItemCount: () => Promise<void>;
    checkWishlistStatus: (productId: string) => Promise<boolean>;
    moveToCart: (productId: string) => Promise<boolean>;
}

export const useWishlistStore = create<IWishlistStore>((set, get) => ({
    // Initial State
    wishlistData: null,
    wishlistItemCount: 0,
    isLoading: false,
    error: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setWishlistData: (wishlistData: any | null) => set({ wishlistData }),
    setWishlistItemCount: (count: number) => set({ wishlistItemCount: count }),

    // API Actions
    fetchWishlist: async () => {
        const { setLoading, setError, setWishlistData } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await WishlistActions.GetUserWishlistAction();
            setWishlistData(response);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch wishlist');
        } finally {
            setLoading(false);
        }
    },

    addToWishlist: async (data: any) => {
        const { setLoading, setError, fetchWishlist, fetchWishlistItemCount } = get();
        try {
            setLoading(true);
            setError(null);
            await WishlistActions.AddItemToWishlistAction(data);
            // Refresh wishlist and count after adding
            await fetchWishlist();
            await fetchWishlistItemCount();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to add item to wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    },

    removeFromWishlist: async (productId: string) => {
        const { setLoading, setError, fetchWishlist, fetchWishlistItemCount } = get();
        try {
            setLoading(true);
            setError(null);
            await WishlistActions.RemoveItemFromWishlistAction(productId);
            // Refresh wishlist and count after removing
            await fetchWishlist();
            await fetchWishlistItemCount();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to remove item from wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    },

    clearWishlist: async () => {
        const { setLoading, setError, setWishlistData, setWishlistItemCount } = get();
        try {
            setLoading(true);
            setError(null);
            await WishlistActions.ClearWishlistAction();
            setWishlistData(null);
            setWishlistItemCount(0);
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to clear wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    },

    fetchWishlistItemCount: async () => {
        const { setError, setWishlistItemCount } = get();
        try {
            setError(null);
            const response = await WishlistActions.GetWishlistItemCountAction();
            setWishlistItemCount(response.count);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch wishlist item count');
        }
    },

    checkWishlistStatus: async (productId: string) => {
        const { setError } = get();
        try {
            setError(null);
            const response = await WishlistActions.CheckWishlistStatusAction(productId);
            return response.isInWishlist;
        } catch (error: any) {
            setError(error.message || 'Failed to check wishlist status');
            return false;
        }
    },

    moveToCart: async (productId: string) => {
        const { setLoading, setError, fetchWishlist, fetchWishlistItemCount } = get();
        try {
            setLoading(true);
            setError(null);
            await WishlistActions.MoveToCartAction(productId);
            // Refresh wishlist and count after moving to cart
            await fetchWishlist();
            await fetchWishlistItemCount();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to move item to cart');
            return false;
        } finally {
            setLoading(false);
        }
    },
}));