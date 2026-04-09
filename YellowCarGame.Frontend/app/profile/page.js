'use client'
import { Badge, Box, Button } from '@mui/material';
import { Title } from '$/Components';
import { useEffect, useState } from 'react';
import { useAppContext } from '$/AppContext';
import { laesDekrypteret } from '@/helpers/storage';
import Loader from '../Components/loader';
import withAuth from '../withAuth';
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { AvatarCropper } from "$/Components";
import { useRouter } from 'next/navigation';

const Profile = () => {
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
                width: '100%',
                py: 10
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

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                px: 2
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: "center"
                }}
            >
                {/* Titel */}
                <Title size={40} color="blue">
                    {profile}
                </Title>

                {/* Velkomst */}
                <Title size={24} color="purple">
                    {welcome.replace('{username}', bruger?.username)}
                </Title>

                <Box
                    sx={{
                        position: "fixed",
                        top: { xs: 80, md: 90 },
                        right: 20,
                        zIndex: 1000
                    }}
                >
                    <AvatarCropper bruger={bruger} />
                </Box>

                {/* Knap */}
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/game')}
                >
                    {game}
                </Button>
            </Box>
        </Box>
    );
}
export default Profile;