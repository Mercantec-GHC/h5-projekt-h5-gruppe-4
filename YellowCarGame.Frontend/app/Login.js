"use client";
import React, { useState } from 'react';
import { login, hentData } from '@/api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAppContext } from "$/AppContext";
import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/navigation';
import { Box } from '@/lib/mui';
import { gemKrypteret } from '@/helpers/storage';
import { Button, TextField } from '@mui/material';

export default function Login() {
    const router = useRouter();
    const { setIsLoggedIn, setResponse } = useAppContext();


    const labels = {
        knap: 'Login',
        register: 'Register',
        brugernavnfejl: 'What about your username???',
        passwordFejl: 'You must enter a password to log in',
        username: 'username'
    }
    const { knap, brugernavnfejl, passwordFejl, username, register } = labels;
    const schema = Yup.object().shape({
        username: Yup.string().required(brugernavnfejl),
        password: Yup.string().required(passwordFejl)
    })

    const defaultValues = {
        username: '',
        password: ''
    }

    const [message, setMessage] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    const { handleSubmit, formState: { errors }, control } = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        let cancel = false;
        setIsLoading(true)

        login(data).then((res) => {
            gemKrypteret("jwt", res);
            hentData().then(user => {
                setMessage(user);
                setResponse('');
                setIsLoading(false);
                setIsLoggedIn(true);
                gemKrypteret("bruger", user);
                router.push('/profile');
            }).catch(() => {
                setIsLoading(false);
                setStatus('Error occurred while fetching user data');
            });
        }).catch(err => {
            setIsLoading(false)
            setStatus(err || 'Login failed');
        })
        return () => {
            cancel = true;
        }
    }

    const centrer = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mt: 2
    }

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 2
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 400,
                        mx: "auto",
                        p: 4,
                        borderRadius: 3,
                        boxShadow: 3,
                        backgroundColor: "background.paper",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}
                >
                    {/* Titel */}
                    <Box sx={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
                        Login
                    </Box>

                    {/* Username */}
                    <Controller
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                autoFocus
                                fullWidth
                                label={username}
                                error={!!errors.username}
                                helperText={<ErrorMessage errors={errors} name="username" />}
                            />
                        )}
                    />

                    {/* Password */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Password"
                                type="password"
                                error={!!errors.password}
                                helperText={<ErrorMessage errors={errors} name="password" />}
                            />
                        )}
                    />

                    {/* Knapper */}
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                    >
                        {knap}
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        fullWidth
                        onClick={() => router.push('/register')}
                    >
                        {register}
                    </Button>

                    {/* Fejl */}
                    {status && (
                        <Box sx={{ color: "error.main", textAlign: "center" }}>
                            {status}
                        </Box>
                    )}
                </Box>
            </form>
        </Box>
    );
}