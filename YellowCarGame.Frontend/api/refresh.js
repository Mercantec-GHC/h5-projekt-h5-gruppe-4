import { api } from '@/config/config';
import { laesDekrypteret, gemKrypteret } from '@/helpers/storage';

export const refresh = async () => {
    const user = laesDekrypteret('jwt');

    const res = await api().post('/api/auth/refresh', {
        id: user.refreshToken,
    });

    if (res.data?.accessToken) {
        gemKrypteret('jwt', {
            ...user,
            accessToken: res.data.accessToken,
        });
    }

    return res.data;
};