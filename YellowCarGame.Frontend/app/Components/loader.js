"use client"
import React from 'react';
import { Box } from '@mui/material';
import { Atom, Commet, OrbitProgress, BlinkBlur, FourSquare, TrophySpin, ThreeDot, LifeLine, Mosaic, Riple, Slab } from 'react-loading-indicators';

export default function Loader(props) {
    const skift = (props) => {
        switch (props.type) {
            case 'atom': return <Atom {...props} />
            case 'orbitProgres': return <OrbitProgress {...props} />
            case 'blinkBlur': return <BlinkBlur {...props} />
            case 'fourSquare': return <FourSquare {...props} />
            case 'trophySpin': return <TrophySpin {...props} />
            case 'threeDot': return <ThreeDot {...props} />
            case 'lifeLine': return <LifeLine {...props} />
            case 'mosaic': return <Mosaic {...props} />
            case 'riple': return <Riple {...props} />
            case 'slab': return <Slab {...props} />
            case 'commet': return <Commet {...props} />
            default: return <OrbitProgress {...props} />
        }
    }

    return (
        <Box sx={props.sx}>
            {skift(props)}
        </Box>
    );
}