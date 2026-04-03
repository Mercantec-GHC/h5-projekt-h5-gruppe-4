"use client"
import React from "react";
import { Box, Button, TextField } from "@/lib/mui";
import { Controller, useForm } from "react-hook-form";
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from "next/navigation";

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
        TimeLimitSeconds: Yup.number().min(0, TimeLimitSecondsErr),
        MaxPlayers: Yup.number().min(2, MaxPlayersErr).max(10, MaxPlayersErr)
    })


    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = async (data) => {
        setResponse(data);
        router.push('/game/lobby/' + data.gameCode);
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
                    name="TimeLimitSeconds"
                    render={({ field: { onChange } }) =>
                        <TextField
                            sx={{ m: 1, width: '50ch' }}
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
                            sx={{ m: 1, width: '50ch' }}
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
            </Box>
            <div>
                <Button type="submit">{start}</Button>
            </div>
        </form>
    );
};

export default CreateGame;