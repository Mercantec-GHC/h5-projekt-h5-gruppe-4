'use client'
import React, { useEffect } from 'react';
import { AppProvider } from './AppContext';
import { useSelectedLayoutSegment } from 'next/navigation';

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
        <Box sx={{ flex: 1 }}>
            <AppProvider>
                {children}
            </AppProvider>
        </Box>
    )
}