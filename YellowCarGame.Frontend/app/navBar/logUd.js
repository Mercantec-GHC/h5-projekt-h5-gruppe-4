'use client';
import React, { useState } from 'react';
import { Box, IconButton, Avatar, Tooltip } from '@mui/material';
import { useAppContext } from '$/AppContext';
import Logud from '$/logUd';

const LogUd = () => {
    const { isLoggedIn } = useAppContext();
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => {
        setOpenModal(!openModal)
        setLogUdModal(false)
    };
    const [logUdModal, setLogUdModal] = useState(false);
    const handleLogUd = () => {
        setLogUdModal(!logUdModal)
        setOpenModal(false)
    };


    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={isLoggedIn ?? "Log ud"}>
                <IconButton onClick={isLoggedIn ? handleLogUd : handleOpen} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'yellow' }} aria-label="G">
                        Bil
                    </Avatar>
                </IconButton>
            </Tooltip>
            {isLoggedIn ?? (
                <Logud handleModal={handleLogUd} modal={logUdModal} />
            )}
        </Box>
    );
};
export default LogUd;