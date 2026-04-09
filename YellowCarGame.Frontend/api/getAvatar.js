import { api } from "@/config/config";

const hentAvatar = async (userId) => {
    const res = await api().get(`/api/userdata/getAvatar/${userId}`, {
        responseType: "blob"
    });

    return URL.createObjectURL(res.data);
};

export default hentAvatar;