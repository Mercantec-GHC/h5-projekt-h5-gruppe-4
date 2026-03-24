//import { refresh } from '@/api';
//import { laesDekrypteret } from '@/helpers/storage';
//import axios from 'axios';
export const url = {
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://10.133.51.112:8080/'}`,
    path: 'api/'
};


/*const axiosInstance = axios.create({
    baseURL: `${url.baseURL}${url.path}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        // 🔒 Undgå uendelig refresh-loop
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('refresh')
        ) {
            originalRequest._retry = true;

            try {
                const user = laesDekrypteret("bruger");
                if (!user?.id) throw new Error("Ingen bruger-id");

                await refresh({ id: user.id }); // forventer { id: 1 }

                return axiosInstance(originalRequest); // 👈 brug samme instans
            } catch (err) {
                console.error("Refresh fejlede, redirecter:", err);
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