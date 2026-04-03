"use client"
import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@/lib/mui";
import { useRouter } from "next/navigation";

const OpretBruger = ({ params }) => {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [players, setPlayers] = useState([]);

    useEffect(() => {

    }, []);

    /*useEffect(() => {
        const interval = setInterval(async () => {
            const res = await fetch("/api/players");
            const data = await res.json();
            setPlayers(data);
        }, 2000); // hver 2 sek

        return () => clearInterval(interval);
    }, []);//*/


    const handleClick = () => {
        setReady(!ready);
    };


    const centrer = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mt: 2,
        m: '0 auto',
        width: '80%'
    }

    return (
        <Box sx={centrer}>
            <Box sx={{ mb: 4 }}>
                <h1>Lobby</h1>
                <p>Game Code: {params?.gameCode}</p>
            </Box>
            <Box sx={{ mb: 4 }}>
                <h2>Spillere</h2>
                <ul>
                    {players.map((p, i) => (
                        <li key={i}>{p.username}</li>
                    ))}
                </ul>
            </Box>
            <Button
                variant="contained"
                color={ready ? "success" : "primary"}
                onClick={handleClick}
                sx={{
                    fontSize: "1.2rem",
                    padding: "12px 24px",
                    borderRadius: "12px",
                }}
            >
                {ready ? "Ready ✅" : "Player Ready"}
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.push("/")}
                sx={{
                    fontSize: "1.2rem",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    mt: 2
                }}
            >
                Leave Lobby
            </Button>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => router.push("/game")}
                sx={{
                    fontSize: "1.2rem",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    mt: 2
                }}
            >
                Start Game
            </Button>
        </Box>
    );
};

export default OpretBruger;