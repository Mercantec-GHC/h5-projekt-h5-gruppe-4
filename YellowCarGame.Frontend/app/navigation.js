'use client';
import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import AppNavBar from './nav/appBar';
import { Box } from '@mui/material';


const Navigation = ({ navn, aktiv }) => {
    const markering = {
        borderRadius: 5,
        backgroundColor: 'yellow',
        fontWeight: 'bold'
    }

    const pages = [
        { name: 'Nyt spil', link: '/newgame', activeSegment: 'newgame' },
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