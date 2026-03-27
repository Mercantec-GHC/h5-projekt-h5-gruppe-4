'use client';
import React from 'react';
import { Box, Typography, MenuItem } from '@mui/material';
import { PiCarProfileFill } from "react-icons/pi";
import { useAppContext } from '$/AppContext';

const MenuItems = ({ retning, aktiv, sider, StyledLink, handleCloseNavMenu, markering }) => {
    const { isLoggedIn } = useAppContext();

    let aktivSide = (sandFalsk) => (sandFalsk) ? markering : { backgroundColor: 'inherit' }
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: retning,
        }}>
            {sider.map((p) => {
                return (
                    <MenuItem onClick={handleCloseNavMenu} key={p.name} sx={
                        aktivSide(aktiv === p.activeSegment)
                    }>
                        <StyledLink prefetch={false} className='link' href={p.link}>
                            <Typography variant="div" textAlign="center">
                                {p.name}
                            </Typography>
                        </StyledLink>
                    </MenuItem>
                )
            })}
            {isLoggedIn && <MenuItem onClick={handleCloseNavMenu} sx={
                aktivSide(aktiv === 'profil')
            }>
                <StyledLink prefetch={false} className='link' href='/profil'>
                    <PiCarProfileFill color='yellow' />
                </StyledLink>
            </MenuItem>}
        </Box>
    )

};
export default MenuItems;