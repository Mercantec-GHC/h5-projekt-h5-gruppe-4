"use client"
import React from "react";
import { Box, Button, TextField, Typography } from "@/lib/mui";
import { Controller, useForm } from "react-hook-form";
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { register } from "@/api";
import { useRouter } from "next/navigation";

const JoinGame = () => {
    const router = useRouter();

    const labels = {
        joinErr: 'You must enter a game code to join a game',
        Gamecode: 'Game Code',
        wrongkode: 'Invalid game code. Please enter a code between 1111 and 9999.',
        join: 'Join Game',
    }

    const { joinErr, Gamecode, wrongkode, join } = labels;

    const defaultValues = {
        Gamecode: 0,
    }

    const schema = Yup.object().shape({
        Gamecode: Yup.string()
            .matches(/^[A-Z0-9]+$/, wrongkode)
            .min(4, wrongkode)
            .max(4, wrongkode)
            .required(joinErr)
    });


    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = async (data) => {
        joinAuth(data).then((d) => {
            router.push('/game/lobby/' + data.Gamecode);
        }).catch(err => {
            setResponse(err)
        });
    }

    const centrer = {
        width: "100%",
        maxWidth: 400,
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mx: "auto"
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={centrer}>
                <Controller
                    control={control}
                    name="Gamecode"
                    render={({ field: { onChange } }) =>
                        <TextField
                            fullWidth
                            label={Gamecode}
                            onChange={onChange}
                            type="number"
                            error={!!errors.Gamecode}
                            helperText={<ErrorMessage errors={errors} name="Gamecode" />}
                        />
                    }
                    rules={{
                        required: true,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <ErrorMessage errors={errors} name="Gamecode" />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                >
                    <Typography variant="h5" fontWeight="bold">
                        {join}
                    </Typography>
                </Button>
            </Box>
        </form>
    );
};

export default JoinGame;