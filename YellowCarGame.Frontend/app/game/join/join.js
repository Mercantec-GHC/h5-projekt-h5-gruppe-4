"use client"
import React from "react";
import { Box, Button, TextField } from "@/lib/mui";
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
        Gamekode: 'Game Code',
        wrongkode: 'Invalid game code. Please enter a code between 1111 and 9999.',
        join: 'Join Game',
    }

    const { joinErr, Gamekode, wrongkode, join } = labels;

    const defaultValues = {
        Gamekode: 0,
    }

    const schema = Yup.object().shape({
        Gamekode: Yup.number().max(9999, wrongkode).min(1111, wrongkode).typeError(wrongkode).required(joinErr)
    })


    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = async (data) => {
        router.push('/game/lobby/' + data.Gamekode);
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
                    name="Gamekode"
                    render={({ field: { onChange } }) =>
                        <TextField
                            sx={{ m: 1, width: '50ch' }}
                            label={Gamekode}
                            onChange={onChange}
                            type="number"
                            error={!!errors.Gamekode}
                            helperText={<ErrorMessage errors={errors} name="Gamekode" />}
                        />
                    }
                    rules={{
                        required: true,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <ErrorMessage errors={errors} name="Gamekode" />
            </Box>
            <div>
                <Button type="submit">{join}</Button>
            </div>
        </form>
    );
};

export default JoinGame;