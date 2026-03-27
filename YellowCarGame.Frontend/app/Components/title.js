"use client"
import React from 'react';
import { Box } from '@mui/material';


const Title = ({ children, size, color, className, textbreak }) => {

    const sx = {
        color,
        fontSize: size,
        wordBreak: textbreak
    }
    return (<Box sx={sx} component='h1' className={className}>{children}</Box>);
}

export default Title;