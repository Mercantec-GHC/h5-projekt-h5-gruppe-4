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
            hentData(res.jwtToken).then(user => {
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
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={centrer}>
                    <Box sx={centrer}>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, value } }) =>
                                <TextField
                                    sx={{ m: 1, width: '50ch' }}
                                    label={username}
                                    value={value}
                                    onChange={onChange}
                                    type="text"
                                    error={!!errors.username}
                                    helperText={<ErrorMessage errors={errors} name="username" />}
                                />
                            }
                            rules={{ required: true }}
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                    <ErrorMessage errors={errors} name="username" />
                    <Box sx={centrer}>
                        <Controller
                            id='password'
                            control={control}
                            name="password"
                            render={({ field: { onChange } }) =>
                                <TextField
                                    sx={{ m: 1, width: '50ch' }}
                                    label='Password'
                                    onChange={onChange}
                                    type="password"
                                    error={!!errors.password}
                                    helperText={<ErrorMessage errors={errors} name="password" />}
                                />
                            }
                            rules={{
                                required: true,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                    <ErrorMessage errors={errors} name="password" />
                    <div>
                        <Button type="submit" disabled={isLoading}>{knap}</Button>
                        <Button type="button" onClick={() => router.push('/register')}>
                            {register}
                        </Button>
                    </div>
                    <Box sx={{ color: 'red' }}>{status}</Box>
                </Box>
            </form>
        </Box>
    );
}