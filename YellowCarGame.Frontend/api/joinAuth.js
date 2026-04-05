import { api } from "@/config/config";

const joinAuth = async (token, sti, gameId) => {
    try {
        const response = await api().get(
            `/api/game/join/${gameId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("POST RESPONSE:", response.data);
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

export default joinAuth;