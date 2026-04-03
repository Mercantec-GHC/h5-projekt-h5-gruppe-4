'use client'
import { Box } from '@mui/material';
import { Title } from '$/Components';

const Skrivebord = () => {
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
            <Title size={50} color='blue' >About</Title>
        </Box>

    )
}
export default Skrivebord;