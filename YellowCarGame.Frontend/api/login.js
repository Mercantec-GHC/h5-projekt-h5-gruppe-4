import axios from 'axios';
import { url } from '@/config/config';
const path = `${url.baseURL}${url.path}`;

const login = async (data) => {
    let res;

    const login = await axios().post(`${path}login`, data).then(response => {
        res = response.data.message
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
    })
    return login
}

export default login;