import { api } from '@/config/config';
import { laesDekrypteret, gemKrypteret } from '@/helpers/storage';

const refresh = async () => {
    const user = laesDekrypteret('jwt');
    console.log("USER:", user);

    if (!user?.refreshToken) {
        throw new Error("No refresh token");
    }
    const res = await api().post('/api/userdata/refresh', {
        refreshToken: user.refreshToken,
    });

    if (res.data?.jwtToken) {
        gemKrypteret('jwt', {
            ...user,
            jwtToken: res.data.jwtToken,
            expiresIn: res.data.expiresIn,
            refreshToken: res.data.refreshToken ?? user.refreshToken
        });
    }

    return res.data;
};
export default refresh;