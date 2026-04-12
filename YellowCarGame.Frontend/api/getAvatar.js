import { api } from "@/config/config";

const hentAvatar = async (userId) => {
    try {
        const res = await api().get(`/api/userdata/getAvatar/${userId}`);
        return res.data;
    } catch (err) {
        if (err.response?.status === 404) {
            return null; // 👈 ingen avatar
        }
        throw err;
    }
};

export default hentAvatar;