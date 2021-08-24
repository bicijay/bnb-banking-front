import React, {useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {
    Backdrop,
    Button,
    CircularProgress,
    Grid,
    InputAdornment, makeStyles,
    TextField,
    Typography,
    useTheme
} from "@material-ui/core";
import {formatMoney} from "../utils/helpers";
import useStore from "../store/store";
import {useSnackbar} from "notistack";
import {Controller, useForm} from "react-hook-form";
import MoneyInput from "../components/MoneyInput";
import ImageDropzone from "../components/ImageDropzone";
import api from "../services/api";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const DepositCheckPage = () => {
    const classes = useStyles();
    let theme = useTheme();
    let history = useHistory();
    const store = useStore(state => state);
    const {control, handleSubmit} = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [selectedPhoto, setSelectedPhoto] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        if (!selectedPhoto) {
            showError("No picture selected.")
            return;
        }

        const formData = new FormData();
        formData.append("check_picture", selectedPhoto);
        formData.append("amount", data.amount);
        formData.append("description", data.description);

        try {
            await api.post("customer/deposits", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            history.push("/checks");
        } catch (e) {
            showError(e.response?.data?.message);
        }
        setLoading(false);
    };

    const showError = (message = "An internal error has occurred") => {
        enqueueSnackbar(message, {variant: "error",})
    };

    const onImageDrop = (files) => {
        setSelectedPhoto(files[0]);
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
    }, []);

    return (
        <PageWrapper pageName={"Check deposit"}>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
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
                                helperText={fieldState?.error?.message || "The money will be deposited in your account once the check is accepted."}
                                value={field.value}
                                onChange={field.onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    inputComponent: MoneyInput
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
                                placeholder={"Granny's gift"}
                                label={"DESCRIPTION"}
                                fullWidth={true}
                                error={fieldState.invalid}
                                helperText={fieldState?.error?.message}
                                value={field.value}
                                onChange={field.onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"/>,
                                }}
                            />
                        )}
                    />
                    <Grid style={{marginTop: 30}}>
                        {<ImageDropzone selectedPhoto={selectedPhoto} onDrop={onImageDrop}/>}
                    </Grid>
                    <Button fullWidth style={{marginTop: 40}} type="submit" variant="contained" color="primary">
                        Deposit check
                    </Button>
                </form>
            </Grid>
        </PageWrapper>
    )
};

export default DepositCheckPage;