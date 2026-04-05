'use client'
import { Box, Button } from '@mui/material';
import { Title } from '$/Components';
import { useEffect, useState } from 'react';
import { useAppContext } from '$/AppContext';
import { laesDekrypteret } from '@/helpers/storage';
import Loader from '../Components/loader';
import withAuth from '../withAuth';
import { useRouter } from 'next/navigation';

const Skrivebord = () => {
    const router = useRouter();
    const { setResponse, response } = useAppContext();
    const [bruger, setBruger] = useState(null);
    const labels = {
        profile: "Profile",
        welcome: "Welcome, {username}!",
        game: "New Game",
    };

    const { profile, welcome, game } = labels;
    useEffect(() => {
        const value = laesDekrypteret("bruger");
        setBruger(value);
    }, []);

    useEffect(() => {
        setResponse('');
    }, []);


    if (!bruger) {
        return <Box
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
                text="Loading user..."
                size="large"
                type="threeDot"
            />
        </Box>;
    }


    console.log("Brugerdata:", bruger);
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
            <Title size={50} color='blue' >{profile}</Title>
            <Title size={30} color='purple' >{welcome.replace('{username}', bruger.username)}</Title>
            <Button variant="contained" color="primary" onClick={() => router.push('/game')}>
                {game}
            </Button>
        </Box>

    )
}
export default Skrivebord;