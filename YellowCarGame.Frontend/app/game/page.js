"use client"
import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@/lib/mui";
import { useRouter } from "next/navigation";
import CreateGame from "./create/create";
import JoinGame from "./join/join";
import { useAppContext } from "../AppContext";

const Spil = () => {
    const { setResponse, response } = useAppContext();
    const router = useRouter();



    const centrer = {
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 4 }, // mindre spacing på mobil
        justifyContent: "center",
        alignItems: "center", // 🔥 vigtigt!
        maxWidth: 900,
        mx: "auto",
        mt: 4,
        px: 2
    }

    return (
        <Box sx={centrer}>
            <CreateGame setResponse={setResponse} />
            <JoinGame />
        </Box>
    );
};

export default Spil;