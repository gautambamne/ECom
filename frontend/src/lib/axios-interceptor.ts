import axios from 'axios'
import { BACKEND_URL } from '@/constants'
import {getCookie} from 'cookies-next'

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    timeout: 20000
})


axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getCookie("auth_token") 
        if(token){
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (resposne)=>{
        return resposne;
    },
    (error)=>{
        if(error.response && error.response.data && error.response.data.api_error){
            throw error.response.data.api_error;
        }
        throw error;
    }
    
);
export default axiosInstance;
