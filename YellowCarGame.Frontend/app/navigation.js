'use client';
import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import AppNavBar from './navBar/navBar';
import { Box } from '@mui/material';


const Navigation = ({ navn, aktiv }) => {
    const markering = {
        borderRadius: 5,
        backgroundColor: 'green',
        fontWeight: 'bold'
    }

    const pages = [
        { name: 'Nyt spil', link: '/game', activeSegment: 'game' },
        { name: 'About', link: '/about', activeSegment: 'about' },
    ];

    const StyledLink = styled(Link)`
            text-decoration: none;
            color: purple;
                &:focus, &:hover, &:visited, &:link, &:active {
                    text-decoration: none;
                    color: purple;
            }
        `;

    return (
        <Box position="fixed" sx={{
            width: '100%',
            backgroundColor: 'gold',
            zIndex: 1000
        }}>
            <AppNavBar navn={navn} StyledLink={StyledLink} aktiv={aktiv} sider={pages} makering={markering} />
        </Box>
    );
};
export default Navigation;