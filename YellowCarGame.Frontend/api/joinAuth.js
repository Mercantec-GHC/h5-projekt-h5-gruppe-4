import { api } from "@/config/config";

const joinAuth = async (gameId) => {
    console.log("joinAuth called with gameId:", gameId);
    try {
        const response = await api().get(
            `/api/game/join?code=${gameId.Gamecode || gameId.code}`);

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