"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@/lib/mui";
import { useParams } from "next/navigation";

const GamePlay = () => {
    const params = useParams();
    const gamecode = params?.gamecode;

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#111",
                color: "white"
            }}
        >
            {/* Countdown */}
            <h1>Game starts in: {countdown}</h1>

            {/* Veje */}
            <Box
                sx={{
                    width: "80%",
                    mt: 5,
                }}
            >
                {[1, 2, 3, 4, 5].map((lane) => (
                    <Box
                        key={lane}
                        sx={{
                            height: "60px",
                            borderBottom: "2px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        Lane {lane}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default GamePlay;