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
            <CreateGame setResponse={setResponse} />
            <JoinGame />
        </Box>
    );
};

export default Spil;