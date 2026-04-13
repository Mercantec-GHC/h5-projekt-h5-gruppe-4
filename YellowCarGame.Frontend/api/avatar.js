import { api } from "@/config/config";

const uploadAvatar = async (fileBlob) => {
    try {
        const formData = new FormData();
        formData.append("file", fileBlob, "avatar.png");

        const response = await api().post("/api/userdata/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;

    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw error.request;
        } else {
            throw error.message;
        }
    }
};

export default uploadAvatar;