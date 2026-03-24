"use client";
import React from 'react';
import { ModalElement, Title } from '$/Components';
import { useAppContext } from "$/AppContext";
import { Box, Button } from '@mui/material';
//import { useLogout } from '@/api/logUd';

export default function Logud({ modal, handleModal }) {
    // const logUd = useLogout();
    const { setIsLoggedIn, setResponse } = useAppContext();


    const labels = {
        knap: 'Log ud',
        besked: 'Dette vil logge dig ud',
        annuller: 'annuller',
        svar: 'Du er nu logget ud'
    }
    const { knap, besked, annuller, svar } = labels;

    const logud = () => {
        setIsLoggedIn(false);
        /*logUd().then(u => {
            setResponse(svar);
        })//*/
        handleModal();
    }

    return (
        <Box>
            <ModalElement open={modal} titel={knap} handleOpen={handleModal}>
                <Box>
                    <Title>{besked}</Title>
                    <Button onClick={logud}>{knap}</Button>
                    <Button onClick={handleModal}>{annuller}</Button>
                </Box>
            </ModalElement>
        </Box>
    );
}