import * as signalR from "@microsoft/signalr";
import { url } from "@/config/config";

let connection = null;

export const getConnection = () => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(url.baseURL + "/game/hub", {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();
    }
    return connection;
};