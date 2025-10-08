import { create } from 'zustand';
import { UserActions } from '@/api-actions/user-action';

interface IUserStore {
    // State
    userData: IUser | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setUserData: (userData: IUser | null) => void;

    // API Actions
    fetchCurrentUser: () => Promise<void>;
    updateUser: (data: any) => Promise<boolean>;
    updatePassword: (data: any) => Promise<boolean>;
}

export const useUserStore = create<IUserStore>((set, get) => ({
    // Initial State
    userData: null,
    isLoading: false,
    error: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setUserData: (userData: IUser | null) => set({ userData }),

    // API Actions
    fetchCurrentUser: async () => {
        const { setLoading, setError, setUserData } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await UserActions.GetCurrentUserAction();
            setUserData(response.user);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch current user');
        } finally {
            setLoading(false);
        }
    },

    updateUser: async (data: any) => {
        const { setLoading, setError, fetchCurrentUser } = get();
        try {
            setLoading(true);
            setError(null);
            await UserActions.UpdateUserAction(data);
            // Refresh user data after updating
            await fetchCurrentUser();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to update user');
            return false;
        } finally {
            setLoading(false);
        }
    },

    updatePassword: async (data: any) => {
        const { setLoading, setError } = get();
        try {
            setLoading(true);
            setError(null);
            await UserActions.UpdatePasswordAction(data);
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to update password');
            return false;
        } finally {
            setLoading(false);
        }
    },
}));