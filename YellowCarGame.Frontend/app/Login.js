"use client";
import React, { useEffect, useState } from 'react';
import login from '@/api/login';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Text, CustomizedButtons } from '$/Components';
import { useAppContext } from "$/AppContext";
import { useRouter } from 'next/navigation';
import { Box } from '@/lib/mui';
import { gemKrypteret } from '@/helpers/storage';
import { checkServer, hent } from '@/api';
import ServerFejl from './serverfejl';
import { Button, TextField } from '@mui/material';

export default function Login() {
    const router = useRouter();
    const { setIsLoggedIn } = useAppContext();


    const labels = {
        knap: 'Log ind',
        brugernavnfejl: 'hvad med din email???',
        passwordFejl: 'Du skal bruge password for at logge ind',
        brugernavn: 'email'
    }
    const { knap, brugernavnfejl, passwordFejl, brugernavn } = labels;
    const schema = Yup.object().shape({
        email: Yup.string().required(brugernavnfejl),
        password: Yup.string().required(passwordFejl)
    })

    const defaultValues = {
        email: '',
        password: ''
    }

    const [message, setMessage] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    const { handleSubmit, formState: { errors }, control, setError } = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        let cancel = false;
        setIsLoading(true)

        login(data).then((res) => {
            if (res.auth) {
                setLanguage(res.sprog)
                setIsLoggedIn(true)
                gemKrypteret("user", res);
            }
        }).catch(err => {
            setIsLoading(false)
            if (err?.message.besked === 'bruger') {
                const bruger = err?.message.info
                setStatus(`the user ${bruger} doesn't exist`)
            } else if (err?.message.besked === 'password') {
                const password = err?.message.info
                setStatus(password, 'Wrong password')
            } else {
                setStatus(err)
            }
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
                            name="email"
                            render={({ field: { onChange } }) =>
                                <Text
                                    width={300}
                                    label={brugernavn}
                                    onChange={onChange}
                                    type="email"
                                    errors={errors.bruger}
                                />
                            }
                            rules={{ required: true }}
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                    {errors && errors.bruger?.message}
                    <Box sx={centrer}>
                        <Controller
                            id='password'
                            control={control}
                            name="password"
                            render={({ field: { onChange } }) =>
                                <TextField
                                    width={300}
                                    label='Password'
                                    onChange={onChange}
                                    type="password"
                                    errors={errors?.password}
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
                    {errors && errors.password?.message}
                    <div>
                        <Button type="submit" disabled={isLoading}>{knap}</Button>
                    </div>
                    <Box sx={{ color: 'red' }}>{status}</Box>
                </Box>
            </form>
        </Box>
    );
}