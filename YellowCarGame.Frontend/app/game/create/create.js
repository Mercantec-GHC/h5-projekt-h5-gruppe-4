"use client"
import React from "react";
import { Box, Button, TextField, Typography } from "@/lib/mui";
import { Controller, useForm } from "react-hook-form";
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from "next/navigation";
import { createGame, joinAuth } from "@/api";

const CreateGame = ({ setResponse }) => {
    const router = useRouter();

    const labels = {
        TimeLimitSecondsErr: 'Time limit must be a positive number',
        MaxPlayersErr: 'Maximum players must be between 2 and 10',
        TimeLimitSeconds: 'Time Limit (seconds)',
        MaxPlayers: 'Maximum Players',
        start: 'Start Game',
    }

    const { TimeLimitSecondsErr, MaxPlayersErr, TimeLimitSeconds, MaxPlayers, start } = labels;

    const defaultValues = {
        TimeLimitSeconds: 60,
        MaxPlayers: 4,
    }

    const schema = Yup.object().shape({
        TimeLimitSeconds: Yup.number().min(0, TimeLimitSecondsErr).required(TimeLimitSecondsErr),
        MaxPlayers: Yup.number().min(1, MaxPlayersErr).max(10, MaxPlayersErr).required(MaxPlayersErr)
    })


    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = async (data) => {
        createGame(data).then((d) => {
            console.log("Game created successfully:", d);
            joinAuth(d).then((dy) => {
                console.log("Game created and joined successfully:", dy);
                router.push(`/game/lobby/${d.code}?id=${d.gameId}&players=${data.MaxPlayers}&duration=${data.TimeLimitSeconds}`);
            }).catch(err => {
                setResponse(err)
            });
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
        mx: "auto" // 🔥 centrerer kortet
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={centrer}>
                <Controller
                    control={control}
                    name="TimeLimitSeconds"
                    render={({ field: { onChange } }) =>
                        <TextField
                            fullWidth
                            label={TimeLimitSeconds}
                            onChange={onChange}
                            type="number"
                            error={!!errors.TimeLimitSeconds}
                            helperText={<ErrorMessage errors={errors} name="TimeLimitSeconds" />}
                        />
                    }
                    rules={{ required: true }}
                    type="text"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <ErrorMessage errors={errors} name="TimeLimitSeconds" />
                <Controller
                    id='password'
                    control={control}
                    name="MaxPlayers"
                    render={({ field: { onChange, value } }) =>
                        <TextField
                            fullWidth
                            label={MaxPlayers}
                            onChange={onChange}
                            type="number"
                            error={!!errors.MaxPlayers}
                            helperText={<ErrorMessage errors={errors} name="MaxPlayers" />}
                        />
                    }
                    rules={{
                        required: true,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <ErrorMessage errors={errors} name="MaxPlayers" />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                >
                    <Typography variant="h5" fontWeight="bold">
                        {start}
                    </Typography>
                </Button>
            </Box>
        </form>
    );
};

export default CreateGame;