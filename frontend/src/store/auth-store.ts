import {create} from 'zustand'
import {setCookie, getCookie, deleteCookie} from 'cookies-next'
import { AuthActions } from '@/api-actions/auth-actions'

interface IAuthStore {
    isLoggedIn: boolean,
    user: IUser | null,
    setLogin: (data:IUser, token ?: string) => void,
    setLogout: () => void
}


export const useAuthStore = create<IAuthStore>((set)=>{
    return {
        isLoggedIn: !!getCookie("auth_token"),
        user: null,

        setLogin: (data, token) => {
            if(token){
            const modified_token = `Bearer ${token}`;
            setCookie("auth_token", modified_token)
            }
            set({user:data})
            set({isLoggedIn: true})
        },
        setLogout: async()=>{
            await AuthActions.LogoutAction()
            set({user:null})
            deleteCookie("auth_token")
            set({isLoggedIn:false})
        }

    }
})