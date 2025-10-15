import {create} from 'zustand'
import {setCookie, getCookie, deleteCookie} from 'cookies-next'
import { AuthActions } from '@/api-actions/auth-actions'
import { UserActions } from '@/api-actions/user-action'

interface IAuthStore {
    isLoggedIn: boolean,
    user: IUser | null,
    isLoading: boolean,
    setLogin: (data:IUser, token ?: string) => void,
    setLogout: () => void,
    forceLogout: () => void,
    initializeAuth: () => Promise<void>,
    setUser: (user: IUser | null) => void
}

// Helper functions for localStorage
const getStoredUser = (): IUser | null => {
    if (typeof window === 'undefined') return null;
    try {
        const user = localStorage.getItem('user_data');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

const setStoredUser = (user: IUser | null) => {
    if (typeof window === 'undefined') return;
    try {
        if (user) {
            localStorage.setItem('user_data', JSON.stringify(user));
        } else {
            localStorage.removeItem('user_data');
        }
    } catch {
        // Ignore localStorage errors
    }
};

export const useAuthStore = create<IAuthStore>((set, get)=>{

    const initializeAuth = async () => {
        const token = getCookie("auth_token");
        const storedUser = getStoredUser();

        if (token) {
            set({ isLoggedIn: true });

            // If we have a token but no user data, try to fetch current user
            if (!storedUser) {
                try {
                    set({ isLoading: true });
                    // Try to get current user data - this will use the refresh token if needed
                    const userResponse = await UserActions.GetCurrentUserAction();
                    if (userResponse && userResponse.user) {
                        setStoredUser(userResponse.user);
                        set({ user: userResponse.user, isLoading: false });
                    } else {
                        // If we can't get user data, force logout
                        get().forceLogout();
                    }
                } catch (error) {
                    // If fetching user fails, force logout
                    get().forceLogout();
                }
            } else {
                set({ user: storedUser });
            }
        } else {
            // No token, clear everything
            set({ isLoggedIn: false, user: null });
            setStoredUser(null);
        }
        set({ isLoading: false });
    };

    return {
        isLoggedIn: false, // Will be set by initializeAuth
        user: null, // Will be set by initializeAuth
        isLoading: true,

        setLogin: (data, token) => {
            if(token){
                const modified_token = `Bearer ${token}`;
                setCookie("auth_token", modified_token)
            }
            setStoredUser(data);
            set({user:data, isLoggedIn: true, isLoading: false})
        },

        setLogout: async()=>{
            try {
                await AuthActions.LogoutAction()
            } catch (error) {
                // Ignore logout API errors
            }
            deleteCookie("auth_token")
            setStoredUser(null);
            set({user:null, isLoggedIn:false, isLoading: false})
        },

        forceLogout: ()=>{
            deleteCookie("auth_token")
            setStoredUser(null);
            set({user:null, isLoggedIn:false, isLoading: false})
        },

        initializeAuth,

        setUser: (user) => {
            setStoredUser(user);
            set({ user, isLoading: false });
        }
    }
})