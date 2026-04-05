import * as signalR from "@microsoft/signalr";
import { url } from "@/config/config";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(url.baseURL.replace("/api", "") + "/hub") // Juster URL'en til din SignalR-hub
    .withAutomaticReconnect()
    .build();

export default connection;