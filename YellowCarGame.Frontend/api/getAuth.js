import { api } from "@/config/config";

const hentData = async () => {
    let res;
    const hentData = await api().get("/api/userdata/getUser").then(response => {
        res = response.data
        console.log("GET USER RESPONSE:", res);
        return res
    }).catch(function (error) {
        if (error.response) {
            res = error.response.data;
            throw res;
        } else if (error.request) {
            res = error.request
            throw res
        } else {
            res = error.message
            throw res
        }
    })
    return hentData;
}

export default hentData;