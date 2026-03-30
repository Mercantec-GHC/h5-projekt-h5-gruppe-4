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
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={centrer}>
                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange } }) =>
                        <TextField
                            width={300}
                            label={username}
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
                <ErrorMessage errors={errors} name="username" />
                <Controller
                    id='password'
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) =>
                        <TextField
                            width={300}
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
                <ErrorMessage errors={errors} name="password" />
                <Controller
                    id='confirmPassword'
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) =>
                        <TextField
                            label={gentag}
                            value={value}
                            onChange={onChange}
                            type="password"
                            error={!!errors.confirmPassword}
                            helperText={<ErrorMessage errors={errors} name="confirmPassword" />}
                        />
                    }
                    rules={{
                        required: true
                    }}

                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <ErrorMessage errors={errors} name="confirmPassword" />
            </Box>
            <div>
                <Button bgcolor={farve} type="submit">gem</Button>
            </div>
        </form>
    );
};

export default OpretBruger;