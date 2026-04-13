import { api } from '@/config/config';

const deleteAvatar = async (userId) => {
    try {
        const res = await api().delete(`/api/userdata/removeAvatar?userId=${userId}`);
        return res.data;
    } catch (err) {
        const data = err.response?.data;

        // håndter både string og object
        const message =
            typeof data === "string"
                ? data
                : data?.message;

        if (message === "Avatar not found.") {
            return { ok: true };
        }

        throw err;
    }
};

export default deleteAvatar;