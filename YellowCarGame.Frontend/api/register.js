import { api } from '@/config/config';

const register = async (data) => {
    let res;

    const register = await api().post("/api/register", data).then(response => {
        res = response.data;
        return res
    }).catch((error) => {
        throw error.response.data;
    })
    return register
}

export default register;