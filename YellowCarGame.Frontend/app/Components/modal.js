"use client"
import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Fab, Tooltip } from '@mui/material';
import { IoCloseCircle } from "react-icons/io5";

const Knap = React.forwardRef(function Knap(props, ref) {
    //  Spread the props to the underlying DOM element.
    return (<Box {...props} ref={ref}>
        <IoCloseCircle size={35} />
    </Box>
    );
});

export default function ModalElement({ children, titel, open, handleOpen, width, height }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width,
        height,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        margin: 'auto'
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Modal
                keepMounted
                open={open}
                onClose={handleOpen}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip sx={{ position: 'relative' }} title="Luk" arrow>
                            <Knap sx={{ cursor: 'pointer' }} onClick={handleOpen} />
                        </Tooltip>
                    </Box>
                    <Typography id="title" variant="h4" component="h2">
                        {titel}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexFlow: 'column wrap' }}>
                        {children}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}