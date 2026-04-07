"use client"
import React from "react";
import { Box, Button, TextField } from "@/lib/mui";
import { Controller, useForm } from "react-hook-form";
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { register } from "@/api";
import { useRouter } from "next/navigation";

const OpretBruger = ({ setResponse, setVisning, farve }) => {
    const router = useRouter();

    const labels = {
        usernameFejl: 'You must have a username',
        passwordFejl: 'You must enter a password',
        bekraeftfejl: 'You must confirm your password',
        username: 'Username',
        ens: 'Passwords must match',
        gentag: 'Confirm Password',
    }

    const { usernameFejl, passwordFejl, bekraeftfejl, ens, gentag, username } = labels;

    const defaultValues = {
        username: '',
        password: '',
        confirmPassword: '',
    }

    const schema = Yup.object().shape({
        username: Yup.string().transform((value) => value.trim()).required(usernameFejl),
        password: Yup.string()
            .transform((value) => value.trim())
            .required(passwordFejl)
            .min(8, 'Your password must be at least 8 characters long')
            .matches(/[0-9]/, 'There must be at least one number')
            .matches(/[A-Z]/, 'There must be at least one uppercase letter')
            .matches(/[^A-Za-z0-9]/, 'There must be at least one special character'),
        confirmPassword: Yup.string().transform((value) => value.trim())
            .required(bekraeftfejl)
            .oneOf([Yup.ref('password')], ens),
    })


    const { handleSubmit, reset, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = async (data) => {
        console.log(data)
        data.username = data.username.trim();
        register(data).then((d) => {
            setVisning('')
            setResponse("User created successfully! Please log in.");
            router.push('/login');
        }).catch(err => {
            setResponse(err)
        })//*/
        reset(defaultValues)

    }

    const centrer = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mt: 2,
        m: '0 auto',
        width: '80%'
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
                        Create User
                    </Box>

                    {/* Username */}
                    <Controller
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label={username}
                                autoFocus
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

                    {/* Confirm Password */}
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label={gentag}
                                type="password"
                                error={!!errors.confirmPassword}
                                helperText={<ErrorMessage errors={errors} name="confirmPassword" />}
                            />
                        )}
                    />

                    {/* Knap */}
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ bgcolor: farve }}
                    >
                        gem
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default OpretBruger;