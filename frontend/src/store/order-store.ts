import { create } from 'zustand';
import { OrderActions } from '@/api-actions/order-actions';

interface IOrderStore {
    // State
    orders: IOrder[];
    order: IOrder | null;
    userOrders: IOrder[];
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
    setOrders: (orders: IOrder[], pagination?: any) => void;
    setOrder: (order: IOrder | null) => void;
    setUserOrders: (orders: IOrder[], pagination?: any) => void;

    // API Actions
    createOrder: (data: any) => Promise<IOrder | null>;
    fetchOrder: (orderId: string) => Promise<void>;
    fetchUserOrders: (page?: number, limit?: number) => Promise<void>;
    fetchAllOrders: (page?: number, limit?: number, status?: string) => Promise<void>;
    updateOrderStatus: (orderId: string, status: string) => Promise<IOrder | null>;
}

export const useOrderStore = create<IOrderStore>((set, get) => ({
    // Initial State
    orders: [],
    order: null,
    userOrders: [],
    isLoading: false,
    error: null,
    pagination: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setOrders: (orders: IOrder[], pagination?: any) => set({ orders, pagination }),
    setOrder: (order: IOrder | null) => set({ order }),
    setUserOrders: (orders: IOrder[], pagination?: any) => set({ userOrders: orders, pagination }),

    // API Actions
    createOrder: async (data: any) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await OrderActions.CreateOrderAction(data);
            return response.order;
        } catch (error: any) {
            setError(error.message || 'Failed to create order');
            return null;
        } finally {
            setLoading(false);
        }
    },

    fetchOrder: async (orderId: string) => {
        const { setLoading, setError, setOrder } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await OrderActions.GetOrderAction(orderId);
            setOrder(response.order);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch order');
        } finally {
            setLoading(false);
        }
    },

    fetchUserOrders: async (page?: number, limit?: number) => {
        const { setLoading, setError, setUserOrders } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await OrderActions.GetUserOrdersAction(page, limit);
            setUserOrders(response.orders, response.pagination);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch user orders');
        } finally {
            setLoading(false);
        }
    },

    fetchAllOrders: async (page?: number, limit?: number, status?: string) => {
        const { setLoading, setError, setOrders } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await OrderActions.GetAllOrdersAction(page, limit, status);
            setOrders(response.orders, response.pagination);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await OrderActions.UpdateOrderStatusAction(orderId, { status } as any);
            return response.order;
        } catch (error: any) {
            setError(error.message || 'Failed to update order status');
            return null;
        } finally {
            setLoading(false);
        }
    },
}));