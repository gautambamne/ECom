import { create } from 'zustand';
import { SessionActions } from '@/api-actions/session-action';

interface ISessionStore {
    // State
    sessionsData: ISessionResponse | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSessionsData: (sessionsData: ISessionResponse | null) => void;

    // API Actions
    getAllUserSessions: () => Promise<void>;
    deleteSpecificSession: (sessionId: string) => Promise<boolean>;
    deleteAllSessionsExceptCurrent: () => Promise<boolean>;
}

export const useSessionStore = create<ISessionStore>((set, get) => ({
    // Initial State
    sessionsData: null,
    isLoading: false,
    error: null,

    // State Setters
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setSessionsData: (sessionsData: ISessionResponse | null) => set({ sessionsData }),

    // API Actions
    getAllUserSessions: async () => {
        const { setLoading, setError, setSessionsData } = get();
        try {
            setLoading(true);
            setError(null);
            const response = await SessionActions.GetAllUserSessionsAction();
            setSessionsData(response);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch user sessions');
        } finally {
            setLoading(false);
        }
    },

    deleteSpecificSession: async (sessionId: string) => {
        const { setLoading, setError, getAllUserSessions } = get();
        try {
            setLoading(true);
            setError(null);
            await SessionActions.DeleteSpecificSessionAction(sessionId);
            // Refresh sessions after deleting
            await getAllUserSessions();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to delete session');
            return false;
        } finally {
            setLoading(false);
        }
    },

    deleteAllSessionsExceptCurrent: async () => {
        const { setLoading, setError, getAllUserSessions } = get();
        try {
            setLoading(true);
            setError(null);
            await SessionActions.DeleteAllSessionsExceptCurrentAction();
            // Refresh sessions after deleting
            await getAllUserSessions();
            return true;
        } catch (error: any) {
            setError(error.message || 'Failed to delete sessions');
            return false;
        } finally {
            setLoading(false);
        }
    },
}));