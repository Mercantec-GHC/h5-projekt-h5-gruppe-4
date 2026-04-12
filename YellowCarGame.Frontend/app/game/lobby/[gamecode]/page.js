"use client"
import React, { useState, useEffect } from "react";
import { Box, Button } from "@/lib/mui";
import withAuth from "@/app/withAuth";
import { useRouter, useParams } from "next/navigation";
import { getConnection } from "$/game/signalr";
import { laesDekrypteret } from "@/helpers/storage";
import { useSearchParams } from "next/navigation";
import Loader from "@/app/Components/loader";

const OpretSpil = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const gameId = searchParams.get("id");
    const gamecode = params?.gamecode;

    const [bruger, setBruger] = useState(null);
    const [myId, setMyId] = useState(null);
    const [players, setPlayers] = useState([]);
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [gameDuration, setGameDuration] = useState(300);

    const router = useRouter();



    // 🔐 Load bruger
    useEffect(() => {
        const value = laesDekrypteret("bruger");
        setBruger(value);
        setMyId(value?.id);
        console.log("Loaded user:", value);
    }, []);

    // 🔥 Derived state (ALTID korrekt)
    const me = players.find(p => p.userId === myId);
    const isReady = me?.isReady ?? false;

    // 🔘 Toggle ready
    const handleClick = async () => {
        const conn = getConnection();

        const me = players.find(p => p.userId === myId);
        const currentReady = me?.isReady ?? false;
        const newReady = !currentReady;

        console.log("CLICK READY");

        try {
            conn.invoke(
                "PlayerAction",
                gameId,
                "SetReadyStatus",
                JSON.stringify(newReady)
            );

            console.log("READY SENT");

            // 🔥 Vent lidt så backend når at opdatere

        } catch (err) {
            console.error("READY ERROR:", err);
        }
    };

    useEffect(() => {
        if (!myId || !gameId) return;

        const conn = getConnection();

        const startConnection = async () => {
            try {
                if (conn.state === "Disconnected") {
                    await conn.start();
                    console.log("Connected:", conn.connectionId);

                    // 🎮 Game start
                    conn.on("GameStart", () => {
                        router.push(`/game/play/${gamecode}?id=${gameId}`);
                    });

                    // 📊 Game info
                    conn.on("GameInfo", (data) => {
                        setMaxPlayers(data.maxPlayers);
                        setGameDuration(data.duration);
                    });

                    conn.on("AllPlayers", (data) => {
                        const unique = [];

                        data.players.forEach(p => {
                            const id = p.userId ?? p.UserId;

                            if (!unique.some(u => u.userId === id)) {
                                unique.push({
                                    userId: id,
                                    username: p.userName ?? p.UserName,
                                    isReady: p.isReady ?? p.IsReady ?? false
                                });
                            }
                        });

                        console.log("Filtered players:", unique);

                        setPlayers(unique);
                    });

                    conn.on("PlayerJoined", (player) => {
                        const id = player.userId ?? player.UserId;

                        setPlayers(prev => {
                            if (prev.some(p => p.userId === id)) return prev;

                            return [
                                ...prev,
                                {
                                    userId: id,
                                    username: player.userName ?? player.UserName,
                                    isReady: false
                                }
                            ];
                        });
                    });

                    // ➖ Player left
                    conn.on("PlayerLeft", (player) => {
                        setPlayers(prev =>
                            prev.filter(p =>
                                p.userId !== (player.userId ?? player.UserId)
                            )
                        );
                    });

                    // ✅ Ready
                    conn.on("PlayerReady", (data) => {
                        console.log("PlayerReady EVENT:", data);
                        console.log("My ID:", myId);

                        setPlayers(prev => {
                            console.log("Before update:", prev);

                            const updated = prev.map(p => {
                                console.log("Comparing:", p.userId, "==", data.userId ?? data.UserId);

                                if (p.userId === (data.userId ?? data.UserId)) {
                                    console.log("MATCH FOUND!");
                                    return { ...p, isReady: true };
                                }
                                return p;
                            });

                            console.log("After update:", updated);
                            return updated;
                        });
                    });

                    // ❌ Not ready
                    conn.on("PlayerNotReady", (data) => {
                        console.log("PlayerNotReady:", data);

                        setPlayers(prev =>
                            prev.map(p =>
                                p.userId === (data.userId ?? data.UserId)
                                    ? { ...p, isReady: false }
                                    : p
                            )
                        );
                    });

                    console.log("Joining game:", gamecode, myId);

                    await conn.invoke("JoinGame", gameId, myId);
                }
            } catch (err) {
                console.error("SignalR error:", err);
            }
        };

        startConnection();

        return () => {
            conn.off("AllPlayers");
            conn.off("PlayerJoined");
            conn.off("PlayerLeft");
            conn.off("PlayerReady");
            conn.off("PlayerNotReady");
        };
    }, [gamecode, myId]);

    // ⏳ Loader
    if (!bruger) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 10
            }}>
                <Loader text="Loading user..." />
            </Box>
        );
    }
    const isConnected = players.length > 0;
    // 🎨 UI
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '80%',
            margin: '0 auto'
        }}>
            <h1>Lobby</h1>
            <p>Game Code: {gamecode}</p>

            <h2>Game Settings</h2>
            <p>Max players: {maxPlayers}</p>
            <p>Game duration: {gameDuration} sek</p>

            <h2>Spillere</h2>
            <ul>
                {players.map((p, i) => (
                    <li key={i}>
                        {p.username} — {p.isReady ? "✅ Ready" : "⏳ Not ready"}
                    </li>
                ))}
            </ul>

            <Button
                variant="contained"
                color={isReady ? "success" : "primary"}
                onClick={handleClick}
                sx={{ mt: 2 }}
            >
                {isReady ? "Ready ✅" : "Player Ready"}
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={async () => {
                    const conn = getConnection();

                    try {
                        conn.invoke("LeaveGame", gameId);
                        if (conn.state === "Connected") await conn.stop();
                    } catch (err) {
                        console.error(err);
                    }

                    router.push("/game");
                }}
            >
                Leave Lobby
            </Button>

            <Button
                variant="outlined"
                sx={{ mt: 2 }}
                disabled={!isConnected}
                onClick={async () => {
                    const conn = getConnection();

                    try {
                        console.log("PLAYERS:", players);
                        await conn.invoke(
                            "PlayerAction",
                            gameId,
                            "StartGame",
                            JSON.stringify({})
                        );
                    } catch (err) {
                        console.error(err);
                    }
                }}
            >
                Start Game
            </Button>
        </Box>
    );
};

export default withAuth(OpretSpil);