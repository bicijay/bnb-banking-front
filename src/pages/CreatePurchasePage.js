import React, {useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {
    Button,
    Grid,
    InputAdornment,
    TextField,
    Typography,
    useTheme
} from "@material-ui/core";
import {formatMoney} from "../utils/helpers";
import {useForm, Controller} from "react-hook-form";
import useStore from "../store/store";
import api from "../services/api";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import MoneyInput from "../components/MoneyInput";
import {format} from "date-fns";



const CreatePurchasePage = () => {
    const store = useStore(state => state);
    const {control, handleSubmit} = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let theme = useTheme();
    let history = useHistory();
    const today = format(new Date(), "yyyy-MM-dd");

    const onSubmit = async (data) => {
        try {
            const response = await api.post("/customer/purchases", {
                amount: data.amount * 100,
                description: data.description,
                purchased_at: data.date
            });
            history.push("/expenses");
        } catch (e) {
            showError(e.response?.data?.message);
        }
    };

    const showError = (message = "An internal error has occurred") => {
        enqueueSnackbar(message, {variant: "error",})
    };

    const getUserBalance = async () => {
        try {
            const response = await api.get("/customer/user-balance");
            const balance = response.data;

            store.setUserBalance({
                currentBalance: balance.current_balance,
                currentIncomes: balance.total_incomes,
                currentExpenses: balance.total_expenses,
            })
        } catch (e) {
        }
    };

    useEffect(() => {
        getUserBalance();
    }, [])

    return (
        <PageWrapper pageName={"Purchase"}>
            <Grid container style={{backgroundColor: theme.palette.secondary.main, marginTop: -5}} xs={12}>
                <Grid style={{padding: 10, paddingLeft: 20}} xs={6} md={4}>
                    <Grid style={{paddingTop: 0}} xs={9} md={11}>
                        <Typography style={{color: "white", opacity: 0.5}}>Current balance</Typography>
                        <Typography style={{color: "white"}}
                                    variant="h6">{formatMoney(store.currentBalance)}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid style={{padding: 20, paddingTop: 40}} xs={12}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="amount"
                        control={control}
                        rules={{required: 'Amount required'}}
                        render={({field, fieldState}) => (
                            <TextField
                                placeholder={"0,00"}
                                label={"AMOUNT"}
                                fullWidth={true}
                                error={fieldState.invalid}
                                helperText={fieldState?.error?.message}
                                value={field.value}
                                onChange={field.onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    inputComponent: MoneyInput
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="date"
                        defaultValue={today}
                        control={control}
                        rules={{required: 'Date required'}}
                        render={({field, fieldState}) => (
                            <TextField
                                style={{marginTop: 40}}
                                label={"DATE"}
                                type="date"
                                fullWidth={true}
                                error={fieldState.invalid}
                                helperText={fieldState?.error?.message}
                                value={field.value}
                                onChange={field.onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        rules={{required: 'Description required'}}
                        render={({field, fieldState}) => (
                            <TextField
                                style={{marginTop: 40}}
                                placeholder={"New t-shirt"}
                                label={"DESCRIPTION"}
                                fullWidth={true}
                                error={fieldState.invalid}
                                helperText={fieldState?.error?.message}
                                value={field.value}
                                onChange={field.onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                            />
                        )}
                    />
                    <Button fullWidth style={{marginTop: 40}} type="submit" variant="contained" color="primary">
                        Add purchase
                    </Button>
                </form>
            </Grid>
        </PageWrapper>
    )
};

export default CreatePurchasePage;