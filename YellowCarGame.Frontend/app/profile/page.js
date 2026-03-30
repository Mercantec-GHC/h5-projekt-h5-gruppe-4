'use client'
import { Box } from '@mui/material';
import { Title } from '$/Components';
import { useEffect, useState } from 'react';
import { useAppContext } from '$/AppContext';
import { laesDekrypteret } from '@/helpers/storage';
import Loader from '../Components/loader';
import withAuth from '../withAuth';

const Skrivebord = () => {
    const { setResponse, response } = useAppContext();
    const [bruger, setBruger] = useState(null);

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
        <Box>
            <Title size={50} color='blue' >Profile</Title>
            <Title size={30} color='purple' >Velkommen, {bruger.username}!</Title>
        </Box>

    )
}
export default withAuth(Skrivebord);