"use client";
import React from "react";
import { Box, Typography } from "@/lib/mui";

export default function About() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 2
            }}
        >
            <Box
                sx={{
                    maxWidth: 700,
                    width: "100%",
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}
            >
                {/* Titel */}
                <Typography variant="h4" fontWeight="bold" textAlign="center">
                    About the Game
                </Typography>

                {/* Intro */}
                <Typography>
                    This is a digital version of the classic game <b>"Yellow Car"</b>
                    (also known as "Gul Bil"). The goal is simple: be the first to spot
                    and click on yellow cars before anyone else!
                </Typography>

                {/* Hvordan det virker */}
                <Typography>
                    The game will feature multiple lanes where cars pass by, and your
                    task is to react quickly when a yellow car appears.
                </Typography>

                {/* Baner */}
                <Typography>
                    In the future, the game will include <b>5 different lanes</b>, each
                    with its own flow of cars, making the game more challenging and fun.
                </Typography>

                {/* Hvordan man spiller */}
                <Typography>
                    You can play directly on this website by clicking on the yellow cars,
                    or by using a connected <b>Arduino device</b> for a more physical and
                    interactive experience.
                </Typography>

                {/* Outro */}
                <Typography>
                    Whether you play solo or with friends, it's all about speed, attention,
                    and having fun!
                </Typography>
            </Box>
        </Box>
    );
}