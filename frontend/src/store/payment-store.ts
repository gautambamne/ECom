import { create } from 'zustand';
import { PaymentActions } from '@/api-actions/payment-actions';

interface IPaymentStore {
    // State
    payment: IPayment | null;
    payments: IPayment[];
    orderPayments: IPayment[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPayment: (payment: IPayment | null) => void;
    setPayments: (payments: IPayment[]) => void;
    setOrderPayments: (payments: IPayment[]) => void;

    // API Actions
    createPayment: (data: any) => Promise<IPayment | null>;
    fetchPayment: (paymentId: string) => Promise<void>;
    fetchOrderPayments: (orderId: string) => Promise<void>;
    fetchUserPayments: (page?: number, limit?: number) => Promise<void>;
}

export const usePaymentStore = create<IPaymentStore>((set, get) => ({
    // Initial State
    payment: null,
    payments: [],
    orderPayments: [],
    isLoading: false,
    error: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setPayment: (payment: IPayment | null) => set({ payment }),
    setPayments: (payments: IPayment[]) => set({ payments }),
    setOrderPayments: (payments: IPayment[]) => set({ orderPayments: payments }),

    // API Actions
    createPayment: async (data: any) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await PaymentActions.CreatePaymentAction(data);
            return response.payment;
        } catch (error: any) {
            setError(error.message || 'Failed to create payment');
            return null;
        } finally {
            setLoading(false);
        }
    },

    fetchPayment: async (paymentId: string) => {
        const { setLoading, setError, setPayment } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await PaymentActions.GetPaymentAction(paymentId);
            setPayment(response.payment);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch payment');
        } finally {
            setLoading(false);
        }
    },

    fetchOrderPayments: async (orderId: string) => {
        const { setLoading, setError, setOrderPayments } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await PaymentActions.GetOrderPaymentsAction(orderId);
            setOrderPayments(response.payments);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch order payments');
        } finally {
            setLoading(false);
        }
    },

    fetchUserPayments: async (page?: number, limit?: number) => {
        const { setLoading, setError, setPayments } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await PaymentActions.GetUserPaymentsAction(page, limit);
            setPayments(response.payments);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch user payments');
        } finally {
            setLoading(false);
        }
    },
}));