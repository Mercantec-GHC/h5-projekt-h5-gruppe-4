import { api } from '@/config/config';

const createGame = async (data) => {
    let res;

    const createGame = await api().post("/api/game/create", data).then(response => {
        res = response.data;
        return res
    }).catch((error) => {
        throw error.response.data;
    })
    return createGame
}

export default createGame;