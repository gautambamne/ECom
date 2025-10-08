import { create } from 'zustand';
import { CartActions } from '@/api-actions/cart-actions';

interface ICartStore {
    // State
    cartData: IGetUserCartResponse | null;
    cartItemCount: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCartData: (cartData: IGetUserCartResponse | null) => void;
    setCartItemCount: (count: number) => void;

    // API Actions
    fetchCart: () => Promise<void>;
    addToCart: (data: any) => Promise<boolean>;
    updateCartItem: (itemId: string, data: any) => Promise<boolean>;
    removeFromCart: (itemId: string) => Promise<boolean>;
    clearCart: () => Promise<boolean>;
    fetchCartItemCount: () => Promise<void>;
    fetchCartItem: (itemId: string) => Promise<IGetSingleCartResponse | null>;
}

export const useCartStore = create<ICartStore>((set, get) => ({
    // Initial State
    cartData: null,
    cartItemCount: 0,
    isLoading: false,
    error: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setCartData: (cartData: IGetUserCartResponse | null) => set({ cartData }),
    setCartItemCount: (count: number) => set({ cartItemCount: count }),

    // API Actions
    fetchCart: async () => {
        const { setLoading, setError, setCartData } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await CartActions.GetUserCartAction();
            setCartData(response);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    },

    addToCart: async (data: any) => {
        const { setLoading, setError, fetchCart, fetchCartItemCount } = get();
        try {
            setLoading(true);
            setError(null);
            await CartActions.AddItemCartAction(data);
            // Refresh cart and count after adding
            await fetchCart();
            await fetchCartItemCount();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to add item to cart');
            return false;
        } finally {
            setLoading(false);
        }
    },

    updateCartItem: async (itemId: string, data: any) => {
        const { setLoading, setError, fetchCart } = get();
        try {
            setLoading(true);
            setError(null);
            await CartActions.UpdateCartItemQuantityAction(data, itemId);
            // Refresh cart after updating
            await fetchCart();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to update cart item');
            return false;
        } finally {
            setLoading(false);
        }
    },

    removeFromCart: async (itemId: string) => {
        const { setLoading, setError, fetchCart, fetchCartItemCount } = get();
        try {
            setLoading(true);
            setError(null);
            await CartActions.RemoveItemFromCartAction(itemId);
            // Refresh cart and count after removing
            await fetchCart();
            await fetchCartItemCount();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to remove item from cart');
            return false;
        } finally {
            setLoading(false);
        }
    },

    clearCart: async () => {
        const { setLoading, setError, setCartData, setCartItemCount } = get();
        try {
            setLoading(true);
            setError(null);
            await CartActions.ClearCartAction();
            setCartData(null);
            setCartItemCount(0);
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to clear cart');
            return false;
        } finally {
            setLoading(false);
        }
    },

    fetchCartItemCount: async () => {
        const { setError, setCartItemCount } = get();
        try {
            setError(null);
            const response = await CartActions.GetCartItemCountAction();
            setCartItemCount(response.count);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch cart item count');
        }
    },

    fetchCartItem: async (itemId: string) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await CartActions.GetSingleCartItemAction(itemId);
            return response;
        } catch (error: any) {
            setError(error.message || 'Failed to fetch cart item');
            return null;
        } finally {
            setLoading(false);
        }
    },
}));