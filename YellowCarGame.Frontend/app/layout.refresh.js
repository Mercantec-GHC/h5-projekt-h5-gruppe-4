'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSelectedLayoutSegment } from 'next/navigation';

import Navigation from './navigation';
import Loader from './Components/loader';
import { useAppContext } from './AppContext';
import { refresh } from '@/api';

export default function RefreshLayout({ children, navn }) {
    const { setIsLoggedIn, isLoggedIn } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const activeSegment = useSelectedLayoutSegment();

    useEffect(() => {
        let mounted = true;

        const checkLogin = async () => {
            try {
                await refresh();
                if (mounted) setIsLoggedIn(true);
            } catch (err) {
                if (mounted) setIsLoggedIn(false);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        if (isLoggedIn) {
            checkLogin();
        } else {
            setIsLoading(false);
        }

        return () => {
            mounted = false;
        };
    }, [isLoggedIn, setIsLoggedIn]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    width: '100vw',
                }}
            >
                <Loader text="Indlaeser..." size="large" type="threeDot" />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Navigation */}
            <Navigation aktiv={activeSegment} navn={navn} />

            {/* Content */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 2,
                    pt: {
                        xs: "70px", // højde på navbar mobil
                        md: "80px"  // højde på navbar desktop
                    }
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
