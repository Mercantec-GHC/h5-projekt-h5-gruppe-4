'use client'
import React, { useEffect } from 'react';
import { AppProvider } from './AppContext';
import RefreshLayout from './layout.refresh';

export default function ClientLayout({ children, navn }) {
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
            <RefreshLayout navn={navn}>
                {children}
            </RefreshLayout>
        </AppProvider>
    )
}