"use client";
import React, { useState, useEffect } from "react";
import { Box, Button } from "@/lib/mui";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getConnection } from "$/game/signalr";
import { laesDekrypteret } from "@/helpers/storage";
import withAuth from "@/app/withAuth";

const GamePage = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const gamecode = params?.gamecode;
    const gameId = searchParams.get("id");
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [score, setScore] = useState(0);
    const [myId, setMyId] = useState(null);
    const [cars, setCars] = useState([]);
    const [countdown, setCountdown] = useState(null);
    const router = useRouter();

    // 🔐 hent bruger
    useEffect(() => {
        const user = laesDekrypteret("bruger");
        setMyId(user?.id);
    }, []);

    // 🔌 SignalR connection
    useEffect(() => {
        if (!myId || !gameId) return;

        const conn = getConnection();
        const start = async () => {
            try {
                if (conn.state === "Disconnected") {
                    await conn.start();
                }

                console.log("🎮 Game connected");
                console.log("GAME ID:", gameId);

                // ⏱️ Countdown
                conn.on("Countdown", (data) => {
                    const sec = data.secondsLeft ?? data.SecondsLeft;
                    console.log("Countdown:", sec);
                    setCountdown(sec);
                });

                // 🚗 Spawn bil
                conn.on("CarSpawned", (car) => {
                    console.log("🚗 CarSpawned:", car);

                    setCars(prev => [
                        ...prev,
                        {
                            id: car.carId ?? car.CarId,
                            lane: car.lane ?? car.Lane,
                            color: car.color ?? car.Color,
                            x: 0 // start position
                        }
                    ]);
                });

                // ❌ Bil taget
                conn.on("CarClaimed", (data) => {
                    const id = data.carId ?? data.CarId;

                    setCars(prev =>
                        prev.filter(c => c.id !== id)
                    );
                });
                conn.on("GameStart", (data) => {
                    const duration = data.timeLimitSeconds ?? data.TimeLimitSeconds ?? 60;

                    console.log("🚀 START TIMER:", duration);

                    setTimeLeft(duration);
                });
                conn.on("GameEvent", (event) => {
                    const name = event.eventName ?? event.EventName;
                    const payload = event.payload ?? event.Payload;

                    if (name === "GameStateChanged") {
                        const state = payload?.newState ?? payload?.NewState;

                        console.log("STATE:", state);

                        if (state === "Active") {
                            // 🔥 spil starter → fjern countdown
                            setCountdown(null);
                        }

                        if (state === "Scoreboard") {
                            console.log("🏁 GAME OVER");
                            setGameOver(true);
                        }
                    }
                });
                conn.on("GameStateChanged", (data) => {
                    const state = data.newState ?? data.NewState;

                    console.log("🎯 STATE:", state);

                    if (state === "Active") {
                        // 🔥 countdown færdig
                        setCountdown(null);
                    }

                    if (state === "Scoreboard") {
                        console.log("🏁 GAME OVER");
                        setGameOver(true);
                    }
                });
                conn.on("CountdownTick", (data) => {
                    const sec = data.secondsLeft ?? data.SecondsLeft;

                    console.log("⏱️ CountdownTick:", sec);

                    setCountdown(sec);

                    // 🔥 når vi rammer 1 → start timer
                    if (sec === 1) {
                        setTimeout(() => {
                            setCountdown(null);
                            setTimeLeft(60); // fallback hvis GameStart ikke rammer
                        }, 1000);
                    }
                });

                // 🔥 join game
                await conn.invoke("JoinGame", gameId, myId);
            } catch (err) {
                console.error("Game error:", err);
            }
        };

        start();

        return () => {
            return () => {
                conn.off("Countdown");
                conn.off("CountdownTick");
                conn.off("GameStart");
                conn.off("CarSpawned");
                conn.off("CarClaimed");
                conn.off("GameStateChanged");
            };
        };
    }, [myId, gameId]);

    const disconnect = async () => {
        const conn = getConnection();

        try {
            if (conn.state === "Connected") {
                await conn.invoke("LeaveGame", gameId);
                await conn.stop();
            }
        } catch (err) {
            console.error("Disconnect error:", err);
        }
    };

    // 🎬 Animation (biler bevæger sig)
    useEffect(() => {
        const interval = setInterval(() => {
            setCars(prev =>
                prev.map(car => ({
                    ...car,
                    x: car.x + 5 // speed
                }))
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);
    // ⏱️ Countdown timer
    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            setGameOver(true);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    // 🖱️ klik på bil
    const handleCarClick = async (car) => {
        const conn = getConnection();

        if (car.color === "Yellow") {
            setScore(s => s + 1);
        } else {
            setScore(s => s - 1);
        }

        try {
            await conn.invoke(
                "PlayerAction",
                gameId,
                "ClaimCar",
                car.id
            );
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (gameOver) {
            setCars([]);
        }
    }, [gameOver]);

    const lanes = [0, 1, 2, 3, 4];

    const btnStyle = {
        padding: "12px 20px",
        fontSize: "1rem",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        background: "#1976d2",
        color: "white"
    };

    return (
        <Box sx={{ p: 3, width: "100vw", height: "90vh", backgroundColor: "green", position: "relative" }}>
            {gameOver && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.95)",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 20,
                        gap: 2
                    }}
                >
                    <h1>🏁 Game Over</h1>
                    <h2>Score: {score}</h2>

                    {/* 🔘 Profil */}
                    <Button
                        onClick={async () => {
                            await disconnect();
                            router.push("/profile");
                        }}
                        sx={btnStyle}
                    >
                        Til profil
                    </Button>

                    {/* 🔘 Nyt spil */}
                    <Button
                        onClick={async () => {
                            await disconnect();
                            router.push("/game");
                        }}
                        sx={btnStyle}
                    >
                        Nyt spil
                    </Button>
                </Box>
            )}
            <Box sx={{ color: "white", textAlign: "center", mb: 2 }}>
                {countdown !== null && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "30%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "5rem",
                            fontWeight: "bold",
                            color: "white",
                            zIndex: 10
                        }}
                    >
                        {countdown}
                    </Box>
                )}

                {timeLeft !== null && !gameOver && (
                    <Box sx={{ fontSize: "2rem" }}>
                        ⏱️ {timeLeft}s
                    </Box>
                )}

                <Box sx={{ fontSize: "1.5rem", mt: 1 }}>
                    Score: {score}
                </Box>
            </Box>

            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: 280, // 🔥 matcher lanes
                    background: "#222",
                    overflow: "hidden",
                    border: "2px solid black"
                }}
            >
                {/* ⏱️ Countdown */}
                {countdown !== null && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "40%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "4rem",
                            color: "white",
                            zIndex: 10
                        }}
                    >
                        {countdown}
                    </Box>
                )}

                {/* 🛣️ Lanes */}
                {lanes.map(lane => (
                    <Box
                        key={lane}
                        sx={{
                            position: "relative",
                            height: 70,
                            borderBottom: "2px dashed white",
                            background: lane % 2 === 0 ? "#333" : "#2a2a2a"
                        }}
                    >
                        {/* 🚗 Cars i denne lane */}
                        {cars
                            .filter(car => car.lane === lane)
                            .map(car => (
                                <Box
                                    key={car.id}
                                    onClick={() => handleCarClick(car)}
                                    sx={{
                                        position: "absolute",
                                        left: car.x,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 50,
                                        height: 30,
                                        backgroundColor: car.color.toLowerCase(),
                                        borderRadius: 2,
                                        cursor: "pointer"
                                    }}
                                />
                            ))}
                    </Box>
                ))}
            </Box>
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <Button
                    onClick={async () => {
                        await disconnect();
                        router.push("/game");
                    }}
                    sx={{
                        padding: "10px 15px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    Leave Game
                </Button>
            </Box>
        </Box>
    );
};

export default withAuth(GamePage);