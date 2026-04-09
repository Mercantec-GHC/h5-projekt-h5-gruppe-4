import { refresh } from '@/api';
import { laesDekrypteret } from '@/helpers/storage';
import axios from 'axios';
export const url = {
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://10.133.51.112:8080'}`,
    path: '/'
};


const axiosInstance = axios.create({
    baseURL: `/`,
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute =
            originalRequest.url.includes('/api/userdata/login') ||
            originalRequest.url.includes('/api/userdata/refresh');

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthRoute
        ) {
            originalRequest._retry = true;
            try {
                await refresh();

                // 🔥 HENT NYT TOKEN
                const user = laesDekrypteret('jwt');
                if (user?.jwtToken) {
                    originalRequest.headers.Authorization = `Bearer ${user.jwtToken}`;
                }

                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Refresh fejlede:', err);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export const api = (formdata) => {
    if (formdata) {
        delete axiosInstance.defaults.headers['Content-Type'];
    } else {
        axiosInstance.defaults.headers['Content-Type'] = 'application/json';
    }

    return axiosInstance;
};//*/