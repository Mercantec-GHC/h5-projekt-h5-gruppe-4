'use client'

import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useSelectedLayoutSegment } from 'next/navigation'

import Navigation from './navigation'
import Loader from './Components/loader'
import { refresh } from '@/api'
import { useAppContext } from './AppContext'

export default function RefreshLayout({ children, navn }) {
    const { setIsLoggedIn } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)
    const activeSegment = useSelectedLayoutSegment()

    useEffect(() => {
        let mounted = true

        refresh()
            .then(res => {
                if (!mounted) return
                setIsLoggedIn(!res?.error)
            })
            .catch(() => {
                if (!mounted) return
                setIsLoggedIn(false)
            })
            .finally(() => {
                if (!mounted) return
                setIsLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [setIsLoggedIn])

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
                <Loader
                    sx={{ maxWidth: '50%' }}
                    text="Indlæser..."
                    size="large"
                    type="threeDot"
                />
            </Box>
        )
    }

    return (
        <Box sx={{ flex: 1, pt: '75px' }}>
            <Navigation aktiv={activeSegment} navn={navn} />
            <Box
                sx={{
                    flex: 1,
                    pt: {
                        xs: '65px',
                        md: '50px',
                    },
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
