'use client';
import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogUd from './logUd';
import MenuItems from './menu';

const AppNavBar = ({ navn, aktiv, sider, StyledLink, makering }) => {

    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar sx={{
            background: 'inherit'
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'purple',
                            textDecoration: 'none',
                        }}
                    >
                        {navn}
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="purple"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItems retning='column' aktiv={aktiv} handleCloseNavMenu={handleCloseNavMenu} sider={sider} StyledLink={StyledLink} markering={makering} />
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'purple',
                            textDecoration: 'none',
                        }}
                    >
                        {navn}
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <MenuItems aktiv={aktiv} handleCloseNavMenu={handleCloseNavMenu} sider={sider} StyledLink={StyledLink} markering={makering} />
                    </Box>
                    <LogUd />
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default AppNavBar;