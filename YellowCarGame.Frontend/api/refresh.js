import { api } from '@/config/config';

const refresh = async (data) => {
    let res;

    const refresh = await api().post('api/auth/refresh', data).then(response => {
        res = response.data
        return res
    }).catch((error) => {
        if (error.response) {
            res = error.response.data;
            throw res;
        } else if (error.request) {
            res = error.request;
            throw res
        } else {
            res = error.message;
            throw res
        }
    });
    return refresh;
}
export default refresh;