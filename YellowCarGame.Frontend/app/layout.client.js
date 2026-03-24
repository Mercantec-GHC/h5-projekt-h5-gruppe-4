'use client'
import React, { useEffect } from 'react';
import { AppProvider } from './AppContext';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Box } from '@mui/material';
import Navigation from './navigation';

export default function ClientLayout({ children, navn }) {
    const activeSegment = useSelectedLayoutSegment();
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault()
        }
        document.addEventListener("contextmenu", handleContextMenu)
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
        }
    }, [])

    return (
        <AppProvider>
            <Box sx={{ flex: 1, pt: '75px' }}>
                <Navigation aktiv={activeSegment} navn={navn} />
                {children}
            </Box>
        </AppProvider>
    )
}